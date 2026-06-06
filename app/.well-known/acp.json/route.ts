import { NextResponse } from 'next/server';

export async function GET() {
  const acpDiscovery = {
    protocol: {
      name: "acp",
      version: "1.0.0"
    },
    api_base_url: "https://paymm.in/api",
    supported_transports: ["rest"],
    capabilities: {
      services: [
        "checkout",
        "cart",
        "product-feed"
      ]
    }
  };

  return new NextResponse(JSON.stringify(acpDiscovery), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
