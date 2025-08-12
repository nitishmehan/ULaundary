import { NextResponse } from 'next/server'
import { verifyToken } from './lib/jwt'

export async function proxy(request) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // No token - allow public routes, redirect protected routes to login
  if (!token) {
    if (!isPublicRoute && pathname !== '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Has token - verify it
  const decoded = verifyToken(token)
  
  if (!decoded) {
    // Invalid token - clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  const { userId, role } = decoded

  // Define dashboard routes
  const dashboards = {
    STUDENT: `/student/${userId}`,
    LAUNDRY_STAFF: `/staff/${userId}`,
    DELIVERY_PERSON: `/delivery/${userId}`,
    ADMIN: '/admin'
  }

  const userDashboard = dashboards[role]

  // Redirect from root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }

  // Redirect from public routes to dashboard
  if (isPublicRoute) {
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }

  // Check if accessing correct role routes
  if (role === 'STUDENT' && !pathname.startsWith(`/student/${userId}`)) {
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }
  if (role === 'LAUNDRY_STAFF' && !pathname.startsWith(`/staff/${userId}`)) {
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }
  if (role === 'DELIVERY_PERSON' && !pathname.startsWith(`/delivery/${userId}`)) {
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }
  if (role === 'ADMIN' && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL(userDashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
