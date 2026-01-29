// Validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validar monto
export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'El monto debe ser un número válido' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'El monto debe ser mayor a 0' };
  }
  
  if (numAmount > 1000000) {
    return { isValid: false, error: 'El monto es demasiado grande' };
  }

  return { isValid: true };
};

// Validar fecha
export const validateDate = (date) => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Fecha inválida' };
  }
  
  const now = new Date();
  if (dateObj > now) {
    return { isValid: false, error: 'La fecha no puede ser futura' };
  }
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 5);
  if (dateObj < oneYearAgo) {
    return { isValid: false, error: 'La fecha es demasiado antigua' };
  }

  return { isValid: true };
};

// Validar nombre de usuario
export const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  
  if (username.length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (username.length > 50) {
    return { isValid: false, error: 'El nombre es demasiado largo' };
  }

  return { isValid: true };
};

// Validar categoría
export const validateCategory = (categoryId, categories) => {
  if (!categoryId) {
    return { isValid: false, error: 'Debes seleccionar una categoría' };
  }
  
  const exists = categories.some(cat => cat.id === categoryId);
  if (!exists) {
    return { isValid: false, error: 'Categoría inválida' };
  }

  return { isValid: true };
};

// Sanitizar texto
export const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};