"use client";

import { X, Check, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Features() {
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <section
      id="features"
      className="h-screen flex flex-col justify-center py-16 px-6 bg-[#fafafa]"
    >
      <div className="max-w-5xl w-full mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight">
            Just floww it
          </h2>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Before Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="bg-gray-200 text-gray-600 px-5 py-1.5 rounded-full text-sm font-medium mb-10">
              Before
            </div>

            {/* Scattered Logos Container */}
            <div className="relative h-44 w-full max-w-[300px] mb-8">
              {/* Logo 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute top-2 left-0"
              >
                {/* BLUR APPLIED HERE ONLY */}
                <Image
                  src="/logo1.svg"
                  alt="App icon"
                  width={56}
                  height={56}
                  className="blur-[2px] opacity-80" 
                />
              </motion.div>

              {/* Logo 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-8 left-1/2 -translate-x-1/2"
              >
                {/* BLUR APPLIED HERE ONLY */}
                <Image
                  src="/logo2.png"
                  alt="App icon"
                  width={52}
                  height={52}
                  className="blur-[2px] opacity-80"
                />
              </motion.div>

              {/* Logo 3 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-0 right-0"
              >
                {/* BLUR APPLIED HERE ONLY */}
                <Image
                  src="/logo3.png"
                  alt="App icon"
                  width={54}
                  height={54}
                  className="blur-[2px] opacity-80"
                />
              </motion.div>
            </div>

            {/* Pain Points */}
            <div className="space-y-4 w-full max-w-xs">
              {[
                "Info scattered everywhere",
                "High effort to organize",
                "Can't find anything",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-3 text-gray-600 font-medium"
                >
                  <X className="w-5 h-5 text-red-500/80 flex-shrink-0" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <div className="bg-blue-500 text-white px-5 py-1.5 rounded-full text-sm font-medium mb-10">
              After
            </div>

            {/* Single Unified Logo */}
            <div className="relative h-44 w-full max-w-[300px] mb-8 flex items-start justify-center pt-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                className="w-24 h-24 border-[3px] border-blue-100 shadow-xl shadow-blue-500/10 rounded-3xl flex items-center justify-center bg-white z-10"
              >
                <Workflow
                  className="w-12 h-12 text-blue-500"
                  strokeWidth={1.5}
                />
              </motion.div>
              
              {/* Decorative background glow for After state */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-400/20 blur-2xl rounded-full" />
            </div>

            {/* Benefits */}
            <div className="space-y-4 w-full max-w-xs">
              {[
                "Everything in one place",
                "Zero organization needed",
                "Find anything instantly",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-3 text-gray-900 font-medium"
                >
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}