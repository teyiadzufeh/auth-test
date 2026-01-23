import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { Pool } from 'pg';
import { UserModel } from '../models/User';
import { validateLogin, validateRegister } from '../middleware/validation';

export const createAuthRouter = (pool: Pool): Router => {
  const router = Router();
  const userModel = new UserModel(pool);
  const authController = new AuthController(userModel);

  router.post('/register', validateRegister, authController.register);
  router.post('/login', validateLogin, authController.login);
  router.post('/refresh', authController.refresh);
  router.get('/me', authenticate, authController.me);

  return router;
};