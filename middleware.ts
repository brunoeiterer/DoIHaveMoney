import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy";
import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
    const response = handleI18nRouting(request);
    return await updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}