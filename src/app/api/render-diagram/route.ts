import { NextResponse } from "next/server";

// D2 rendering using Kroki.io service
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { d2Code, sketchMode = true } = body;

    if (!d2Code || typeof d2Code !== "string") {
      return NextResponse.json(
        { error: "Invalid D2 code provided" },
        { status: 400 }
      );
    }

    // Detect if this is an ER/SQL diagram
    const isSqlDiagram = d2Code.includes('sql_table') || d2Code.includes('shape: sql_table');

    // Use dagre for SQL tables (better spacing), elk for others
    const layoutEngine = isSqlDiagram ? 'dagre' : 'elk';

    // Add D2 configuration for better rendering
    // Theme 1 = Neutral default, better contrast
    // Theme 3 = Vanilla Nitro Cola - good for SQL tables
    // Theme 4 = Grape soda - good contrast for tables
    // Theme 300 = Terminal theme (good for sketch)
    const themeId = isSqlDiagram ? 4 : 1;

    // Use larger padding for better visibility
    const d2Config = `vars: {
  d2-config: {
    layout-engine: ${layoutEngine}
    theme-id: ${themeId}
    pad: 100
    center: true
  }
}

`;

    // Prepend config if not already present
    let finalCode = d2Code;
    if (!finalCode.includes('d2-config')) {
      finalCode = d2Config + finalCode;
    }

    console.log("[render-diagram] isSqlDiagram:", isSqlDiagram);
    console.log("[render-diagram] layoutEngine:", layoutEngine);
    console.log("[render-diagram] Final D2 code to render:", finalCode.substring(0, 500));

    // For SQL diagrams, add direction if not present for better layout
    if (isSqlDiagram && !finalCode.includes('direction:')) {
      // Add direction after the vars block
      finalCode = finalCode.replace(
        /\n\n(?!vars:)/,
        '\n\ndirection: right\n\n'
      );
    }

    // For SQL diagrams, ensure tables have proper styling for header visibility
    // Add default styling if not present
    if (isSqlDiagram) {
      // Add classes for consistent sql_table styling if not already defined
      if (!finalCode.includes('classes:') && !finalCode.includes('style.font-color')) {
        const sqlTableStyle = `
classes: {
  sql_table_style: {
    style.fill: "#4A90D9"
    style.font-color: "#FFFFFF"
    style.stroke: "#2E5A8E"
    style.font-size: 24
  }
}

`;
        // Insert after vars block
        finalCode = finalCode.replace(
          /(vars:\s*\{[^}]*\}\s*\}\s*\n\n)/,
          `$1${sqlTableStyle}`
        );

        // Apply class to all sql_table shapes that don't have explicit styling
        // Add larger font-size for headers and better styling
        finalCode = finalCode.replace(
          /(\w+):\s*\{\s*\n\s*shape:\s*sql_table(?!\s*\n\s*style\.)/g,
          (match, tableName) => {
            return `${tableName}: {\n  shape: sql_table\n  style.fill: "#4A90D9"\n  style.font-color: "#FFFFFF"\n  style.font-size: 24`;
          }
        );
      }
    }

    // Use Kroki.io POST API to render D2 to SVG (normal or sketch mode)
    const apiUrl = sketchMode ? "https://kroki.io/d2/svg?sketch" : "https://kroki.io/d2/svg";
    const renderResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: finalCode,
    });

    console.log("[render-diagram] Sketch mode:", sketchMode);
    console.log("[render-diagram] API URL:", apiUrl);

    const svg = await renderResponse.text();

    console.log("[render-diagram] Kroki response status:", renderResponse.status);
    console.log("[render-diagram] SVG length:", svg.length);
    console.log("[render-diagram] SVG preview:", svg.substring(0, 300));

    // Check if Kroki returned an error SVG (contains "Error" in the SVG)
    if (svg.includes('Error 400') || svg.includes('Error 500') || svg.includes('fill="#ff3860"')) {
      // Extract error message from SVG if possible
      const errorMatch = svg.match(/<tspan[^>]*>([^<]+)<\/tspan>/);
      const errorMsg = errorMatch ? errorMatch[1] : "Failed to render diagram";
      console.error("Kroki D2 render error:", errorMsg);
      return NextResponse.json(
        { error: `Diagram syntax error: ${errorMsg}` },
        { status: 400 }
      );
    }

    if (!renderResponse.ok) {
      console.error("Kroki D2 render error:", svg);
      return NextResponse.json(
        { error: "Failed to render diagram. Please check your diagram syntax." },
        { status: 400 }
      );
    }

    // Post-process SVG for better rendering and larger size
    let processedSvg = svg;

    // Parse SVG to get dimensions and scale appropriately
    const widthMatch = svg.match(/width="(\d+)"/);
    const heightMatch = svg.match(/height="(\d+)"/);
    const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);

    let originalWidth = widthMatch ? parseInt(widthMatch[1]) : 800;
    let originalHeight = heightMatch ? parseInt(heightMatch[1]) : 600;

    // Scale factor to make diagram larger for better text readability (2.5x instead of 2x)
    const scaleFactor = 2.5;
    const newWidth = Math.round(originalWidth * scaleFactor);
    const newHeight = Math.round(originalHeight * scaleFactor);

    // Update width and height attributes to make SVG larger
    processedSvg = processedSvg
      .replace(/width="(\d+)"/, `width="${newWidth}"`)
      .replace(/height="(\d+)"/, `height="${newHeight}"`);

    // Increase all font sizes for better readability (especially for sketch mode text clarity)
    processedSvg = processedSvg
      // Increase font sizes in style attributes - more aggressive for sketch text clarity
      .replace(/font-size:\s*(\d+(?:\.\d+)?)(px)?/g, (match, size, unit) => {
        const sizeNum = parseFloat(size);
        // For text elements, use 2.5x multiplier for much better visibility
        const newSize = sizeNum < 16 ? Math.max(sizeNum * 2.5, 20) : Math.max(sizeNum * 2.0, 24);
        return `font-size: ${Math.round(newSize)}${unit || 'px'}`;
      })
      // Increase font-size attributes
      .replace(/font-size="(\d+(?:\.\d+)?)"/g, (match, size) => {
        const sizeNum = parseFloat(size);
        // For text elements, use 2.5x multiplier for much better visibility
        const newSize = sizeNum < 16 ? Math.max(sizeNum * 2.5, 20) : Math.max(sizeNum * 2.0, 24);
        return `font-size="${Math.round(newSize)}"`;
      })
      // Make stroke widths thicker for sketch effect
      .replace(/stroke-width:\s*(\d+(?:\.\d+)?)/g, (match, width) => {
        const newWidth = Math.max(parseFloat(width) * 1.5, 1.5);
        return `stroke-width: ${newWidth.toFixed(1)}`;
      })
      .replace(/stroke-width="(\d+(?:\.\d+)?)"/g, (match, width) => {
        const newWidth = Math.max(parseFloat(width) * 1.5, 1.5);
        return `stroke-width="${newWidth.toFixed(1)}"`;
      });

    // For SQL diagrams, additional scaling
    if (isSqlDiagram) {
      processedSvg = processedSvg
        // Make text positions have more spacing
        .replace(/(<text[^>]*y=")([^"]+)(")/g, (match, prefix, yVal, suffix) => {
          const newY = parseFloat(yVal) + 2;
          return `${prefix}${newY}${suffix}`;
        });
    }

    return NextResponse.json({ svg: processedSvg }, { status: 200 });
  } catch (error) {
    console.error("Render API Error:", error);
    return NextResponse.json(
      { error: "Failed to render diagram. Please try again." },
      { status: 500 }
    );
  }
}
