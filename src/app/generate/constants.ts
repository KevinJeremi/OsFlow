// Configuration constants for the Generate page
import { DiagramTypeOption } from "./types";

export const CANVAS_SIZE = 4000;
export const VIEWPORT_PADDING = 100;

// Zoom configuration
export const ZOOM_MIN = 20;
export const ZOOM_MAX = 300;
export const ZOOM_STEP = 10;
export const ZOOM_SCROLL_SENSITIVITY = 0.15; // How sensitive scroll-to-zoom is (lower = smoother)

// Mock history data
export const MOCK_HISTORY = [
    { id: 1, text: "auth_flow_v2_final", time: "10:42 AM", type: "flow" },
    { id: 2, text: "aws_infrastructure_prod", time: "09:15 AM", type: "map" },
    { id: 3, text: "user_retention_loop", time: "Yesterday", type: "loop" },
];

// D2 Configuration
export const D2_CONFIG = {
    layout: 'elk' as const,        // 'dagre' or 'elk' - elk provides better layouts
    themeID: 0,                    // Default neutral theme
    darkThemeID: 200,              // Dark mode theme
    sketch: false,                 // Sketch/hand-drawn mode
    pad: 50,                       // Padding around diagram
    center: true,                  // Center the SVG
};

// D2 Available Themes
export const D2_THEMES = {
    neutral: 0,
    neutralGrey: 1,
    flagshipTerrastruct: 3,
    coolClassics: 4,
    mixedBerryBlue: 5,
    grapeSoda: 6,
    aubergine: 7,
    colorblind: 8,
    vanillaNitroCola: 100,
    orangeCreamsicle: 101,
    shirleyTemple: 102,
    earthTones: 103,
    everglade: 104,
    buttered: 105,
    terminal: 300,                 // Special theme with uppercase labels, monospace font
    terminalGrayscale: 301,
    origami: 302,
};

// Valid D2 diagram patterns for validation
export const VALID_D2_PATTERNS = [
    /[\w\-_]+\s*:/,                // Shape declaration: "name:" or "name: label"
    /[\w\-_]+\s*->/,               // Connection: "a -> b"
    /[\w\-_]+\s*<-/,               // Connection: "a <- b"
    /[\w\-_]+\s*<->/,              // Connection: "a <-> b"
    /[\w\-_]+\s*--/,               // Connection: "a -- b"
    /shape:\s*sequence_diagram/i,  // Sequence diagram
    /shape:\s*sql_table/i,         // SQL/ER table
    /direction:\s*(up|down|left|right)/i, // Direction declaration
    /\{[\s\S]*shape:/i,            // Nested shape definition
    /^\w+:/m,                      // Simple shape declaration
];

// Diagram type options for selector
export const DIAGRAM_TYPES: DiagramTypeOption[] = [
    { id: "auto", label: "Auto", description: "Otomatis pilih tipe" },
    { id: "flowchart", label: "Flowchart", description: "Diagram alur proses" },
    { id: "sequence", label: "Sequence", description: "Diagram urutan" },
    { id: "class", label: "Class", description: "Diagram kelas OOP" },
    { id: "er", label: "ER/SQL", description: "Database relations" },
    { id: "architecture", label: "Architecture", description: "System architecture" },
    { id: "network", label: "Network", description: "Network topology" },
];
