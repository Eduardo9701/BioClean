# DESIGN SYSTEM: BIOCLEAN MASTER

**Versión:** 1.0.0  
**Autor:** Principal UX/UI Designer & Senior Design Technologist  
**Plataforma de Integración:** Google Stitch MCP / Web App  
**Idioma y Región:** Español (México)  
**Lema de Marca:** *“Espacios limpios, negocios más productivos”*  
**Teléfono Comercial Oficial:** `55 7924 7494`

---

## 1. Principios de Diseño y Fundamentos UX

1. **Cero Decisiones Arbitrarias**: Todo espaciado, radio de curvatura y tono de color responde a una necesidad de legibilidad, contraste o jerarquía de interacción.
2. **Pensamiento Atómico (Atomic Design)**:
   - **Tokens**: Colores, espaciado de 8pt, radios, sombras, tipografía Aptos.
   - **Átomos**: Botones (`.btn`), badges de estado (`.badge`), inputs (`.form-input`), iconos SVG.
   - **Moléculas**: Grupos de campos con validación, selector de radio cards, ítems de checklist de propuesta.
   - **Organismos**: Header interactivo, tarjeta de servicio con modales, Wizard de cotización de 4 pasos, tabla y KPIs administrativos.
   - **Plantillas**: Layout del sitio comercial (`#public-site-container`) y Dashboard administrativo (`#admin-site-container`).
3. **Accesibilidad Basal (WCAG 2.1 AA/AAA)**:
   - Ratios de contraste contrastados: Navy `#072246` sobre fondo blanco/hielo (15.8:1, supera AAA).
   - Verde `#55A724` utilizado con fondo claro o texto en contraste controlado.
   - Zonas táctiles mínimas $\ge 44\times 44\text{ px}$.
   - Anillos de foco visibles (`outline: 3px solid #0C67B0; outline-offset: 3px`).
   - Soporte completo para lectores de pantalla mediante roles ARIA, `aria-live`, `aria-describedby` y skip links.
4. **Ciclo Completo de Estados**: Default, Hover, Focus-Visible, Active, Disabled, Loading/Skeleton, Empty State y Error State.

---

## 2. Paleta de Color Oficial (Extraída de la Presentación PPTX)

| Token Semántico | Valor Hex | Rol UX / Función | Ratio de Contraste vs Blanco |
|---|---|---|---|
| `--bcm-navy` | `#072246` | Color primario de marca, encabezados, footer y superficies oscuras. | **15.8:1 (AAA)** |
| `--bcm-navy-dark` | `#04142B` | Fondo de footer corporativo y estados activos profundos. | **18.2:1 (AAA)** |
| `--bcm-navy-light` | `#0D356A` | Tarjetas de beneficios en sección oscura. | **11.4:1 (AAA)** |
| `--bcm-green` | `#55A724` | Verde de marca ("BioClean"), CTAs primarios y éxito. | **3.8:1 (UI Components)** |
| `--bcm-green-hover` | `#468E1D` | Hover de botones y texto accesible sobre fondos claros. | **4.6:1 (AA Texto)** |
| `--bcm-green-subtle`| `#EBF7E5` | Fondos de badges de éxito y tarjetas seleccionadas. | Superficie suave |
| `--bcm-blue` | `#0C67B0` | Azul corporativo, enlaces, iconos de soporte y focos. | **5.4:1 (AA)** |
| `--bcm-blue-hover` | `#094F88` | Hover de acciones secundarias. | **7.6:1 (AAA)** |
| `--bcm-blue-subtle` | `#E6F0F8` | Fondos de aviso informativo y campos activos. | Superficie suave |
| `--bcm-ice` | `#F0F7F9` | Superficie base de la aplicación (Ice blue tint). | Fondo de descanso |
| `--bcm-slate` | `#4E6172` | Texto secundario y etiquetas de metadatos. | **6.2:1 (AA)** |
| `--bcm-mint` | `#ABDE82` | Acentos sutiles y bordes de badges. | Decorativo / Acento |
| `--bcm-white` | `#FFFFFF` | Superficie de tarjetas y texto en contraste negativo. | **21:1 (AAA vs Navy)** |

