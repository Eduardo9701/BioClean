/**
 * contact.js
 * Módulo de contacto y enlaces directos a llamadas y WhatsApp para BioClean Master.
 * Número oficial: 55 7924 7494 (+52 55 7924 7494).
 */

export const ContactModule = {
  PHONE_NUMBER: '5579247494',
  PHONE_FORMATTED: '55 7924 7494',
  WHATSAPP_LINK: 'https://wa.me/525579247494',

  init() {
    this.setupWhatsAppButtons();
  },

  setupWhatsAppButtons() {
    document.querySelectorAll('.js-whatsapp-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const customMessage = btn.dataset.message || 
          'Hola BioClean Master, me interesa solicitar información sobre sus servicios de limpieza y mantenimiento integral.';
        const url = `${this.WHATSAPP_LINK}?text=${encodeURIComponent(customMessage)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    });
  }
};
