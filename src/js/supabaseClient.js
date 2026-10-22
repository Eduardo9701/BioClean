/**
 * supabaseClient.js
 * Cliente y conector oficial para Supabase.
 * Proporciona detección automática de configuración y métodos seguros con fallback.
 * Compatible tanto con Vite (navegador) como con Node.js (entorno de pruebas).
 */

import { createClient } from '@supabase/supabase-js';

// Acceso seguro a variables de entorno para Vite (import.meta.env) y Node.js (process.env)
const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {});

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY 
  || env.VITE_SUPABASE_PUBLISHABLE_KEY 
  || env.SUPABASE_PUBLISHABLE_KEY 
  || env.SUPABASE_ANON_KEY 
  || '';

/**
 * Determina si las variables de entorno de Supabase están configuradas con valores reales
 */
export function isSupabaseConfigured() {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('tu-proyecto') || supabaseAnonKey.includes('tu-clave')) return false;
  return supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;
}

/**
 * Instancia del cliente de Supabase
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Estado legible de la conexión para mostrar en el panel administrativo
 */
export function getSupabaseConnectionStatus() {
  if (isSupabaseConfigured()) {
    return {
      connected: true,
      mode: 'supabase',
      label: 'Supabase Cloud (Activo)',
      url: supabaseUrl
    };
  }
  return {
    connected: false,
    mode: 'local',
    label: 'Almacenamiento Local (Standby)',
    url: null
  };
}
