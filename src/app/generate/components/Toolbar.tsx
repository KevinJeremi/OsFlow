"use client";

import { motion } from "framer-motion";
import {
    ZoomIn,
    ZoomOut,
    Layers,
    Maximize,
    Maximize2,
    Pen,
} from "lucide-react";
import { ToolbarProps } from "../types";
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from "../constants";

export const Toolbar = ({
    zoom,
    setZoom,
    onReset,
    onFit,
    hasDiagram,
    sketchMode,
    onSketchModeToggle,
}: ToolbarProps) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
    >
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-full shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] p-1.5 flex items-center gap-1">
            <div className="flex items-center px-1">
                <button
                    onClick={() => setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 hover:text-black transition-colors active:scale-95"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-medium w-10 md:w-12 text-center text-gray-600 select-none">
                    {Math.round(zoom)}%
                </span>
                <button
                    onClick={() => setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 hover:text-black transition-colors active:scale-95"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <div className="flex items-center px-1 gap-1">
                <button
                    onClick={onSketchModeToggle}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95 ${
                        sketchMode
                            ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            : "hover:bg-gray-100 text-gray-500 hover:text-black"
                    }`}
                    title={sketchMode ? "Sketch Mode On" : "Sketch Mode Off"}
                >
                    <Pen className="w-4 h-4" />
                </button>
                <button
                    onClick={onFit}
                    disabled={!hasDiagram}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 hover:text-black transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Fit to View"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onReset}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 hover:text-black transition-colors active:scale-95"
                    title="Center View"
                >
                    <Maximize className="w-4 h-4" />
                </button>
                <button className="hidden md:flex w-8 h-8 items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 hover:text-black transition-colors active:scale-95">
                    <Layers className="w-4 h-4" />
                </button>
            </div>
        </div>
    </motion.div>
);

export default Toolbar;
