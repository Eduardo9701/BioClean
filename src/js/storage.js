/**
 * storage.js
 * Capa de persistencia desacoplada (Patrón Repositorio) con soporte dual:
 * 1. Supabase Cloud Database (PostgreSQL en tiempo real).
 * 2. LocalStorage con fallback y sincronización local en caso de desconexión o modo offline.
 */

import { INITIAL_QUOTES } from '../data/initialQuotes.js';
import { supabase, isSupabaseConfigured, getSupabaseConnectionStatus } from './supabaseClient.js';

const STORAGE_KEY = 'bioclean_master_quotes_v1';
const AUTH_KEY = 'bioclean_master_admin_session_v1';
const ADMIN_CREDS_KEY = 'bioclean_master_admin_creds_v1';

class QuotesRepository {
  constructor() {
    this.initialized = false;
  }

  /**
   * Normaliza los datos de Supabase (snake_case) al modelo de dominio (camelCase)
   */
  normalizeFromSupabase(row) {
    if (!row) return null;
    return {
      id: row.id,
      createdAt: row.created_at || new Date().toISOString(),
      status: row.status || 'nueva',
      client: row.client || {},
      property: row.property || {},
      service: row.service || {},
      assignedTo: row.assigned_to || 'Sin asignar',
      followUpDate: row.follow_up_date || '',
      notes: Array.isArray(row.notes) ? row.notes : [],
      updatedAt: row.updated_at
    };
  }

  /**
   * Normaliza un objeto de dominio a formato de fila para Supabase
   */
  normalizeToSupabase(quote) {
    return {
      id: quote.id,
      created_at: quote.createdAt,
      status: quote.status,
      client: quote.client,
      property: quote.property,
      service: quote.service,
      assigned_to: quote.assignedTo || 'Sin asignar',
      follow_up_date: quote.followUpDate || null,
      notes: quote.notes || []
    };
  }

  /**
   * Inicializa la base de datos local y/o remota
   */
  async init() {
    if (this.initialized) return;

    try {
      // 1. Inicialización en Supabase si está disponible
      if (isSupabaseConfigured() && supabase) {
        try {
          const { count, error } = await supabase
            .from('quotes')
            .select('*', { count: 'exact', head: true });

          if (!error && count === 0) {
            // Sembrar registros iniciales en Supabase
            const rowsToInsert = INITIAL_QUOTES.map(q => this.normalizeToSupabase(q));
            await supabase.from('quotes').insert(rowsToInsert);
          }
        } catch (supaErr) {
          console.warn('No se pudo verificar la tabla de cotizaciones en Supabase:', supaErr);
        }
      }

      // 2. Caché local en LocalStorage
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
   * Obtiene todas las solicitudes almacenadas (de Supabase o LocalStorage)
   */
  async getAll() {
    await this.init();

    // Intento con Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const normalized = data.map(r => this.normalizeFromSupabase(r));
          // Actualizar caché local
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch (e) {}
          return normalized;
        }
        console.warn('Error al consultar Supabase, utilizando fallback local:', error?.message);
      } catch (err) {
        console.warn('Error de red al consultar Supabase, usando datos locales:', err);
      }
    }

