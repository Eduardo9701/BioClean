import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

const TARGET_URL = 'https://bio-clean-master.vercel.app/';
const LOGO_PATH = path.resolve('public/assets/bioclean_logo.png');
const QR_PNG_PATH = path.resolve('public/assets/qr_bioclean_master.png');
const OUTPUT_PDF_PATH = path.resolve('BioClean_Master_Codigo_QR.pdf');
const PUBLIC_PDF_PATH = path.resolve('public/assets/BioClean_Master_Codigo_QR.pdf');

async function generate() {
  console.log('Generando código QR de alta resolución...');

  // 1. Generar imagen PNG del código QR (1024x1024px con alta corrección de errores 'H')
  await QRCode.toFile(QR_PNG_PATH, TARGET_URL, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 2,
    width: 800,
    color: {
      dark: '#072246', // Deep Navy oficial de BioClean Master
      light: '#FFFFFF'
    }
  });

  console.log(`Código QR guardado en: ${QR_PNG_PATH}`);

  // 2. Crear documento PDF tamaño Carta (Letter: 612 x 792 pt)
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 36, bottom: 36, left: 36, right: 36 },
    info: {
      Title: 'Código QR Oficial - BioClean Master',
      Author: 'BioClean Master',
      Subject: 'QR para cotizaciones y catálogo en línea',
      Keywords: 'BioClean Master, QR, Limpieza, Cotizaciones'
    }
  });

  const pdfStream = fs.createWriteStream(OUTPUT_PDF_PATH);
  doc.pipe(pdfStream);

  // Copia también a la carpeta public para acceso web si se desea
  const publicStream = fs.createWriteStream(PUBLIC_PDF_PATH);
  doc.pipe(publicStream);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // Fondo superior decorativo / encabezado
  doc.rect(0, 0, pageWidth, 12).fill('#55A724'); // Franja Verde BioClean superior
  doc.rect(0, 12, pageWidth, 110).fill('#072246'); // Franja Deep Navy

  // Logotipo en encabezado
  if (fs.existsSync(LOGO_PATH)) {
    try {
      doc.image(LOGO_PATH, 48, 24, { width: 140 });
    } catch (e) {
      console.warn('No se pudo incrustar el logo, se usará texto alternativo:', e);
    }
  }

  // Textos del encabezado
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(16)
     .text('SOLUCIONES INTEGRALES DE LIMPIEZA', 210, 36, { align: 'right', width: pageWidth - 258 });

  doc.fillColor('#ABDE82')
     .font('Helvetica-Oblique')
     .fontSize(12)
     .text('“Espacios limpios, negocios más productivos”', 210, 58, { align: 'right', width: pageWidth - 258 });

  doc.fillColor('#F0F7F9')
     .font('Helvetica')
     .fontSize(10)
     .text('Cotizaciones y Visitas de Evaluación: 55 7924 7494', 210, 78, { align: 'right', width: pageWidth - 258 });

  // Contenedor / Tarjeta Central
  const cardX = 48;
  const cardY = 145;
  const cardWidth = pageWidth - 96;
  const cardHeight = 490;

  // Sombra suave y fondo de la tarjeta
  doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 16)
     .lineWidth(1.5)
     .strokeColor('#D8E5EC')
     .fillColor('#FFFFFF')
     .fillAndStroke();

  // Título de la tarjeta
  doc.fillColor('#072246')
     .font('Helvetica-Bold')
     .fontSize(22)
     .text('¡Cotiza tu Servicio en Línea!', cardX, cardY + 28, { align: 'center', width: cardWidth });

  doc.fillColor('#4E6172')
     .font('Helvetica')
     .fontSize(12)
     .text('Escanea el código QR con tu celular para conocer nuestros servicios y recibir una propuesta personalizada al instante.', cardX + 30, cardY + 58, {
       align: 'center',
       width: cardWidth - 60,
       lineGap: 3
     });

  // Código QR Central
  const qrSize = 250;
  const qrX = cardX + (cardWidth - qrSize) / 2;
  const qrY = cardY + 110;

  // Borde decorativo alrededor del QR
  doc.roundedRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12)
     .lineWidth(2)
     .strokeColor('#55A724')
     .fillColor('#F0F7F9')
     .fillAndStroke();

  doc.image(QR_PNG_PATH, qrX, qrY, { width: qrSize, height: qrSize });

  // Píldora de URL debajo del QR
  const pillY = qrY + qrSize + 22;
  doc.roundedRect(cardX + 40, pillY, cardWidth - 80, 36, 18)
     .fillColor('#072246')
     .fill();

  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(12)
     .text(TARGET_URL, cardX + 40, pillY + 11, { align: 'center', width: cardWidth - 80 });

  // 3 Pasos rápidos debajo de la URL
  const stepsY = pillY + 48;
  doc.fillColor('#55A724')
     .font('Helvetica-Bold')
     .fontSize(10)
     .text('1. Abre la cámara de tu celular    •    2. Apunta al código QR    •    3. Recibe tu folio y cotización', cardX, stepsY, {
       align: 'center',
       width: cardWidth
     });

  // Franja Inferior / Footer Informativo
  const footerY = pageHeight - 105;
  doc.rect(0, footerY, pageWidth, 105).fill('#F0F7F9');
  doc.rect(0, footerY, pageWidth, 3).fill('#0C67B0'); // Línea divisoria azul

  doc.fillColor('#072246')
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('BioClean Master · Soluciones Integrales de Limpieza y Mantenimiento', 48, footerY + 18, { align: 'center', width: pageWidth - 96 });

  doc.fillColor('#4E6172')
     .font('Helvetica')
     .fontSize(9.5)
     .text('Limpieza Recurrente de Oficinas  •  Condominios y Edificios  •  Lavado de Tapicerías  •  Pulido de Pisos  •  Postobra', 48, footerY + 36, { align: 'center', width: pageWidth - 96 });

  doc.fillColor('#0C67B0')
     .font('Helvetica-Bold')
     .fontSize(10.5)
     .text('WhatsApp & Teléfono Comercial: 55 7924 7494  |  Sitio Web: bio-clean-master.vercel.app', 48, footerY + 58, { align: 'center', width: pageWidth - 96 });

  // Finalizar documento
  doc.end();

  await new Promise((resolve) => {
    publicStream.on('finish', resolve);
  });

  console.log(`Documento PDF generado exitosamente en:\n- ${OUTPUT_PDF_PATH}\n- ${PUBLIC_PDF_PATH}`);
}

generate().catch(err => {
  console.error('Error al generar código QR y PDF:', err);
  process.exit(1);
});
