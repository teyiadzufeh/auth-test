import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

// Configuration
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param plainPassword - The plain text password
 * @returns Hashed password
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain password with a hashed password
 * @param plainPassword - The plain text password
 * @param hashedPassword - The hashed password from database
 * @returns True if passwords match
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a secure random token (for password reset, email verification, etc.)
 * @param length - Length of the token in bytes (default: 32)
 * @returns Hex string token
 */
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a token for database storage (so tokens aren't stored in plain text)
 * @param token - The plain token
 * @returns SHA256 hash of the token
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and error message if invalid
 */
export const validatePasswordStrength = (
  password: string
): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  // Optional: Check for special characters
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }

  return { valid: true };
};

/**
 * Check if password has been compromised (basic check against common passwords)
 * In production, consider using HaveIBeenPwned API
 * @param password - Password to check
 * @returns True if password is compromised
 */
export const isCommonPassword = (password: string): boolean => {
  const commonPasswords = [
    'password',
    '12345678',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
  ];

  return commonPasswords.includes(password.toLowerCase());
};