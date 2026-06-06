import { NextResponse } from 'next/server';

export async function GET() {
  const jwks = {
    keys: [
      {
        kty: "OKP",
        crv: "Ed25519",
        x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHNy8",
        kid: "key1",
        use: "sig",
        alg: "EdDSA"
      }
    ]
  };

  return new NextResponse(JSON.stringify(jwks), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
