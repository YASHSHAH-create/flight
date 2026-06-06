import { NextResponse } from 'next/server';

export async function GET() {
  const resourceMetadata = {
    resource: "https://paymm.in/api",
    authorization_servers: [
      "https://paymm.in"
    ],
    scopes_supported: [
      "read:flights",
      "write:bookings",
      "offline_access"
    ]
  };

  return new NextResponse(JSON.stringify(resourceMetadata), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
