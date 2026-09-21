-- ==============================================================================
-- SCHEMA SQL PARA SUPABASE: PAN DEL BARRIO - CHECKLIST OFICIAL DE TAREAS
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
    category TEXT NOT NULL DEFAULT 'Apertura',
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
-- FUNCIÓN DE REINICIO DIARIO Y GUARDADO EN HISTÓRICO (Cierre de las 22:00h)
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
    -- 1. Registrar snapshot del estado actual en el histórico
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
        'Cierre de jornada registrado a las 22:00h.'
    )
    ON CONFLICT (snapshot_date) DO UPDATE SET
        total_tasks = EXCLUDED.total_tasks,
        completed_tasks = EXCLUDED.completed_tasks,
        pending_tasks = EXCLUDED.pending_tasks,
        completion_percentage = EXCLUDED.completion_percentage,
        morning_completion_pct = EXCLUDED.morning_completion_pct,
        afternoon_completion_pct = EXCLUDED.afternoon_completion_pct,
        created_at = NOW();

    -- 2. REINICIAR ABSOLUTAMENTE TODAS LAS TAREAS DEL DÍA A 'PENDIENTE' (ROJO / 0%)
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
-- INSERCIÓN DEL CHECKLIST OFICIAL DE PAN DEL BARRIO
-- ==============================================================================
TRUNCATE TABLE public.tasks CASCADE;

INSERT INTO public.tasks (title, description, category, shift_id, display_order, active) VALUES
-- MAÑANA - APERTURA
('Revisión de la temperatura de equipos y correcto funcionamiento', 'Verificar congeladoras, neveras y exhibidores.', 'Apertura', 'manana', 1, true),
('Abastecer exhibidor de panes y colocar etiqueta de nombres', 'Organizar panes frescos y etiquetar variedades.', 'Apertura', 'manana', 2, true),
('Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.)', 'Revisión de productos perecibles en stock.', 'Apertura', 'manana', 3, true),
('Verificar estado de los panes campesinos', 'Revisar frescura, textura y empaque.', 'Apertura', 'manana', 4, true),
('Verificar stock de ingredientes para la preparación de productos', 'Materia prima de la jornada.', 'Apertura', 'manana', 5, true),
('Limpieza de barras, mesas y sillas', 'Desinfectar superficies del salón.', 'Apertura', 'manana', 6, true),
('Preparar triples', 'Elaboración de sandwiches triples de producción.', 'Apertura', 'manana', 7, true),

-- MAÑANA - MEDIO TURNO
('Cambiar sandwiches de exhibición (lunes-jueves)', 'Renovación y rotación de sandwiches en vitrina.', 'Medio Turno', 'manana', 8, true),
('Ambas vitrinas con todos los productos exhibidos y con nombres', 'Verificar exhibición completa y nombres legibles.', 'Medio Turno', 'manana', 9, true),
('Guardar campesinos nuevos en el taper grande', 'Almacenamiento higiénico del pan campesino.', 'Medio Turno', 'manana', 10, true),
('Cortar fruta', 'Porcionado de fruta fresca para atención.', 'Medio Turno', 'manana', 11, true),
('Corte y empaquetado de pan de molde / hamburguesas / pullman', 'Empaquetar porciones listas para venta.', 'Medio Turno', 'manana', 12, true),
('Limpieza de barras, mesas y sillas', 'Repaso de limpieza en zona de clientes.', 'Medio Turno', 'manana', 13, true),
('Limpieza de pisos', 'Barrido y trapeado de salón.', 'Medio Turno', 'manana', 14, true),
('Limpieza del baño', 'Aseo de servicios higiénicos.', 'Medio Turno', 'manana', 15, true),
('Dejar limpio y despejado el lavadero', 'Sin platos ni utensilios acumulados.', 'Medio Turno', 'manana', 16, true),
('Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada, pan campesino y pullman cortado y papas al hilo', 'Control de insumos de cocina.', 'Medio Turno', 'manana', 17, true),
('Revisión y reposición de descartables y bolsas', 'Vasos, servilletas, sorbetes y empaques.', 'Medio Turno', 'manana', 18, true),
('Dejar abastecido de detergente, lejía y poet', 'Stock de productos de aseo.', 'Medio Turno', 'manana', 19, true),
('Dejar trapos y trapeador limpios', 'Lavar y desinfectar implementos de limpieza.', 'Medio Turno', 'manana', 20, true),
('Limpiar rebanadora', 'Desinfección de la máquina cortadora de pan.', 'Medio Turno', 'manana', 21, true),
('Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar', 'Comunicación y relevo entre turnos.', 'Medio Turno', 'manana', 22, true),

