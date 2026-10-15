# BioClean Master — Plataforma Web Profesional

Aplicación web de nivel de producción para **BioClean Master**, empresa de soluciones integrales de limpieza y mantenimiento de inmuebles en México. Desarrollada a partir del análisis riguroso de la presentación comercial oficial (`BioClean_Master_Presentacion_Comercial.pptx`).

**Lema de Marca:** *“Espacios limpios, negocios más productivos”*  
**Teléfono y WhatsApp Comercial:** `55 7924 7494` (+52 55 7924 7494)  
**Llamada a la Acción:** *“Solicita una visita de evaluación o una cotización personalizada”*  
**Mercado Objetivo:** Oficinas, corporativos, consultorios médicos, condominios, edificios y clientes residenciales.

---

## 1. Arquitectura y Tecnologías

El proyecto está diseñado bajo principios de máxima ligereza, mantenibilidad, cero dependencias innecesarias y arquitectura modular:

- **Frontend Core:** HTML5 semántico accesible, CSS3 modular estructurado por capas y JavaScript moderno (ES6+ Modules).
- **Herramienta de Compilación y Servidor:** [Vite](https://vitejs.dev/) v6 para recarga rápida en caliente (HMR), empaquetado optimizado y compilación ultrarrápida (185 ms).
- **Sistema de Diseño (Design System):** Basado en Atomic Design y tokens extraídos de la presentación comercial en PowerPoint:
  - Paleta: Deep Navy (`#072246`), Eco Green (`#55A724`), Corporate Blue (`#0C67B0`), Ice Tint (`#F0F7F9`), Muted Slate (`#4E6172`), Mint Accent (`#ABDE82`).
  - Tipografía: Aptos / Sans corporativo contemporáneo con escala modular armónica.
  - Rejilla: Matriz estricta de base 8pt (subdivisiones de 4pt reservadas para micro-alineación).
- **Accesibilidad Universal:** Cumplimiento de **WCAG 2.1 AA/AAA**:
  - Contraste superior a 15:1 en textos principales.
  - Objetivos táctiles mínimos $\ge 44\times 44\text{ px}$.
  - Anillos de foco visibles universales (`:focus-visible`).
  - Compatibilidad total con navegación por teclado y lectores de pantalla.
- **Persistencia Desacoplada (Repository Pattern):**
  - Módulo `storage.js` con soporte para almacenamiento local (`LocalStorage`), sembrado de datos iniciales y firmas asíncronas preparadas para integración directa con Supabase o REST API.
- **Enrutamiento SPA:** Módulo `router.js` basado en Hash para navegación fluida entre secciones y aislamiento seguro del portal administrativo.

---

## 2. Estructura del Código

```text
Bioclean/
├── index.html                   # Documento semántico principal, SEO, meta tags y JSON-LD
├── package.json                 # Configuración de scripts y dependencias
├── vite.config.js               # Configuración de compilación y servidor Vite
├── DESIGN.md                    # Especificación formal del sistema de diseño para Stitch MCP
├── .env.example                 # Plantilla de variables de entorno seguras
├── README.md                    # Documentación exhaustiva del proyecto
├── docs/
│   └── cost-estimate.md         # Estimación económica en MXN para Escenarios A, B y C
├── public/
│   ├── favicon.svg              # Isotipo vectorial de gota y hoja
│   └── assets/
│       └── bioclean_logo.png    # Logotipo oficial extraído del archivo PPTX
├── src/
│   ├── css/
│   │   ├── variables.css        # Tokens semánticos, paleta de colores y espaciado de 8pt
│   │   ├── global.css           # Reseteo moderno, accesibilidad y tipografía base
│   │   ├── layout.css           # Header sticky, containers, grids y secciones
│   │   ├── components.css       # Botones, tarjetas, stepper, modales y panel admin
│   │   └── responsive.css       # Breakpoints móviles (360-390px), tablets y desktop
│   ├── data/
│   │   ├── servicesData.js      # Catálogo oficial de las 5 categorías y modalidades
│   │   └── initialQuotes.js     # Datos semilla realistas para cálculo de KPIs
│   └── js/
│       ├── main.js              # Inicializador y bootstrapping de la aplicación
│       ├── router.js            # Enrutador SPA ligero basado en Hash
│       ├── services.js          # Renderizado de catálogo, filtros y modales de detalle
│       ├── quotes.js            # Wizard de cotizaciones, validaciones, folio y WhatsApp
│       ├── admin.js             # Autenticación, KPIs en tiempo real, búsqueda y exportación CSV
│       ├── validation.js        # Validaciones de correo, teléfonos de México y áreas
│       ├── contact.js           # Manejador de llamadas y enlaces a WhatsApp
│       └── storage.js           # Capa de repositorio, persistencia y autenticación
└── tests/
    └── test-runner.js           # Suite de 40 pruebas unitarias y funcionales automatizadas
```

---

## 3. Módulos y Funcionalidades Principales

### A. Catálogo Completo de Servicios (5 Categorías Oficiales)
1. **Limpieza recurrente para empresas:** Estaciones de trabajo, salas de juntas, sanitarios, horarios adaptados y listas de verificación.
2. **Limpieza de condominios y edificios:** Vestíbulos, pasillos, escaleras, áreas comunes, cristales y coordinación con administración.
3. **Lavado profesional de tapicerías:** Salas, sillas, colchones y alfombras con inyección-succión y diagnóstico de tejidos.
4. **Pulido, abrillantado y cuidado de pisos:** Mármol, granito y terrazo con maquinaria rotativa industrial y prueba previa.
5. **Limpiezas especiales y servicios adicionales:** Limpieza profunda, retiro de polvo fino postobra, locales comerciales y acondicionamiento.

### B. Modalidades de Contratación
- **Contrato recurrente:** Servicio diario o en días definidos con dotación de personal y supervisión.
- **Servicio por evento:** Intervención puntual para terminación de obra o mudanzas.
- **Mantenimiento programado:** Calendario mensual o trimestral para pisos y tapicería.
- *Cada modalidad cuenta con un botón interactivo que preselecciona el campo en el cotizador.*

### C. Proceso Comercial ("Cómo trabajamos")
1. Escuchamos la necesidad y recopilamos datos del inmueble.
2. Realizamos una visita de evaluación técnica cuando se requiere.
3. Definimos alcance, frecuencia, insumos y equipo.
4. Entregamos una propuesta técnica y económica formal.
5. Acordamos condiciones, indicadores de calidad y fecha de inicio.
- *Checklist integrado con los 5 puntos obligatorios de cada propuesta.*

### D. Módulo de Solicitud de Cotizaciones (Wizard en 4 Pasos)
- **Paso 1: Datos del solicitante:** Validación de nombre, empresa opcional, correo electrónico corporativo o personal, teléfono celular de 10 dígitos y medio preferido de contacto.
- **Paso 2: Información del inmueble:** Tipo de inmueble, zona geográfica, superficie aproximada en $m^2$, niveles y descripción de necesidades con simulador de adjuntos/fotografías.
- **Paso 3: Especificaciones del servicio:** Categoría de servicio, modalidad, frecuencia, horario preferido, fecha tentativa, insumos/maquinaria y solicitud de visita técnica.
- **Paso 4: Revisión previa:** Tabla de verificación antes de registrar.
- **Folio y Conexión WhatsApp:**
  - Generación de folio único verificable: `BCM-YYYYMMDD-XXXX`.
  - Persistencia inmediata en la base de datos.
  - Puente directo a WhatsApp mediante enlace preformateado a `55 7924 7494` con todos los detalles de la solicitud.

### E. Panel Administrativo Protegido (`#admin`)
- Control de sesión de acceso administrativo.
- **Credenciales por defecto:**
  - **Usuario:** `admin@bioclean.mx` (o `admin`)
  - **Contraseña:** `bioclean2026`
- **Dashboard con KPIs calculados en tiempo real:**
  - Solicitudes totales recibidas.
  - Solicitudes pendientes de atención.
  - Cuentas aceptadas.
  - Solicitudes con seguimiento esta semana.
- **Búsqueda y Filtros:** Búsqueda en vivo por folio, nombre, empresa o teléfono, y filtrado por estado y servicio.
- **Expediente Detallado:** Cambio de estatus en vivo, asignación de responsable comercial, fecha de seguimiento y bitácora de notas internas de auditoría.
- **Exportación:** Descarga de expedientes completos en formato `.csv` compatible con Excel.

---

## 4. Instrucciones de Instalación y Ejecución Local

### Prerrequisitos
- Node.js (v18 o superior).
- Gestor de paquetes npm.

### Comandos de Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   La aplicación se iniciará en `http://localhost:3000`.

3. **Ejecutar suite de pruebas unitarias y de validación:**
   ```bash
   npm test
   ```
   *Ejecuta 40 pruebas automatizadas que verifican regex de correo, validación telefónica MX, consistencia del catálogo, generación de folios y persistencia.*

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Genera el bundle ultra-optimizado en la carpeta `dist/`.

5. **Previsualizar la compilación de producción:**
   ```bash
   npm run preview
   ```

---

## 5. Guía de Despliegue en la Nube

### Opción A: Despliegue en Cloudflare Pages (Recomendado por Economía y Velocidad)
1. Conecta el repositorio de GitHub en el panel de Cloudflare Pages.
2. Parámetros de compilación:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
3. Agrega las variables de entorno de `.env.example` si se conecta a backend.
4. Vincula tu dominio propio (`biocleanmaster.com.mx`) en la pestaña de Custom Domains. SSL y CDN son automáticos y gratuitos.

### Opción B: Despliegue en Vercel
1. Instala Vercel CLI o conecta mediante el Dashboard de Vercel.
2. Comando de importación: `vercel`
3. Vercel detectará automáticamente Vite y la carpeta `dist/`.

### Opción C: Despliegue en Netlify
1. Conecta el repositorio en Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 6. Lista de Funcionalidades y Estado del Proyecto

### Funcionalidades Terminadas (Entregadas en Versión 1.0)
- [x] Identidad de marca, logotipo oficial PPTX y paleta semántica Aptos / Navy / Green / Blue.
- [x] Catálogo completo con las 5 categorías oficiales y modales de actividades.
- [x] Las 3 modalidades de contratación con preselección en cotizador.
- [x] Proceso comercial de 5 pasos con checklist de contenido de propuestas.
- [x] Módulo cotizador de 4 pasos con validación estricta y prevención de pérdida de datos.
- [x] Generación de folios únicos estándar `BCM-YYYYMMDD-XXXX`.
- [x] Conexión inteligente a WhatsApp comercial (55 7924 7494).
- [x] Panel administrativo con login protegido y sesión segura.
- [x] Dashboard con KPIs calculados a partir de datos reales almacenados.
- [x] Búsqueda en tiempo real y filtros multidimensionales de solicitudes.
- [x] Bitácora de notas internas y cambio de estado con auditoría.
- [x] Exportación formal a archivo CSV.
- [x] Suite de 40 pruebas automatizadas superadas al 100%.
- [x] Documentación técnica, estimación de costos en MXN y especificación para Google Stitch MCP.

### Funcionalidades Recomendadas para Siguientes Versiones (Fase 2)
- [ ] Conexión de `storage.js` con base de datos en tiempo real PostgreSQL en Supabase.
- [ ] Envío automático de correo transaccional de confirmación al cliente vía Resend.
- [ ] Generación automática de propuestas en formato PDF membretado listas para firma.
- [ ] Calendario interactivo sincronizado con Google Calendar para agendar visitas técnicas.
- [ ] Integración con la API oficial de WhatsApp Business (Meta Cloud API).
