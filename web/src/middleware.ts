import { NextResponse, type NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const path = request.nextUrl.pathname

  // ─── LEGACY REDIRECT MAP ───────────────────────────────────────────
  const legacyRedirects: Record<string, string> = {
    '/dashboard':              '/user/dashboard',
    '/dashboard/edit':         '/user/profile',
    '/dashboard/jobs':         '/user/dashboard',
    '/dashboard/skills':       '/user/skills',
    '/dashboard/portfolio':    '/user/dashboard',
    '/dashboard/reputation':   '/user/dashboard',
    '/dashboard/nfts':         '/user/credentials',
    '/dashboard/nft':          '/user/credentials',
    '/dashboard/insights':     '/user/insights',
    '/dashboard/career':       '/user/dashboard',
    '/dashboard/interview':    '/user/dashboard',
    '/dashboard/community':    '/user/dashboard',
    '/dashboard/settings':     '/user/settings',
    '/dashboard/resume':       '/user/profile',
    '/dashboard/enhancer':     '/user/dashboard',
    '/dashboard/assessments':  '/user/dashboard',
    '/dashboard/activity':     '/user/dashboard',
    '/dashboard/saved':        '/user/saved',
    '/applications':           '/user/applications',
    '/settings':               '/user/settings',
    '/profile':                '/user/profile',
  }

  if (legacyRedirects[path]) {
    return NextResponse.redirect(new URL(legacyRedirects[path], request.url))
  }

  if (path.startsWith('/dashboard/') && !legacyRedirects[path]) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url))
  }

  // ─── ROLE DETECTION ────────────────────────────────────────────────
  let role: string | null = null

  // Check for custom JWT cookie (auth_token)
  const customToken = request.cookies.get('auth_token')?.value
  if (customToken) {
    try {
      const payload = decodeJwt(customToken) as any
      if (payload && payload.roles && Array.isArray(payload.roles)) {
         role = payload.roles[0]
      } else if (payload && payload.role) {
         role = payload.role
      }
    } catch (e) {
      console.error("Middleware JWT Decode Error:", e)
    }
  }

  // ─── ROUTE CLASSIFICATION ─────────────────────────────────────────
  const isPublicRoute = path === '/' 
    || path.startsWith('/login') 
    || path.startsWith('/signup') 
    || path.startsWith('/auth')
    || (path.startsWith('/jobs') && !path.startsWith('/jobs/create'))
    || path.startsWith('/talent')
    || path.startsWith('/about')
    || path.startsWith('/pricing')
    || path.startsWith('/terms')
    || path.startsWith('/privacy')
    || path.startsWith('/support')
    || path.startsWith('/verify')
    || path.startsWith('/career-advice')
    || path.startsWith('/salary')
    || path.startsWith('/bounties')
    || path.startsWith('/companies')
    || path.startsWith('/search')
    || path.startsWith('/u/')

  const isAdminRoute = path.startsWith('/admin')
  const isCompanyRoute = path.startsWith('/company')
  const isUserRoute = path.startsWith('/user')

  if (isPublicRoute) return response

  // ─── AUTHENTICATION GUARD ─────────────────────────────────────────
  if (!role && (isAdminRoute || isCompanyRoute || isUserRoute)) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', path)
    return NextResponse.redirect(redirectUrl)
  }

  // ─── ROLE-BASED ACCESS CONTROL ────────────────────────────────────
  if (role) {
    const normalizedRole = role.toLowerCase()

    // Bypassing strict redirects for local testing and dual administration capabilities
    /*
    if (isAdminRoute && normalizedRole !== 'admin') {
      return NextResponse.redirect(new URL(
        normalizedRole === 'company' ? '/company/dashboard' : '/user/dashboard', 
        request.url
      ))
    }

    if (isCompanyRoute && normalizedRole !== 'company' && normalizedRole !== 'admin') {
      return NextResponse.redirect(new URL(
        normalizedRole === 'admin' ? '/admin' : '/user/dashboard', 
        request.url
      ))
    }

    if (isUserRoute) {
      if (normalizedRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      if (normalizedRole === 'company') {
        return NextResponse.redirect(new URL('/company/dashboard', request.url))
      }
    }

    if (path.startsWith('/auth') || path === '/login' || path === '/signup') {
      if (normalizedRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
      if (normalizedRole === 'company') return NextResponse.redirect(new URL('/company/dashboard', request.url))
      return NextResponse.redirect(new URL('/user/dashboard', request.url))
    }
    */
  }

  return response
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
