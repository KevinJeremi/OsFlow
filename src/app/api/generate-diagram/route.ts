import { NextResponse } from "next/server";
import OpenAI from "openai";

// Algion API Configuration (Free OpenAI-compatible API)
// Documentation: https://algion.dev/
const ALGION_API_KEY = "free";
const ALGION_BASE_URL = "https://api.algion.dev/v1";
const PRIMARY_MODEL = "claude-opus-4.5";
const FALLBACK_MODEL = "gemini-2.5-pro";

export async function POST(req: Request) {
  try {
    // Initialize Algion API client (free, no API key validation needed)
    const client = new OpenAI({
      apiKey: ALGION_API_KEY,
      baseURL: ALGION_BASE_URL,
    });

    const body = await req.json();
    const { prompt, diagramType = "auto" } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt terlalu panjang (maksimal 2000 karakter)" },
        { status: 400 }
      );
    }

    const diagramTypeInstructions: Record<string, string> = {
      auto: "Choose the most appropriate diagram type based on the request.",
      flowchart: "Generate a flowchart/process flow diagram. Use shapes like oval for start/end, diamond for decisions, rectangle for processes.",
      sequence: "Generate a sequence diagram. Start with 'shape: sequence_diagram' and define actors and their interactions.",
      class: "Generate a class-style diagram showing relationships between components using classes block for styling.",
      er: "Generate an ER/database diagram using 'shape: sql_table' for tables. IMPORTANT: Use SHORT field names (max 10 chars) and SHORT type names. Example: 'id: int' not 'user_id: integer'. Use abbreviations like 'ts' for timestamp, 'vc' for varchar, 'fk' for foreign_key, 'pk' for primary_key.",
      architecture: "Generate a system architecture diagram showing servers, databases, users, and their connections. Use containers for grouping.",
      network: "Generate a network topology diagram showing network components, their connections and data flow.",
    };

    const typeInstruction = diagramTypeInstructions[diagramType] || diagramTypeInstructions.auto;

    const systemPrompt = `You are a D2 Diagram Generator. Generate ONLY valid D2 diagram code.

DIAGRAM TYPE INSTRUCTION: ${typeInstruction}

CRITICAL RULES:
1. Output ONLY raw D2 code - NO explanations, NO thinking, NO markdown
2. Start DIRECTLY with D2 code
3. Do NOT wrap code in markdown code blocks (no \`\`\`)
4. Do NOT explain anything
5. Use valid D2 syntax only

D2 SYNTAX FOR SQL/ER DIAGRAMS:
IMPORTANT: For sql_table, add styling for visibility and size:
- style.fill: header background color (use "#4A90D9" for blue)
- style.font-color: header text color (use "#FFFFFF" for white)
- style.font-size: use 18 or larger for readability
- Use full type names (varchar, integer, timestamp) for wider columns

users: {
  shape: sql_table
  style.fill: "#4A90D9"
  style.font-color: "#FFFFFF"
  style.font-size: 18
  id: integer {constraint: primary_key}
  username: varchar(100)
  email: varchar(255) {constraint: unique}
  password_hash: varchar(255)
  first_name: varchar(100)
  last_name: varchar(100)
  phone: varchar(20)
  created_at: timestamp
  updated_at: timestamp
}

addresses: {
  shape: sql_table
  style.fill: "#4A90D9"
  style.font-color: "#FFFFFF"
  style.font-size: 18
  id: integer {constraint: primary_key}
  user_id: integer {constraint: foreign_key}
  street: varchar(255)
  city: varchar(100)
  state: varchar(100)
  postal_code: varchar(20)
  country: varchar(100)
  is_default: boolean
}

orders: {
  shape: sql_table
  style.fill: "#4A90D9"
  style.font-color: "#FFFFFF"
  style.font-size: 18
  id: integer {constraint: primary_key}
  user_id: integer {constraint: foreign_key}
  shipping_address_id: integer {constraint: foreign_key}
  status: varchar(50)
  total_amount: decimal(10,2)
  created_at: timestamp
}

products: {
  shape: sql_table
  style.fill: "#4A90D9"
  style.font-color: "#FFFFFF"
  style.font-size: 18
  id: integer {constraint: primary_key}
  category_id: integer {constraint: foreign_key}
  name: varchar(255)
  description: text
  price: decimal(10,2)
  stock_qty: integer
  sku: varchar(50) {constraint: unique}
  created_at: timestamp
}

order_items: {
  shape: sql_table
  style.fill: "#4A90D9"
  style.font-color: "#FFFFFF"
  style.font-size: 18
  id: integer {constraint: primary_key}
  order_id: integer {constraint: foreign_key}
  product_id: integer {constraint: foreign_key}
  quantity: integer
  unit_price: decimal(10,2)
}

users.id -> orders.user_id
users.id -> addresses.user_id
addresses.id -> orders.shipping_address_id
orders.id -> order_items.order_id
products.id -> order_items.product_id

OTHER D2 SYNTAX:

## Basic Shapes
shape_name: Label {shape: oval}
a -> b: connection label

## Nested Containers
server: {
  api: API
  db: DB {shape: cylinder}
}

## Direction
direction: right

REQUEST: "${prompt}"

Generate D2 code now (no explanations):`;

    const models = [PRIMARY_MODEL, FALLBACK_MODEL];
    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);

        const response = await client.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: "system",
              content: "You are a D2 diagram code generator. Output ONLY valid D2 syntax. Never include explanations or markdown code blocks.",
            },
            {
              role: "user",
              content: systemPrompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.3,
        });

        let text = response.choices[0]?.message?.content?.trim() || "";

        console.log(`[${modelName}] Raw response length: ${text.length}`);
        console.log(`[${modelName}] Raw response (first 500 chars): ${text.substring(0, 500)}`);

        if (!text) {
          lastError = new Error("Empty response from model");
          console.log(`[${modelName}] Empty response, trying next model...`);
          continue;
        }

        if (text.includes("</think>")) {
          const afterThink = text.split("</think>").pop()?.trim() || "";
          if (afterThink) {
            text = afterThink;
          }
        }

        if (text.includes("<think>") && !text.includes("</think>")) {
          lastError = new Error("Incomplete thinking response");
          continue;
        }

        if (
          text.includes("INVALID_REQUEST_TYPE") ||
          text.toLowerCase().includes("i cannot") ||
          text.toLowerCase().includes("i can only")
        ) {
          return NextResponse.json(
            {
              error: "I can only generate diagrams. Please describe a process, system, flow, or architecture that needs visualization.",
            },
            { status: 400 }
          );
        }

        let cleanedText = text
          .replace(/```d2\s*/gi, "")
          .replace(/```\s*/g, "")
          .replace(/^\s+/, "")
          .trim();

        if (cleanedText.includes("<think>")) {
          const parts = cleanedText.split("<think>");
          cleanedText = parts[parts.length - 1].replace(/<\/think>/gi, "").trim();
        }

        const validD2Patterns = [
          /[\w\s]+:/,
          /[\w\s]+\s*->/,
          /[\w\s]+\s*<-/,
          /[\w\s]+\s*<->/,
          /[\w\s]+\s*--/,
          /shape:\s*\w+/i,
          /direction:\s*\w+/i,
        ];

        const containsValidPattern = validD2Patterns.some((pattern) =>
          pattern.test(cleanedText)
        );

        if (!containsValidPattern) {
          lastError = new Error("No valid D2 pattern found");
          continue;
        }

        let d2Code = cleanedText
          .replace(/[""]/g, '"')
          .replace(/['']/g, "'")
          .replace(/—/g, "--")
          .replace(/–/g, "-")
          .replace(/\r\n/g, "\n")
          .replace(/\t/g, "  ")
          .replace(/\n{3,}/g, "\n\n");

        const lines = d2Code.split('\n');
        const cleanLines: string[] = [];
        let foundCode = false;

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!foundCode && !trimmedLine) continue;

          const isD2Line =
            /^[\w\s\-_]+:/.test(trimmedLine) ||
            /^[\w\s\-_]+\s*->/.test(trimmedLine) ||
            /^[\w\s\-_]+\s*<-/.test(trimmedLine) ||
            /^[\w\s\-_]+\s*--/.test(trimmedLine) ||
            /^direction:/.test(trimmedLine) ||
            /^shape:/.test(trimmedLine) ||
            /^style\./.test(trimmedLine) ||
            /^classes:/.test(trimmedLine) ||
            /^vars:/.test(trimmedLine) ||
            /^#/.test(trimmedLine) ||
            /^\}/.test(trimmedLine) ||
            /^\{/.test(trimmedLine) ||
            trimmedLine === '' ||
            /^\s+[\w\s\-_]+/.test(line);

          if (isD2Line || foundCode) {
            foundCode = true;
            cleanLines.push(line);
          }
        }

        d2Code = cleanLines.join('\n').trim();

        // Fix unbalanced braces - count opening and closing braces
        let openBraces = 0;
        let closeBraces = 0;
        for (const char of d2Code) {
          if (char === '{') openBraces++;
          if (char === '}') closeBraces++;
        }

        // Add missing closing braces if needed
        if (openBraces > closeBraces) {
          const missingBraces = openBraces - closeBraces;
          d2Code += '\n' + '}'.repeat(missingBraces);
        }

        console.log(`[${modelName}] Final D2 code length: ${d2Code.length}`);
        console.log(`[${modelName}] Final D2 code:\n${d2Code}`);
        console.log(`Success with model: ${modelName}`);
        return NextResponse.json({ d2: d2Code }, { status: 200 });
      } catch (error) {
        console.warn(`Model ${modelName} failed:`, error);
        lastError = error;
        continue;
      }
    }

    console.error("All models failed. Last error:", lastError);
    return NextResponse.json(
      { error: "Unable to generate a valid diagram. Please provide more details about the process or system you want to visualize." },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate diagram. Please try again." },
      { status: 500 }
    );
  }
}
