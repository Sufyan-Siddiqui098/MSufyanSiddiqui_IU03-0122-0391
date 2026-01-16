// Password validation: at least 1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 chars
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must include at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  if (strength <= 2) return { label: 'Weak', color: 'bg-red-500' };
  if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500' };
  if (strength <= 4) return { label: 'Strong', color: 'bg-green-500' };
  return { label: 'Very Strong', color: 'bg-green-600' };
};
