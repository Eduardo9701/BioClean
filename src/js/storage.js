/**
 * storage.js
 * Capa de persistencia desacoplada (Patrón Repositorio).
 * Soporta almacenamiento local en LocalStorage con fallback y sembrado inicial,
 * estructurado con firmas asíncronas para conectarse directamente a Supabase o REST API.
 */

import { INITIAL_QUOTES } from '../data/initialQuotes.js';

const STORAGE_KEY = 'bioclean_master_quotes_v1';
const AUTH_KEY = 'bioclean_master_admin_session_v1';

class QuotesRepository {
  constructor() {
    this.initialized = false;
  }

  /**
   * Inicializa la base de datos local con datos semilla si está vacía
   */
  async init() {
    if (this.initialized) return;

    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_QUOTES));
      }
      this.initialized = true;
    } catch (err) {
      console.warn('LocalStorage no disponible, usando almacenamiento en memoria.', err);
      this.memoryDb = [...INITIAL_QUOTES];
      this.initialized = true;
    }
  }

  /**
   * Obtiene todas las solicitudes almacenadas
   */
  async getAll() {
    await this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : (this.memoryDb || []);
    } catch (err) {
      console.error('Error al leer solicitudes:', err);
      return this.memoryDb || [];
    }
  }

  /**
   * Busca una solicitud por su folio
   */
  async getById(id) {
    const list = await this.getAll();
    return list.find(q => q.id === id) || null;
  }

  /**
   * Crea y persiste una nueva solicitud de cotización
   */
  async create(quoteData) {
    await this.init();
    const list = await this.getAll();

    const newQuote = {
      ...quoteData,
      createdAt: new Date().toISOString(),
      status: 'nueva',
      assignedTo: 'Sin asignar',
      followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: [
        {
          id: 'n_' + Date.now(),
          author: 'Sistema Web',
          date: new Date().toISOString(),
          text: 'Solicitud generada a través del cotizador en línea.'
        }
      ]
    };

    list.unshift(newQuote);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      if (this.memoryDb) this.memoryDb.unshift(newQuote);
    }

    return newQuote;
  }

  /**
   * Actualiza el estado, responsable o campos de una cotización
   */
  async update(id, updates) {
    await this.init();
    const list = await this.getAll();
    const index = list.findIndex(q => q.id === id);

    if (index === -1) {
      throw new Error(`Solicitud con folio ${id} no encontrada.`);
    }

    const current = list[index];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      if (this.memoryDb) this.memoryDb[index] = updated;
    }

    return updated;
  }

  /**
   * Agrega una nota interna al historial de la solicitud
   */
  async addNote(id, noteText, author = 'Administrador') {
    const quote = await this.getById(id);
    if (!quote) throw new Error('Solicitud no encontrada');

    const newNote = {
      id: 'note_' + Date.now(),
      author,
      date: new Date().toISOString(),
      text: noteText
    };

    const notes = quote.notes ? [...quote.notes, newNote] : [newNote];
    return await this.update(id, { notes });
  }

  /**
   * Calcula indicadores y KPIs en tiempo real a partir de datos reales
   */
  async getKPIs() {
    const list = await this.getAll();
    const total = list.length;

    const pending = list.filter(q => 
      ['nueva', 'en_revision', 'visita_pendiente', 'cotizacion_preparacion'].includes(q.status)
    ).length;

    const accepted = list.filter(q => q.status === 'aceptada').length;

    // Conteo por categoría
    const byCategory = {};
    // Conteo por modalidad
    const byModality = {};

    list.forEach(q => {
      const cat = q.service?.categoryTitle || 'Otros';
      byCategory[cat] = (byCategory[cat] || 0) + 1;

      const mod = q.service?.modalityTitle || 'Otra';
      byModality[mod] = (byModality[mod] || 0) + 1;
    });

    // Pendientes de esta semana
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thisWeekFollowups = list.filter(q => {
      if (!q.followUpDate) return false;
      const fDate = new Date(q.followUpDate);
      return fDate >= now && fDate <= weekFromNow && q.status !== 'aceptada' && q.status !== 'rechazada';
    }).length;

    return {
      total,
      pending,
      accepted,
      thisWeekFollowups,
      byCategory,
      byModality
    };
  }

  /**
   * Genera un identificador único de folio en formato BCM-YYYYMMDD-XXXX
   */
  generateFolio() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BCM-${year}${month}${day}-${random}`;
  }

  /**
   * Exporta las solicitudes a formato CSV con escape RFC 4180
   */
  async exportToCSV() {
    const list = await this.getAll();
    if (!list.length) return '';

    const headers = [
      'Folio',
      'Fecha Creacion',
      'Estado',
      'Cliente',
      'Empresa',
      'Telefono',
      'Email',
      'Medio Contacto',
      'Tipo Inmueble',
      'Zona / Ciudad',
      'Superficie (m2)',
      'Categoria Servicio',
      'Modalidad',
      'Frecuencia',
      'Visita Evaluacion',
      'Insumos',
      'Responsable',
      'Fecha Seguimiento'
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map(q => [
      escapeCSV(q.id),
      escapeCSV(new Date(q.createdAt).toLocaleDateString('es-MX')),
      escapeCSV(q.status),
      escapeCSV(q.client?.fullName),
      escapeCSV(q.client?.company || 'N/A'),
      escapeCSV(q.client?.phone),
      escapeCSV(q.client?.email),
      escapeCSV(q.client?.preferredContact),
      escapeCSV(q.property?.type),
      escapeCSV(q.property?.cityZone),
      escapeCSV(q.property?.squareMeters),
      escapeCSV(q.service?.categoryTitle),
      escapeCSV(q.service?.modalityTitle),
      escapeCSV(q.service?.frequency),
      escapeCSV(q.service?.evaluationVisit ? 'SI' : 'NO'),
      escapeCSV(q.service?.supplies),
      escapeCSV(q.assignedTo || 'Sin asignar'),
      escapeCSV(q.followUpDate || 'Sin fecha')
    ].join(','));

    return [headers.join(','), ...rows].join('\r\n');
  }
}

/**
 * Gestión de autenticación simple de administrador
 */
export const AuthManager = {
  // Credenciales por defecto documentadas para la versión inicial
  DEFAULT_USER: 'admin@bioclean.mx',
  DEFAULT_PASS: 'bioclean2026',

  login(username, password) {
    if (
      (username.trim().toLowerCase() === this.DEFAULT_USER || username.trim() === 'admin') &&
      password.trim() === this.DEFAULT_PASS
    ) {
      const session = {
        authenticated: true,
        user: username,
        token: 'bcm_token_' + Date.now(),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8 horas
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, message: 'Usuario o contraseña incorrectos.' };
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated() {
    try {
      const sessionStr = localStorage.getItem(AUTH_KEY);
      if (!sessionStr) return false;
      const session = JSON.parse(sessionStr);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return false;
      }
      return session.authenticated === true;
    } catch {
      return false;
    }
  }
};

export const quotesRepo = new QuotesRepository();
