import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Feature";
import Hero from "../components/Hero";
import Demo from "../components/Demo";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      <Hero />
      <Demo />
      <Footer />
    </main>
  );
}
