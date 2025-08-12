import { cookies } from 'next/headers'
import { verifyToken } from './jwt'
import { prisma } from './prisma'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      hostelName: true,
      roomNumber: true,
      laundryNumber: true
    }
  })

  return user
})