-- MAÑANA - CAMBIO DE TURNO
('Abastecer exhibidor de panes y colocar etiqueta de nombres', 'Reabastecer vitrina principal.', 'Cambio de Turno', 'manana', 23, true),
('Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.)', 'Control de caducidad.', 'Cambio de Turno', 'manana', 24, true),
('Verificar estado de los panes campesinos', 'Revisión de stock campesino.', 'Cambio de Turno', 'manana', 25, true),
('Verificar stock de ingredientes para la preparación de productos', 'Inventario de insumos.', 'Cambio de Turno', 'manana', 26, true),
('Limpieza de barras, mesas y sillas', 'Limpieza general de muebles.', 'Cambio de Turno', 'manana', 27, true),
('Corte y empaquetado de pan de molde/hamburguesas/ pullman/ tostadas/ roskitas', 'Empaque de stock secundario.', 'Cambio de Turno', 'manana', 28, true),

-- MAÑANA - CIERRE
('Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada, pan campesino y pullman cortado y papas al hilo', 'Control para la jornada siguiente.', 'Cierre', 'manana', 29, true),
('Lavar máquina de naranjas', 'Desarmar y lavar exprimidor industrial.', 'Cierre', 'manana', 30, true),
('Limpieza de pisos, limpieza del baño y zona de la cocina', 'Aseo profundo de áreas.', 'Cierre', 'manana', 31, true),
('Limpiar rebanadora', 'Limpieza e higiene de rebanadora.', 'Cierre', 'manana', 32, true),
('Revisión y reposición de descartables y bolsas', 'Reposición completa.', 'Cierre', 'manana', 33, true),
('Realizar el conteo de panadería', 'Inventario final de panadería.', 'Cierre', 'manana', 34, true),
('Dejar limpio y despejado el lavadero', 'Fregadero impecable.', 'Cierre', 'manana', 35, true),
('Embolsar correctamente los productos de la vitrina de panadería', 'Protección para conservación de productos.', 'Cierre', 'manana', 36, true),
('Dejar moldes de embutidos bien tapados y sin exceso de envoltura', 'Almacenamiento correcto en frío.', 'Cierre', 'manana', 37, true),
('Meter sillas y mesas; dejar limpio el piso de la terraza', 'Resguardo de muebles exteriores.', 'Cierre', 'manana', 38, true),
('Dejar vitrina limpia y vacía (limpiar con limpiavidrios y periódico)', 'Limpieza de cristales de exhibición.', 'Cierre', 'manana', 39, true),
('Solicitar insumos necesarios para el día siguiente', 'Anotar faltantes y realizar pedido.', 'Cierre', 'manana', 40, true),
('Dejar abastecido de detergente, lejía y poet', 'Reposición de insumos de aseo.', 'Cierre', 'manana', 41, true),
('Dejar trapos, trapeador y lavadero limpio', 'Orden e higiene en zona de lavado.', 'Cierre', 'manana', 42, true),
('Revisión de la temperatura de equipos y correcto funcionamiento', 'Comprobar congeladores y refrigeradores.', 'Cierre', 'manana', 43, true),
('Sacar la basura (salón, producción, baños)', 'Retiro de bolsas de residuos.', 'Cierre', 'manana', 44, true),
('Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar', 'Relevo de información al turno tarde.', 'Cierre', 'manana', 45, true),

