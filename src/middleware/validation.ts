import { Request, Response, NextFunction } from 'express';

export interface ValidationError {
  field: string;
  message: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }
  if (!/[A-Z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
  }
  if (!/[a-z]/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
  }
  if (!/\d/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one number' });
  }

  return errors;
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
const errors: ValidationError[] = [];

try {
    const { email, password, name } = req.body;

    // Validate email
    if (!email) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (typeof email !== 'string') {
        errors.push({ field: 'email', message: 'Email must be a string' });
    } else if (!validateEmail(email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }

    // Validate password
    if (!password) {
        errors.push({ field: 'password', message: 'Password is required' });
    } else if (typeof password !== 'string') {
        errors.push({ field: 'password', message: 'Password must be a string' });
    } else {
        errors.push(...validatePassword(password));
    }

    // Validate name
    if (!name) {
        errors.push({ field: 'name', message: 'Name is required' });
    } else if (typeof name !== 'string') {
        errors.push({ field: 'name', message: 'Name must be a string' });
    } else if (name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    }

    if (errors.length > 0) {
        res.status(400).json({
            error: 'Validation failed',
            details: errors,
        });
        return;
    }
} catch (error) {
    console.log('Validation error:', error);
    res.status(500).json({
        error: 'Validation error',
        details: 'An unexpected error occurred',
    });
    return;
}

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: ValidationError[] = [];
  const { email, password } = req.body;

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (typeof email !== 'string') {
    errors.push({ field: 'email', message: 'Email must be a string' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password must be a string' });
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  next();
};