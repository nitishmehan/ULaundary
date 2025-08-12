import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-this-in-production') {
  console.warn('WARNING: Using default JWT_SECRET. Please set a secure secret in production!')
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET || 'fallback-secret', { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET || 'fallback-secret')
  } catch (error) {
    return null
  }
}

export function verifyTokenSync(token) {
  try {
    return jwt.verify(token, JWT_SECRET || 'fallback-secret')
  } catch (error) {
    return null
  }
}
