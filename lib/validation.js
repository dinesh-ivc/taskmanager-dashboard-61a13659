// Email validation regex
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password must not exceed 128 characters' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one digit
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true, error: null };
};

// Task title validation
export const validateTaskTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Task title is required' };
  }

  if (title.length > 255) {
    return { isValid: false, error: 'Task title must not exceed 255 characters' };
  }

  return { isValid: true, error: null };
};

// Task description validation
export const validateTaskDescription = (description) => {
  if (description && description.length > 1000) {
    return { isValid: false, error: 'Task description must not exceed 1000 characters' };
  }

  return { isValid: true, error: null };
};

// Generic validation helper
export const validateRequired = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
};

// Validate UUID
export const validateUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};