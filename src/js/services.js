/**
 * services.js
 * Renderizado dinámico del catálogo de servicios, filtros por categoría y modales de detalle.
 */

import { SERVICES } from '../data/servicesData.js';

export const ServicesModule = {
  currentFilter: 'todos',

  init() {
    this.renderServicesGrid();
    this.setupCategoryFilters();
    this.setupDetailModal();
  },

  /**
   * Renderiza las tarjetas de servicios según el filtro activo
   */
  renderServicesGrid() {
    const container = document.getElementById('services-grid-container');
    if (!container) return;

    const filtered = this.currentFilter === 'todos' 
      ? SERVICES 
      : SERVICES.filter(s => s.category === this.currentFilter);

    container.innerHTML = filtered.map(service => `
      <article class="service-card" data-service-id="${service.id}">
        <div class="service-card-media">
          <img src="${service.image}" alt="${service.title}" class="service-card-img" loading="lazy">
          <span class="badge badge-green service-card-badge">${service.badge}</span>
          <div class="service-card-icon-pill" aria-hidden="true">
            ${service.icon}
          </div>
        </div>

        <div class="service-card-body">
          <h3 class="service-card-title">${service.title}</h3>
          <p class="service-card-desc">${service.description}</p>
          
          <ul class="service-activities-list">
            ${service.activities.slice(0, 3).map(act => `
              <li class="service-activity-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${act}</span>
              </li>
            `).join('')}
          </ul>

          <div class="service-card-footer">
            <button type="button" class="btn btn-outline btn-sm js-view-service-detail" data-service-id="${service.id}">
              Ver detalles
            </button>
            <button type="button" class="btn btn-primary btn-sm js-quote-this-service" data-service-id="${service.id}" data-modality="${service.defaultModality}">
              Cotizar servicio
            </button>
          </div>
        </div>
      </article>
    `).join('');
  },

  /**
   * Filtros de pestañas (Todos, Empresarial, Residencial, Técnicos y Especiales)
   */
  setupCategoryFilters() {
    const tabs = document.querySelectorAll('.service-filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        this.currentFilter = tab.dataset.filter || 'todos';
        this.renderServicesGrid();
      });
    });
  },

  /**
   * Configura el modal de detalle completo del servicio
   */
  setupDetailModal() {
    document.addEventListener('click', (e) => {
      const detailBtn = e.target.closest('.js-view-service-detail');
      if (detailBtn) {
        const serviceId = detailBtn.dataset.serviceId;
        const service = SERVICES.find(s => s.id === serviceId);
        if (service) this.openDetailModal(service);
      }

      const quoteBtn = e.target.closest('.js-quote-this-service');
      if (quoteBtn) {
        const serviceId = quoteBtn.dataset.serviceId;
        const modality = quoteBtn.dataset.modality;
        this.redirectToQuoter(serviceId, modality);
      }
    });

    const closeBtn = document.getElementById('close-service-modal-btn');
    const modalOverlay = document.getElementById('service-detail-modal');
    if (closeBtn && modalOverlay) {
      closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
      });
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          modalOverlay.classList.remove('active');
        }
      });
    }
  },

  /**
   * Abre el modal con todas las actividades oficiales de la presentación
   */
  openDetailModal(service) {
    const modal = document.getElementById('service-detail-modal');
    const titleEl = document.getElementById('service-modal-title');
    const badgeEl = document.getElementById('service-modal-badge');
    const targetEl = document.getElementById('service-modal-target');
    const activitiesEl = document.getElementById('service-modal-activities');
    const highlightsEl = document.getElementById('service-modal-highlights');
    const ctaBtn = document.getElementById('service-modal-cta-btn');

    if (!modal) return;

    if (titleEl) titleEl.textContent = service.title;
    if (badgeEl) badgeEl.textContent = service.badge;
    if (targetEl) targetEl.textContent = service.target;

    if (activitiesEl) {
      activitiesEl.innerHTML = service.activities.map(act => `
        <li style="display: flex; gap: 8px; margin-bottom: 8px; font-size: 0.875rem;">
          <svg style="color: var(--bcm-green); flex-shrink: 0; margin-top: 3px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${act}</span>
        </li>
      `).join('');
    }

    if (highlightsEl) {
      highlightsEl.innerHTML = service.highlights.map(hl => `
        <li style="display: flex; gap: 8px; margin-bottom: 6px; font-size: 0.8125rem; color: var(--bcm-slate);">
          <svg style="color: var(--bcm-blue); flex-shrink: 0; margin-top: 2px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>${hl}</span>
        </li>
      `).join('');
    }

    if (ctaBtn) {
      ctaBtn.onclick = () => {
        modal.classList.remove('active');
        this.redirectToQuoter(service.id, service.defaultModality);
      };
    }

    modal.classList.add('active');
  },

  /**
   * Preselecciona el servicio y salta al cotizador
   */
  redirectToQuoter(serviceId, modality) {
    const wizardEl = document.getElementById('cotizador');
    if (wizardEl) {
      wizardEl.scrollIntoView({ behavior: 'smooth' });
    }

    // Dispara evento para que quotes.js preseleccione los campos
    window.dispatchEvent(new CustomEvent('bcm:preselect-quote', {
      detail: { serviceId, modality }
    }));
  }
};
