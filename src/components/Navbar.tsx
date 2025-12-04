"use client";

import Link from "next/link";
import { Workflow, ChevronDown } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              className="flex items-center gap-1 text-[15px] text-sm font-medium text-gray-700 hover:text-black transition-colors"
              onClick={() => scrollToSection("demo")}
            >
              Demo
            </button>
            <button
              className="flex items-center gap-1 text-[15px] text-sm font-medium text-gray-700 hover:text-black transition-colors"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
          </div>

          {/* Right - Auth buttons */}
          <div className="flex items-center gap-3">
            {/* <button className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2 transition-colors">
              Log in
            </button> */}
            <Link href="/generate">
              <button className="bg-sky-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
                Get OsFlow free
              </button>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}
