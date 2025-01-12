import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Auth error in middleware:', error)
    }

    // Handle admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Allow access to login page
      if (req.nextUrl.pathname === '/admin/login') {
        // If already logged in, redirect to admin dashboard
        if (session) {
          const redirectUrl = new URL('/admin', req.url)
          return NextResponse.redirect(redirectUrl)
        }
        // Allow access to login page if not logged in
        return res
      }

      // Protect all other admin routes
      if (!session) {
        const redirectUrl = new URL('/admin/login', req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }

    return res
  } catch (e) {
    console.error('Middleware error:', e)
    // On error, redirect to login
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const redirectUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }
}

// Update matcher to only handle admin routes
export const config = {
  matcher: ['/admin/:path*'],
} 