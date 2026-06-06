"use client";

import { useEffect } from "react";

export default function AgentCapabilities() {
  useEffect(() => {
    const registerWebMCP = async () => {
      const toolDefinitions = [
        {
          name: "search_flights",
          description: "Search for cheap flight tickets on Paymm.",
          inputSchema: {
            type: "object",
            properties: {
              from: { type: "string", description: "Origin airport code (e.g. DEL)" },
              to: { type: "string", description: "Destination airport code (e.g. BOM)" },
              date: { type: "string", description: "Departure date in DDMMYYYY format" },
              class: { type: "string", enum: ["e", "pe", "b", "f"], description: "Cabin class: e (Economy), pe (Premium Economy), b (Business), f (First Class)" }
            },
            required: ["from", "to", "date"]
          },
          execute: async (args: any) => {
            try {
              const res = await fetch(`/api/search?from=${args.from}&to=${args.to}&date=${args.date}&class=${args.class || 'e'}`);
              const data = await res.json();
              return { content: [{ type: "text", text: JSON.stringify(data) }] };
            } catch (err: any) {
              return { content: [{ type: "text", text: `Error: ${err.message}` }] };
            }
          }
        }
      ];

      // 1. Support legacy/batch pattern: navigator.modelContext.provideContext
      const navContext = (navigator as any).modelContext;
      if (navContext && typeof navContext.provideContext === "function") {
        try {
          await navContext.provideContext({ tools: toolDefinitions });
          console.log("WebMCP tools registered via provideContext");
        } catch (e) {
          console.error("Failed to register tools via provideContext:", e);
        }
      }

      // 2. Support newer pattern: document.modelContext.registerTool
      const docContext = (document as any).modelContext;
      if (docContext && typeof docContext.registerTool === "function") {
        for (const tool of toolDefinitions) {
          try {
            await docContext.registerTool(tool);
            console.log(`WebMCP tool ${tool.name} registered via registerTool`);
          } catch (e) {
            console.error(`Failed to register tool ${tool.name} via registerTool:`, e);
          }
        }
      }
    };

    registerWebMCP();
  }, []);

  return null;
}
