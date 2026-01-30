import prisma from '../config/database';
import crypto from 'node:crypto';

export class RefreshTokenModel {
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async create(userId: string, token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRES_IN?.slice(0,2) || 30) * 24 * 60 * 60 * 1000); // Deafult to 30 days

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async verify(token: string): Promise<{ userId: string } | null> {
    const tokenHash = this.hashToken(token);

    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
        revoked: false,
      },
      select: {
        userId: true,
        revoked: true,
      },
    });

    if (!refreshToken) {
      return null;
    }

    // Detect token reuse
    if (refreshToken.revoked) {
      await this.revokeAllForUser(refreshToken.userId);
      throw new Error('Token reuse detected - all sessions revoked');
    }

    return { userId: refreshToken.userId };
  }

  async revoke(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }

  async cleanup(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true },
        ],
      },
    });
  }
}