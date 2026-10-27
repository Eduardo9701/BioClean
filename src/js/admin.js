/**
 * admin.js
 * Módulo del Panel Administrativo de BioClean Master:
 * Control de acceso por sesión, cálculo de KPIs en tiempo real, búsqueda,
 * filtrado multidimensional, gestión de estados, notas internas,
 * cambio de contraseña de administrador y sincronización con Supabase.
 */

import { quotesRepo, AuthManager, getSupabaseConnectionStatus } from './storage.js';
import { SERVICES, MODALITIES } from '../data/servicesData.js';

export const AdminModule = {
  currentFilterStatus: 'todos',
  currentFilterService: 'todos',
  searchQuery: '',
  activeQuote: null,

  async init() {
    this.bindEvents();
    await this.checkSessionAndRender();

    // Actualización reactiva cuando entra una nueva cotización
    window.addEventListener('bcm:quote-created', () => {
      if (AuthManager.isAuthenticated()) {
        this.renderDashboard();
      }
    });
  },

  bindEvents() {
    // Login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-user-input').value;
        const pass = document.getElementById('admin-pass-input').value;
        const errEl = document.getElementById('admin-login-error');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Verificando...';
        }

        try {
          const res = await AuthManager.login(user, pass);
          if (res.success) {
            if (errEl) errEl.style.display = 'none';
            this.clearLoginForm();
            await this.checkSessionAndRender();
          } else {
            if (errEl) {
              errEl.textContent = res.message;
              errEl.style.display = 'block';
            }
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
          }
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthManager.logout();
        this.clearLoginForm();
        this.checkSessionAndRender();
      });
    }

    // Búsqueda y filtros
    const searchInput = document.getElementById('admin-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderQuotesTable();
      });
    }

    const statusFilter = document.getElementById('admin-filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.currentFilterStatus = e.target.value;
        this.renderQuotesTable();
      });
    }

    const serviceFilter = document.getElementById('admin-filter-service');
    if (serviceFilter) {
      serviceFilter.addEventListener('change', (e) => {
        this.currentFilterService = e.target.value;
        this.renderQuotesTable();
      });
    }

    // Exportar CSV
    const exportCsvBtn = document.getElementById('admin-export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this.handleExportCSV());
    }

    // Eventos del modal de detalle de cotización
    this.setupDetailDrawer();

    // Eventos del modal de cambio de contraseña
    this.setupPasswordModal();

    // Atajo de teclado privado para administradores (Ctrl + Shift + A o Alt + A)
    window.addEventListener('keydown', (e) => {
      const isCtrlShiftA = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a');
      const isAltA = e.altKey && (e.key === 'A' || e.key === 'a');
      if (isCtrlShiftA || isAltA) {
        e.preventDefault();
        window.location.hash = '#admin';
      }
    });
  },

  /**
   * Verifica la sesión y conmuta entre la vista de login y el dashboard
   */
  async checkSessionAndRender() {
    const isAuth = AuthManager.isAuthenticated();
    const loginView = document.getElementById('admin-login-container');
    const dashboardView = document.getElementById('admin-dashboard-container');

    const emailBadge = document.getElementById('admin-user-email-badge');
    const supaBadge = document.getElementById('admin-supabase-status-badge');
    const changePassBtn = document.getElementById('admin-open-password-btn');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // Enlaces de acceso al portal en el sitio público (ocultos para el público general)
    const navAdminLink = document.getElementById('nav-admin-link');
    const footerAdminLink = document.getElementById('footer-admin-link');
    const footerAdminBottomLink = document.getElementById('footer-admin-bottom-link');

    if (navAdminLink) {
      navAdminLink.style.display = isAuth ? 'inline-flex' : 'none';
    }
    if (footerAdminLink) {
      footerAdminLink.style.display = isAuth ? 'inline-block' : 'none';
    }
    if (footerAdminBottomLink) {
      footerAdminBottomLink.style.display = isAuth ? 'inline-block' : 'none';
    }

    if (loginView && dashboardView) {
      if (isAuth) {
        loginView.style.display = 'none';
        dashboardView.style.display = 'block';

        // Mostrar controles y opciones exclusivas cuando hay sesión iniciada
        if (emailBadge) emailBadge.style.display = 'inline-flex';
        if (supaBadge) supaBadge.style.display = 'inline-flex';
        if (changePassBtn) changePassBtn.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';

        // Actualizar información del usuario en el encabezado
        this.updateHeaderUserInfo();

        await this.renderDashboard();
      } else {
        loginView.style.display = 'block';
        dashboardView.style.display = 'none';

        // Ocultar opciones y badges si NO hay sesión iniciada
        if (emailBadge) emailBadge.style.display = 'none';
        if (supaBadge) supaBadge.style.display = 'none';
        if (changePassBtn) changePassBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';

        // Asegurar que el formulario no retenga datos anteriores
        this.clearLoginForm();
      }
    }
  },

  /**
   * Limpia el formulario de login y remueve cualquier dato anterior
   */
  clearLoginForm() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) loginForm.reset();

    const userInput = document.getElementById('admin-user-input');
    const passInput = document.getElementById('admin-pass-input');
    const errEl = document.getElementById('admin-login-error');

    if (userInput) {
      userInput.value = '';
      userInput.defaultValue = '';
    }
    if (passInput) {
      passInput.value = '';
      passInput.defaultValue = '';
    }
    if (errEl) {
      errEl.textContent = '';
      errEl.style.display = 'none';
    }
  },

  /**
   * Actualiza el correo del administrador y el estado de Supabase en el encabezado
   */
  updateHeaderUserInfo() {
    const user = AuthManager.getCurrentUser();
    const emailBadge = document.getElementById('admin-user-email-badge');
    if (emailBadge) {
      emailBadge.textContent = user.email;
    }

    const supaStatus = getSupabaseConnectionStatus();
    const supaBadge = document.getElementById('admin-supabase-status-badge');
    if (supaBadge) {
      supaBadge.textContent = supaStatus.label;
      if (supaStatus.connected) {
        supaBadge.className = 'badge badge-green';
        supaBadge.title = `Conectado a ${supaStatus.url}`;
      } else {
        supaBadge.className = 'badge badge-blue';
        supaBadge.title = 'Operando con persistencia local y sincronización automática';
      }
    }
  },

  /**
   * Renderiza KPIs y la tabla de solicitudes
   */
  async renderDashboard() {
    await this.renderKPIs();
    await this.renderQuotesTable();
  },

  /**
   * Calcula e inyecta los KPIs en tiempo real
   */
  async renderKPIs() {
    const kpis = await quotesRepo.getKPIs();

    const totalEl = document.getElementById('kpi-total-quotes');
    const pendingEl = document.getElementById('kpi-pending-quotes');
    const acceptedEl = document.getElementById('kpi-accepted-quotes');
    const weekEl = document.getElementById('kpi-week-quotes');

    if (totalEl) totalEl.textContent = kpis.total;
    if (pendingEl) pendingEl.textContent = kpis.pending;
    if (acceptedEl) acceptedEl.textContent = kpis.accepted;
    if (weekEl) weekEl.textContent = kpis.thisWeekFollowups;
  },

  /**
   * Renderiza el listado de solicitudes con filtros y búsqueda activa
   */
  async renderQuotesTable() {
    const tbody = document.getElementById('admin-quotes-tbody');
    if (!tbody) return;

    let quotes = await quotesRepo.getAll();

    // Filtro por Estado
    if (this.currentFilterStatus !== 'todos') {
      quotes = quotes.filter(q => q.status === this.currentFilterStatus);
    }

    // Filtro por Servicio
    if (this.currentFilterService !== 'todos') {
      quotes = quotes.filter(q => q.service?.categoryId === this.currentFilterService);
    }

    // Búsqueda por folio, cliente, empresa o teléfono
    if (this.searchQuery) {
      quotes = quotes.filter(q => {
        const idMatch = q.id?.toLowerCase().includes(this.searchQuery);
        const nameMatch = q.client?.fullName?.toLowerCase().includes(this.searchQuery);
        const compMatch = q.client?.company?.toLowerCase().includes(this.searchQuery);
        const phoneMatch = q.client?.phone?.includes(this.searchQuery);
        return idMatch || nameMatch || compMatch || phoneMatch;
      });
    }

    if (!quotes.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 32px; color: var(--bcm-slate);">
            No se encontraron solicitudes con los criterios de búsqueda seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = quotes.map(q => {
      const statusBadge = this.getStatusBadge(q.status);
      const dateFormatted = new Date(q.createdAt).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      return `
        <tr style="cursor: pointer;" class="js-quote-row" data-id="${q.id}">
          <td><strong>${q.id}</strong></td>
          <td>${dateFormatted}</td>
          <td>
            <div style="font-weight: 600; color: var(--bcm-navy);">${q.client?.fullName || 'Sin nombre'}</div>
            <div style="font-size: 0.75rem; color: var(--bcm-slate);">${q.client?.company || 'Particular'}</div>
          </td>
          <td>
            <div>${q.service?.categoryTitle || 'General'}</div>
            <div style="font-size: 0.75rem; color: var(--bcm-slate);">${q.service?.modalityTitle || ''} · ${q.property?.squareMeters || 0} m²</div>
          </td>
          <td>${q.client?.phone || 'N/A'}</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button type="button" class="btn btn-outline btn-sm js-view-quote-btn" data-id="${q.id}" title="Gestionar cotización">
                Gestionar
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm js-delete-quote-btn" data-id="${q.id}" title="Eliminar cotización">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Eventos para abrir detalle de cada fila (excepto si se hace clic en eliminar)
    tbody.querySelectorAll('.js-quote-row').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.js-delete-quote-btn')) return;
        const quoteId = el.dataset.id;
        if (quoteId) this.openDetailDrawer(quoteId);
      });
    });

    // Evento de eliminación directa desde la fila de la tabla
    tbody.querySelectorAll('.js-delete-quote-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const quoteId = btn.dataset.id;
        if (quoteId) {
          await this.handleDeleteQuote(quoteId);
        }
      });
    });
  },

  /**
   * Obtiene la etiqueta visual según el estado de la solicitud
   */
  getStatusBadge(status) {
    const map = {
      nueva: '<span class="badge badge-navy">Nueva</span>',
      en_revision: '<span class="badge badge-blue">En Revisión</span>',
      visita_pendiente: '<span class="badge badge-warning">Visita Pendiente</span>',
      cotizacion_preparacion: '<span class="badge badge-blue">Cotización en Prep.</span>',
      cotizacion_enviada: '<span class="badge badge-green">Cotización Enviada</span>',
      aceptada: '<span class="badge badge-success">Aceptada / Cerrada</span>',
      rechazada: '<span class="badge badge-danger">Rechazada</span>',
      cancelada: '<span class="badge" style="background:#E2E8F0; color:#64748B;">Cancelada</span>'
    };
    return map[status] || `<span class="badge">${status}</span>`;
  },

  /**
   * Configura el modal de detalle y edición de cotización
   */
  setupDetailDrawer() {
    const modal = document.getElementById('admin-detail-modal');
    const closeBtn = document.getElementById('close-admin-detail-modal');
    const saveStatusBtn = document.getElementById('admin-save-status-btn');
    const addNoteBtn = document.getElementById('admin-add-note-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (saveStatusBtn) {
      saveStatusBtn.addEventListener('click', async () => {
        if (!this.activeQuote) return;
        const newStatus = document.getElementById('admin-detail-status-select').value;
        const newAssigned = document.getElementById('admin-detail-assigned-input').value;
        const newFollowup = document.getElementById('admin-detail-followup-input').value;

        saveStatusBtn.disabled = true;
        saveStatusBtn.textContent = 'Guardando...';

        try {
          await quotesRepo.update(this.activeQuote.id, {
            status: newStatus,
            assignedTo: newAssigned,
            followUpDate: newFollowup
          });

          await quotesRepo.addNote(
            this.activeQuote.id,
            `Estado actualizado a: ${newStatus}. Responsable: ${newAssigned || 'Sin asignar'}. Fecha seguimiento: ${newFollowup || 'Sin fecha'}.`,
            AuthManager.getCurrentUser().email
          );

          await this.openDetailDrawer(this.activeQuote.id);
          await this.renderDashboard();
        } finally {
          saveStatusBtn.disabled = false;
          saveStatusBtn.textContent = 'Guardar Cambios de Estado';
        }
      });
    }

    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', async () => {
        if (!this.activeQuote) return;
        const noteInput = document.getElementById('admin-new-note-text');
        const text = noteInput.value.trim();
        if (!text) return;

        addNoteBtn.disabled = true;
        try {
          await quotesRepo.addNote(this.activeQuote.id, text, AuthManager.getCurrentUser().email);
          noteInput.value = '';
          await this.openDetailDrawer(this.activeQuote.id);
        } finally {
          addNoteBtn.disabled = false;
        }
      });
    }

    const deleteDetailBtn = document.getElementById('admin-detail-delete-btn');
    if (deleteDetailBtn) {
      deleteDetailBtn.addEventListener('click', async () => {
        if (!this.activeQuote) return;
        await this.handleDeleteQuote(this.activeQuote.id);
      });
    }
  },

  /**
   * Configura el modal de cambio de contraseña
   */
  setupPasswordModal() {
    const modal = document.getElementById('admin-change-password-modal');
    const openBtn = document.getElementById('admin-open-password-btn');
    const closeBtn = document.getElementById('close-admin-password-modal');
    const form = document.getElementById('admin-change-password-form');
    const errEl = document.getElementById('admin-password-error');
    const successEl = document.getElementById('admin-password-success');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        const user = AuthManager.getCurrentUser();
        const emailLabel = document.getElementById('admin-password-current-email');
        if (emailLabel) emailLabel.textContent = user.email;

        if (form) form.reset();
        if (errEl) errEl.style.display = 'none';
        if (successEl) successEl.style.display = 'none';

        modal.classList.add('active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPass = document.getElementById('admin-current-password').value;
        const newPass = document.getElementById('admin-new-password').value;
        const confirmPass = document.getElementById('admin-confirm-password').value;
        const submitBtn = document.getElementById('admin-submit-password-btn');

        if (errEl) errEl.style.display = 'none';
        if (successEl) successEl.style.display = 'none';

        if (newPass !== confirmPass) {
          if (errEl) {
            errEl.textContent = 'La nueva contraseña y su confirmación no coinciden.';
            errEl.style.display = 'block';
          }
          return;
        }

        if (newPass.length < 6) {
          if (errEl) {
            errEl.textContent = 'La nueva contraseña debe tener mínimo 6 caracteres.';
            errEl.style.display = 'block';
          }
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Actualizando contraseña...';
        }

        try {
          const res = await AuthManager.changePassword(currentPass, newPass);
          if (res.success) {
            if (successEl) {
              successEl.textContent = res.message;
              successEl.style.display = 'block';
            }
            form.reset();
            setTimeout(() => {
              modal.classList.remove('active');
            }, 2500);
          } else {
            if (errEl) {
              errEl.textContent = res.message;
              errEl.style.display = 'block';
            }
          }
        } catch (err) {
          if (errEl) {
            errEl.textContent = 'Ocurrió un error inesperado al actualizar la contraseña.';
            errEl.style.display = 'block';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Actualizar Contraseña';
          }
        }
      });
    }
  },

  /**
   * Abre y puebla el modal de gestión detallada de la solicitud
   */
  async openDetailDrawer(id) {
    const quote = await quotesRepo.getById(id);
    if (!quote) return;
    this.activeQuote = quote;

    const modal = document.getElementById('admin-detail-modal');
    if (!modal) return;

    // Encabezado
    document.getElementById('admin-detail-folio').textContent = quote.id;
    document.getElementById('admin-detail-created').textContent = new Date(quote.createdAt).toLocaleString('es-MX');

    // Datos del cliente
    document.getElementById('admin-detail-client-name').textContent = quote.client?.fullName || 'Sin nombre';
    document.getElementById('admin-detail-client-company').textContent = quote.client?.company || 'Particular';
    document.getElementById('admin-detail-client-phone').textContent = quote.client?.phone || 'Sin teléfono';
    document.getElementById('admin-detail-client-email').textContent = quote.client?.email || 'Sin correo';
    document.getElementById('admin-detail-client-contact').textContent = (quote.client?.preferredContact || 'N/A').toUpperCase();

    // Inmueble
    document.getElementById('admin-detail-prop-type').textContent = (quote.property?.type || 'N/A').toUpperCase();
    document.getElementById('admin-detail-prop-zone').textContent = quote.property?.cityZone || 'N/A';
    document.getElementById('admin-detail-prop-m2').textContent = `${quote.property?.squareMeters || 0} m²`;
    document.getElementById('admin-detail-prop-levels').textContent = quote.property?.levels || 'N/A';
    document.getElementById('admin-detail-prop-desc').textContent = quote.property?.description || 'Sin descripción';

    // Servicio
    document.getElementById('admin-detail-serv-cat').textContent = quote.service?.categoryTitle || 'N/A';
    document.getElementById('admin-detail-serv-mod').textContent = quote.service?.modalityTitle || 'N/A';
    document.getElementById('admin-detail-serv-freq').textContent = (quote.service?.frequency || 'N/A').toUpperCase();
    document.getElementById('admin-detail-serv-visit').textContent = quote.service?.evaluationVisit ? 'Sí requerida' : 'No en primera etapa';
    document.getElementById('admin-detail-serv-supplies').textContent = (quote.service?.supplies || 'N/A').toUpperCase();
    document.getElementById('admin-detail-serv-comments').textContent = quote.service?.additionalComments || 'Sin comentarios adicionales.';

    // Controles de estado y asignación
    const statusSelect = document.getElementById('admin-detail-status-select');
    if (statusSelect) statusSelect.value = quote.status;

    const assignedInput = document.getElementById('admin-detail-assigned-input');
    if (assignedInput) assignedInput.value = quote.assignedTo || '';

    const followupInput = document.getElementById('admin-detail-followup-input');
    if (followupInput) followupInput.value = quote.followUpDate || '';

    // Historial de notas
    const notesContainer = document.getElementById('admin-detail-notes-list');
    if (notesContainer) {
      notesContainer.innerHTML = (quote.notes || []).map(n => `
        <div style="background: var(--color-surface-subtle); padding: 10px 14px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid var(--bcm-blue); font-size: 0.8125rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: var(--bcm-slate); font-size: 0.75rem;">
            <strong>${n.author}</strong>
            <span>${new Date(n.date).toLocaleString('es-MX')}</span>
          </div>
          <div>${n.text}</div>
        </div>
      `).join('') || '<p style="color: var(--bcm-slate); font-size: 0.8125rem;">No hay notas registradas.</p>';
    }

    modal.classList.add('active');
  },

  /**
   * Genera y descarga el archivo CSV con todas las solicitudes
   */
  async handleExportCSV() {
    const csvContent = await quotesRepo.exportToCSV();
    if (!csvContent) {
      alert('No hay solicitudes para exportar.');
      return;
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BioClean_Master_Solicitudes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Muestra el modal de confirmación con diseño BioClean Master
   */
  confirmDeleteModal(quote) {
    return new Promise((resolve) => {
      const modal = document.getElementById('admin-delete-confirm-modal');
      const folioEl = document.getElementById('admin-delete-modal-folio');
      const statusEl = document.getElementById('admin-delete-modal-status');
      const clientEl = document.getElementById('admin-delete-modal-client');
      const serviceEl = document.getElementById('admin-delete-modal-service');
      const confirmBtn = document.getElementById('admin-delete-modal-confirm-btn');
      const cancelBtn = document.getElementById('admin-delete-modal-cancel-btn');
      const closeBtn = document.getElementById('close-admin-delete-modal-btn');

      if (!modal) {
        resolve(window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la solicitud con folio ${quote.id}?`));
        return;
      }

      if (folioEl) folioEl.textContent = quote.id;
      if (statusEl) {
        statusEl.innerHTML = this.getStatusBadge(quote.status);
      }
      if (clientEl) {
        const name = quote.client?.fullName || 'Sin nombre';
        const company = quote.client?.company ? ` · ${quote.client.company}` : '';
        clientEl.textContent = `${name}${company}`;
      }
      if (serviceEl) {
        const cat = quote.service?.categoryTitle || 'General';
        const m2 = quote.property?.squareMeters ? ` · ${quote.property.squareMeters} m²` : '';
        serviceEl.textContent = `${cat}${m2}`;
      }

      const cleanup = () => {
        modal.classList.remove('active');
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        if (closeBtn) closeBtn.removeEventListener('click', onCancel);
        modal.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKeyDown);
      };

      const onConfirm = () => {
        cleanup();
        resolve(true);
      };

      const onCancel = () => {
        cleanup();
        resolve(false);
      };

      const onBackdrop = (e) => {
        if (e.target === modal) {
          cleanup();
          resolve(false);
        }
      };

      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          cleanup();
          resolve(false);
        }
      };

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      if (closeBtn) closeBtn.addEventListener('click', onCancel);
      modal.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKeyDown);

      modal.classList.add('active');
    });
  },

  /**
   * Elimina una solicitud o cotización previa confirmación del administrador
   */
  async handleDeleteQuote(id) {
    const quote = await quotesRepo.getById(id);
    if (!quote) {
      this.showToast('No se encontró la solicitud seleccionada.', 'danger');
      return;
    }

    const confirmed = await this.confirmDeleteModal(quote);
    if (!confirmed) {
      return;
    }

    try {
      const deleted = await quotesRepo.delete(id);
      if (deleted) {
        // Cerrar modal de detalle si estaba abierto para este folio
        const detailModal = document.getElementById('admin-detail-modal');
        if (detailModal && this.activeQuote && this.activeQuote.id === id) {
          detailModal.classList.remove('active');
          this.activeQuote = null;
        }

        this.showToast(`Solicitud ${id} eliminada exitosamente.`, 'success');
        await this.renderDashboard();
      } else {
        this.showToast('No se pudo encontrar la solicitud para eliminar.', 'danger');
      }
    } catch (err) {
      console.error('Error al eliminar solicitud:', err);
      this.showToast('Ocurrió un error inesperado al intentar eliminar la solicitud.', 'danger');
    }
  },

  /**
   * Muestra un mensaje flotante tipo Toast
   */
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'danger') {
      toast.style.borderLeft = '4px solid var(--color-feedback-danger)';
    } else if (type === 'success') {
      toast.style.borderLeft = '4px solid var(--bcm-green)';
    } else {
      toast.style.borderLeft = '4px solid var(--bcm-mint)';
    }
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};
