import React from "react";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-20 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-12">
        {/* Brand + Newsletter */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-semibold text-slate-50">
          FlashMind
          </h2>

          <p className="text-slate-400 text-sm max-w-md">
            Turn PDFs into summaries, flashcards, and quizzes. Learn smarter,
            revise faster, and stay ahead with AI-powered study tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-900/60 border border-slate-700/50 text-slate-300 px-4 py-3 rounded-md placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-6 py-3 rounded-md hover:bg-cyan-500/30 transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-10">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-slate-200">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer">AI Summaries</li>
              <li className="hover:text-white cursor-pointer">Flashcards</li>
              <li className="hover:text-white cursor-pointer">Quizzes</li>
              <li className="hover:text-white cursor-pointer">PDF Viewer</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-slate-200">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer">Docs</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Guides</li>
              <li className="hover:text-white cursor-pointer">Support</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-slate-200">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Privacy</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate-500 text-xs">
          © 2026 FlashMind. All rights reserved.
        </p>

        <div className="flex gap-5 text-slate-400">
          {["X", "GitHub", "LinkedIn", "YouTube"].map((item) => (
            <span
              key={item}
              className="cursor-pointer hover:text-cyan-400 transition"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
