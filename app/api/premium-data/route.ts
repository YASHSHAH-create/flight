import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const paymentRequiredDetail = {
    amount: "10000", // in micro-units
    currency: "USDC",
    network: "solana",
    destination: "C1aw2J3uB45FQD3eDummyWalletAddress",
    facilitator: "https://x402.org/facilitator"
  };

  return new NextResponse(
    JSON.stringify({ error: "Payment Required to access premium flight insights." }),
    {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'Payment-Required': Buffer.from(JSON.stringify(paymentRequiredDetail)).toString('base64'),
      },
    }
  );
}
