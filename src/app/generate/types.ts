// Types for the Generate page components

export type Point = { x: number; y: number };

export type DiagramType = 
    | "auto"
    | "flowchart"
    | "sequence"
    | "class"
    | "er"
    | "architecture"
    | "network";

export interface DiagramTypeOption {
    id: DiagramType;
    label: string;
    description: string;
}

export interface HistoryItem {
    id: number;
    text: string;
    time: string;
    type: string;
}

export interface SidebarProps {
    prompt: string;
    setPrompt: (s: string) => void;
    diagramType: DiagramType;
    setDiagramType: (t: DiagramType) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export interface ToolbarProps {
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    onReset: () => void;
    onFit: () => void;
    hasDiagram: boolean;
    sketchMode: boolean;
    onSketchModeToggle: () => void;
}

export interface CanvasState {
    zoom: number;
    pan: Point;
    isDragging: boolean;
}

export interface DiagramViewerProps {
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
}
