import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { getPostLoginDestination } from './lib/auth-utils'

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
    '/dashboard/Verifications':         '/user/credentials',
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
  let userId: string | null = null
  let username: string | null = null

  // Check for custom JWT cookie (auth_token)
  const customToken = request.cookies.get('auth_token')?.value
  console.log("[Middleware] Found auth_token:", !!customToken)
  if (customToken) {
    try {
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) throw new Error("JWT_SECRET is not defined in environment variables");
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(customToken, secret)
      console.log("[Middleware] Decoded payload:", payload)
      
      if (payload.exp && payload.exp * 1000 < Date.now()) {
         console.log("[Middleware] Token is expired");
         response.cookies.delete('auth_token');
      } else {
          if (payload && payload.roles && Array.isArray(payload.roles)) {
             // Normalize all roles to lowercase
             const normalizedRoles = (payload.roles as string[]).map(r => r.toLowerCase())
             role = normalizedRoles[0] as string
          } else if (payload && payload.role) {
             role = (payload.role as string).toLowerCase()
          }
          userId = (payload?.sub || payload?.id || payload?.user_id) as string | null
          username = (payload?.username || payload?.preferred_username || payload?.name) as string | null
          console.log("[Middleware] Extracted role:", role)
      }
    } catch (e) {
      console.error("Middleware JWT Decode Error:", e)
      response.cookies.delete('auth_token');
    }
  }

  // Intercept /user/profile requests
  if ((path === '/user/profile' || path === '/profile') && userId) {
      return NextResponse.redirect(new URL(`/in/${username || userId}`, request.url))
  }

  // Redirect /feeds to /feed
  if (path === '/feeds') {
      return NextResponse.redirect(new URL('/feed', request.url))
  }

  // Redirect root to role-specific dashboard if logged in
  if (path === '/' && role) {
      const normalizedRole = role.toLowerCase();
      const effectiveRole = normalizedRole === 'user' ? 'career_professional' : normalizedRole;
      const destination = getPostLoginDestination({ role: effectiveRole });
      return NextResponse.redirect(new URL(destination || '/feed', request.url))
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
    || path.startsWith('/in/')

  const isSuperAdminRoute = path.startsWith('/superadmin')
  const isAdminRoute = path.startsWith('/admin') || isSuperAdminRoute
  const isCompanyRoute = path.startsWith('/company')
  const isUserRoute = path.startsWith('/user')
  const isModerationRoute = path.startsWith('/moderation')
  const isMentorRoute = path.startsWith('/mentor')
  const isRecruiterRoute = path.startsWith('/recruiter')
  const isHRRoute = path.startsWith('/hr')
  const isFinanceRoute = path.startsWith('/finance')
  const isEmployeeRoute = path.startsWith('/employee')
  const isDeveloperRoute = path.startsWith('/developer')
  const isPartnerRoute = path.startsWith('/partner')

  if (isPublicRoute) return response

  // ─── AUTHENTICATION GUARD ─────────────────────────────────────────
  const isProtectedPath = isAdminRoute || isCompanyRoute || isUserRoute || isModerationRoute || isMentorRoute || isRecruiterRoute || isHRRoute || isFinanceRoute || isEmployeeRoute || isDeveloperRoute || isPartnerRoute || path.startsWith('/feed') || path.startsWith('/notifications') || path.startsWith('/assessments') || path.startsWith('/messages');

  if (!role && isProtectedPath) {
    console.log("[Middleware] Blocked route access. Path:", path, "Role:", role)
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('redirectedFrom', path)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    
    // Ensure we delete the cookie on the redirect response if it was marked for deletion
    if (customToken) {
      redirectResponse.cookies.delete('auth_token')
    }
    
    return redirectResponse
  }

  // ─── ROLE-BASED ACCESS CONTROL ────────────────────────────────────
  if (role) {
    const normalizedRole = role.toLowerCase()
    
    // Convert old `user` role to new `career_professional` for backward compatibility
    const effectiveRole = normalizedRole === 'user' ? 'career_professional' : normalizedRole;

    const destination = getPostLoginDestination({ role: effectiveRole });
    const fallbackDestination = destination || '/feed';

    const ADMIN_ROLES = ['super_admin', 'admin', 'security_admin', 'support_admin', 'ai_admin'];

    // Strict isolation within admin dashboards
    if (isAdminRoute) {
      if (!ADMIN_ROLES.includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
      }

      // If the user is trying to access /superadmin, they MUST be super_admin or a specific global admin
      if (path.startsWith('/superadmin')) {
        if (!['super_admin', 'security_admin', 'support_admin', 'ai_admin'].includes(effectiveRole)) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }

        if (path.startsWith('/superadmin/security') && !['super_admin', 'security_admin'].includes(effectiveRole)) {
          return NextResponse.redirect(new URL('/superadmin', request.url))
        }
        if (path.startsWith('/superadmin/support') && !['super_admin', 'support_admin'].includes(effectiveRole)) {
          return NextResponse.redirect(new URL('/superadmin', request.url))
        }
        if (path.startsWith('/superadmin/ai') && !['super_admin', 'ai_admin'].includes(effectiveRole)) {
          return NextResponse.redirect(new URL('/superadmin', request.url))
        }
      }
      
      // If the user is trying to access /admin, any ADMIN_ROLE is fine (including standard 'admin').
      // No further block is needed unless we want to lock out super_admin from /admin (we do not).
    }

    if (isModerationRoute && !['super_admin', 'admin', 'moderator'].includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isMentorRoute && effectiveRole !== 'mentor') {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isRecruiterRoute && effectiveRole !== 'recruiter' && !ADMIN_ROLES.includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isHRRoute && effectiveRole !== 'hr' && !ADMIN_ROLES.includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isFinanceRoute && effectiveRole !== 'finance' && !ADMIN_ROLES.includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isEmployeeRoute && effectiveRole !== 'employee' && !ADMIN_ROLES.includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isDeveloperRoute && effectiveRole !== 'developer' && !ADMIN_ROLES.includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isPartnerRoute && effectiveRole !== 'partner' && !ADMIN_ROLES.includes(effectiveRole)) {
        return NextResponse.redirect(new URL(fallbackDestination, request.url));
    }

    if (isCompanyRoute && effectiveRole !== 'company' && !ADMIN_ROLES.includes(effectiveRole)) {
      return NextResponse.redirect(new URL(fallbackDestination, request.url))
    }

    if (isUserRoute && effectiveRole !== 'career_professional' && !ADMIN_ROLES.includes(effectiveRole)) {
      return NextResponse.redirect(new URL(fallbackDestination, request.url))
    }

    if (path.startsWith('/auth') || path === '/auth/login' || path === '/auth/register') {
      return NextResponse.redirect(new URL(fallbackDestination, request.url))
    }
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
