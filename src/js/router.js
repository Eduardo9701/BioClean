/**
 * router.js
 * Enrutador SPA ligero basado en Hash para BioClean Master.
 * Soporta navegación fluida entre secciones comerciales y el Panel Administrativo.
 */

export const Router = {
  routes: {
    '': 'inicio',
    'inicio': 'inicio',
    'servicios': 'servicios',
    'modalidades': 'modalidades',
    'proceso': 'proceso',
    'nosotros': 'nosotros',
    'cotizador': 'cotizador',
    'contacto': 'contacto',
    'admin': 'admin'
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const rawHash = window.location.hash.replace('#', '') || 'inicio';
    const route = this.routes[rawHash] || 'inicio';

    const publicContainer = document.getElementById('public-site-container');
    const adminContainer = document.getElementById('admin-site-container');

    // Manejo de la vista de administración
    if (route === 'admin') {
      if (publicContainer) publicContainer.style.display = 'none';
      if (adminContainer) adminContainer.style.display = 'block';
      document.title = 'Panel Administrativo | BioClean Master';
      window.scrollTo(0, 0);
    } else {
      if (publicContainer) publicContainer.style.display = 'block';
      if (adminContainer) adminContainer.style.display = 'none';
      document.title = 'BioClean Master | Soluciones Integrales de Limpieza y Mantenimiento';

      // Scroll suave a la sección correspondiente
      if (route !== 'inicio') {
        const targetSection = document.getElementById(route);
        if (targetSection) {
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Actualiza clase active en enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${route}` || (route === 'inicio' && href === '#inicio')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Cerrar menú móvil si estuviera abierto
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.remove('is-open');
  }
};
