import { NextResponse } from 'next/server';

export async function GET() {
  const index = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "flight-search",
        type: "skill-md",
        description: "Enables agents to search and book flights on Paymm.",
        url: "/.well-known/agent-skills/flight-search/SKILL.md",
        digest: "sha256:4b494ce8b9a2a904fa27ae41e4649b934ca495991b7852b855e3b0c44298fc1c"
      }
    ]
  };

  return new NextResponse(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
