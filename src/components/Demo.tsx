"use client";
import { motion, useInView } from "framer-motion";
import { Terminal, Loader2, Database, User, Globe, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Demo() {
  const [step, setStep] = useState(0);
  const [key, setKey] = useState(0); // Key to force re-render and restart animation
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Simulate the flow of the demo
  useEffect(() => {
    if (isInView) {
      setStep(0);
      const timers = [
        setTimeout(() => setStep(1), 500),  // Start typing
        setTimeout(() => setStep(2), 2500), // Finish typing / Processing
        setTimeout(() => setStep(3), 4000), // Show Nodes
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isInView, key]);

  const restartAnimation = () => {
    setStep(0);
    setKey(prev => prev + 1);
  };

  return (
    <section id="demo" className="min-h-screen py-16 md:py-24 px-4 md:px-6 bg-[#fafafa] overflow-hidden flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        > 
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-5xl font-serif text-black tracking-tight">
              See it in action
            </h2>
            <button
              onClick={restartAnimation}
              className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
              title="Play Demo"
            >
              {/* Ping animation rings */}
              <span className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping [animation-delay:0.5s]" />
              <Play className="relative w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300 fill-current" />
            </button>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto px-4">
            Watch how OsFlow transforms your words into diagrams instantly.
          </p>
        </motion.div>

        {/* Main Interface Window */}
        <div ref={ref} className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[500px] lg:h-[450px]">
          
          {/* Top Bar (Mac-like) - Absolute on Desktop, Relative on Mobile */}
          <div className="lg:absolute top-0 left-0 right-0 h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 z-20 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
            <div className="ml-4 text-xs text-gray-400 font-mono">floww_generator.exe</div>
          </div>

          {/* Left Panel: The Input */}
          <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-gray-100 bg-[#fafafa] pt-6 lg:pt-16 p-6 md:p-8 flex flex-col relative min-h-[200px]">
            <div className="flex items-center gap-2 mb-4 md:mb-6 text-gray-400">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-mono font-medium uppercase tracking-wide">Input Prompt</span>
            </div>
            
            <div className="font-mono text-sm text-gray-800 leading-relaxed relative flex-1 break-words">
              <span className="text-blue-500 mr-2">$</span>
              {isInView && (
                <Typewriter 
                  key={key}
                  text="Design a user registration flow. Validate email, encrypt password, save to DB, and send welcome email." 
                  startDelay={500}
                />
              )}
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-blue-500 align-middle ml-1"
              />
            </div>

            {/* Processing Indicator */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: step === 2 ? 1 : 0 }}
               className="mt-4 lg:mt-auto flex items-center gap-2 text-xs text-gray-500 font-mono"
            >
                <Loader2 className="w-3 h-3 animate-spin" />
                Parsing logic...
            </motion.div>
          </div>

          {/* Right Panel: The Output Canvas */}
          <div className="w-full lg:w-3/5 bg-white pt-8 lg:pt-16 p-4 md:p-8 relative overflow-hidden flex items-start lg:items-center justify-center min-h-[300px]">
             {/* Subtle Grid Background */}
             <div className="absolute inset-0 bg-slate-50" style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

             <div className="relative z-10 w-full max-w-sm lg:max-w-lg">
                <FlowDiagram visible={step >= 3} />
             </div>

             {/* Waiting State Overlay */}
             {step < 3 && (
                 <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    {step === 2 && (
                        <div className="text-sm font-medium text-gray-400 animate-pulse">Generative AI working...</div>
                    )}
                 </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-component for Typing Effect
function Typewriter({ text, startDelay }: { text: string; startDelay: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index === text.length) clearInterval(interval);
      }, 30); // Typing speed
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, startDelay]);

  return <span>{displayedText}</span>;
}

// Sub-component for the Diagram Visualization
function FlowDiagram({ visible }: { visible: boolean }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
    };

    const lineVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        show: { pathLength: 1, opacity: 1, transition: { duration: 0.5 } }
    };

    if (!visible) return null;

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-6 md:gap-8 w-full relative"
        >
            {/* 1. Start Node */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 z-10">
                <div className="bg-white border-2 border-gray-900 rounded-full px-4 py-2 md:px-6 md:py-2.5 shadow-sm flex items-center gap-2 md:gap-3">
                   <User className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                   <span className="text-xs md:text-sm font-semibold text-gray-900">Registration Request</span>
                </div>
            </motion.div>

            {/* Arrow 1 - Positioned absolutely relative to the flex container */}
            <svg className="absolute top-[35px] md:top-[45px] w-6 h-10 overflow-visible pointer-events-none">
                <motion.line x1="12" y1="0" x2="12" y2="40" stroke="#cbd5e1" strokeWidth="2" variants={lineVariants} />
                <motion.path d="M 8 35 L 12 40 L 16 35" stroke="#cbd5e1" fill="none" strokeWidth="2" variants={lineVariants} />
            </svg>

            {/* 2. Process Node */}
            <motion.div variants={itemVariants} className="mt-2 z-10">
                 <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-2 md:px-6 md:py-3 shadow-sm text-xs md:text-sm font-medium w-40 md:w-48 text-center">
                    Validate Input
                 </div>
            </motion.div>

             {/* Arrow 2 */}
            <svg className="absolute top-[100px] md:top-[125px] w-6 h-10 overflow-visible pointer-events-none">
                <motion.line x1="12" y1="0" x2="12" y2="40" stroke="#cbd5e1" strokeWidth="2" variants={lineVariants} />
                <motion.path d="M 8 35 L 12 40 L 16 35" stroke="#cbd5e1" fill="none" strokeWidth="2" variants={lineVariants} />
            </svg>

            {/* 3. Logic Branch */}
            <div className="mt-2 grid grid-cols-2 gap-4 md:gap-8 w-full z-10">
                <motion.div variants={itemVariants} className="flex flex-col items-center">
                    <div className="bg-purple-50 border border-purple-200 text-purple-800 rounded-lg px-3 py-2 md:px-5 md:py-3 shadow-sm flex items-center gap-2 text-xs md:text-sm font-medium whitespace-nowrap">
                        <Database className="w-3 h-3 md:w-4 md:h-4" />
                        Save User
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col items-center">
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-3 py-2 md:px-5 md:py-3 shadow-sm flex items-center gap-2 text-xs md:text-sm font-medium whitespace-nowrap">
                        <Globe className="w-3 h-3 md:w-4 md:h-4" />
                        Send Email
                    </div>
                </motion.div>
            </div>
             
             {/* Connection Lines for Split (Visual only) - Responsive Paths */}
             <svg className="absolute top-[140px] md:top-[175px] w-full h-10 overflow-visible pointer-events-none -z-10">
                 {/* Left Path: Starts center, goes down 20, goes left, goes down */}
                <motion.path 
                    d="M 50% 0 L 50% 20 L 25% 20 L 25% 40" 
                    stroke="#cbd5e1" 
                    fill="none" 
                    strokeWidth="2" 
                    className="text-gray-300" 
                    initial={{ pathLength: 0 }} 
                    animate={{ pathLength: 1 }} 
                    transition={{ delay: 1, duration: 0.5}} 
                    // Using vector-effect to prevent stroke scaling issues if container resizes
                    vectorEffect="non-scaling-stroke"
                />
                
                 {/* Right Path */}
                <motion.path 
                    d="M 50% 0 L 50% 20 L 75% 20 L 75% 40" 
                    stroke="#cbd5e1" 
                    fill="none" 
                    strokeWidth="2" 
                    className="text-gray-300" 
                    initial={{ pathLength: 0 }} 
                    animate={{ pathLength: 1 }} 
                    transition={{ delay: 1, duration: 0.5}} 
                    vectorEffect="non-scaling-stroke"
                />
             </svg>

        </motion.div>
    );
}