-- TARDE - APERTURA
('Revisión de la temperatura de equipos y correcto funcionamiento', 'Revisar congeladoras y vitrinas.', 'Apertura', 'tarde', 46, true),
('Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc)', 'Inspección de caducidad.', 'Apertura', 'tarde', 47, true),
('Verificar estado de los panes campesinos', 'Frescura de productos campesinos.', 'Apertura', 'tarde', 48, true),
('Verificar stock de ingredientes para la preparación de productos', 'Revisión de insumos.', 'Apertura', 'tarde', 49, true),
('Verificar las APPS (Cárkula, PedidosYa, Rappi)', 'Revisar tablets y recepción de pedidos online.', 'Apertura', 'tarde', 50, true),
('Verificar máquina de café (que esté abastecida: leche, café, chocolate y agua)', 'Comprobar insumos de cafetera.', 'Apertura', 'tarde', 51, true),
('Verificar e ingresar producción', 'Registrar ingreso de producción de la tarde.', 'Apertura', 'tarde', 52, true),
('Limpieza de barras, mesas y sillas', 'Higiene del área de mesas.', 'Apertura', 'tarde', 53, true),
('Limpieza de pisos', 'Barrido y trapeado de salón.', 'Apertura', 'tarde', 54, true),
('Limpieza del baño', 'Aseo de baños.', 'Apertura', 'tarde', 55, true),
('Limpieza de horno, tostadora, microondas, vitrina, caja y estantes', 'Limpieza profunda de artefactos y caja.', 'Apertura', 'tarde', 56, true),
('Abastecer cafetera (café, agua, leche, chocolate)', 'Llenado de contenedores de cafetera.', 'Apertura', 'tarde', 57, true),
('Revisión y reposición de servilletas, cucharas, sorbetes, sobres azúcar, etc...', 'Insumos de mostrador.', 'Apertura', 'tarde', 58, true),
('Abastecer neveras y estantes (jugos, gaseosas, leches, tostadas)', 'Reposición de bebidas en frío y productos.', 'Apertura', 'tarde', 59, true),
('Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada, pan campesino cortado', 'Stock de ingredientes.', 'Apertura', 'tarde', 60, true),
('Dejar vitrina de postres abastecida (empanadas, alfajores y roskitas)', 'Montaje de postres y dulce.', 'Apertura', 'tarde', 61, true),
('Colocar los postres con etiquetas de nombre y fecha', 'Etiquetado de caducidad.', 'Apertura', 'tarde', 62, true),
('Cuadrar caja, ingreso de venta a drive y cierre de sistema', 'Registro contable y ventas.', 'Apertura', 'tarde', 63, true),
('Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar', 'Relevo entre personal.', 'Apertura', 'tarde', 64, true),

-- TARDE - CAMBIO DE TURNO
('Verificar las APPS (Cárkula, PedidosYa, Rappi)', 'Control de aplicaciones de delivery.', 'Cambio de Turno', 'tarde', 65, true),
('Verificar máquina de café (que esté abastecida: leche, café, chocolate y agua)', 'Revisión de cafetera.', 'Cambio de Turno', 'tarde', 66, true),
('Limpieza de barras, mesas y sillas', 'Aseo de salón.', 'Cambio de Turno', 'tarde', 67, true),
('Colocar los postres con etiquetas de nombre y fecha', 'Etiquetar postres expuestos.', 'Cambio de Turno', 'tarde', 68, true),
('Corte y empaquetado de pan de molde/hamburguesas/ pullman/ tostadas/ roskitas', 'Empaquetado de productos.', 'Cambio de Turno', 'tarde', 69, true),

-- TARDE - CIERRE
('Abastecer neveras y estantes (jugos, gaseosas, leches, tostadas)', 'Llenar stock frío y seco para mañana.', 'Cierre', 'tarde', 70, true),
('Revisión y reposición de descartables y bolsas', 'Reposición final de empaques.', 'Cierre', 'tarde', 71, true),
('Limpieza de horno, tostadora, microondas, vitrina, caja y estantes', 'Aseo total de equipos de calor y vitrinas.', 'Cierre', 'tarde', 72, true),
('Limpieza de pisos', 'Barrido y trapeado final del salón.', 'Cierre', 'tarde', 73, true),
('Abastecer cafetera (café, agua, leche, chocolate)', 'Dejar lista máquina de café para la mañana.', 'Cierre', 'tarde', 74, true),
('Colocar milhojas y pies en envase descartables y cubrir la crema volteada', 'Protección y envasado de repostería.', 'Cierre', 'tarde', 75, true),
('Dejar vitrina de postres abastecida (empanadas, alfajores y roskitas)', 'Organizar vitrina.', 'Cierre', 'tarde', 77, true),
('Revisión y reposición de servilletas, cucharas, sorbetes, sobres azúcar, etc', 'Insumos de atención.', 'Cierre', 'tarde', 77, true),
('Lavar máquina de café', 'Limpieza y purgado de máquina expreso / cafetera.', 'Cierre', 'tarde', 78, true),
('Realizar el conteo de pastelería', 'Inventario final de pastelería.', 'Cierre', 'tarde', 79, true),
('Revisión de la temperatura de equipos y correcto funcionamiento', 'Control de frío en nocturno.', 'Cierre', 'tarde', 80, true),
('Cuadrar caja, ingreso de venta a drive y cierre de sistema', 'Arqueo de caja final, informe a Drive y cierre.', 'Cierre', 'tarde', 81, true),
('Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar', 'Novedades de cierre.', 'Cierre', 'tarde', 82, true);

-- Crear logs para el día actual
INSERT INTO public.daily_task_logs (log_date, task_id, status)
SELECT CURRENT_DATE, id, 'pendiente'
FROM public.tasks
ON CONFLICT (log_date, task_id) DO NOTHING;
