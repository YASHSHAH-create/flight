import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('ngrok-skip-browser-warning', 'true');

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        '/api/:path*',
        '/auth/:path*',
        '/flights/:path*',
    ],
};
