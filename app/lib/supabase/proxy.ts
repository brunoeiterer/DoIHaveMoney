import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  )

  const url = request.nextUrl.clone();
  const pathnameParts = url.pathname.split('/');

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (!user && pathnameParts[2] === 'dashboard') {
    const locale = pathnameParts[1];
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  return response;
}