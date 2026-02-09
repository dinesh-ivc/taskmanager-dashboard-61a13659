import bcrypt from 'bcryptjs';

// Hash a password
export const hashPassword = async (password) => {
  const saltRounds = 12;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

// Compare a password with its hash
export const comparePassword = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};

// Validate password strength (at least 6 characters)
export const validatePassword = (password) => {
  // Basic password validation
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password must not exceed 128 characters' };
  }

  // Additional complexity requirements
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasLowercase || !hasUppercase || !hasNumbers) {
    return { 
      isValid: false, 
      error: 'Password must contain lowercase letters, uppercase letters, and numbers' 
    };
  }

  return { isValid: true };
};

// Generate a random password (for testing purposes or password reset)
export const generateRandomPassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};