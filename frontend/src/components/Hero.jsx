import React, { useState } from "react";
import { Menu, X, ArrowRight, Brain } from "lucide-react";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-gradient-radial from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between w-full py-6 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur-md bg-slate-950/30 border-b border-slate-800/50">
        <a href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">

            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            FlashMind
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Features", "Testimonials", "FAQ" ,"Footer"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-slate-300 hover:text-white transition-colors group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95">
            Get started
          </button>
          <button className="px-6 py-2.5 border border-slate-600 hover:border-cyan-500/50 rounded-lg font-medium transition-all duration-300 hover:bg-slate-800/50 hover:scale-105 active:scale-95">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors active:scale-90"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl md:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-lg">
          {["Home", "Features", "Testimonials", "FAQ" ,"Footer"].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors transform hover:scale-110"
              style={{
                animation: mobileMenuOpen
                  ? `slideIn 0.5s ease-out ${i * 0.1}s both`
                  : "none",
              }}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center px-6 pt-20 pb-32">
        {/* Badge */}
        <div className="group flex items-center gap-2.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 rounded-full px-5 py-2.5 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer">
          <div className="relative">
            <div className="size-2.5 bg-emerald-400 rounded-full animate-ping absolute"></div>
            <div className="size-2.5 bg-emerald-400 rounded-full"></div>
          </div>
          <span className="text-sm font-medium">Book a live demo today</span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-5xl md:text-7xl lg:text-8xl mt-8 font-bold max-w-5xl leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
            Stop reading. Start learning
          </span>
          <br />
          <span className="text-white"></span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg md:text-xl text-slate-400 max-w-2xl mt-6 leading-relaxed">
          Transform textbooks, research papers, and lecture notes into
          summaries, flashcards, and quizzes tailored to how you learn best{" "}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <button className="group flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl px-8 py-4 font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 active:scale-95">
            Get started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border-2 border-slate-600 hover:border-cyan-500/50 rounded-xl px-8 py-4 font-semibold transition-all duration-300 hover:bg-slate-800/50 hover:scale-105 active:scale-95 hover:shadow-lg">
            Book a demo
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative mt-20 w-full max-w-6xl group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-3 shadow-2xl">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-2.png"
              className="w-full rounded-xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
              alt="Platform showcase"
            />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
