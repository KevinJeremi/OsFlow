"use client";

import { useState, useRef, useCallback } from "react";
import { Point } from "../types";
import {
    CANVAS_SIZE,
    VIEWPORT_PADDING,
    ZOOM_MIN,
    ZOOM_MAX,
    ZOOM_SCROLL_SENSITIVITY,
} from "../constants";

interface UseCanvasOptions {
    initialZoom?: number;
    initialPan?: Point;
}

interface UseCanvasReturn {
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    pan: Point;
    setPan: React.Dispatch<React.SetStateAction<Point>>;
    isDragging: boolean;
    viewportRef: React.RefObject<HTMLDivElement | null>;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: () => void;
    handleWheel: (e: React.WheelEvent) => void;
    resetView: () => void;
    fitToView: (svgWidth: number, svgHeight: number) => void;
    getConstrainedPan: (newPan: Point, currentZoom: number) => Point;
}

export const useCanvas = (options: UseCanvasOptions = {}): UseCanvasReturn => {
    const { initialZoom = 100, initialPan = { x: 0, y: 0 } } = options;

    // Canvas State
    const [zoom, setZoom] = useState(initialZoom);
    const [pan, setPan] = useState<Point>(initialPan);
    const [isDragging, setIsDragging] = useState(false);

    // Refs
    const viewportRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<Point>({ x: 0, y: 0 });
    const panStartRef = useRef<Point>({ x: 0, y: 0 });

    // Constrain pan to keep canvas visible - allows full navigation of large canvas
    const getConstrainedPan = useCallback((newPan: Point, currentZoom: number): Point => {
        if (!viewportRef.current) return newPan;

        const viewportW = viewportRef.current.clientWidth;
        const viewportH = viewportRef.current.clientHeight;

        // Calculate how much space the canvas takes up at current zoom
        const scaledCanvasSize = CANVAS_SIZE * (currentZoom / 100);

        // Calculate boundaries - allow panning to see all edges of canvas
        // We want to be able to pan until the opposite edge of canvas reaches viewport edge
        const maxPanX = (scaledCanvasSize / 2) - VIEWPORT_PADDING;
        const maxPanY = (scaledCanvasSize / 2) - VIEWPORT_PADDING;

        // Minimum pan is negative of max (allows panning in both directions)
        const minPanX = -maxPanX;
        const minPanY = -maxPanY;

        return {
            x: Math.max(minPanX, Math.min(maxPanX, newPan.x)),
            y: Math.max(minPanY, Math.min(maxPanY, newPan.y)),
        };
    }, []);

    // Mouse handlers for dragging
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        panStartRef.current = { ...pan };
        document.body.style.cursor = "grabbing";
    }, [pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;

        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;

        const rawPan = {
            x: panStartRef.current.x + dx,
            y: panStartRef.current.y + dy,
        };

        setPan(getConstrainedPan(rawPan, zoom));
    }, [isDragging, zoom, getConstrainedPan]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        document.body.style.cursor = "default";
    }, []);

    // Wheel handler for zooming
    // User-friendly: scroll UP = zoom IN, scroll DOWN = zoom OUT
    // No need to hold Ctrl/Cmd - just scroll anywhere on the canvas
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        // Normalize deltaY for consistent behavior across browsers/trackpads
        // Use smaller multiplier and add threshold for smoother feel
        const rawDelta = -e.deltaY;

        // Apply dead zone - ignore very small movements
        if (Math.abs(rawDelta) < 5) return;

        // Clamp the delta to prevent huge jumps from trackpad momentum
        const clampedDelta = Math.max(-100, Math.min(100, rawDelta));

        // Apply sensitivity with smooth scaling
        const delta = clampedDelta * ZOOM_SCROLL_SENSITIVITY;

        // Calculate new zoom with proportional change (feels more natural)
        const zoomChange = delta * (zoom / 100);
        const newZoom = Math.min(Math.max(zoom + zoomChange, ZOOM_MIN), ZOOM_MAX);

        // Get mouse position relative to viewport for zoom-towards-cursor
        if (viewportRef.current) {
            const rect = viewportRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;

            // Calculate how much the position under cursor should move
            const zoomRatio = newZoom / zoom;
            const newPanX = pan.x - (mouseX - pan.x) * (zoomRatio - 1);
            const newPanY = pan.y - (mouseY - pan.y) * (zoomRatio - 1);

            setZoom(newZoom);
            setPan(getConstrainedPan({ x: newPanX, y: newPanY }, newZoom));
        } else {
            setZoom(newZoom);
            setPan((p) => getConstrainedPan(p, newZoom));
        }
    }, [zoom, pan, getConstrainedPan]);

    // Reset view to center
    const resetView = useCallback(() => {
        setPan({ x: 0, y: 0 });
        setZoom(100);
    }, []);

    // Fit diagram to viewport
    const fitToView = useCallback((svgWidth: number, svgHeight: number) => {
        if (!viewportRef.current || svgWidth <= 0 || svgHeight <= 0) return;

        const vw = viewportRef.current.clientWidth;
        const vh = viewportRef.current.clientHeight;
        const padding = 100;

        // Calculate optimal zoom to fit diagram in viewport
        const zoomX = ((vw - padding) / svgWidth) * 100;
        const zoomY = ((vh - padding) / svgHeight) * 100;
        const optimalZoom = Math.min(zoomX, zoomY, 100);

        // Clamp zoom within bounds
        const finalZoom = Math.max(ZOOM_MIN, Math.min(optimalZoom, ZOOM_MAX));

        setZoom(finalZoom);
        setPan({ x: 0, y: 0 });
    }, []);

    return {
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
    };
};

export default useCanvas;
