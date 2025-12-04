"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Workflow, ArrowRight, Github, Twitter } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-24 px-6 bg-white overflow-hidden border-t border-gray-100">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
        <span className="text-[20vw] font-serif leading-none tracking-tighter">
          OSFLOW
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 max-w-2xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-serif text-black mb-6 tracking-tight">
            Ready to <span className="italic font-light">flow</span>?
          </h2>
          <p className="text-gray-500 text-lg md:text-xl mb-10 leading-relaxed">
            Stop wrestling with drag-and-drop tools. Start creating beautiful diagrams with natural language today.
          </p>

          <Link href="/generate">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-sky-500 text-white text-lg font-medium px-10 py-5 rounded-full hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/30 flex items-center gap-2 mx-auto"
            >
              Start Creating — It&apos;s Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer Bottom Grid */}
        <div className="border-t border-gray-100 pt-12 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <Logo href="/" showIcon={true} className="flex items-center gap-2" />
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                The fastest way to visualize your ideas. Powered by AI, designed for humans.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-black mb-2">Product</h4>
              <Link href="#features" className="text-gray-500 hover:text-black transition-colors text-sm">Features</Link>
              <Link href="#demo" className="text-gray-500 hover:text-black transition-colors text-sm">Live Demo</Link>
              <Link href="/pricing" className="text-gray-500 hover:text-black transition-colors text-sm">Pricing</Link>
            </div>

            {/* Legal / Social Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-black mb-2">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-black transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-black transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-auto pt-4">
                © {currentYear} OsFlow Inc.
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}