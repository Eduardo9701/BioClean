# ESTIMACIÓN ECONÓMICA Y DE COSTOS DE DESARROLLO E INFRAESTRUCTURA
## PROYECTO: BIOCLEAN MASTER WEB APP

**Moneda:** Pesos Mexicanos (MXN).  
**Fecha de Emisión:** Octubre 2026.  
**Mercado Objetivo:** México (Corporativos, Oficinas, Condominios y Clientes Residenciales).  
**Teléfono Comercial Oficial:** 55 7924 7494.

---

### Resumen Ejecutivo de Escenarios

| Concepto | Escenario A: MVP Económico | Escenario B: Aplicación con Administración | Escenario C: Plataforma Empresarial |
|---|---|---|---|
| **Alcance Principal** | Landing comercial, catálogo de 5 servicios, cotizador interactivo con WhatsApp y almacenamiento local. | Todo lo de A + Base de datos en la nube (Supabase), autenticación segura, Dashboard administrativo y exportación CSV. | Todo lo de B + CRM comercial, generación de cotizaciones PDF automáticas, calendario de visitas, IA clasificadora y WhatsApp Business API. |
| **Honorarios de Desarrollo (Pago Único)** | **\$18,500 – \$24,000 MXN** | **\$32,000 – \$42,000 MXN** | **\$58,000 – \$78,000 MXN** |
| **Infraestructura Mensual (Recurrente)** | **\$0 – \$150 MXN** *(Nivel Gratuito Cloudflare/Vercel)* | **\$0 – \$550 MXN** *(Free Tier / Pro Supabase)* | **\$1,200 – \$2,800 MXN** *(Servicios Pro + API WhatsApp)* |
| **Dominio Propio Anual (.mx / .com.mx)** | **\$450 – \$750 MXN / año** | **\$450 – \$750 MXN / año** | **\$450 – \$750 MXN / año** |
| **Mantenimiento Mensual Opcional** | **\$1,800 MXN / mes** | **\$3,200 MXN / mes** | **\$5,500 MXN / mes** |

---

## 1. Desglose Detallado: Escenario A (MVP Económico)

Ideal para validar comercialmente la propuesta, comenzar a recibir prospectos calificados y enlazar solicitudes directamente al WhatsApp comercial (55 7924 7494) con costo operativo casi cero.

### Componentes Incluidos
- Sitio web comercial responsivo con identidad fiel a la presentación (`Aptos`, paleta `#072246`, `#55A724`, `#0C67B0`).
- Catálogo de los 5 servicios con filtros interactivos y modales de actividades oficiales.
- Sección de 3 modalidades de contratación (Recurrente, Evento, Programado) con preselección.
- Línea de tiempo de 5 pasos ("Cómo trabajamos") y caja de contenido de propuestas.
- Módulo cotizador de 4 pasos con validaciones en tiempo real y generación de folio único (`BCM-YYYYMMDD-XXXX`).
- Integración directa con WhatsApp (mensaje preformateado con datos completos de la solicitud).
- Persistencia en almacenamiento local del navegador (`LocalStorage`).

### Costos de Infraestructura y Servicios (Escenario A)
- **Desarrollo e Implementación:** \$18,500 – \$24,000 MXN (pago único por entrega y puesta a punto).
- **Hosting Frontend:** \$0 MXN / mes (Plan Free en Cloudflare Pages o Vercel: incluye ancho de banda ilimitado, CDN global y SSL HTTPS automático).
- **Base de Datos y Almacenamiento:** \$0 MXN (almacenamiento en cliente sin costos de servidor).
- **Dominio Web (`biocleanmaster.com.mx` o `bioclean.mx`):** \$450 – \$750 MXN anuales (proveedor sugerido: Neubox, Akky o Google Domains/Squarespace).
- **Mensajería:** \$0 MXN (aprovecha la aplicación WhatsApp estándar/business del teléfono comercial sin costo por mensaje).
- **Límites del Plan Gratuito:** Soporta hasta 100,000 visitas mensuales sin ningún cargo.

---

## 2. Desglose Detallado: Escenario B (Aplicación con Administración en la Nube)

La solución recomendada para operación formal. Permite al equipo comercial y operativo acceder desde cualquier dispositivo para gestionar el estatus de las cotizaciones, asignar responsables y registrar visitas técnicas.