    // Fallback a LocalStorage
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : (this.memoryDb || []);
    } catch (err) {
      console.error('Error al leer solicitudes locales:', err);
      return this.memoryDb || [];
    }
  }

  /**
   * Busca una solicitud por su folio
   */
  async getById(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return this.normalizeFromSupabase(data);
        }
      } catch (e) {}
    }

    const list = await this.getAll();
    return list.find(q => q.id === id) || null;
  }

  /**
   * Crea y persiste una nueva solicitud de cotización
   */
  async create(quoteData) {
    await this.init();

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

    // 1. Guardar en Supabase si está activo
    if (isSupabaseConfigured() && supabase) {
      try {
        const row = this.normalizeToSupabase(newQuote);
        const { error } = await supabase.from('quotes').insert([row]);
        if (error) {
          console.error('Error insertando cotización en Supabase:', error.message);
        } else {
          console.info('Cotización guardada exitosamente en Supabase Cloud:', newQuote.id);
        }
      } catch (supaErr) {
        console.error('Error de red con Supabase al guardar cotización:', supaErr);
      }
    }

    // 2. Sincronizar en LocalStorage
    try {
      const list = await this.getAll();
      const existingIdx = list.findIndex(q => q.id === newQuote.id);
      if (existingIdx >= 0) {
        list[existingIdx] = newQuote;
      } else {
        list.unshift(newQuote);
      }
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

    // 1. Actualizar en Supabase si está disponible
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {};
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.assignedTo !== undefined) payload.assigned_to = updates.assignedTo;
        if (updates.followUpDate !== undefined) payload.follow_up_date = updates.followUpDate;
        if (updates.notes !== undefined) payload.notes = updates.notes;

        const { error } = await supabase
          .from('quotes')
          .update(payload)
          .eq('id', id);

        if (error) {
          console.warn('Error al actualizar en Supabase:', error.message);
        }
      } catch (supaErr) {
        console.warn('Fallo de conexión al actualizar en Supabase:', supaErr);
      }
    }

    // 2. Actualizar en LocalStorage
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
   * Elimina permanentemente una solicitud por su folio
   */
  async delete(id) {
    await this.init();

    // 1. Comprobar existencia antes de eliminar
    const existing = await this.getById(id);
    if (!existing) {
      return false;
    }

    // 2. Eliminar en Supabase si está disponible
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('quotes')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('Error al eliminar en Supabase:', error.message);
        } else {
          console.info('Cotización eliminada exitosamente en Supabase:', id);
        }
      } catch (supaErr) {
        console.warn('Fallo de conexión al eliminar en Supabase:', supaErr);
      }
    }

    // 3. Eliminar del almacenamiento LocalStorage local
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const localList = JSON.parse(raw);
        const filtered = localList.filter(q => q.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (err) {
      console.warn('Error actualizando localStorage al eliminar:', err);
    }

    // 4. Eliminar de la base en memoria si aplica
    if (this.memoryDb) {
      this.memoryDb = this.memoryDb.filter(q => q.id !== id);
    }

    return true;
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

    const byCategory = {};
    const byModality = {};

    list.forEach(q => {
      const cat = q.service?.categoryTitle || 'Otros';
      byCategory[cat] = (byCategory[cat] || 0) + 1;

      const mod = q.service?.modalityTitle || 'Otra';
      byModality[mod] = (byModality[mod] || 0) + 1;
    });

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
 * Gestión de autenticación de administrador con soporte para Supabase y cambio de contraseña
 */
export const AuthManager = {
  DEFAULT_USER: 'admin@bioclean.mx',
  DEFAULT_PASS: 'bioclean2026',

  /**
   * Obtiene las credenciales administradas localmente
   */
  getLocalCredentials() {
    try {
      const stored = localStorage.getItem(ADMIN_CREDS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return {
      email: this.DEFAULT_USER,
      password: this.DEFAULT_PASS
    };
  },

  /**
   * Inicia sesión validando contra Supabase o almacenamiento local
   */
  async login(username, password) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Intento de autenticación contra Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('email, password_hash, role')
          .eq('email', cleanUser)
          .single();

        if (!error && data) {
          if (data.password_hash === cleanPass) {
            const session = {
              authenticated: true,
              user: data.email,
              role: data.role || 'admin',
              source: 'supabase',
              token: 'bcm_supa_' + Date.now(),
              expiresAt: Date.now() + 8 * 60 * 60 * 1000
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(session));
            return { success: true, session };
          } else {
            return { success: false, message: 'Contraseña incorrecta.' };
          }
        }
      } catch (supaErr) {
        console.warn('No se pudo autenticar en Supabase, recurriendo a credenciales locales:', supaErr);
      }
    }

    // 2. Validación local
    const localCreds = this.getLocalCredentials();
    const isDefault = (cleanUser === this.DEFAULT_USER || cleanUser === 'admin') && cleanPass === localCreds.password;
    const isCustom = cleanUser === localCreds.email.toLowerCase() && cleanPass === localCreds.password;

    if (isDefault || isCustom) {
      const session = {
        authenticated: true,
        user: localCreds.email,
        role: 'admin',
        source: 'local',
        token: 'bcm_token_' + Date.now(),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    return { success: false, message: 'Usuario o contraseña incorrectos.' };
  },

  /**
   * Cierra la sesión activa
   */
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  /**
   * Comprueba si el usuario tiene una sesión válida
   */
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
  },

  /**
   * Retorna la información del usuario autenticado actual
   */
  getCurrentUser() {
    try {
      const sessionStr = localStorage.getItem(AUTH_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.authenticated) {
          return {
            email: session.user || this.DEFAULT_USER,
            role: session.role || 'admin',
            source: session.source || 'local'
          };
        }
      }
    } catch (e) {}
    return {
      email: this.DEFAULT_USER,
      role: 'admin',
      source: 'local'
    };
  },

  /**
   * Permite al administrador cambiar su contraseña con validación de seguridad
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.isAuthenticated()) {
      return { success: false, message: 'Debes iniciar sesión para cambiar tu contraseña.' };
    }

    if (!currentPassword || !newPassword) {
      return { success: false, message: 'Ingresa la contraseña actual y la nueva contraseña.' };
    }

    if (newPassword.trim().length < 6) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };
    }

    const user = this.getCurrentUser();
    const cleanCurrent = currentPassword.trim();
    const cleanNew = newPassword.trim();

    // 1. Validar contra Supabase si está activo
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('password_hash')
          .eq('email', user.email)
          .single();

        if (!error && data) {
          if (data.password_hash !== cleanCurrent) {
            return { success: false, message: 'La contraseña actual no coincide.' };
          }

          const { error: updateErr } = await supabase
            .from('admin_users')
            .update({
              password_hash: cleanNew,
              updated_at: new Date().toISOString()
            })
            .eq('email', user.email);

          if (updateErr) {
            console.error('Error al actualizar contraseña en Supabase:', updateErr.message);
            return { success: false, message: 'Error en la base de datos de Supabase: ' + updateErr.message };
          }
        }
      } catch (err) {
        console.warn('Error conectando a Supabase para cambio de contraseña:', err);
      }
    } else {
      // Validar contra local
      const localCreds = this.getLocalCredentials();
      if (cleanCurrent !== localCreds.password) {
        return { success: false, message: 'La contraseña actual no coincide.' };
      }
    }

    // 2. Persistir siempre en el almacenamiento local para sincronización y modo offline
    try {
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({
        email: user.email,
        password: cleanNew,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {}

    return {
      success: true,
      message: '¡Contraseña actualizada exitosamente! Utiliza tu nueva clave para el próximo inicio de sesión.'
    };
  }
};

export const quotesRepo = new QuotesRepository();
export { getSupabaseConnectionStatus };
