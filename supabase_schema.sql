-- ==============================================================================
-- SCHEMA SQL PARA SUPABASE: PAN DEL BARRIO - CHECKLIST CAJERA Y DESPACHO (MAÑANA)
-- Ejecutar en el SQL Editor de Supabase (https://app.supabase.com)
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Perfiles / Usuarios
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Turnos Operativos
CREATE TABLE IF NOT EXISTS public.shifts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar Turnos por defecto
INSERT INTO public.shifts (id, name, icon, start_time, end_time)
VALUES 
    ('manana', 'Mañana', 'Sunrise', '06:00:00', '14:00:00'),
    ('tarde', 'Tarde', 'Sunset', '14:00:00', '22:00:00')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time;

-- 4. Tabla Maestra de Tareas (Plantilla de Tareas)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Cajera',
    shift_id TEXT NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_category_check;

-- 5. Tabla de Registro Diario de Tareas (Logs por fecha)
CREATE TABLE IF NOT EXISTS public.daily_task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completada')),
    completed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed_by_name TEXT,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_task_per_day UNIQUE (log_date, task_id)
);

-- 6. Tabla de Histórico y Snapshots Diarios
CREATE TABLE IF NOT EXISTS public.daily_history_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date DATE NOT NULL UNIQUE,
    total_tasks INT DEFAULT 0,
    completed_tasks INT DEFAULT 0,
    pending_tasks INT DEFAULT 0,
    completion_percentage NUMERIC(5,2) DEFAULT 0.00,
    morning_completion_pct NUMERIC(5,2) DEFAULT 0.00,
    afternoon_completion_pct NUMERIC(5,2) DEFAULT 0.00,
    summary_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- FUNCIÓN DE REINICIO DIARIO Y GUARDADO EN HISTÓRICO
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.fn_reset_daily_tasks(target_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_tasks INT := 0;
    v_completed_tasks INT := 0;
    v_pending_tasks INT := 0;
    v_pct NUMERIC(5,2) := 0.00;
    v_morning_pct NUMERIC(5,2) := 0.00;
    v_afternoon_pct NUMERIC(5,2) := 0.00;
    v_today DATE := CURRENT_DATE;
    v_rec RECORD;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE l.status = 'completada'),
        COUNT(*) FILTER (WHERE l.status = 'pendiente')
    INTO v_total_tasks, v_completed_tasks, v_pending_tasks
    FROM public.daily_task_logs l
    WHERE l.log_date = target_date;

    IF v_total_tasks > 0 THEN
        v_pct := ROUND((v_completed_tasks::NUMERIC / v_total_tasks::NUMERIC) * 100, 2);
    END IF;

    SELECT 
        CASE WHEN COUNT(*) > 0 
             THEN ROUND((COUNT(*) FILTER (WHERE l.status = 'completada')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
             ELSE 0.00 END
    INTO v_morning_pct
    FROM public.daily_task_logs l
    JOIN public.tasks t ON l.task_id = t.id
    WHERE l.log_date = target_date AND t.shift_id = 'manana';

    SELECT 
        CASE WHEN COUNT(*) > 0 
             THEN ROUND((COUNT(*) FILTER (WHERE l.status = 'completada')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
             ELSE 0.00 END
    INTO v_afternoon_pct
    FROM public.daily_task_logs l
    JOIN public.tasks t ON l.task_id = t.id
    WHERE l.log_date = target_date AND t.shift_id = 'tarde';

    INSERT INTO public.daily_history_snapshots (
        snapshot_date,
        total_tasks,
        completed_tasks,
        pending_tasks,
        completion_percentage,
        morning_completion_pct,
        afternoon_completion_pct,
        summary_notes
    ) VALUES (
        target_date,
        v_total_tasks,
        v_completed_tasks,
        v_pending_tasks,
        v_pct,
        v_morning_pct,
        v_afternoon_pct,
        'Cierre de jornada a las 22:00h registrado con éxito.'
    )
    ON CONFLICT (snapshot_date) DO UPDATE SET
        total_tasks = EXCLUDED.total_tasks,
        completed_tasks = EXCLUDED.completed_tasks,
        pending_tasks = EXCLUDED.pending_tasks,
        completion_percentage = EXCLUDED.completion_percentage,
        morning_completion_pct = EXCLUDED.morning_completion_pct,
        afternoon_completion_pct = EXCLUDED.afternoon_completion_pct,
        created_at = NOW();

    UPDATE public.daily_task_logs
    SET status = 'pendiente',
        completed_by_user_id = NULL,
        completed_by_name = NULL,
        completed_at = NULL,
        updated_at = NOW()
    WHERE log_date = v_today;

    FOR v_rec IN SELECT id FROM public.tasks WHERE active = TRUE LOOP
        INSERT INTO public.daily_task_logs (log_date, task_id, status)
        VALUES (v_today, v_rec.id, 'pendiente')
        ON CONFLICT (log_date, task_id) DO UPDATE SET 
            status = 'pendiente', 
            completed_at = NULL, 
            completed_by_name = NULL;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'snapshot_date', target_date,
        'completion_percentage', v_pct,
        'completed_tasks', v_completed_tasks,
        'pending_tasks', v_pending_tasks,
        'new_day_initialized', v_today
    );
END;
$$;

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD RLS
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_history_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura general de turnos" ON public.shifts;
CREATE POLICY "Permitir lectura general de turnos" ON public.shifts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir lectura general de tareas activas" ON public.tasks;
CREATE POLICY "Permitir lectura general de tareas activas" ON public.tasks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir lectura general de logs diarios" ON public.daily_task_logs;
CREATE POLICY "Permitir lectura general de logs diarios" ON public.daily_task_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir lectura general de histórico" ON public.daily_history_snapshots;
CREATE POLICY "Permitir lectura general de histórico" ON public.daily_history_snapshots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir actualizar logs diarios" ON public.daily_task_logs;
CREATE POLICY "Permitir actualizar logs diarios" ON public.daily_task_logs FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir insertar logs diarios" ON public.daily_task_logs;
CREATE POLICY "Permitir insertar logs diarios" ON public.daily_task_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir admin gestionar tareas" ON public.tasks;
CREATE POLICY "Permitir admin gestionar tareas" ON public.tasks FOR ALL USING (true);

-- ==============================================================================
-- INSERCIÓN DE TAREAS: TURNO MAÑANA (18 CAJERA + 21 DESPACHO = 39 TAREAS)
-- TURNO TARDE QUEDA VACÍO PARA QUE EL ADMINISTRADOR AGREGUE SUS TAREAS
-- ==============================================================================
TRUNCATE TABLE public.tasks CASCADE;

INSERT INTO public.tasks (title, description, category, shift_id, display_order, active) VALUES
-- MAÑANA - CAJERA (18 Tareas)
('Revisión de temperatura de equipos y correcto funcionamiento', 'Verificar congeladoras, neveras y exhibidores.', 'Cajera', 'manana', 1, true),
('Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.)', 'Revisión de productos perecibles en stock.', 'Cajera', 'manana', 2, true),
('Verificar stock de ingredientes para la preparación de productos', 'Materia prima e insumos de la jornada.', 'Cajera', 'manana', 3, true),
('Verificar estado de los panes campesinos', 'Revisar frescura, textura y empaque.', 'Cajera', 'manana', 4, true),
('Verificar APPS (Cárkula, PedidosYa, Rappi)', 'Revisar tablets y recepción de pedidos online.', 'Cajera', 'manana', 5, true),
('Verificar máquina de café (que esté abastecida: leche, café, chocolate y agua)', 'Comprobar insumos de cafetera.', 'Cajera', 'manana', 6, true),
('Verificar e ingresar la producción', 'Registrar ingreso de producción.', 'Cajera', 'manana', 7, true),
('Limpieza de barras y mesas', 'Desinfectar superficies del salón.', 'Cajera', 'manana', 8, true),
('Limpieza de piso, baño', 'Barrido, trapeado de salón y aseo de baño.', 'Cajera', 'manana', 9, true),
('Limpieza de horno, tostadora y demás', 'Limpieza profunda de artefactos, microondas, vitrina, caja y estantes.', 'Cajera', 'manana', 10, true),
('Abastecer la cafetera (café, agua, leche, chocolate)', 'Llenado de contenedores de cafetera.', 'Cajera', 'manana', 11, true),
('Revisión y reposición de servilletas, cucharas, sorbetes, azúcar', 'Insumos de atención en caja y barra.', 'Cajera', 'manana', 12, true),
('Abastecer neveras y estantes (jugos, gaseosas, leches, tostadas)', 'Reposición de bebidas en frío y exhibidor.', 'Cajera', 'manana', 13, true),
('Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada', 'Control de insumos de barra y cocina.', 'Cajera', 'manana', 14, true),
('Dejar vitrina de postres abastecida (empanadas, alfajores y roskitas)', 'Montaje de dulce y postres.', 'Cajera', 'manana', 15, true),
('Colocar postres con etiquetas y nombres', 'Etiquetado de caducidad e identificación.', 'Cajera', 'manana', 16, true),
('Cuadre de caja, ingreso de venta a drive y cierre de sistema', 'Arqueo contable e informe de ventas en Drive.', 'Cajera', 'manana', 17, true),
('Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar', 'Relevo entre cajeras.', 'Cajera', 'manana', 18, true),

-- MAÑANA - DESPACHO (21 Tareas)
('Revisión de temperatura de las neveras y equipos', 'Comprobar refrigeración en área de despacho.', 'Despacho', 'manana', 19, true),
('Abastecer exhibidor de panes y colocar etiqueta de nombres', 'Organizar vitrina principal de panadería.', 'Despacho', 'manana', 20, true),
('Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.)', 'Control de caducidad en insumos.', 'Despacho', 'manana', 21, true),
('Verificar stock de ingredientes para la preparación de productos', 'Revisar insumos de despacho.', 'Despacho', 'manana', 22, true),
('Limpieza de barras, mesas y sillas', 'Aseo de muebles de atención.', 'Despacho', 'manana', 23, true),
('Preparar triples', 'Elaboración de triples frescos.', 'Despacho', 'manana', 24, true),
('Cambiar sandwiches de exhibición (lunes-jueves)', 'Rotación y presentación de sandwiches.', 'Despacho', 'manana', 25, true),
('Verificar productos en vitrina (ambas vitrinas exhibidas y con nombres)', 'Exhibición impecable.', 'Despacho', 'manana', 26, true),
('Guardar campesinos nuevos en el taper grande', 'Almacenamiento del pan campesino.', 'Despacho', 'manana', 27, true),
('Cortar fruta', 'Porcionado de fruta fresca.', 'Despacho', 'manana', 28, true),
('Corte y empaquetado de pan de molde / hamburguesas / pullman / tostadas / roskitas', 'Empaquetado de panes.', 'Despacho', 'manana', 29, true),
('Sancochar camote', 'Preparación de camote para sandwiches.', 'Despacho', 'manana', 30, true),
('Limpieza general de salón y pisos', 'Barrido y desinfección de salón.', 'Despacho', 'manana', 31, true),
('Limpieza de baño', 'Aseo de servicios higiénicos.', 'Despacho', 'manana', 32, true),
('Dejar limpio y despejado el lavadero', 'Sin utensilios ni loza acumulada.', 'Despacho', 'manana', 33, true),
('Verificar stock de mayonesa, zarza, pollo, lechuga lavada, papas al hilo', 'Insumos de despacho.', 'Despacho', 'manana', 34, true),
('Revisión y reposición de descartables y bolsas', 'Reposición de bolsas y empaques.', 'Despacho', 'manana', 35, true),
('Dejar abastecido de detergente, lejía y poet', 'Productos de aseo.', 'Despacho', 'manana', 36, true),
('Dejar trapos y trapeadores limpios', 'Implementos de aseo higienizados.', 'Despacho', 'manana', 37, true),
('Limpiar rebanadora', 'Desinfección de rebanadora.', 'Despacho', 'manana', 38, true),
('Informar sobre cualquier pedido pendiente y/o si falta algo por terminar', 'Relevo entre personal de despacho.', 'Despacho', 'manana', 39, true);

-- Crear logs para el día actual
INSERT INTO public.daily_task_logs (log_date, task_id, status)
SELECT CURRENT_DATE, id, 'pendiente'
FROM public.tasks
ON CONFLICT (log_date, task_id) DO NOTHING;
