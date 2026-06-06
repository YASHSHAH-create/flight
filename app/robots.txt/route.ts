export async function GET() {
  const robotsTxt = `User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: https://paymm.in/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
