import jwt from 'jsonwebtoken';
import ms from 'ms';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET!, 
    {
      expiresIn: process.env.JWT_EXPIRES_IN as ms.StringValue || '7d',
    }
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as ms.StringValue || '30d',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  return jwt.verify(bearerToken, process.env.JWT_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  return jwt.verify(bearerToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
};