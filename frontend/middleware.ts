import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname;

    const isPublicPath =
        path === "/login" ||
        path === "/signup"

    const hart = request.cookies.get("hart")?.value || '';

    if (isPublicPath && hart) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!isPublicPath && !hart) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
    ],
}