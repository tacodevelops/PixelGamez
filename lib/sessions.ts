import crypto from 'crypto';
import { prisma } from './prisma';

const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000; 

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(now + SESSION_MAX_AGE),
    }
  });

  return token;
}

export async function getSession(token: string) {
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token } });
  if (!session) return null;
  
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { token } });
    return null;
  }
  return session;
}

export async function deleteSession(token: string): Promise<void> {
  try {
    await prisma.session.delete({ where: { token } });
  } catch {
    
  }
}

export const SESSION_COOKIE_NAME = 'pgz_session';
export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE / 1000; 
