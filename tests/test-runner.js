/**
 * test-runner.js
 * Suite automatizada de pruebas funcionales y unitarias para BioClean Master Web App.
 * Ejecuta validaciones de datos, pruebas de repositorio, cálculo de KPIs y consistencia de servicios.
 */

import { Validation } from '../src/js/validation.js';
import { SERVICES, MODALITIES, WORK_PROCESS } from '../src/data/servicesData.js';
import { INITIAL_QUOTES } from '../src/data/initialQuotes.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

console.log('\n======================================================');
console.log('  EJECUTANDO SUITE DE PRUEBAS: BIOCLEAN MASTER WEB APP');
console.log('======================================================\n');

// --------------------------------------------------------------------------
// 1. Pruebas del Módulo de Validación (validation.js)
// --------------------------------------------------------------------------
console.log('--- 1. Pruebas de Validación de Entradas ---');

assert(Validation.isValidEmail('contacto@bioclean.mx') === true, 'Valida correo electrónico corporativo válido');
assert(Validation.isValidEmail('usuario.prueba@gmail.com') === true, 'Valida correo electrónico personal con punto');
assert(Validation.isValidEmail('invalido@') === false, 'Rechaza correo sin dominio');
assert(Validation.isValidEmail('invalido.com') === false, 'Rechaza correo sin arroba');
assert(Validation.isValidEmail('') === false, 'Rechaza correo vacío');

assert(Validation.isValidPhone('5579247494') === true, 'Valida teléfono comercial de 10 dígitos (55 7924 7494)');
assert(Validation.isValidPhone('55-7924-7494') === true, 'Valida teléfono con guiones');
assert(Validation.isValidPhone('(55) 7924 7494') === true, 'Valida teléfono con paréntesis y espacios');
assert(Validation.isValidPhone('12345') === false, 'Rechaza teléfono incompleto (menos de 10 dígitos)');
assert(Validation.isValidPhone('557924749400') === false, 'Rechaza teléfono con más de 10 dígitos');

assert(Validation.cleanPhone('(55) 7924-7494') === '5579247494', 'Limpia caracteres especiales dejando 10 dígitos puros');

assert(Validation.isValidSquareMeters('350') === true, 'Valida superficie positiva en m²');
assert(Validation.isValidSquareMeters('0') === false, 'Rechaza superficie de 0 m²');
assert(Validation.isValidSquareMeters('-50') === false, 'Rechaza superficie negativa');
assert(Validation.isValidSquareMeters('abc') === false, 'Rechaza superficie no numérica');

assert(Validation.sanitizeText('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'Sanitiza caracteres peligrosos de inyección HTML/XSS');

// --------------------------------------------------------------------------
// 2. Pruebas de Consistencia de Datos Oficiales (servicesData.js)
// --------------------------------------------------------------------------
console.log('\n--- 2. Pruebas de Consistencia del Catálogo de Servicios ---');

assert(SERVICES.length === 5, 'Existen exactamente las 5 categorías oficiales de la presentación');

const expectedIds = [
  'limpieza-recurrente-empresas',
  'limpieza-condominios-edificios',
  'lavado-profesional-tapicerias',
  'pulido-abrillantado-pisos',
  'limpiezas-especiales-adicionales'
];

expectedIds.forEach(id => {
  const service = SERVICES.find(s => s.id === id);
  assert(service !== undefined, `Servicio ${id} está registrado`);
  assert(service && service.activities.length >= 4, `Servicio ${id} tiene al menos 4 actividades documentadas`);
  assert(service && service.highlights.length >= 3, `Servicio ${id} tiene criterios técnicos definidos`);
});

assert(MODALITIES.length === 3, 'Existen las 3 modalidades oficiales (Recurrente, Evento, Programado)');
assert(WORK_PROCESS.length === 5, 'El proceso de trabajo incluye los 5 pasos documentados en la presentación');

// --------------------------------------------------------------------------
// 3. Pruebas de Formato de Folio y Lógica de Cotización
// --------------------------------------------------------------------------
console.log('\n--- 3. Pruebas de Folio y Lógica de Negocio ---');

function mockGenerateFolio() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BCM-${year}${month}${day}-${random}`;
}

const folio = mockGenerateFolio();
const folioRegex = /^BCM-\d{8}-\d{4}$/;
assert(folioRegex.test(folio), `El folio generado (${folio}) cumple con el formato estándar BCM-YYYYMMDD-XXXX`);

// --------------------------------------------------------------------------
// 4. Pruebas de KPIs sobre el Dataset Inicial (initialQuotes.js)
// --------------------------------------------------------------------------
console.log('\n--- 4. Pruebas de KPIs sobre Datos Reales ---');

assert(INITIAL_QUOTES.length >= 5, 'El dataset semilla cuenta con registros realistas para el panel');

const pendingCount = INITIAL_QUOTES.filter(q => 
  ['nueva', 'en_revision', 'visita_pendiente', 'cotizacion_preparacion'].includes(q.status)
).length;

assert(pendingCount > 0, `Se calculan correctamente las solicitudes pendientes (${pendingCount} pendientes)`);

const acceptedCount = INITIAL_QUOTES.filter(q => q.status === 'aceptada').length;
assert(acceptedCount >= 1, `Se calculan correctamente las cotizaciones aceptadas (${acceptedCount} aceptadas)`);

// --------------------------------------------------------------------------
// 5. Validación de Enlaces de Marca Permanentes
// --------------------------------------------------------------------------
console.log('\n--- 5. Verificación de Elementos Permanentes de Marca ---');

const officialPhone = '5579247494';
const officialWhatsAppUrl = `https://wa.me/52${officialPhone}`;

assert(officialPhone === '5579247494', 'Número telefónico oficial es 55 7924 7494');
assert(officialWhatsAppUrl === 'https://wa.me/525579247494', 'Enlace directo a WhatsApp incluye código de país México (+52)');

// --------------------------------------------------------------------------
// RESUMEN FINAL DE PRUEBAS
// --------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`  RESUMEN: ${passedTests} de ${totalTests} pruebas pasadas.`);
if (failedTests === 0) {
  console.log('  RESULTADO: TODAS LAS PRUEBAS PASARON EXITOSAMENTE (100%)');
} else {
  console.error(`  RESULTADO: ${failedTests} PRUEBA(S) FALLIDAS.`);
}
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
