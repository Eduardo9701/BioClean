/**
 * servicesData.js
 * Fuente oficial de servicios de BioClean Master extraída de la presentación comercial.
 * Contiene las 5 categorías exactas, descripciones y actividades documentadas.
 */

export const SERVICES = [
  {
    id: 'limpieza-recurrente-empresas',
    title: 'Limpieza recurrente para empresas',
    shortTitle: 'Empresarial Recurrente',
    category: 'empresarial',
    badge: 'Alta Demanda Corporativa',
    description: 'Servicio continuo diseñado para mantener oficinas, corporativos, consultorios y establecimientos comerciales en condiciones óptimas de higiene, orden y productividad.',
    target: 'Oficinas, corporativos, consultorios y establecimientos comerciales',
    activities: [
      'Limpieza de estaciones de trabajo, salas de juntas y recepción.',
      'Limpieza de sanitarios, cocinetas y áreas de circulación.',
      'Barrido, aspirado, trapeado y retiro de residuos ordinarios.',
      'Frecuencias y horarios adaptados a la operación del cliente.',
      'Rutinas y listas de verificación definidas por inmueble.'
    ],
    highlights: [
      'Personal capacitado con uniforme e identificación',
      'Listas de verificación diarias y semanales',
      'Supervisión periódica de calidad',
      'Planes flexibles matutinos, vespertinos o nocturnos'
    ],
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    defaultModality: 'recurrente'
  },
  {
    id: 'limpieza-condominios-edificios',
    title: 'Limpieza de condominios y edificios',
    shortTitle: 'Condominios y Edificios',
    category: 'residencial',
    badge: 'Administración y Residencial',
    description: 'Soluciones integrales de mantenimiento para áreas comunes, accesos y amenidades en torres residenciales, edificios de departamentos y complejos corporativos.',
    target: 'Condominios, edificios de departamentos, áreas comunes y conjuntos residenciales',
    activities: [
      'Vestíbulos, pasillos, escaleras y elevadores.',
      'Áreas comunes, accesos, amenidades y estacionamientos.',
      'Limpieza de cristales accesibles y superficies de contacto.',
      'Programas diarios, semanales o periódicos.',
      'Atención coordinada con la administración del inmueble.'
    ],
    highlights: [
      'Bitácoras de servicio para comités y administradores',
      'Cuidado estricto de accesos y zonas de alta afluencia',
      'Coordinación con personal de vigilancia y mantenimiento',
      'Horarios programados para no interrumpir a residentes'
    ],
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path><path d="M14 9h1"></path><path d="M14 13h1"></path><path d="M14 17h1"></path></svg>`,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    defaultModality: 'recurrente'
  },
  {
    id: 'lavado-profesional-tapicerias',
    title: 'Lavado profesional de tapicerías',
    shortTitle: 'Lavado de Tapicerías',
    category: 'tecnico',
    badge: 'Cuidado Textil Especializado',
    description: 'Limpieza profunda e higienización mediante inyección-succión para muebles textiles, alfombras y colchones, eliminando ácaros, polvo y manchas.',
    target: 'Muebles de oficina, salas residenciales, sillería ejecutiva, colchones y alfombras',
    activities: [
      'Salas y sillones: Limpieza profunda de tapicerías, asientos, sillas y muebles textiles, previa evaluación del material y sus condiciones.',
      'Colchones y alfombras: Aspirado, extracción y tratamiento de manchas cuando el tejido lo permite.',
      'Evaluación del material y sus condiciones para aplicar el químico adecuado.',
      'Tiempos de secado sujetos a condiciones climáticas y ventilación del servicio.'
    ],
    highlights: [
      'Inyección y extracción profunda de suciedad',
      'Desinfección y neutralización de olores',
      'Productos formulados para proteger fibras y colores',
      'Diagnóstico previo del tejido antes de la intervención'
    ],
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"></path><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"></path><path d="M4 18v2"></path><path d="M20 18v2"></path></svg>`,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    defaultModality: 'programado'
  },
  {
    id: 'pulido-abrillantado-pisos',
    title: 'Pulido, abrillantado y cuidado de pisos',
    shortTitle: 'Pulido y Cuidado de Pisos',
    category: 'tecnico',
    badge: 'Tratamiento de Superficies Duras',
    description: 'Restauración, sellado y abrillantado mecánico de pisos duros para devolver su brillo natural, eliminar marcas de tránsito y proteger la superficie.',
    target: 'Mármol, granito, terrazo, loseta, concreto pulido y pisos duros compatibles',
    activities: [
      'Limpieza profunda y mantenimiento de superficies duras.',
      'Pulido y abrillantado según tipo de piso y diagnóstico técnico.',
      'Tratamientos para mármol, granito, terrazo y otras superficies compatibles.',
      'Uso de maquinaria industrial, discos abrasivos (pads) y productos específicos.',
      'Prueba previa y cotización según metraje y estado de conservación.'
    ],
    highlights: [
      'Maquinaria rotativa industrial de alta velocidad',
      'Pads diamantados y pastas decapantes certificadas',
      'Selladores acrílicos antideslizantes de alto tráfico',
      'Prueba previa en área controlada antes de ejecución'
    ],
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v18"></path><path d="M3 12h18"></path><circle cx="12" cy="12" r="4"></circle></svg>`,
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80',
    defaultModality: 'programado'
  },
  {
    id: 'limpiezas-especiales-adicionales',
    title: 'Limpiezas especiales y servicios adicionales',
    shortTitle: 'Limpiezas Especiales y Postobra',
    category: 'especial',
    badge: 'Intervención Técnica Puntual',
    description: 'Servicios de choque para situaciones exigentes: entrega de obra, mudanzas, locales desocupados y acondicionamiento profundo con retiro de polvo fino.',
    target: 'Inmuebles en remodelación, terminación de obra, locales comerciales y mudanzas',
    activities: [
      'Limpieza profunda y postobra: Retiro de polvo fino, restos de pintura y yeso.',
      'Limpieza detallada de superficies, zoclos y cristales accesibles.',
      'Acondicionamiento final del inmueble para entrega inmediata o habitabilidad.',
      'Limpieza de locales e inmuebles desocupados para traspaso o renta.',
      'Atención intensiva en áreas de alto tránsito y mantenimiento de alfombras/mobiliario.'
    ],
    highlights: [
      'Equipo de aspirado HEPA para retención de partículas finas',
      'Desincrustación segura de residuos de obra sin rayar superficies',
      'Evaluación técnica de riesgos y residuos previa a cotizar',
      'Disponibilidad para cronogramas críticos de apertura'
    ],
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    defaultModality: 'evento'
  }
];

