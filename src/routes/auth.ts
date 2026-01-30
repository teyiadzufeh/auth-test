import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { UserModel } from '../models/User';
import { validateLogin, validateRegister } from '../middleware/validation';
import { RefreshTokenModel } from '../models/RefreshToken';

export const createAuthRouter = (): Router => {
  const router = Router();
  const userModel = new UserModel();
  const refreshTokenModel = new RefreshTokenModel();
  const authController = new AuthController(userModel, refreshTokenModel);

  router.post('/register', validateRegister, authController.register);
  router.post('/login', validateLogin, authController.login);
  router.post('/refresh', authController.refresh);
  router.get('/me', authenticate, authController.me);
  router.post('/logout', authenticate, authController.logout);
  router.post('/logout-all', authenticate, authController.logoutAll);

  return router;
};