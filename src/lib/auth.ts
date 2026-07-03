import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devprofile-secret-key-change-in-production';

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request): { userId: string; email: string } | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.slice(7));
}