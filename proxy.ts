import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname === '/') {
    const acceptHeader = request.headers.get('accept') || '';
    const contentTypeHeader = request.headers.get('content-type') || '';
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    const isMarkdownHeader =
      acceptHeader.includes('text/markdown') ||
      acceptHeader.includes('text/x-markdown') ||
      contentTypeHeader.includes('text/markdown') ||
      contentTypeHeader.includes('text/x-markdown');

    const isBotOrCrawler =
      userAgent.includes('bot') ||
      userAgent.includes('crawler') ||
      userAgent.includes('spider') ||
      userAgent.includes('crawl') ||
      userAgent.includes('google-extended') ||
      userAgent.includes('openai');

    if (isMarkdownHeader || isBotOrCrawler) {
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
        console.error('Error fetching llms.txt in proxy:', error);
      }
    } else {
      // Standard browser request to homepage - add Link headers
      const response = NextResponse.next();
      response.headers.set(
        'Link',
        '</.well-known/api-catalog>; rel="api-catalog", </auth.md>; rel="auth.md", </.well-known/agent-skills/index.json>; rel="agent-skills", </.well-known/oauth-protected-resource>; rel="oauth-protected-resource"'
      );
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};


