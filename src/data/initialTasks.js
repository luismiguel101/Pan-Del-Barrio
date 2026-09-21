export const DEFAULT_SHIFTS = [
  { id: 'manana', name: 'Mañana', icon: 'Sunrise', hours: 'Apertura - Cierre Mañana' },
  { id: 'tarde', name: 'Tarde', icon: 'Sunset', hours: 'Apertura - Cierre Tarde' }
];

export const CATEGORIES = [
  { id: 'Todas', name: 'Todas', icon: 'Sparkles', color: 'bg-[#3D2214] text-amber-300 border-amber-900' },
  { id: 'Apertura', name: 'Apertura 🌅', icon: 'Sunrise', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'Medio Turno', name: 'Medio Turno ⏰', icon: 'Clock', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'Cambio de Turno', name: 'Cambio de Turno 🔄', icon: 'RotateCcw', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'Cierre', name: 'Cierre 🌙', icon: 'Sunset', color: 'bg-rose-100 text-rose-900 border-rose-300' }
];

export const INITIAL_TASKS = [
  // ==========================================
  // TURNO MAÑANA - APERTURA
  // ==========================================
  {
    id: 'm-ap-1',
    title: 'Revisión de la temperatura de equipos y correcto funcionamiento',
    description: 'Verificar congeladoras, neveras y exhibidores.',
    category: 'Apertura',
    shift: 'manana',
    order: 1,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ap-2',
    title: 'Abastecer exhibidor de panes y colocar etiqueta de nombres',
    description: 'Organizar panes frescos y etiquetar variedades.',
    category: 'Apertura',
    shift: 'manana',
    order: 2,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ap-3',
    title: 'Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.)',
    description: 'Revisión de productos perecibles en stock.',
    category: 'Apertura',
    shift: 'manana',
    order: 3,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ap-4',
    title: 'Verificar estado de los panes campesinos',
    description: 'Revisar frescura, textura y empaque.',
    category: 'Apertura',
    shift: 'manana',
    order: 4,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ap-5',
    title: 'Verificar stock de ingredientes para la preparación de productos',
    description: 'Materia prima de la jornada.',
    category: 'Apertura',
    shift: 'manana',
    order: 5,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ap-6',
    title: 'Limpieza de barras, mesas y sillas',
    description: 'Desinfectar superficies del salón.',
    category: 'Apertura',
    shift: 'manana',
    order: 6,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ap-7',
    title: 'Preparar triples',
    description: 'Elaboración de sandwiches triples de producción.',
    category: 'Apertura',
    shift: 'manana',
    order: 7,
    active: true,
    status: 'pendiente'
  },

  // ==========================================
  // TURNO MAÑANA - MEDIO TURNO
  // ==========================================
  {
    id: 'm-mt-1',
    title: 'Cambiar sandwiches de exhibición (lunes-jueves)',
    description: 'Renovación y rotación de sandwiches en vitrina.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 8,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-2',
    title: 'Ambas vitrinas con todos los productos exhibidos y con nombres',
    description: 'Verificar exhibición completa y nombres legibles.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 9,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-3',
    title: 'Guardar campesinos nuevos en el taper grande',
    description: 'Almacenamiento higiénico del pan campesino.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 10,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-4',
    title: 'Cortar fruta',
    description: 'Porcionado de fruta fresca para atención.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 11,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-5',
    title: 'Corte y empaquetado de pan de molde / hamburguesas / pullman',
    description: 'Empaquetar porciones listas para venta.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 12,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-6',
    title: 'Limpieza de barras, mesas y sillas',
    description: 'Repaso de limpieza en zona de clientes.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 13,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-7',
    title: 'Limpieza de pisos',
    description: 'Barrido y trapeado de salón.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 14,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-8',
    title: 'Limpieza del baño',
    description: 'Aseo de servicios higiénicos.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 15,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-9',
    title: 'Dejar limpio y despejado el lavadero',
    description: 'Sin platos ni utensilios acumulados.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 16,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-10',
    title: 'Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada, pan campesino y pullman cortado y papas al hilo',
    description: 'Control de insumos de cocina.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 17,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-11',
    title: 'Revisión y reposición de descartables y bolsas',
    description: 'Vasos, servilletas, sorbetes y empaques.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 18,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-12',
    title: 'Dejar abastecido de detergente, lejía y poet',
    description: 'Stock de productos de aseo.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 19,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-13',
    title: 'Dejar trapos y trapeador limpios',
    description: 'Lavar y desinfectar implementos de limpieza.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 20,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-14',
    title: 'Limpiar rebanadora',
    description: 'Desinfección de la máquina cortadora de pan.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 21,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-mt-15',
    title: 'Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar',
    description: 'Comunicación y relevo entre turnos.',
    category: 'Medio Turno',
    shift: 'manana',
    order: 22,
    active: true,
    status: 'pendiente'
  },

  // ==========================================
  // TURNO MAÑANA - CAMBIO DE TURNO
  // ==========================================
  {
    id: 'm-ct-1',
    title: 'Abastecer exhibidor de panes y colocar etiqueta de nombres',
    description: 'Reabastecer vitrina principal.',
    category: 'Cambio de Turno',
    shift: 'manana',
    order: 23,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ct-2',
    title: 'Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc.)',
    description: 'Control de caducidad.',
    category: 'Cambio de Turno',
    shift: 'manana',
    order: 24,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ct-3',
    title: 'Verificar estado de los panes campesinos',
    description: 'Revisión de stock campesino.',
    category: 'Cambio de Turno',
    shift: 'manana',
    order: 25,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ct-4',
    title: 'Verificar stock de ingredientes para la preparación de productos',
    description: 'Inventario de insumos.',
    category: 'Cambio de Turno',
    shift: 'manana',
    order: 26,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ct-5',
    title: 'Limpieza de barras, mesas y sillas',
    description: 'Limpieza general de muebles.',
    category: 'Cambio de Turno',
    shift: 'manana',
    order: 27,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ct-6',
    title: 'Corte y empaquetado de pan de molde/hamburguesas/ pullman/ tostadas/ roskitas',
    description: 'Empaque de stock secundario.',
    category: 'Cambio de Turno',
    shift: 'manana',
    order: 28,
    active: true,
    status: 'pendiente'
  },

  // ==========================================
  // TURNO MAÑANA - CIERRE
  // ==========================================
  {
    id: 'm-ci-1',
    title: 'Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada, pan campesino y pullman cortado y papas al hilo',
    description: 'Control para la jornada siguiente.',
    category: 'Cierre',
    shift: 'manana',
    order: 29,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-2',
    title: 'Lavar máquina de naranjas',
    description: 'Desarmar y lavar exprimidor industrial.',
    category: 'Cierre',
    shift: 'manana',
    order: 30,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-3',
    title: 'Limpieza de pisos, limpieza del baño y zona de la cocina',
    description: 'Aseo profundo de áreas.',
    category: 'Cierre',
    shift: 'manana',
    order: 31,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-4',
    title: 'Limpiar rebanadora',
    description: 'Limpieza e higiene de rebanadora.',
    category: 'Cierre',
    shift: 'manana',
    order: 32,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-5',
    title: 'Revisión y reposición de descartables y bolsas',
    description: 'Reposición completa.',
    category: 'Cierre',
    shift: 'manana',
    order: 33,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-6',
    title: 'Realizar el conteo de panadería',
    description: 'Inventario final de panadería.',
    category: 'Cierre',
    shift: 'manana',
    order: 34,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-7',
    title: 'Dejar limpio y despejado el lavadero',
    description: 'Fregadero impecable.',
    category: 'Cierre',
    shift: 'manana',
    order: 35,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-8',
    title: 'Embolsar correctamente los productos de la vitrina de panadería',
    description: 'Protección para conservación de productos.',
    category: 'Cierre',
    shift: 'manana',
    order: 36,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-9',
    title: 'Dejar moldes de embutidos bien tapados y sin exceso de envoltura',
    description: 'Almacenamiento correcto en frío.',
    category: 'Cierre',
    shift: 'manana',
    order: 37,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-10',
    title: 'Meter sillas y mesas; dejar limpio el piso de la terraza',
    description: 'Resguardo de muebles exteriores.',
    category: 'Cierre',
    shift: 'manana',
    order: 38,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-11',
    title: 'Dejar vitrina limpia y vacía (limpiar con limpiavidrios y periódico)',
    description: 'Limpieza de cristales de exhibición.',
    category: 'Cierre',
    shift: 'manana',
    order: 39,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-12',
    title: 'Solicitar insumos necesarios para el día siguiente',
    description: 'Anotar faltantes y realizar pedido.',
    category: 'Cierre',
    shift: 'manana',
    order: 40,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-13',
    title: 'Dejar abastecido de detergente, lejía y poet',
    description: 'Reposición de insumos de aseo.',
    category: 'Cierre',
    shift: 'manana',
    order: 41,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-14',
    title: 'Dejar trapos, trapeador y lavadero limpio',
    description: 'Orden e higiene en zona de lavado.',
    category: 'Cierre',
    shift: 'manana',
    order: 42,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-15',
    title: 'Revisión de la temperatura de equipos y correcto funcionamiento',
    description: 'Comprobar congeladores y refrigeradores.',
    category: 'Cierre',
    shift: 'manana',
    order: 43,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-16',
    title: 'Sacar la basura (salón, producción, baños)',
    description: 'Retiro de bolsas de residuos.',
    category: 'Cierre',
    shift: 'manana',
    order: 44,
    active: true,
    status: 'pendiente'
  },
  {
    id: 'm-ci-17',
    title: 'Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar',
    description: 'Relevo de información al turno tarde.',
    category: 'Cierre',
    shift: 'manana',
    order: 45,
    active: true,
    status: 'pendiente'
  },

  // ==========================================
  // TURNO TARDE - APERTURA
  // ==========================================
  {
    id: 't-ap-1',
    title: 'Revisión de la temperatura de equipos y correcto funcionamiento',
    description: 'Revisar congeladoras y vitrinas.',
    category: 'Apertura',
    shift: 'tarde',
    order: 1,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-2',
    title: 'Verificar fechas de vencimiento (moldes, hamburguesas, huevos, etc)',
    description: 'Inspección de caducidad.',
    category: 'Apertura',
    shift: 'tarde',
    order: 2,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-3',
    title: 'Verificar estado de los panes campesinos',
    description: 'Frescura de productos campesinos.',
    category: 'Apertura',
    shift: 'tarde',
    order: 3,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-4',
    title: 'Verificar stock de ingredientes para la preparación de productos',
    description: 'Revisión de insumos.',
    category: 'Apertura',
    shift: 'tarde',
    order: 4,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-5',
    title: 'Verificar las APPS (Cárkula, PedidosYa, Rappi)',
    description: 'Revisar tablets y recepción de pedidos online.',
    category: 'Apertura',
    shift: 'tarde',
    order: 5,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-6',
    title: 'Verificar máquina de café (que esté abastecida: leche, café, chocolate y agua)',
    description: 'Comprobar insumos de cafetera.',
    category: 'Apertura',
    shift: 'tarde',
    order: 6,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-7',
    title: 'Verificar e ingresar producción',
    description: 'Registrar ingreso de producción de la tarde.',
    category: 'Apertura',
    shift: 'tarde',
    order: 7,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-8',
    title: 'Limpieza de barras, mesas y sillas',
    description: 'Higiene del área de mesas.',
    category: 'Apertura',
    shift: 'tarde',
    order: 8,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-9',
    title: 'Limpieza de pisos',
    description: 'Barrido y trapeado de salón.',
    category: 'Apertura',
    shift: 'tarde',
    order: 9,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-10',
    title: 'Limpieza del baño',
    description: 'Aseo de baños.',
    category: 'Apertura',
    shift: 'tarde',
    order: 10,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-11',
    title: 'Limpieza de horno, tostadora, microondas, vitrina, caja y estantes',
    description: 'Limpieza profunda de artefactos y caja.',
    category: 'Apertura',
    shift: 'tarde',
    order: 11,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-12',
    title: 'Abastecer cafetera (café, agua, leche, chocolate)',
    description: 'Llenado de contenedores de cafetera.',
    category: 'Apertura',
    shift: 'tarde',
    order: 12,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-13',
    title: 'Revisión y reposición de servilletas, cucharas, sorbetes, sobres azúcar, etc...',
    description: 'Insumos de mostrador.',
    category: 'Apertura',
    shift: 'tarde',
    order: 13,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-14',
    title: 'Abastecer neveras y estantes (jugos, gaseosas, leches, tostadas)',
    description: 'Reposición de bebidas en frío y productos.',
    category: 'Apertura',
    shift: 'tarde',
    order: 14,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-15',
    title: 'Verificar stock de mayonesa, zarza, azúcar, sal, agua hervida, pollo, lechuga lavada, pan campesino cortado',
    description: 'Stock de ingredientes.',
    category: 'Apertura',
    shift: 'tarde',
    order: 15,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-16',
    title: 'Dejar vitrina de postres abastecida (empanadas, alfajores y roskitas)',
    description: 'Montaje de postres y dulce.',
    category: 'Apertura',
    shift: 'tarde',
    order: 16,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-17',
    title: 'Colocar los postres con etiquetas de nombre y fecha',
    description: 'Etiquetado de caducidad.',
    category: 'Apertura',
    shift: 'tarde',
    order: 17,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-18',
    title: 'Cuadrar caja, ingreso de venta a drive y cierre de sistema',
    description: 'Registro contable y ventas.',
    category: 'Apertura',
    shift: 'tarde',
    order: 18,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ap-19',
    title: 'Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar',
    description: 'Relevo entre personal.',
    category: 'Apertura',
    shift: 'tarde',
    order: 19,
    active: true,
    status: 'pendiente'
  },

  // ==========================================
  // TURNO TARDE - CAMBIO DE TURNO
  // ==========================================
  {
    id: 't-ct-1',
    title: 'Verificar las APPS (Cárkula, PedidosYa, Rappi)',
    description: 'Control de aplicaciones de delivery.',
    category: 'Cambio de Turno',
    shift: 'tarde',
    order: 20,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ct-2',
    title: 'Verificar máquina de café (que esté abastecida: leche, café, chocolate y agua)',
    description: 'Revisión de cafetera.',
    category: 'Cambio de Turno',
    shift: 'tarde',
    order: 21,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ct-3',
    title: 'Limpieza de barras, mesas y sillas',
    description: 'Aseo de salón.',
    category: 'Cambio de Turno',
    shift: 'tarde',
    order: 22,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ct-4',
    title: 'Colocar los postres con etiquetas de nombre y fecha',
    description: 'Etiquetar postres expuestos.',
    category: 'Cambio de Turno',
    shift: 'tarde',
    order: 23,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ct-5',
    title: 'Corte y empaquetado de pan de molde/hamburguesas/ pullman/ tostadas/ roskitas',
    description: 'Empaquetado de productos.',
    category: 'Cambio de Turno',
    shift: 'tarde',
    order: 24,
    active: true,
    status: 'pendiente'
  },

  // ==========================================
  // TURNO TARDE - CIERRE
  // ==========================================
  {
    id: 't-ci-1',
    title: 'Abastecer neveras y estantes (jugos, gaseosas, leches, tostadas)',
    description: 'Llenar stock frío y seco para mañana.',
    category: 'Cierre',
    shift: 'tarde',
    order: 25,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-2',
    title: 'Revisión y reposición de descartables y bolsas',
    description: 'Reposición final de empaques.',
    category: 'Cierre',
    shift: 'tarde',
    order: 26,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-3',
    title: 'Limpieza de horno, tostadora, microondas, vitrina, caja y estantes',
    description: 'Aseo total de equipos de calor y vitrinas.',
    category: 'Cierre',
    shift: 'tarde',
    order: 27,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-4',
    title: 'Limpieza de pisos',
    description: 'Barrido y trapeado final del salón.',
    category: 'Cierre',
    shift: 'tarde',
    order: 28,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-5',
    title: 'Abastecer cafetera (café, agua, leche, chocolate)',
    description: 'Dejar lista máquina de café para la mañana.',
    category: 'Cierre',
    shift: 'tarde',
    order: 29,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-6',
    title: 'Colocar milhojas y pies en envase descartables y cubrir la crema volteada',
    description: 'Protección y envasado de repostería.',
    category: 'Cierre',
    shift: 'tarde',
    order: 30,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-7',
    title: 'Dejar vitrina de postres abastecida (empanadas, alfajores y roskitas)',
    description: 'Organizar vitrina.',
    category: 'Cierre',
    shift: 'tarde',
    order: 31,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-8',
    title: 'Revisión y reposición de servilletas, cucharas, sorbetes, sobres azúcar, etc',
    description: 'Insumos de atención.',
    category: 'Cierre',
    shift: 'tarde',
    order: 32,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-9',
    title: 'Lavar máquina de café',
    description: 'Limpieza y purgado de máquina expreso / cafetera.',
    category: 'Cierre',
    shift: 'tarde',
    order: 33,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-10',
    title: 'Realizar el conteo de pastelería',
    description: 'Inventario final de pastelería.',
    category: 'Cierre',
    shift: 'tarde',
    order: 34,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-11',
    title: 'Revisión de la temperatura de equipos y correcto funcionamiento',
    description: 'Control de frío en nocturno.',
    category: 'Cierre',
    shift: 'tarde',
    order: 35,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-12',
    title: 'Cuadrar caja, ingreso de venta a drive y cierre de sistema',
    description: 'Arqueo de caja final, informe a Drive y cierre.',
    category: 'Cierre',
    shift: 'tarde',
    order: 36,
    active: true,
    status: 'pendiente'
  },
  {
    id: 't-ci-13',
    title: 'Informar al siguiente turno de algún pedido pendiente y/o si falta algo por terminar',
    description: 'Novedades de cierre.',
    category: 'Cierre',
    shift: 'tarde',
    order: 37,
    active: true,
    status: 'pendiente'
  }
];
