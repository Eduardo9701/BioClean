/**
 * main.js
 * Punto de entrada principal de la aplicación web BioClean Master.
 * Inicializa router, servicios, cotizador, panel administrativo y utilidades de interfaz.
 */

import { Router } from './router.js';
import { ServicesModule } from './services.js';
import { QuotesModule } from './quotes.js';
import { AdminModule } from './admin.js';
import { ContactModule } from './contact.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de submódulos
  ServicesModule.init();
  QuotesModule.init();
  AdminModule.init();
  ContactModule.init();
  Router.init();

  // Control del header al hacer scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Menú móvil accesible
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar al hacer click fuera del menú
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        navMenu.classList.remove('is-open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Preselección de modalidad de contratación desde las tarjetas de la sección "Modalidades"
  document.querySelectorAll('.js-select-modality-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modality = btn.dataset.modality;
      const wizardEl = document.getElementById('cotizador');
      if (wizardEl) {
        wizardEl.scrollIntoView({ behavior: 'smooth' });
      }
      window.dispatchEvent(new CustomEvent('bcm:preselect-quote', {
        detail: { modality }
      }));
    });
  });

  console.info('BioClean Master Web App inicializada correctamente.');
});
