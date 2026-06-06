import { NextResponse } from 'next/server';

export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: "https://paymm.in/api",
        "service-desc": [
          {
            "href": "https://paymm.in/openapi.json",
            "type": "application/json"
          }
        ],
        "service-doc": [
          {
            "href": "https://paymm.in/auth.md",
            "type": "text/markdown"
          }
        ],
        "status": [
          {
            "href": "https://paymm.in/api/status",
            "type": "application/json"
          }
        ]
      }
    ]
  };

  return new NextResponse(JSON.stringify(catalog), {
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
    },
  });
}
