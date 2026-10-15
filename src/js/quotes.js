/**
 * quotes.js
 * Módulo del cotizador interactivo paso a paso (Wizard) de BioClean Master.
 * Validaciones en vivo, persistencia en repositorio, generación de folio BCM,
 * confirmación de registro y conexión comercial a WhatsApp (55 7924 7494).
 */

import { Validation } from './validation.js';
import { quotesRepo } from './storage.js';
import { SERVICES, MODALITIES } from '../data/servicesData.js';

export const QuotesModule = {
  currentStep: 1,
  totalSteps: 4,

  // Estado reactivo en memoria del formulario
  formData: {
    // Paso 1: Solicitante
    fullName: '',
    company: '',
    email: '',
    phone: '',
    preferredContact: 'whatsapp',

    // Paso 2: Inmueble
    propertyType: 'oficina',
    cityZone: '',
    squareMeters: '',
    levels: '',
    description: '',
    photos: [],

    // Paso 3: Servicio
    serviceCategory: 'limpieza-recurrente-empresas',
    modality: 'recurrente',
    frequency: 'diaria',
    preferredSchedule: 'matutino',
    tentativeStartDate: '',
    evaluationVisit: true,
    supplies: 'incluidos',
    additionalComments: ''
  },

  init() {
    this.bindEvents();
    this.setupPhotoUpload();
    this.listenToPreselectEvents();
    this.updateStepUI();
  },

  bindEvents() {
    // Botones de navegación del Wizard
    const nextBtn = document.getElementById('wizard-next-btn');
    const prevBtn = document.getElementById('wizard-prev-btn');
    const submitBtn = document.getElementById('wizard-submit-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNextStep());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.handlePrevStep());
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleSubmitQuote());
    }

    // Radio cards para selección visual
    document.querySelectorAll('.js-radio-card-group').forEach(group => {
      const fieldName = group.dataset.field;
      const cards = group.querySelectorAll('.radio-card');

      cards.forEach(card => {
        card.addEventListener('click', () => {
          cards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');

          const input = card.querySelector('input');
          if (input) {
            input.checked = true;
            this.formData[fieldName] = input.value;
          }
        });
      });
    });

    // Inputs directos con sincronización en tiempo real
    const inputs = document.querySelectorAll('#quote-wizard-form [data-model]');
    inputs.forEach(input => {
      const field = input.dataset.model;
      input.addEventListener('input', (e) => {
        if (input.type === 'checkbox') {
          this.formData[field] = input.checked;
        } else {
          this.formData[field] = input.value;
        }
        this.clearFieldError(input);
      });
    });
  },

  /**
   * Escucha eventos de preselección desde las tarjetas de catálogo o modalidades
   */
  listenToPreselectEvents() {
    window.addEventListener('bcm:preselect-quote', (e) => {
      const { serviceId, modality } = e.detail;
      if (serviceId) {
        this.formData.serviceCategory = serviceId;
        const serviceSelect = document.getElementById('input-service-category');
        if (serviceSelect) serviceSelect.value = serviceId;
      }
      if (modality) {
        this.formData.modality = modality;
        const modalityGroup = document.querySelector('[data-field="modality"]');
        if (modalityGroup) {
          modalityGroup.querySelectorAll('.radio-card').forEach(c => {
            const val = c.querySelector('input')?.value;
            c.classList.toggle('selected', val === modality);
          });
        }
      }
    });
  },

  /**
   * Simulador y preview de carga de fotografías de referencia
   */
  setupPhotoUpload() {
    const fileInput = document.getElementById('quote-photo-input');
    const previewContainer = document.getElementById('photo-preview-container');

    if (!fileInput || !previewContainer) return;

    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      files.slice(0, 4).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoObj = {
            name: file.name,
            dataUrl: event.target.result
          };
          this.formData.photos.push(photoObj);
          this.renderPhotoPreviews();
        };
        reader.readAsDataURL(file);
      });
    });
  },

  renderPhotoPreviews() {
    const container = document.getElementById('photo-preview-container');
    if (!container) return;

    container.innerHTML = this.formData.photos.map((p, idx) => `
      <div class="photo-preview-item">
        <img src="${p.dataUrl}" alt="${p.name}">
        <button type="button" class="photo-remove-btn" data-index="${idx}" aria-label="Eliminar foto">&times;</button>
      </div>
    `).join('');

    container.querySelectorAll('.photo-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        this.formData.photos.splice(idx, 1);
        this.renderPhotoPreviews();
      });
    });
  },

  /**
   * Manejo del avance de paso con validación estricta
   */
  handleNextStep() {
    this.syncCurrentStepData();

    if (this.currentStep === 1) {
      const res = Validation.validateStep1(this.formData);
      if (!res.isValid) {
        this.displayErrors(res.errors);
        return;
      }
    } else if (this.currentStep === 2) {
      const res = Validation.validateStep2(this.formData);
      if (!res.isValid) {
        this.displayErrors(res.errors);
        return;
      }
    } else if (this.currentStep === 3) {
      const res = Validation.validateStep3(this.formData);
      if (!res.isValid) {
        this.displayErrors(res.errors);
        return;
      }
      this.renderReviewSummary();
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStepUI();
    }
  },

  /**
   * Retroceso de paso sin perder datos
   */
  handlePrevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepUI();
    }
  },

  /**
   * Sincroniza campos del DOM hacia el estado
   */
  syncCurrentStepData() {
    document.querySelectorAll('#quote-wizard-form [data-model]').forEach(input => {
      const field = input.dataset.model;
      if (input.type === 'checkbox') {
        this.formData[field] = input.checked;
      } else if (input.value !== undefined) {
        this.formData[field] = input.value;
      }
    });
  },

  /**
   * Actualiza la visibilidad de los paneles y los indicadores del Stepper
   */
  updateStepUI() {
    // Paneles
    for (let i = 1; i <= this.totalSteps; i++) {
      const panel = document.getElementById(`wizard-step-${i}`);
      const indicator = document.getElementById(`step-indicator-${i}`);

      if (panel) {
        panel.classList.toggle('active', i === this.currentStep);
      }

      if (indicator) {
        indicator.classList.remove('active', 'completed');
        if (i === this.currentStep) {
          indicator.classList.add('active');
          indicator.setAttribute('aria-current', 'step');
        } else if (i < this.currentStep) {
          indicator.classList.add('completed');
          indicator.removeAttribute('aria-current');
        } else {
          indicator.removeAttribute('aria-current');
        }
      }
    }

    // Botones
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const submitBtn = document.getElementById('wizard-submit-btn');

    if (prevBtn) {
      prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      nextBtn.style.display = this.currentStep === this.totalSteps ? 'none' : 'inline-flex';
    }

    if (submitBtn) {
      submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-flex' : 'none';
    }

    // Scroll al inicio del cotizador al cambiar de paso
    const wizardEl = document.getElementById('cotizador');
    if (wizardEl && window.scrollY > wizardEl.offsetTop + 100) {
      wizardEl.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Renderiza la tabla de revisión del paso 4
   */
  renderReviewSummary() {
    const tableBody = document.getElementById('review-summary-tbody');
    if (!tableBody) return;

    const service = SERVICES.find(s => s.id === this.formData.serviceCategory);
    const modality = MODALITIES.find(m => m.id === this.formData.modality);

    const rows = [
      { label: 'Nombre del Solicitante', value: this.formData.fullName },
      { label: 'Empresa / Razón Social', value: this.formData.company || 'Particular / Residencial' },
      { label: 'Teléfono / Celular', value: this.formData.phone },
      { label: 'Correo Electrónico', value: this.formData.email },
      { label: 'Medio de Contacto Preferido', value: this.formData.preferredContact.toUpperCase() },
      { label: 'Tipo de Inmueble', value: this.formData.propertyType.toUpperCase() },
      { label: 'Zona / Ciudad', value: this.formData.cityZone },
      { label: 'Superficie Estimada', value: `${this.formData.squareMeters} m²` },
      { label: 'Niveles / Áreas', value: this.formData.levels || 'No especificado' },
      { label: 'Categoría de Servicio', value: service ? service.title : this.formData.serviceCategory },
      { label: 'Modalidad de Contratación', value: modality ? modality.title : this.formData.modality },
      { label: 'Frecuencia Deseada', value: this.formData.frequency.toUpperCase() },
      { label: 'Horario Preferido', value: this.formData.preferredSchedule },
      { label: 'Fecha Tentativa de Inicio', value: this.formData.tentativeStartDate || 'Por coordinar' },
      { label: 'Requiere Visita de Evaluación', value: this.formData.evaluationVisit ? 'Sí, agendar inspección' : 'No en primera etapa' },
      { label: 'Insumos y Maquinaria', value: this.formData.supplies.toUpperCase() },
      { label: 'Fotografías Adjuntas', value: this.formData.photos.length > 0 ? `${this.formData.photos.length} imagen(es)` : 'Sin fotografías' }
    ];

    tableBody.innerHTML = rows.map(r => `
      <tr>
        <th>${r.label}</th>
        <td>${Validation.sanitizeText(String(r.value))}</td>
      </tr>
    `).join('');
  },

  /**
   * Muestra mensajes de error en los campos
   */
  displayErrors(errors) {
    Object.keys(errors).forEach(field => {
      const group = document.querySelector(`[data-field-group="${field}"]`);
      if (group) {
        group.classList.add('has-error');
        const errEl = group.querySelector('.form-error-msg');
        if (errEl) errEl.textContent = errors[field];
      }
    });

    // Foco en el primer campo con error
    const firstError = Object.keys(errors)[0];
    const firstInput = document.querySelector(`[data-model="${firstError}"]`);
    if (firstInput) firstInput.focus();
  },

  clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  },

  /**
   * Envío real de la cotización, persistencia y confirmación
   */
  async handleSubmitQuote() {
    const submitBtn = document.getElementById('wizard-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando solicitud...';
    }

    try {
      const folio = quotesRepo.generateFolio();
      const service = SERVICES.find(s => s.id === this.formData.serviceCategory);
      const modality = MODALITIES.find(m => m.id === this.formData.modality);

      const quoteRecord = {
        id: folio,
        client: {
          fullName: this.formData.fullName.trim(),
          company: this.formData.company.trim(),
          email: this.formData.email.trim(),
          phone: Validation.cleanPhone(this.formData.phone),
          preferredContact: this.formData.preferredContact
        },
        property: {
          type: this.formData.propertyType,
          cityZone: this.formData.cityZone.trim(),
          squareMeters: Number(this.formData.squareMeters),
          levels: this.formData.levels.trim(),
          description: this.formData.description.trim(),
          photoCount: this.formData.photos.length
        },
        service: {
          categoryId: this.formData.serviceCategory,
          categoryTitle: service ? service.title : this.formData.serviceCategory,
          modality: this.formData.modality,
          modalityTitle: modality ? modality.title : this.formData.modality,
          frequency: this.formData.frequency,
          preferredSchedule: this.formData.preferredSchedule,
          tentativeStartDate: this.formData.tentativeStartDate,
          evaluationVisit: this.formData.evaluationVisit,
          supplies: this.formData.supplies,
          additionalComments: this.formData.additionalComments.trim()
        }
      };

      // Persistencia real en la capa de datos
      const created = await quotesRepo.create(quoteRecord);

      // Mostrar modal de confirmación con folio
      this.openConfirmationModal(created);

      // Disparar evento para actualizar panel administrativo en tiempo real
      window.dispatchEvent(new CustomEvent('bcm:quote-created', { detail: created }));

    } catch (err) {
      console.error('Error al registrar cotización:', err);
      alert('Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo o comunícate vía WhatsApp.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmar y Enviar Solicitud';
      }
    }
  },

  /**
   * Abre modal de confirmación con opciones para continuar en WhatsApp (55 7924 7494)
   */
  openConfirmationModal(quote) {
    const modal = document.getElementById('quote-confirmation-modal');
    const folioEl = document.getElementById('confirmation-folio-number');
    const clientNameEl = document.getElementById('confirmation-client-name');
    const whatsappLinkBtn = document.getElementById('confirmation-whatsapp-btn');

    if (!modal) return;

    if (folioEl) folioEl.textContent = quote.id;
    if (clientNameEl) clientNameEl.textContent = quote.client.fullName;

    // Generar mensaje preformateado para WhatsApp Comercial
    const waText = encodeURIComponent(
      `*Hola BioClean Master*, he registrado una solicitud de cotización en su plataforma web.\n\n` +
      `📋 *Folio:* ${quote.id}\n` +
      `👤 *Cliente:* ${quote.client.fullName}\n` +
      `🏢 *Empresa:* ${quote.client.company || 'Particular'}\n` +
      `📍 *Zona:* ${quote.property.cityZone} (${quote.property.squareMeters} m²)\n` +
      `✨ *Servicio:* ${quote.service.categoryTitle}\n` +
      `🔄 *Modalidad:* ${quote.service.modalityTitle}\n` +
      `📅 *Visita de evaluación:* ${quote.service.evaluationVisit ? 'Sí requerida' : 'No por ahora'}\n\n` +
      `Agradezco su atención y seguimiento.`
    );

    const waUrl = `https://wa.me/525579247494?text=${waText}`;

    if (whatsappLinkBtn) {
      whatsappLinkBtn.href = waUrl;
    }

    modal.classList.add('active');

    // Cerrar modal
    const closeBtn = document.getElementById('close-confirmation-modal-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.classList.remove('active');
        this.resetWizard();
      };
    }
  },

  resetWizard() {
    this.currentStep = 1;
    this.formData.photos = [];
    document.getElementById('quote-wizard-form')?.reset();
    this.renderPhotoPreviews();
    this.updateStepUI();
  }
};