### Componentes Incluidos
- Todo lo incluido en el Escenario A.
- Base de datos relacional PostgreSQL en la nube (vía Supabase / Firebase / Railway).
- Autenticación de administradores con roles y sesiones cifradas.
- Dashboard administrativo con KPIs en tiempo real (totales, pendientes, aceptadas, seguimiento semanal).
- Filtros avanzados de solicitudes por estado, categoría y rango de fechas.
- Bitácora de notas internas de seguimiento con autor y fecha/hora.
- Exportación formal de solicitudes a archivo CSV.
- Notificaciones automáticas por correo electrónico al recibir una nueva cotización (vía Resend o Brevo).

### Costos de Infraestructura y Servicios (Escenario B)
- **Desarrollo e Implementación:** \$32,000 – \$42,000 MXN (pago único).
- **Hosting Frontend:** \$0 MXN / mes (Cloudflare Pages / Vercel Hobby).
- **Base de Datos (Supabase Cloud):**
  - *Plan Free:* \$0 MXN / mes (incluye 500 MB de base de datos relacional, hasta 50,000 usuarios activos y 1 GB de almacenamiento de fotos de inmuebles; suficiente para los primeros 12–18 meses de operación).
  - *Plan Pro (si se requiere backup automatizado diario y mayor capacidad):* \$25 USD / mes (aprox. \$480 – \$530 MXN / mes).
- **Servicio de Correo Transaccional (Resend / Brevo):**
  - *Plan Free:* \$0 MXN / mes (hasta 3,000 correos al mes, suficiente para avisos de cotización).
- **Dominio Anual:** \$450 – \$750 MXN / año.
- **Mantenimiento Mensual (Soporte y actualizaciones de seguridad):** \$3,200 MXN / mes.

---

## 3. Desglose Detallado: Escenario C (Plataforma Empresarial y CRM)

Diseñado para escalar la operación de BioClean Master hacia un estándar SaaS empresarial con automatizaciones, generación de contratos y analítica avanzada.

### Componentes Incluidos
- Todo lo incluido en el Escenario B.
- Generador automático de propuestas técnicas y económicas en PDF con diseño membretado, listas de verificación y términos de servicio autorizados.
- Integración oficial con WhatsApp Business Platform (API oficial de Meta mediante proveedores como Wati o Twilio) para enviar confirmaciones automáticas con plantilla verificada.
- Calendario interactivo para programar y confirmar visitas de evaluación técnica presencial.
- Clasificador inteligente asistido por IA (Gemini API) para categorizar la complejidad del inmueble y sugerir cuadrilla estimada de personal.
- Reportes mensuales consolidados de prospección y tasa de conversión comercial.

### Costos de Infraestructura y Servicios (Escenario C)
- **Desarrollo e Implementación:** \$58,000 – \$78,000 MXN (desarrollo por fases modulares).
- **Hosting Frontend y Backend Serverless:** \$350 – \$600 MXN / mes (Vercel Pro o AWS Amplify).
- **Base de Datos y Almacenamiento en la Nube:** \$500 – \$800 MXN / mes (Supabase Pro con respaldos Point-in-Time).
- **WhatsApp Business API (Meta + BSP):**
  - Costo de plataforma BSP (ej. Wati / Twilio): \$800 – \$1,500 MXN / mes.
  - Costo por conversación iniciada por la empresa: aprox. \$0.60 – \$1.10 MXN por mensaje de plantilla comercial.
- **Generación de PDFs y Cloud Storage Seguro:** \$200 MXN / mes.
- **Dominio Anual:** \$450 – \$750 MXN / año.
- **Mantenimiento Mensual y Monitoreo 24/7:** \$5,500 MXN / mes.

---

## 4. Recomendación Estratégica de Inversión

Se sugiere a BioClean Master adoptar una **estrategia de adopción ágil por etapas**:

1. **Mes 1 a 3 (Lanzamiento con Escenario A / B Híbrido)**:
   - Desplegar el MVP construido con Vite en Cloudflare Pages o Netlify (costo de hosting: **\$0 MXN**).
   - Invertir únicamente en el dominio propio (`.com.mx`: **\$450 MXN/año**) y en la puesta en marcha.
   - Operar la captación mediante el cotizador con folio y canalización directa a WhatsApp al **55 7924 7494**.
2. **Mes 4 en adelante (Migración a Escenario B Cloud)**:
   - Conectar las credenciales de Supabase documentadas en `.env.example` en cuanto el volumen de cotizaciones supere las 30 semanales.
   - Presupuesto mensual estimado en esta etapa: **\$0 a \$500 MXN/mes**, manteniendo un retorno de inversión óptimo.
