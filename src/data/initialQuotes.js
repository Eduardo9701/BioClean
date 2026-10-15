/**
 * initialQuotes.js
 * Registros iniciales realistas para demostración y cálculo inmediato de KPIs en el panel administrativo.
 */

export const INITIAL_QUOTES = [
  {
    id: 'BCM-20261012-1082',
    createdAt: '2026-10-12T09:30:00Z',
    client: {
      fullName: 'Lic. Roberto Morales Serrano',
      company: 'Torre Corporativa Insurgentes Sur',
      email: 'roberto.morales@torreinsurgentes.com.mx',
      phone: '5541829304',
      preferredContact: 'whatsapp'
    },
    property: {
      type: 'corporativo',
      cityZone: 'Insurgentes Sur, CDMX',
      squareMeters: 1450,
      levels: '4 pisos y mezzanine',
      description: 'Oficinas corporativas de alta afluencia, 8 salas de juntas y 12 módulos sanitarios.',
      photoCount: 2
    },
    service: {
      categoryId: 'limpieza-recurrente-empresas',
      categoryTitle: 'Limpieza recurrente para empresas',
      modality: 'recurrente',
      modalityTitle: 'Contrato Recurrente',
      frequency: 'diaria',
      preferredSchedule: 'nocturno (19:00 - 02:00)',
      tentativeStartDate: '2026-11-01',
      evaluationVisit: true,
      supplies: 'incluidos',
      additionalComments: 'Requerimos 6 elementos fijos y 1 supervisor de planta.'
    },
    status: 'en_revision',
    assignedTo: 'Carlos Mendoza (Supervisor Comercial)',
    followUpDate: '2026-10-16',
    notes: [
      {
        id: 'n1',
        author: 'Sistema',
        date: '2026-10-12T09:30:00Z',
        text: 'Solicitud registrada mediante el cotizador web.'
      },
      {
        id: 'n2',
        author: 'Carlos Mendoza',
        date: '2026-10-12T14:15:00Z',
        text: 'Llamada inicial realizada. Se coordinó visita técnica para el 16 de octubre a las 11:00 am.'
      }
    ]
  },
  {
    id: 'BCM-20261013-2491',
    createdAt: '2026-10-13T11:15:00Z',
    client: {
      fullName: 'Arq. Mariana Fuentes',
      company: 'Desarrollos Urbanos del Valle',
      email: 'mfuentes@urbandelvalle.mx',
      phone: '5578129043',
      preferredContact: 'telefono'
    },
    property: {
      type: 'condominio',
      cityZone: 'Del Valle Centro, Benito Juárez, CDMX',
      squareMeters: 850,
      levels: 'Torre de 8 niveles, lobby y roof garden',
      description: 'Condominio residencial nuevo, entrega de áreas comunes y mantenimiento de escaleras.',
      photoCount: 1
    },
    service: {
      categoryId: 'limpieza-condominios-edificios',
      categoryTitle: 'Limpieza de condominios y edificios',
      modality: 'recurrente',
      modalityTitle: 'Contrato Recurrente',
      frequency: 'semanal',
      preferredSchedule: 'matutino (08:00 - 14:00)',
      tentativeStartDate: '2026-10-25',
      evaluationVisit: true,
      supplies: 'incluidos',
      additionalComments: 'Requerimos especial atención al pulido de vestíbulo y cristales templados.'
    },
    status: 'visita_pendiente',
    assignedTo: 'Valeria Ríos',
    followUpDate: '2026-10-17',
    notes: [
      {
        id: 'n3',
        author: 'Sistema',
        date: '2026-10-13T11:15:00Z',
        text: 'Solicitud registrada desde catálogo de condominios.'
      }
    ]
  },
  {
    id: 'BCM-20261014-3810',
    createdAt: '2026-10-14T16:40:00Z',
    client: {
      fullName: 'Dr. Alejandro Benítez',
      company: 'Clínica Dental OdontoSalud',
      email: 'contacto@odontosalud.mx',
      phone: '5533902145',
      preferredContact: 'whatsapp'
    },
    property: {
      type: 'consultorio',
      cityZone: 'Roma Norte, Cuauhtémoc, CDMX',
      squareMeters: 280,
      levels: '1 nivel con 5 cubículos y sala de espera',
      description: 'Pisos de mármol con pérdida de brillo en sala de espera y lavado de 14 sillones.',
      photoCount: 0
    },
    service: {
      categoryId: 'pulido-abrillantado-pisos',
      categoryTitle: 'Pulido, abrillantado y cuidado de pisos',
      modality: 'programado',
      modalityTitle: 'Mantenimiento Programado',
      frequency: 'trimestral',
      preferredSchedule: 'vespertino / fin de semana',
      tentativeStartDate: '2026-10-20',
      evaluationVisit: false,
      supplies: 'incluidos',
      additionalComments: 'Se requiere realizar el trabajo en domingo para no afectar consultas.'
    },
    status: 'cotizacion_preparacion',
    assignedTo: 'Carlos Mendoza (Supervisor Comercial)',
    followUpDate: '2026-10-15',
    notes: [
      {
        id: 'n4',
        author: 'Carlos Mendoza',
        date: '2026-10-14T17:00:00Z',
        text: 'Se enviaron muestras de acabado y se calculó metraje para abrillantado con pasta cristalizadora.'
      }
    ]
  },
  {
    id: 'BCM-20261014-4902',
    createdAt: '2026-10-14T18:20:00Z',
    client: {
      fullName: 'Sofía Garza Lozano',
      company: '',
      email: 'sofia.garza@gmail.com',
      phone: '5598712345',
      preferredContact: 'whatsapp'
    },
    property: {
      type: 'vivienda',
      cityZone: 'Polanco V Sección, Miguel Hidalgo, CDMX',
      squareMeters: 180,
      levels: 'Departamento dúplex',
      description: 'Lavado de 1 sala modular de lino de 5 plazas, 6 sillas de comedor y 2 colchones king size.',
      photoCount: 3
    },
    service: {
      categoryId: 'lavado-profesional-tapicerias',
      categoryTitle: 'Lavado profesional de tapicerías',
      modality: 'evento',
      modalityTitle: 'Servicio por Evento',
      frequency: 'por_evento',
      preferredSchedule: 'matutino (09:00 - 13:00)',
      tentativeStartDate: '2026-10-18',
      evaluationVisit: false,
      supplies: 'incluidos',
      additionalComments: 'Requiere técnica especial para lino natural y secado rápido.'
    },
    status: 'cotizacion_enviada',
    assignedTo: 'Valeria Ríos',
    followUpDate: '2026-10-16',
    notes: [
      {
        id: 'n5',
        author: 'Valeria Ríos',
        date: '2026-10-15T09:00:00Z',
        text: 'Propuesta enviada vía WhatsApp y correo con desglose de inyección-extracción y desinfección.'
      }
    ]
  },
  {
    id: 'BCM-20261015-5120',
    createdAt: '2026-10-15T08:05:00Z',
    client: {
      fullName: 'Ing. Fernando Castillo',
      company: 'Constructora e Inmobiliaria Atlas',
      email: 'fcastillo@atlasconstrucciones.com',
      phone: '5567891234',
      preferredContact: 'telefono'
    },
    property: {
      type: 'corporativo',
      cityZone: 'Santa Fe, Cuajimalpa, CDMX',
      squareMeters: 2200,
      levels: 'Planta baja corporativa y mezzanines',
      description: 'Terminación de remodelación integral. Mucho polvo fino de tablaroca, pintura y residuos en cristales.',
      photoCount: 4
    },
    service: {
      categoryId: 'limpiezas-especiales-adicionales',
      categoryTitle: 'Limpiezas especiales y servicios adicionales',
      modality: 'evento',
      modalityTitle: 'Servicio por Evento',
      frequency: 'por_evento',
      preferredSchedule: 'todo_el_dia',
      tentativeStartDate: '2026-10-22',
      evaluationVisit: true,
      supplies: 'incluidos',
      additionalComments: 'Se requiere aspirado HEPA de alta capacidad y cuadrilla de 8 personas durante 3 días.'
    },
    status: 'nueva',
    assignedTo: 'Sin asignar',
    followUpDate: '2026-10-15',
    notes: [
      {
        id: 'n6',
        author: 'Sistema',
        date: '2026-10-15T08:05:00Z',
        text: 'Nueva solicitud registrada hoy. Requiere atención prioritaria por fecha próxima.'
      }
    ]
  },
  {
    id: 'BCM-20261010-0943',
    createdAt: '2026-10-10T14:00:00Z',
    client: {
      fullName: 'Lic. Claudia Nava',
      company: 'Gimnasio & Wellness Center Vitalia',
      email: 'cnava@vitaliagym.mx',
      phone: '5512348765',
      preferredContact: 'whatsapp'
    },
    property: {
      type: 'local_comercial',
      cityZone: 'Coyoacán, CDMX',
      squareMeters: 620,
      levels: '2 niveles con área de pesas y vestidores',
      description: 'Limpieza diaria con énfasis en sanitización de regaderas, vapor y pisos vinílicos.',
      photoCount: 0
    },
    service: {
      categoryId: 'limpieza-recurrente-empresas',
      categoryTitle: 'Limpieza recurrente para empresas',
      modality: 'recurrente',
      modalityTitle: 'Contrato Recurrente',
      frequency: 'diaria',
      preferredSchedule: 'matutino y vespertino',
      tentativeStartDate: '2026-10-15',
      evaluationVisit: true,
      supplies: 'incluidos',
      additionalComments: 'Contrato anual cerrado satisfactoriamente.'
    },
    status: 'aceptada',
    assignedTo: 'Carlos Mendoza (Supervisor Comercial)',
    followUpDate: '2026-10-15',
    notes: [
      {
        id: 'n7',
        author: 'Carlos Mendoza',
        date: '2026-10-14T11:00:00Z',
        text: 'Contrato firmado. Arranque operativo confirmado para el 15 de octubre a las 06:00 am.'
      }
    ]
  }
];
