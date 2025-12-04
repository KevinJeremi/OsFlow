"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    Menu,
    Move,
    LayoutTemplate,
} from "lucide-react";
import { CANVAS_SIZE } from "../constants";
import { Point } from "../types";

interface DiagramViewerProps {
    renderedSvg: string;
    baseSvg: string;
    isGenerating: boolean;
    error: string;
    zoom: number;
    pan: Point;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onWheel: (e: React.WheelEvent) => void;
    onDownload: () => void;
    onSidebarOpen: () => void;
    viewportRef: React.RefObject<HTMLDivElement | null>;
    sketchMode?: boolean;
}

export const DiagramViewer = ({
    renderedSvg,
    baseSvg,
    isGenerating,
    error,
    zoom,
    pan,
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    onDownload,
    onSidebarOpen,
    viewportRef,
    sketchMode = true,
}: DiagramViewerProps) => {
    // Debug log
    console.log("[DiagramViewer] Props:", {
        hasRenderedSvg: !!renderedSvg,
        renderedSvgLength: renderedSvg?.length || 0,
        hasBaseSvg: !!baseSvg,
        isGenerating,
        error,
        sketchMode,
    });

    return (
        <div
            ref={viewportRef}
            className="flex-1 relative overflow-hidden bg-[#F8F9FA]"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
        >
            {/* Mobile Header Toggle */}
            <div className="absolute top-6 left-6 z-20 md:hidden">
                <button
                    onClick={onSidebarOpen}
                    className="p-2.5 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-700 hover:text-black transition-all active:scale-95"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Workspace Canvas with Grid - Contains the diagram */}
            <div
                className={`absolute left-1/2 top-1/2 bg-white border-2 border-gray-300 ${isDragging ? "cursor-grabbing transition-none" : "cursor-grab transition-transform duration-100 ease-out"}`}
                style={{
                    width: CANVAS_SIZE,
                    height: CANVAS_SIZE,
                    transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                    transformOrigin: "center center",
                }}
            >
                {/* Dot Pattern Background */}
                <div
                    className="absolute inset-0 bg-slate-50"
                    style={{
                        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                        backgroundSize: `24px 24px`,
                    }}
                />

                {/* Diagram Content - Centered in Canvas */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Debug: Show current state */}
                    <div className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded z-50">
                        SVG: {renderedSvg ? `${renderedSvg.length} chars` : 'none'} | Loading: {isGenerating ? 'yes' : 'no'} | Error: {error || 'none'}
                    </div>

                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/95 backdrop-blur-md border border-gray-200 p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 z-50 pointer-events-auto"
                            >
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                                <span className="text-sm font-medium text-gray-500">
                                    Generating diagram...
                                </span>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50 border border-red-100 p-6 rounded-2xl shadow-xl max-w-sm text-center pointer-events-auto mx-4"
                            >
                                <p className="text-red-600 font-medium mb-1">
                                    Generation Failed
                                </p>
                                <p className="text-xs text-red-400 mb-4">{error}</p>
                            </motion.div>
                        ) : renderedSvg ? (
                            <motion.div
                                key="diagram"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pointer-events-auto"
                            >
                                {/* SVG Container - larger size for better visibility */}
                                <div
                                    data-mermaid="true"
                                    data-sketch={sketchMode ? "true" : "false"}
                                    dangerouslySetInnerHTML={{ __html: renderedSvg }}
                                    className="select-none mermaid-container"
                                    style={{
                                        filter: sketchMode ? 'none' : 'drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.05))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '400px',
                                        minHeight: '300px',
                                    }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center gap-4 opacity-40 select-none"
                            >
                                <div className="w-20 h-20 bg-gray-200/50 rounded-3xl flex items-center justify-center rotate-3 backdrop-blur-sm">
                                    <LayoutTemplate className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="font-medium text-lg text-gray-400">
                                    Ready to visualize
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-6 right-6 z-20 flex gap-2 md:gap-3">
                <button
                    onClick={onDownload}
                    disabled={!baseSvg}
                    className="h-9 px-3 md:px-4 bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                </button>
            </div>

            {/* Position Indicator */}
            <div className="absolute bottom-6 right-6 pointer-events-none opacity-30 mix-blend-multiply flex items-center gap-2 text-xs font-mono">
                <Move className="w-4 h-4" />
                <span>
                    {Math.round(pan.x)}, {Math.round(pan.y)}
                </span>
            </div>
        </div>
    );
};

export default DiagramViewer;
