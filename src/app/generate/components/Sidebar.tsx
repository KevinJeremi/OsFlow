"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    History,
    Command,
    Sparkles,
    GitBranch,
    X,
    Workflow,
    MessageSquare,
    Boxes,
    Database,
    Server,
    Network,
    Wand2,
} from "lucide-react";
import { SidebarProps, DiagramType } from "../types";
import { MOCK_HISTORY, DIAGRAM_TYPES } from "../constants";
import Logo from "../../../components/Logo";

const DIAGRAM_ICONS: Record<DiagramType, React.ReactNode> = {
    auto: <Wand2 className="w-3.5 h-3.5" />,
    flowchart: <Workflow className="w-3.5 h-3.5" />,
    sequence: <MessageSquare className="w-3.5 h-3.5" />,
    class: <Boxes className="w-3.5 h-3.5" />,
    er: <Database className="w-3.5 h-3.5" />,
    architecture: <Server className="w-3.5 h-3.5" />,
    network: <Network className="w-3.5 h-3.5" />,
};

export const Sidebar = ({
    prompt,
    setPrompt,
    diagramType,
    setDiagramType,
    onGenerate,
    isGenerating,
    isOpen,
    onClose,
}: SidebarProps) => {
    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                    />
                )}
            </AnimatePresence>

            <div
                className={`
          fixed md:relative inset-y-0 left-0 z-40 
          w-[85vw] md:w-[380px] h-full flex flex-col 
          border-r border-gray-200 bg-white shadow-2xl md:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]
          transition-transform duration-300 ease-in-out shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <Logo href="/" showIcon={true} className="flex items-center gap-2" />
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 -mr-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 custom-scrollbar">
                    {/* Diagram Type Selector */}
                    <div className="space-y-3">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <label>Tipe Diagram</label>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                            {DIAGRAM_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setDiagramType(type.id)}
                                    className={`
                                        flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-all
                                        ${diagramType === type.id
                                            ? "bg-sky-500 text-white shadow-md"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                        }
                                    `}
                                    title={type.description}
                                >
                                    {DIAGRAM_ICONS[type.id]}
                                    <span className="text-[10px] leading-tight">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <label>Prompt</label>
                            <div className="hidden md:flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                                <Command className="w-2.5 h-2.5" />
                                <span>Enter</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                        onGenerate();
                                        if (window.innerWidth < 768) onClose();
                                    }
                                }}
                                className="w-full h-40 bg-gray-50 border border-gray-200 focus:border-black/20 rounded-xl p-4 text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all placeholder:text-gray-400 shadow-sm"
                                placeholder="Describe your flow...
Ex:
Design a user authentication flow with login, registration, and password reset."
                            />

                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={() => {
                                        onGenerate();
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                    disabled={isGenerating || !prompt}
                                    className="bg-sky-500 text-white hover:bg-sky-600 disabled:bg-gray-100 disabled:text-gray-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-sky-500/10 disabled:shadow-none w-full md:w-auto justify-center md:justify-start"
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></span>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Generate Diagram</span>
                                            <Sparkles className="w-3 h-3" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                History
                            </span>
                        </div>

                        {/* Uncomment below to show history items */}
                        {/* <div className="space-y-1">
              {MOCK_HISTORY.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left p-3 rounded-lg flex items-center justify-between group hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200/60"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-gray-300 transition-colors shadow-sm">
                      <GitBranch className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-medium text-gray-700 group-hover:text-black truncate">
                        {item.text}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {item.type} • {item.time}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
