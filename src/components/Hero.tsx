"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white pt-20 pb-12 md:pt-16 md:pb-0">
      
      {/* --- Floating Diagram Examples (Visible on Large Screens) --- */}
      
      {/* Top Left - Diagram 1 */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="hidden xl:block absolute left-[5%] xl:left-[8%] top-[20%] z-10"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-70 2xl:w-110"
        >
          <Image
            src="/diagrams/1.webp"
            alt="Generated diagram example"
            width={300}
            height={370}
            className="rounded-2xl shadow-lg"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Bottom Left - Diagram 2 */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        className="hidden xl:block absolute left-[4%] 2xl:left-[8%] top-[55%] z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="w-80 2xl:w-120"
        >
          <Image
            src="/diagrams/2.png"
            alt="Architecture diagram"
            width={224}
            height={290}
            className="rounded-xl shadow-lg -rotate-6"
          />
        </motion.div>
      </motion.div>

      {/* Top Right - Diagram 3 */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="hidden xl:block absolute right-[5%] 2xl:right-[1%] top-[15%] z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="w-80 2xl:w-120" >
          <Image
            src="/diagrams/3.avif"
            alt="Flowchart example"
            width={256}
            height={340}
            className="rounded-2xl shadow-lg rotate-3"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Bottom Right - Diagram 4 */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        className="hidden xl:block absolute right-[5%] 2xl:right-[12%] top-[60%] z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="w-80 2xl:w-120"
        >
          <Image
            src="/diagrams/4.webp"
            alt="System design diagram"
            width={250}
            height={280}
            className="rounded-xl shadow-lg rotate-6"
          />
        </motion.div>
      </motion.div>

      {/* --- Main Content --- */}
      <div className="relative z-20 max-w-4xl px-4 md:px-6 text-center mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-serif tracking-tight text-black leading-[1.1] md:leading-[1.05] mb-6 md:mb-8"
        >
          <span className="italic font-normal">Describe</span> it.
          <br />
          We&apos;ll diagram it.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="space-y-4 md:space-y-6 mb-8 md:mb-10 max-w-lg mx-auto"
        >
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Turn natural language into beautiful diagrams instantly.
            <span className="hidden sm:inline"> No drag and drop required.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/generate" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-sky-500 text-white text-base md:text-lg font-medium px-8 py-3 rounded-full hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/30 flex items-center justify-center gap-2"
            >
              Start Creating — It&apos;s Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}