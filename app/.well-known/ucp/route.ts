import { NextResponse } from 'next/server';

export async function GET() {
  const ucpProfile = {
    ucp: {
      version: "2026-04-08",
      services: {
        "dev.ucp.shopping": [
          {
            "version": "2026-04-08",
            "spec": "https://ucp.dev/specification/overview",
            "transport": "rest",
            "endpoint": "https://paymm.in/api/ucp"
          }
        ]
      },
      capabilities: [
        {
          "name": "dev.ucp.shopping.checkout",
          "version": "2026-04-08",
          "spec": "https://ucp.dev/specs/shopping/checkout",
          "schema": "https://ucp.dev/schemas/shopping/checkout.json"
        }
      ]
    }
  };

  return new NextResponse(JSON.stringify(ucpProfile), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
