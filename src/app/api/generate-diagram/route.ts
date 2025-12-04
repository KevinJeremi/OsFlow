import { NextResponse } from "next/server";

// Kolosal AI Configuration
// Using their native chat API that's reliable and no proxy restrictions
const KOLOSAL_API_KEY = process.env.KOLOSAL_API_KEY || "";
const KOLOSAL_BASE_URL = process.env.KOLOSAL_BASE_URL || "https://api.kolosal.ai";
const PRIMARY_MODEL = process.env.KOLOSAL_PRIMARY_MODEL || "llama-3-70b";
const FALLBACK_MODEL = process.env.KOLOSAL_FALLBACK_MODEL || "mistral-7b-instruct";

interface KolosalMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface KolosalResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Utility function to fix common D2 syntax errors
function fixD2Syntax(code: string): string {
  let fixed = code;

  // Fix sql_table field syntax: id { type: integer } -> id: integer
  // Only for inline field definitions, not block definitions
  fixed = fixed.replace(
    /(\w+)\s*\{\s*(?:type|dtype|data_type)?\s*:\s*([^}]+)\s*\}/g,
    '$1: $2'
  );

  // Fix constraint syntax: id: integer {constraint: primary_key} -> id: integer
  // Only remove constraint braces, keep field values
  fixed = fixed.replace(
    /(\w+:\s*[^{]+)\s*\{[^}]*constraint[^}]*\}/g,
    '$1'
  );

  // Fix incomplete blocks (e.g., "posts:" with no content)
  // Replace "name:" with "name: {}" if it's followed by another block
  fixed = fixed.replace(
    /^(\s*\w+:)\s*\n(?=\s*\w+:|\s*\w+\.)/gm,
    '$1 {}\n'
  );

  // Clean up any empty braces followed by content
  fixed = fixed.replace(
    /\{\s*\}\s*\n\s+(\w+:)/g,
    '{\n  $1'
  );

  return fixed;
}

