export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /payment/
Disallow: /profile/
Disallow: /search
Disallow: /book
Disallow: /bookings
Disallow: /hotels/search
Disallow: /hotels/checkout
Disallow: /flights/search
Disallow: /flights/fare-quote
Disallow: /flights/fare-rule
Disallow: /flights/book
Disallow: /flights/ticket
Disallow: /flights/ssr
Disallow: /test-seo
Disallow: /auth/

Sitemap: https://paymm.in/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
