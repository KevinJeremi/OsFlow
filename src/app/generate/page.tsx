"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Sidebar, Toolbar, DiagramViewer } from "./components";
import { useCanvas, useDiagram } from "./hooks";
import { DiagramType } from "./types";

export default function Generate() {
  // Prompt state
  const [prompt, setPrompt] = useState("");

  // Diagram type state
  const [diagramType, setDiagramType] = useState<DiagramType>("auto");

  // Sketch mode state
  const [sketchMode, setSketchMode] = useState(true);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Local isGenerating state for immediate UI feedback
  const [isGenerating, setIsGenerating] = useState(false);

  // Canvas hook - handles zoom, pan, and interactions
  const {
    zoom,
    setZoom,
    pan,
    setPan,
    isDragging,
    viewportRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetView,
    fitToView,
    getConstrainedPan,
  } = useCanvas();

  // Diagram hook - handles D2 rendering
  const {
    setDiagramCode,
    renderedSvg,
    baseSvg,
    svgDimensions,
    error,
    setError,
    isRendering,
    handleDownload,
    reRender,
  } = useDiagram(zoom, sketchMode);

  // Combined loading state (API call + mermaid rendering)
  const showLoading = isGenerating || isRendering;

  // Auto-fit diagram when new diagram is rendered
  useEffect(() => {
    if (svgDimensions.width > 0 && svgDimensions.height > 0 && !isRendering && baseSvg) {
      // Small delay to ensure SVG is fully rendered
      const timer = setTimeout(() => {
        fitToView(svgDimensions.width, svgDimensions.height);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [svgDimensions, isRendering, baseSvg, fitToView]);

  // Handle fit to view button
  const handleFitToView = useCallback(() => {
    if (svgDimensions.width > 0 && svgDimensions.height > 0) {
      fitToView(svgDimensions.width, svgDimensions.height);
    }
  }, [svgDimensions, fitToView]);

  // Generate diagram handler
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    console.log("[Generate] Starting generation for prompt:", prompt.substring(0, 50));
    setIsGenerating(true);
    setError("");

    try {
      console.log("[Generate] Calling API...");
      const res = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, diagramType }),
      });
      const data = await res.json();
      console.log("[Generate] API response:", { ok: res.ok, hasD2: !!data.d2, error: data.error });

      if (!res.ok) throw new Error(data.error || "Generation failed");

      const cleanCode = data.d2
        .replace(/```d2/gi, "")
        .replace(/```/g, "")
        .trim();

      console.log("[Generate] Clean D2 code:", cleanCode.substring(0, 100));
      setDiagramCode(cleanCode);

      // Reset view when new diagram is generated
      resetView();
    } catch (err: any) {
      console.error("[Generate] Error:", err);
      setError(err.message);
    } finally {
      console.log("[Generate] Finished, setting isGenerating to false");
      setIsGenerating(false);
    }
  };

  // Toolbar zoom handler with pan constraint
  const handleToolbarZoom = useCallback((z: React.SetStateAction<number>) => {
    if (typeof z === "function") {
      setZoom((prev) => {
        const newZ = z(prev);
        setPan((p) => getConstrainedPan(p, newZ));
        return newZ;
      });
    } else {
      setZoom(z);
      setPan((p) => getConstrainedPan(p, z));
    }
  }, [setZoom, setPan, getConstrainedPan]);

  // Sketch mode toggle handler - re-render diagram with new mode
  const handleSketchModeToggle = useCallback(() => {
    setSketchMode(prev => {
      // Schedule reRender after state update
      setTimeout(() => {
        reRender();
      }, 50);
      return !prev;
    });
  }, [reRender]);

  return (
    <div className="flex h-screen bg-gray-50 text-black font-sans overflow-hidden">
      <Sidebar
        prompt={prompt}
        setPrompt={setPrompt}
        diagramType={diagramType}
        setDiagramType={setDiagramType}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 relative flex flex-col">
        <DiagramViewer
          renderedSvg={renderedSvg}
          baseSvg={baseSvg}
          isGenerating={showLoading}
          error={error}
          zoom={zoom}
          pan={pan}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onDownload={handleDownload}
          onSidebarOpen={() => setIsSidebarOpen(true)}
          viewportRef={viewportRef}
          sketchMode={sketchMode}
        />

        <Toolbar
          zoom={zoom}
          setZoom={handleToolbarZoom}
          onReset={resetView}
          onFit={handleFitToView}
          hasDiagram={!!baseSvg}
          sketchMode={sketchMode}
          onSketchModeToggle={handleSketchModeToggle}
        />
      </div>
    </div>
  );
}