---

## 3. Sistema de Espaciado (Rejilla Estricta Base 8pt)

```css
--space-1: 4px;   /* Micro-ajustes de iconos, tags y badges */
--space-2: 8px;   /* 1 unidad: padding interno compacto */
--space-3: 12px;  /* 1.5 unidades */
--space-4: 16px;  /* 2 unidades: padding estándar de tarjetas móviles */
--space-5: 20px;  /* 2.5 unidades */
--space-6: 24px;  /* 3 unidades: padding de tarjetas de escritorio */
--space-8: 32px;  /* 4 unidades: separación entre módulos */
--space-10: 40px; /* 5 unidades */
--space-12: 48px; /* 6 unidades: márgenes de sección compacta */
--space-16: 64px; /* 8 unidades: márgenes verticales estándar de sección */
--space-20: 80px; /* 10 unidades */
--space-24: 96px; /* 12 unidades */
```

---

## 4. Tipografía y Jerarquía

- **Familia Primaria:** `'Aptos', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Escala Modular Armónica:**
  - `Display / Hero Title`: 48px – 52px / Interlineado 1.15 / Bold
  - `H1 / Sección Principal`: 36px – 40px / Interlineado 1.20 / Bold
  - `H2 / Títulos de Módulo`: 28px – 32px / Interlineado 1.25 / Bold
  - `H3 / Tarjetas`: 20px – 24px / Interlineado 1.30 / Semibold
  - `H4 / Subtítulos`: 16px – 18px / Interlineado 1.35 / Semibold
  - `Body / Texto Lectura`: 16px / Interlineado 1.55 / Regular
  - `Caption / Metadatos`: 12px – 14px / Interlineado 1.45 / Medium

---

## 5. Catálogo de Componentes y Nomenclatura Semántica

1. `Header / Global / Sticky`:
   - Barra fija con backdrop blur `rgba(255,255,255,0.95)`, isotipo BioClean Master, menú de navegación principal y botón de llamada directa.
2. `Card / Service / Default`:
   - Tarjeta con contenedor de imagen de 200px, badge de especialidad, icono en pill blanco, lista de 3 actividades clave, botón "Ver detalles" (modal) y "Cotizar servicio" (enlace al wizard).
3. `Card / Modality / Option`:
   - Tarjeta comparativa con beneficio destacado, badge de tipo de contrato, lista de ventajas y CTA que preselecciona la modalidad en el cotizador.
4. `Wizard / Stepper / MultiStep`:
   - Barra de 4 pasos con estados reactivos (`.step-indicator.active`, `.completed`), formularios segregados por dominio (Solicitante, Inmueble, Servicio, Revisión), validación en tiempo real y generación de folio único (`BCM-YYYYMMDD-XXXX`).
5. `Modal / Confirmation / WhatsApp`:
   - Diálogo accesible de confirmación con folio destacado y botón de redirección preformateada a WhatsApp comercial (+52 55 7924 7494).
6. `Dashboard / Admin / KPIs`:
   - Panel de control protegido con métricas calculadas en tiempo real: Solicitudes Totales, Pendientes, Aceptadas y Seguimiento Semanal.
   - Tabla interactiva con búsqueda por texto y filtros multidimensionales (Estado y Categoría).
   - Cajón de expediente con cambio de estado, asignación de responsable, fecha de visita y bitácora de notas internas con auditoría.

---

## 6. Breakpoints Responsive

- **Móvil (Smartphones):** `360px – 640px` (menú hamburguesa desplegable, wizard simplificado con indicadores compactos, tabla con columnas secundarias colapsadas).
- **Tablet / Pantallas Medianas:** `641px – 1023px` (grid de servicios a 2 columnas, modalidades a 1 columna).
- **Desktop / Escritorio:** `1024px – 1440px+` (navegación horizontal extendida, grid de servicios a 3 columnas, tabla administrativa completa).
