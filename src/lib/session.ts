import { SignJWT, jwtVerify } from 'jose';
import { serialize, parse } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from './db';

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error('SESSION_SECRET is not set');

const key = new TextEncoder().encode(secret);

type SessionPayload = {
  userId: number;
  expiresAt: number; // timestamp in ms
};

// Create the JWT token
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

// Verify and decode the JWT
export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch(error) {
    console.log("failed to verify session");
    return null;
  }
}

// Set the cookie in the response
type  UserRow={
  user_id:number;
}
export async function createSession(res: NextApiResponse, email: string) {
  const result = await query('SELECT user_id FROM users WHERE email = ?', [email]);

  const rows = result as unknown as UserRow[];

const userId = rows[0]?.user_id;
  if (!userId) throw new Error("User not found");

  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const token = await encrypt({ userId, expiresAt });

  const cookie = serialize('session', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });

  const isLoggedIn = serialize('loggedIn', 'true', {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  res.setHeader('Set-Cookie', [cookie, isLoggedIn]);
}


// Delete the cookie
export function deleteSession(res: NextApiResponse) {
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });
  const isLoggedIn =serialize('loggedIn', 'false', {
        httpOnly: false,
        path: '/',
        maxAge: 0,
      }) 

  res.setHeader('Set-Cookie', [cookie, isLoggedIn]);
}

// Retrieve and verify the session from the request
export async function getSession(req: NextApiRequest): Promise<SessionPayload | null> {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.session;

  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload || typeof payload.expiresAt !== 'number') return null;

  if (Date.now() > payload.expiresAt) return null;

  return payload;
}
