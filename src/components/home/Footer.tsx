"use client";

const FOOTER_LINKS = {
  Product: [
    { label: "How It Works", href: "#product" },
    { label: "Features", href: "#features" },
    { label: "Languages", href: "#languages" },
    { label: "Get Started", href: "/onboarding" },
  ],
  Resources: [
    { label: "YouTube", href: "https://youtube.com" },
    { label: "NPTEL", href: "https://nptel.ac.in" },
    { label: "Khan Academy", href: "https://khanacademy.org" },
    { label: "MIT OCW", href: "https://ocw.mit.edu" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Open Source", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-12 lg:px-9">
      <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-8 lg:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a237e] to-[#3949ab]">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              Adiyogi AI
            </span>
          </div>
          <p className="mt-3 max-w-[250px] font-mono text-xs leading-relaxed text-zinc-500">
            AI-powered free education for every Indian. Learn anything, in any language, at any
            level — completely free.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-zinc-400">
              {title}
            </h4>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-mono text-xs text-zinc-600 transition-colors hover:text-orange-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1920px] items-center justify-between border-t border-zinc-100 pt-6">
        <p className="font-mono text-[10px] text-zinc-400">
          &copy; Adiyogi AI 2026. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="font-mono text-[10px] text-zinc-400 hover:text-zinc-600">
            GitHub
          </a>
          <a href="#" className="font-mono text-[10px] text-zinc-400 hover:text-zinc-600">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
