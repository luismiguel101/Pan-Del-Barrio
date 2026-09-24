export const DEFAULT_SHIFTS = [
  { id: 'manana', name: 'Mañana', icon: 'Sunrise', hours: 'Turno Mañana' },
  { id: 'tarde', name: 'Tarde', icon: 'Sunset', hours: 'Turno Tarde' }
];

export const CATEGORIES = [
  { id: 'Cajera', name: 'Cajera 💳', icon: 'Receipt', color: 'from-amber-700 to-amber-600' },
  { id: 'Despacho', name: 'Despacho 🥖', icon: 'Wheat', color: 'from-orange-700 to-amber-600' }
];

export const INITIAL_TASKS = [
  // ==========================================
  // CAJERA TURNO MAÑANA (18 Tareas Exactas)
  // ==========================================
  {
    id: 'm-caj-1',
    title: 'Revisión de temperatura de equipos y correcto funcionamiento.',
    description: 'Verificar congeladoras, neveras y exhibidores.',
    category: 'Cajera',
    shift: 'manana',
    order: 1,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-2',
    title: 'Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.).',
    description: 'Revisión de productos perecibles en stock.',
    category: 'Cajera',
    shift: 'manana',
    order: 2,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-3',
    title: 'Verificar stock de ingredientes para la preparación de productos.',
    description: 'Materia prima e insumos de la jornada.',
    category: 'Cajera',
    shift: 'manana',
    order: 3,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-4',
    title: 'Verificar estado de los panes campesinos.',
    description: 'Revisar frescura, textura y empaque.',
    category: 'Cajera',
    shift: 'manana',
    order: 4,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-5',
    title: 'Verificar APPS (Cárkula, PedidosYa, Rappi).',
    description: 'Revisar tablets y recepción de pedidos online.',
    category: 'Cajera',
    shift: 'manana',
    order: 5,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-6',
    title: 'Verificar máquina de café (que esté abastecida: leche, café, chocolate y agua).',
    description: 'Comprobar insumos de cafetera.',
    category: 'Cajera',
    shift: 'manana',
    order: 6,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-7',
    title: 'Verificar e ingresar la producción.',
    description: 'Registrar ingreso de producción.',
    category: 'Cajera',
    shift: 'manana',
    order: 7,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-8',
    title: 'Limpieza de barras y mesas.',
    description: 'Desinfectar superficies del salón.',
    category: 'Cajera',
    shift: 'manana',
    order: 8,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-9',
    title: 'Limpieza de piso, baño.',
    description: 'Barrido, trapeado de salón y aseo de baño.',
    category: 'Cajera',
    shift: 'manana',
    order: 9,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-10',
    title: 'Limpieza de horno, tostadora y demás (microondas, vitrina, caja y estantes).',
    description: 'Limpieza profunda de artefactos, mostrador y caja.',
    category: 'Cajera',
    shift: 'manana',
    order: 10,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-11',
    title: 'Abastecer la cafetera (café, agua, leche, chocolate).',
    description: 'Llenado de contenedores de cafetera.',
    category: 'Cajera',
    shift: 'manana',
    order: 11,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-12',
    title: 'Revisión y reposición de servilletas, cucharas, sorbetes, azúcar.',
    description: 'Insumos de atención en caja y barra.',
    category: 'Cajera',
    shift: 'manana',
    order: 12,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-13',
    title: 'Abastecer neveras y estantes (jugos, gaseosas, leches, tostadas).',
    description: 'Reposición de bebidas en frío y exhibidor.',
    category: 'Cajera',
    shift: 'manana',
    order: 13,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-14',
    title: 'Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada.',
    description: 'Control de insumos de barra y cocina.',
    category: 'Cajera',
    shift: 'manana',
    order: 14,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-15',
    title: 'Dejar vitrina de postres abastecida (empanadas, alfajores y roskitas).',
    description: 'Montaje de dulce y postres.',
    category: 'Cajera',
    shift: 'manana',
    order: 15,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-16',
    title: 'Colocar postres con etiquetas y nombres.',
    description: 'Etiquetado de caducidad e identificación.',
    category: 'Cajera',
    shift: 'manana',
    order: 16,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-17',
    title: 'Cuadre de caja, ingreso de venta a drive y cierre de sistema.',
    description: 'Arqueo contable e informe de ventas en Drive.',
    category: 'Cajera',
    shift: 'manana',
    order: 17,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-caj-18',
    title: 'Informar al siguiente turno de algún pedido pendiente.',
    description: 'Relevo entre cajeras.',
    category: 'Cajera',
    shift: 'manana',
    order: 18,
    active: true,
    status: 'pendiente'
  },

  // ==========================================
  // DESPACHO TURNO MAÑANA (21 Tareas Exactas)
  // ==========================================
  {
    id: 'm-des-1',
    title: 'Revisión de temperatura de las neveras y equipos.',
    description: 'Comprobar refrigeración en área de despacho.',
    category: 'Despacho',
    shift: 'manana',
    order: 19,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-2',
    title: 'Abastecer exhibidor de panes y colocar etiqueta de nombres.',
    description: 'Organizar vitrina principal de panadería.',
    category: 'Despacho',
    shift: 'manana',
    order: 20,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-3',
    title: 'Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.).',
    description: 'Control de caducidad en insumos.',
    category: 'Despacho',
    shift: 'manana',
    order: 21,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-4',
    title: 'Verificar stock de ingredientes para la preparación de productos.',
    description: 'Revisar insumos de despacho.',
    category: 'Despacho',
    shift: 'manana',
    order: 22,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-5',
    title: 'Limpieza de barras, mesas y sillas.',
    description: 'Aseo de muebles de atención.',
    category: 'Despacho',
    shift: 'manana',
    order: 23,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-6',
    title: 'Preparar triples.',
    description: 'Elaboración de triples frescos.',
    category: 'Despacho',
    shift: 'manana',
    order: 24,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-7',
    title: 'Cambiar sandwiches de exhibición (lunes-jueves).',
    description: 'Rotación y presentación de sandwiches.',
    category: 'Despacho',
    shift: 'manana',
    order: 25,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-8',
    title: 'Verificar productos en vitrina (ambas vitrinas exhibidas y con nombres).',
    description: 'Exhibición impecable.',
    category: 'Despacho',
    shift: 'manana',
    order: 26,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-9',
    title: 'Guardar campesinos nuevos en el táper grande.',
    description: 'Almacenamiento del pan campesino.',
    category: 'Despacho',
    shift: 'manana',
    order: 27,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-10',
    title: 'Cortar fruta.',
    description: 'Porcionado de fruta fresca.',
    category: 'Despacho',
    shift: 'manana',
    order: 28,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-11',
    title: 'Corte y empaquetado de pan de molde / hamburguesas / pullman / tostadas / roskitas.',
    description: 'Empaquetado de panes.',
    category: 'Despacho',
    shift: 'manana',
    order: 29,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-12',
    title: 'Sancochar camote.',
    description: 'Preparación de camote para sandwiches.',
    category: 'Despacho',
    shift: 'manana',
    order: 30,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-13',
    title: 'Limpieza general de salón y pisos.',
    description: 'Barrido y desinfección de salón.',
    category: 'Despacho',
    shift: 'manana',
    order: 31,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-14',
    title: 'Limpieza de baño.',
    description: 'Aseo de servicios higiénicos.',
    category: 'Despacho',
    shift: 'manana',
    order: 32,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-15',
    title: 'Dejar limpio y despejado el lavadero.',
    description: 'Sin utensilios ni loza acumulada.',
    category: 'Despacho',
    shift: 'manana',
    order: 33,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-16',
    title: 'Verificar stock de mayonesa, zarza, pollo, lechuga lavada, papas al hilo.',
    description: 'Insumos de despacho.',
    category: 'Despacho',
    shift: 'manana',
    order: 34,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-17',
    title: 'Revisión y reposición de descartables y bolsas.',
    description: 'Reposición de bolsas y empaques.',
    category: 'Despacho',
    shift: 'manana',
    order: 35,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-18',
    title: 'Dejar abastecido de detergente, lejía y poet.',
    description: 'Productos de aseo.',
    category: 'Despacho',
    shift: 'manana',
    order: 36,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-19',
    title: 'Dejar trapos y trapeadores limpios.',
    description: 'Implementos de aseo higienizados.',
    category: 'Despacho',
    shift: 'manana',
    order: 37,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-20',
    title: 'Limpiar rebanadora.',
    description: 'Desinfección de rebanadora.',
    category: 'Despacho',
    shift: 'manana',
    order: 38,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-des-21',
    title: 'Informar sobre cualquier pedido pendiente.',
    description: 'Relevo entre personal de despacho.',
    category: 'Despacho',
    shift: 'manana',
    order: 39,
    active: true,
    status: 'pendiente'
  }
];
