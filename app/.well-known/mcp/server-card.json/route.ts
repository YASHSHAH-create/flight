import { NextResponse } from 'next/server';

export async function GET() {
  const mcpCard = {
    mcpVersion: "2025-11-25",
    serverInfo: {
      name: "paymm-mcp-server",
      version: "1.0.0"
    },
    transport: {
      type: "streamable-http",
      endpoint: "https://paymm.in/api/mcp"
    },
    capabilities: {
      tools: {
        "search_flights": {
          "description": "Search for flights by origin, destination, and date."
        }
      },
      resources: {},
      prompts: {}
    }
  };

  return new NextResponse(JSON.stringify(mcpCard), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