export const MODALITIES = [
  {
    id: 'recurrente',
    title: 'Contrato Recurrente',
    badge: 'Operación Continua',
    description: 'Servicio diario o en días definidos, con alcance, horarios, dotación y supervisión acordados.',
    benefits: [
      'Personal fijo asignado a tu inmueble',
      'Cobertura de ausencias e incidencias',
      'Suministro y control de insumos y consumibles opcional',
      'Facturación mensual consolidada',
      'Supervisión presencial programada'
    ],
    idealFor: 'Oficinas corporativas, condominios residenciales, clínicas y plazas comerciales.'
  },
  {
    id: 'evento',
    title: 'Servicio por Evento',
    badge: 'Puntual / Emergencia',
    description: 'Intervención puntual para limpieza profunda, postobra o acondicionamiento.',
    benefits: [
      'Cuadrilla técnica especializada',
      'Maquinaria y equipo de trabajo pesado incluido',
      'Sin compromisos ni plazos forzosos a largo plazo',
      'Atención para mudanzas, entregas o aperturas'
    ],
    idealFor: 'Fin de obra o remodelación, pre-entrega de inmuebles y eventos corporativos.'
  },
  {
    id: 'programado',
    title: 'Mantenimiento Programado',
    badge: 'Preventivo Calendarizado',
    description: 'Calendario mensual o trimestral de pisos, tapicería y servicios especializados.',
    benefits: [
      'Prolonga la vida útil de pisos y mobiliario textil',
      'Presupuesto anual predecible sin sorpresas',
      'Descuentos por paquete de servicios técnicos',
      'Recordatorios y agendamiento proactivo'
    ],
    idealFor: 'Hoteles boutique, salas de juntas, corporativos con alfombras y áreas de alto tráfico.'
  }
];

export const WORK_PROCESS = [
  {
    step: 1,
    title: 'Escuchamos la necesidad',
    description: 'Recopilamos información detallada del inmueble, características del espacio y objetivos de limpieza.'
  },
  {
    step: 2,
    title: 'Visita de evaluación',
    description: 'Realizamos una inspección técnica presencial cuando se requiere para dimensionar metraje, materiales y riesgos.'
  },
  {
    step: 3,
    title: 'Definición de alcance',
    description: 'Determinamos con precisión frecuencia, insumos, maquinaria, número de elementos y rutinas operativas.'
  },
  {
    step: 4,
    title: 'Propuesta técnica y económica',
    description: 'Entregamos una cotización transparente y personalizada con alcance, precios y condiciones sin letras chiquitas.'
  },
  {
    step: 5,
    title: 'Acuerdo e inicio',
    description: 'Validamos condiciones, indicadores de calidad verificables y fijamos la fecha de arranque del servicio.'
  }
];

export const PROPOSAL_INCLUDES = [
  'Áreas y actividades detalladas del servicio.',
  'Frecuencia, horarios, número de elementos y esquema de supervisión.',
  'Insumos, maquinaria y materiales: incluidos o por separado.',
  'Protocolos de seguridad y tratamiento de superficies delicadas.',
  'Precio transparente, impuestos aplicables, vigencia y condiciones de pago.'
];
