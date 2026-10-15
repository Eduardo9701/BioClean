/**
 * validation.js
 * Validaciones robustas de datos en el cliente para el cotizador y formularios.
 */

export const Validation = {
  /**
   * Valida correo electrónico con formato estándar
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(email.trim());
  },

  /**
   * Valida número telefónico de México (10 dígitos numéricos)
   * Acepta formatos con espacios, guiones o paréntesis y valida que contenga exactamente 10 dígitos.
   */
  isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  },

  /**
   * Limpia y formatea un teléfono a 10 dígitos puros
   */
  cleanPhone(phone) {
    if (!phone) return '';
    return phone.replace(/\D/g, '').slice(0, 10);
  },

  /**
   * Valida que un texto no esté vacío y cumpla con una longitud mínima
   */
  isNonEmpty(str, minLength = 2) {
    if (!str || typeof str !== 'string') return false;
    return str.trim().length >= minLength;
  },

  /**
   * Valida metros cuadrados (número positivo mayor que cero)
   */
  isValidSquareMeters(val) {
    const num = Number(val);
    return !isNaN(num) && num > 0 && num <= 500000;
  },

  /**
   * Saneamiento básico para prevenir inyección XSS
   */
  sanitizeText(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Valida el paso 1 del cotizador (Datos del solicitante)
   */
  validateStep1(data) {
    const errors = {};

    if (!this.isNonEmpty(data.fullName, 3)) {
      errors.fullName = 'Ingresa el nombre completo del solicitante (mínimo 3 caracteres).';
    }

    if (!this.isValidEmail(data.email)) {
      errors.email = 'Ingresa un correo electrónico válido (ejemplo: contacto@empresa.com).';
    }

    if (!this.isValidPhone(data.phone)) {
      errors.phone = 'Ingresa un teléfono o celular válido de 10 dígitos numéricos.';
    }

    if (!data.preferredContact) {
      errors.preferredContact = 'Selecciona tu medio preferido de contacto.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Valida el paso 2 del cotizador (Información del inmueble)
   */
  validateStep2(data) {
    const errors = {};

    if (!data.propertyType) {
      errors.propertyType = 'Selecciona el tipo de inmueble.';
    }

    if (!this.isNonEmpty(data.cityZone, 3)) {
      errors.cityZone = 'Indica la ciudad, alcaldía, municipio o zona donde se ubica el inmueble.';
    }

    if (!this.isValidSquareMeters(data.squareMeters)) {
      errors.squareMeters = 'Indica la superficie aproximada en m² (debe ser un número mayor a 0).';
    }

    if (!this.isNonEmpty(data.description, 10)) {
      errors.description = 'Describe brevemente las necesidades o características del servicio (mínimo 10 caracteres).';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Valida el paso 3 del cotizador (Detalles del servicio)
   */
  validateStep3(data) {
    const errors = {};

    if (!data.serviceCategory) {
      errors.serviceCategory = 'Selecciona la categoría principal de servicio.';
    }

    if (!data.modality) {
      errors.modality = 'Selecciona la modalidad de contratación.';
    }

    if (!data.frequency) {
      errors.frequency = 'Selecciona la frecuencia deseada.';
    }

    if (!data.supplies) {
      errors.supplies = 'Selecciona la condición de insumos y maquinaria.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