export async function POST(req: Request) {
  try {
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

⚠️ IMPORTANT: sql_table FIELD SYNTAX
For sql_table, fields are SIMPLE KEY-VALUE pairs with colons, NOT nested blocks.
WRONG: id { type: integer }
CORRECT: id: integer

Full sql_table example:
users: {
  shape: sql_table
  id: integer
  username: varchar
  email: varchar
  created_at: timestamp
}

VALID D2 SYNTAX BY TYPE:

1️⃣ FOR SQL/ER DIAGRAMS:
users: {
  shape: sql_table
  id: integer
  name: varchar
  email: varchar
  created_at: timestamp
}

products: {
  shape: sql_table
  id: integer
  name: varchar
  price: decimal
}

users.id -> products.user_id

2️⃣ FOR FLOWCHARTS:
start: {shape: oval}
validate: {shape: diamond}
process: {shape: rectangle}
end: {shape: oval}

start -> validate
validate -> process
process -> end

3️⃣ FOR ARCHITECTURE:
frontend: {
  web: Web App
  mobile: Mobile App
}
backend: {
  api: API Server
  db: Database
}
frontend -> backend

4️⃣ FOR SEQUENCE:
actor1: Actor 1
actor2: Actor 2
actor1 -> actor2: Message
actor2 -> actor1: Response

REQUEST: "${prompt}"

Generate D2 code now (output ONLY the code, nothing else):`;

    const models = [PRIMARY_MODEL, FALLBACK_MODEL];
    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`[D2 Generator] Trying model: ${modelName}`);

        if (!KOLOSAL_API_KEY) {
          throw new Error("KOLOSAL_API_KEY environment variable is not set");
        }

        const messages: KolosalMessage[] = [
          {
            role: "system",
            content: "You are a D2 diagram code generator. Output ONLY valid D2 syntax. Never include explanations or markdown code blocks.",
          },
          {
            role: "user",
            content: systemPrompt,
          },
        ];

        const payload = {
          model: modelName,
          messages: messages,
          max_tokens: 2000,
          temperature: 0.3,
        };

        console.log(`[D2 Generator] Calling Kolosal API with payload:`, {
          model: modelName,
          messagesCount: messages.length,
          maxTokens: 2000,
        });

        const response = await fetch(`${KOLOSAL_BASE_URL}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${KOLOSAL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log(`[D2 Generator] Response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[D2 Generator] API Error (${response.status}):`, errorText);
          lastError = new Error(`API Error: ${response.status} - ${errorText.substring(0, 200)}`);
          continue;
        }

        const data = (await response.json()) as KolosalResponse;

        let text = data.choices?.[0]?.message?.content?.trim() || "";

        console.log(`[${modelName}] Raw response length: ${text.length}`);
        console.log(`[${modelName}] Raw response (first 500 chars): ${text.substring(0, 500)}`);

        if (!text) {
          lastError = new Error("Empty response from model");
          console.log(`[${modelName}] Empty response, trying next model...`);
          continue;
        }

        // Remove thinking tags if present
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

        // Check for refusal
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
          /direction:\s*(up|down|left|right)/i,
        ];

        const containsValidPattern = validD2Patterns.some((pattern) =>
          pattern.test(cleanedText)
        );

        if (!containsValidPattern) {
          lastError = new Error("No valid D2 pattern found");
          console.log(`[${modelName}] No valid D2 pattern found, trying next model...`);
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

        // Simple line-by-line processing - keep everything that looks like D2
        const lines = d2Code.split('\n');
        const cleanLines: string[] = [];
        let braceDepth = 0;
        let foundCode = false;

        for (const line of lines) {
          const trimmedLine = line.trim();

          // Count braces to track if we're inside a block
          braceDepth += (line.match(/\{/g) || []).length;
          braceDepth -= (line.match(/\}/g) || []).length;

          // Skip leading empty lines before first code
          if (!foundCode && !trimmedLine && braceDepth === 0) continue;

          // A line is valid D2 if:
          // 1. It's inside a block (braceDepth > 0)
          // 2. It starts a definition (contains : or -> or similar)
          // 3. It's a brace or comment
          const isD2Line =
            braceDepth > 0 || // Inside a block
            /^[\w\-_]+\s*:\s*.+/.test(trimmedLine) || // key: value
            /^[\w\-_]+\s*:(\s*\{)?/.test(trimmedLine) || // key: or key: {
            /^[\w\s\-_]+\s*->/.test(trimmedLine) || // connections
            /^[\w\s\-_]+\s*<-/.test(trimmedLine) ||
            /^[\w\s\-_]+\s*--/.test(trimmedLine) ||
            /^[\w\s\-_]+\s*<->/.test(trimmedLine) ||
            /^direction:/.test(trimmedLine) ||
            /^shape:/.test(trimmedLine) ||
            /^style\./.test(trimmedLine) ||
            /^classes:/.test(trimmedLine) ||
            /^vars:/.test(trimmedLine) ||
            /^#/.test(trimmedLine) ||
            /^[\{\}]/.test(trimmedLine) ||
            trimmedLine === '';

          if (isD2Line || foundCode) {
            foundCode = true;
            cleanLines.push(line);
          }
        }

        d2Code = cleanLines.join('\n').trim();

        // Fix unbalanced braces
        let openBraces = 0;
        let closeBraces = 0;
        for (const char of d2Code) {
          if (char === '{') openBraces++;
          if (char === '}') closeBraces++;
        }

        if (openBraces > closeBraces) {
          const missingBraces = openBraces - closeBraces;
          d2Code += '\n' + '}'.repeat(missingBraces);
        }

        // Fix common D2 syntax errors
        d2Code = fixD2Syntax(d2Code);

        console.log(`[${modelName}] Final D2 code length: ${d2Code.length}`);
        console.log(`[${modelName}] Final D2 code:\n${d2Code}`);
        console.log(`✓ Success with model: ${modelName}`);

        return NextResponse.json({ d2: d2Code }, { status: 200 });
      } catch (error) {
        console.warn(`[D2 Generator] Model ${modelName} failed:`, error);
        lastError = error;
        continue;
      }
    }

    console.error("[D2 Generator] All models failed. Last error:", lastError);
    return NextResponse.json(
      { error: "Unable to generate a valid diagram. Please provide more details about the process or system you want to visualize." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[D2 Generator] API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate diagram. Please try again." },
      { status: 500 }
    );
  }
}
