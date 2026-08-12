import { NextResponse } from 'next/server';

export async function GET() {
  const oauthConfig = {
    issuer: "https://www.paymm.in",
    authorization_endpoint: "https://www.paymm.in/oauth/authorize",
    token_endpoint: "https://www.paymm.in/oauth/token",
    jwks_uri: "https://www.paymm.in/.well-known/jwks.json",
    response_types_supported: ["code", "token"],
    grant_types_supported: ["authorization_code", "client_credentials"],
    agent_auth: {
      skill: "https://www.paymm.in/auth.md",
      register_uri: "https://www.paymm.in/api/agent/register",
      claim_uri: "https://www.paymm.in/api/agent/claim",
      revocation_uri: "https://www.paymm.in/api/agent/revoke",
      identity_types_supported: ["id-jag", "email_otp"],
      credential_types_supported: ["jwt"]
    }
  };

  return new NextResponse(JSON.stringify(oauthConfig), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
