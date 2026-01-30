import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  constructor(
    private readonly userModel: UserModel,
    private readonly refreshTokenModel: RefreshTokenModel
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      const user = await this.userModel.create({ email, password, name });

      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      // Store refresh token in database
      await this.refreshTokenModel.create(user.id, refreshToken);

      res.status(201).json({
        user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await this.userModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isValid = await this.userModel.verifyPassword(password, user.password);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      // Store refresh token in database
      await this.refreshTokenModel.create(user.id, refreshToken);

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token required' });
        return;
      }

      // Verify token exists in database and is not revoked
      const tokenData = await this.refreshTokenModel.verify(refreshToken);
      if (!tokenData) {
        res.status(401).json({ error: 'Invalid or revoked refresh token' });
        return;
      }

      // Verify JWT signature
      const decoded = verifyRefreshToken(refreshToken);

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
      });

      res.json({ accessToken });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  };

  logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Revoke the refresh token
        await this.refreshTokenModel.revoke(refreshToken);
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  };

  logoutAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;

      // Revoke all refresh tokens for this user
      await this.refreshTokenModel.revokeAllForUser(userId);

      res.json({ message: 'Logged out from all devices' });
    } catch (error) {
      console.error('Logout all error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  };

  me = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.userModel.findById(req.user!.userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}