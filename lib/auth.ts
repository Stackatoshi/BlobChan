import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')

export interface JWTPayload {
  walletAddress: string
  iat: number
  exp: number
}

export async function createJWT(walletAddress: string): Promise<string> {
  return await new SignJWT({ walletAddress })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret)
  return payload as JWTPayload
}

export async function getJWTFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get('auth-token')?.value
  if (!token) return null
  
  try {
    return await verifyJWT(token)
  } catch {
    return null
  }
}

export async function getJWTFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  
  try {
    return await verifyJWT(token)
  } catch {
    return null
  }
}

export async function setJWTCookie(walletAddress: string) {
  const token = await createJWT(walletAddress)
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function clearJWTCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}
