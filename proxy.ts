import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname === '/') {
    const acceptHeader = request.headers.get('accept') || '';
    const contentTypeHeader = request.headers.get('content-type') || '';

    if (
      acceptHeader.includes('text/markdown') ||
      acceptHeader.includes('text/x-markdown') ||
      contentTypeHeader.includes('text/markdown') ||
      contentTypeHeader.includes('text/x-markdown')
    ) {
      try {
        // Fetch public/llms.txt using the incoming request's base URL
        const response = await fetch(new URL('/llms.txt', request.url));
        if (response.ok) {
          const text = await response.text();
          return new NextResponse(text, {
            status: 200,
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching llms.txt in middleware:', error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
