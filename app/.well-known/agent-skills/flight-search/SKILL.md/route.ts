import { NextResponse } from 'next/server';

export async function GET() {
  const markdown = `# Flight Search Skill

This skill allows agents to search for flights on Paymm.

## Usage

Agents can search flights by calling the endpoint:
\`GET /api/search\`

Parameters:
- \`from\`: Origin airport code (e.g. DEL)
- \`to\`: Destination airport code (e.g. BOM)
- \`date\`: Departure date in DDMMYYYY format
- \`class\`: Cabin class (e, pe, b, f)
`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
