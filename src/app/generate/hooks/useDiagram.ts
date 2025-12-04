"use client";

import { useState, useEffect, useCallback } from "react";
import { VALID_D2_PATTERNS } from "../constants";

// Helper function to scale SVG properly for sharp rendering
const getScaledSvg = (svgString: string, scale: number): string => {
    if (!svgString) return svgString;

    // Check if running on server (no DOMParser)
    if (typeof window === 'undefined') return svgString;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (!svgElement) return svgString;

    // Get original dimensions - try multiple sources
    let originalWidth = parseFloat(svgElement.getAttribute("width") || "0");
    let originalHeight = parseFloat(svgElement.getAttribute("height") || "0");

    // If no width/height, try to get from viewBox
    const viewBox = svgElement.getAttribute("viewBox");
    if ((!originalWidth || !originalHeight) && viewBox) {
        const parts = viewBox.split(/\s+/);
        if (parts.length >= 4) {
            originalWidth = originalWidth || parseFloat(parts[2]);
            originalHeight = originalHeight || parseFloat(parts[3]);
        }
    }

    // If still no dimensions, use defaults
    if (!originalWidth) originalWidth = 800;
    if (!originalHeight) originalHeight = 600;

    // Ensure viewBox exists
    if (!viewBox) {
        svgElement.setAttribute("viewBox", `0 0 ${originalWidth} ${originalHeight}`);
    }

    // Scale dimensions
    const scaleFactor = scale / 100;
    const newWidth = originalWidth * scaleFactor;
    const newHeight = originalHeight * scaleFactor;

    // Only set dimensions if they're valid
    if (newWidth > 0 && newHeight > 0) {
        svgElement.setAttribute("width", `${newWidth}`);
        svgElement.setAttribute("height", `${newHeight}`);
    }

    // Ensure crisp rendering
    svgElement.style.shapeRendering = "geometricPrecision";
    svgElement.style.textRendering = "geometricPrecision";

    return svgElement.outerHTML;
};

export interface SvgDimensions {
    width: number;
    height: number;
}

interface UseDiagramReturn {
    diagramCode: string;
    setDiagramCode: (code: string) => void;
    renderedSvg: string;
    baseSvg: string;
    svgDimensions: SvgDimensions;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    isRendering: boolean;
    handleDownload: () => void;
    reRender: () => void;
}

