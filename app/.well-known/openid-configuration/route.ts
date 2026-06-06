import { NextResponse } from 'next/server';

export async function GET() {
  const oidcConfig = {
    issuer: "https://paymm.in",
    authorization_endpoint: "https://paymm.in/oauth/authorize",
    token_endpoint: "https://paymm.in/oauth/token",
    jwks_uri: "https://paymm.in/.well-known/jwks.json",
    response_types_supported: ["code", "token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    grant_types_supported: ["authorization_code", "client_credentials"]
  };

  return new NextResponse(JSON.stringify(oidcConfig), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
