"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "How It Works", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Languages", href: "#languages" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md after:absolute after:inset-0 after:left-1/2 after:h-full after:w-screen after:-translate-x-1/2 md:border-b-0 md:border-none">
      <nav className="relative z-10 mx-auto flex max-w-[1920px] items-center justify-between py-3 lg:py-4 lg:px-5">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a237e] to-[#3949ab]">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            Adiyogi AI
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative font-mono text-xs text-zinc-500 transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out hover:text-orange-500 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/onboarding"
            className="hidden rounded-lg bg-zinc-900 px-4 py-2 font-mono text-xs font-medium text-white transition-colors hover:bg-zinc-700 md:block"
          >
            Get Started
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[2px] w-5 bg-zinc-900 transition-all ${
                mobileOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 bg-zinc-900 transition-all ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 bg-zinc-900 transition-all ${
                mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="relative z-10 border-t border-zinc-100 bg-white pb-6 md:hidden">
          <div className="flex flex-col gap-4 px-4 pt-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm text-zinc-600"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/onboarding"
              className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-center font-mono text-xs font-medium text-white"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