export const useDiagram = (zoom: number, sketchMode: boolean = false): UseDiagramReturn => {
    const [diagramCode, setDiagramCodeInternal] = useState<string>("");
    const [renderedSvg, setRenderedSvg] = useState<string>("");
    const [baseSvg, setBaseSvg] = useState<string>("");
    const [svgDimensions, setSvgDimensions] = useState<SvgDimensions>({ width: 0, height: 0 });
    const [error, setError] = useState<string>("");
    const [isRendering, setIsRendering] = useState<boolean>(false);

    // Track render trigger to force re-render when sketchMode changes
    const [renderTrigger, setRenderTrigger] = useState(0);

    // Wrapper to set diagram code AND immediately set isRendering to true
    const setDiagramCode = useCallback((code: string) => {
        if (code.trim()) {
            setIsRendering(true);
        }
        setDiagramCodeInternal(code);
    }, []);

    // Function to force re-render with current code (used when sketchMode changes)
    const reRender = useCallback(() => {
        if (diagramCode.trim()) {
            setIsRendering(true);
            setRenderTrigger(prev => prev + 1);
        }
    }, [diagramCode]);

    // Render diagram when code changes - using server-side API
    useEffect(() => {
        let isMounted = true;

        const renderDiagram = async () => {
            if (!diagramCode.trim()) {
                console.log("[useDiagram] No diagram code to render");
                return;
            }

            console.log("[useDiagram] Rendering D2 code:", diagramCode.substring(0, 100));
            console.log("[useDiagram] Full D2 code:", diagramCode);

            try {
                // Clean the code
                let cleanedCode = diagramCode
                    .replace(/[""]/g, '"')
                    .replace(/['']/g, "'")
                    .replace(/—/g, "--")
                    .replace(/–/g, "-")
                    .trim();

                console.log("[useDiagram] Cleaned code:", cleanedCode.substring(0, 200));

                // Validate basic D2 structure
                const isValidStart = VALID_D2_PATTERNS.some((pattern) => {
                    const matches = pattern.test(cleanedCode);
                    console.log(`[useDiagram] Pattern ${pattern} matches: ${matches}`);
                    return matches;
                });

                console.log("[useDiagram] Is valid D2:", isValidStart);

                if (!isValidStart) {
                    console.error("Invalid D2 code start:", cleanedCode.substring(0, 100));
                    if (isMounted) {
                        setError("Invalid diagram format received. Please try generating again.");
                        setIsRendering(false);
                    }
                    return;
                }

                console.log("[useDiagram] Calling render API...");

                // Call the server-side render API with sketch mode parameter
                const response = await fetch("/api/render-diagram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ d2Code: cleanedCode, sketchMode }), // Use parameter from props
                });

                const data = await response.json();

                if (!isMounted) return;

                if (!response.ok) {
                    throw new Error(data.error || "Failed to render diagram");
                }

                const svg = data.svg;

                console.log("[useDiagram] Render successful, SVG length:", svg?.length);
                console.log("[useDiagram] SVG preview:", svg?.substring(0, 300));

                if (!svg || svg.length === 0) {
                    throw new Error("Empty SVG received from render API");
                }

                // Extract SVG dimensions from the outer SVG
                const parser = new DOMParser();
                const doc = parser.parseFromString(svg, "image/svg+xml");

                // Check for parsing errors - but still try to use the SVG
                const parseError = doc.querySelector("parsererror");
                if (parseError) {
                    console.warn("[useDiagram] SVG parse warning (will still try to render):", parseError.textContent);
                }

                const svgEl = doc.querySelector("svg");
                console.log("[useDiagram] Found SVG element:", !!svgEl);

                // Even if parsing had issues, try to extract dimensions
                let w = 800, h = 600;
                if (svgEl) {
                    w = parseFloat(svgEl.getAttribute("width") || "0") || 800;
                    h = parseFloat(svgEl.getAttribute("height") || "0") || 600;
                    const viewBox = svgEl.getAttribute("viewBox");
                    console.log("[useDiagram] SVG dimensions - width:", w, "height:", h, "viewBox:", viewBox);

                    if (viewBox) {
                        const parts = viewBox.split(/[\s,]+/);
                        if (parts.length >= 4) {
                            w = parseFloat(parts[2]) || w;
                            h = parseFloat(parts[3]) || h;
                        }
                    }
                }

                setSvgDimensions({ width: w, height: h });
                console.log("[useDiagram] Final dimensions:", { width: w, height: h });

                console.log("[useDiagram] Setting baseSvg and renderedSvg...");
                setBaseSvg(svg);
                setRenderedSvg(svg);
                setError("");
                setIsRendering(false);
                console.log("[useDiagram] Done! SVG should be visible now.");
            } catch (err: unknown) {
                console.error("D2 render error:", err);
                console.error("D2 code that failed:", diagramCode);

                if (!isMounted) return;

                const errorMessage = err instanceof Error ? err.message : "Unknown error";

                if (errorMessage.includes("syntax") || errorMessage.includes("parse")) {
                    setError(`Diagram syntax error: ${errorMessage}. Please try rephrasing your request.`);
                } else {
                    setError(`Failed to render diagram: ${errorMessage}`);
                }
                setIsRendering(false);
            }
        };

        renderDiagram();

        return () => {
            isMounted = false;
        };
    }, [diagramCode, sketchMode, renderTrigger]);

    // Download handler
    const handleDownload = useCallback(() => {
        if (!baseSvg) return;
        const blob = new Blob([baseSvg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "diagram.svg";
        link.click();
        URL.revokeObjectURL(url);
    }, [baseSvg]);

    // Apply sketch text post-processing
    const sketchTextProcessing = useCallback((svgHtml: string) => {
        if (!svgHtml || !sketchMode) return svgHtml;

        console.log("[useDiagram] Applying sketch text post-processing...");

        // Parse SVG and apply sketch styling to text elements
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgHtml, "image/svg+xml");

        // Apply sketch styling to all text elements
        const textElements = doc.querySelectorAll('text');
        textElements.forEach(textEl => {
            // Add appropriate font family for SQL data (normal text, headers, constraint)
            if (textEl.textContent?.includes('PK') || textEl.textContent?.includes('FK') || textEl.textContent?.includes('UNQ')) {
                textEl.style.fontFamily = `"Times New Roman", serif !important`;
            } else if (textEl.textContent?.includes('?') || textEl.textContent?.includes('!')) {
                textEl.style.fontFamily = `"Courier New", monospace !important`;
            } else {
                textEl.style.fontFamily = `"Comic Sans MS", sans-serif !important`;
            }

            // Add slight rotation for handwritten irregularity
            const randomRotation = (Math.random() - 0.5) * 0.2;
            const opacity = 0.8 + (Math.random() * 0.1);
            textEl.style.transform = `rotate(${randomRotation}deg)`;
            textEl.style.opacity = `${opacity}`;

            // Add text shadow for depth
            textEl.style.filter = 'drop-shadow(0.5px 0.5px 0px rgba(0, 0, 0.05))';
            textEl.style.letterSpacing = '0.05em';

            // Random font size variations for table data
            const fontSize = parseInt(textEl.getAttribute('font-size') || '12');
            if (fontSize > 9) {
                const randomSize = Math.max(8, Math.floor(fontSize * 1.1));
                textEl.style.fontSize = `${randomSize}px`;
            }
        });

        return doc.documentElement.outerHTML;
    }, [sketchMode]);

    return {
        diagramCode,
        setDiagramCode,
        renderedSvg,
        baseSvg,
        svgDimensions,
        error,
        setError,
        isRendering,
        handleDownload,
        reRender,
    };
};

export default useDiagram;
