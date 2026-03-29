"use client";

import { useRef } from "react";
import Section from "./Section";
import Badge from "./Badge";
import { useCharReveal } from "@/hooks/useCharReveal";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

function LanguageGrid() {
  const languages = [
    "English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা",
    "मराठी", "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ",
    "ଓଡ଼ିଆ", "অসমীয়া", "اردو",
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {languages.map((lang) => (
        <div
          key={lang}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-center font-mono text-xs text-zinc-600 transition-colors hover:border-orange-300 hover:bg-orange-50"
        >
          {lang}
        </div>
      ))}
    </div>
  );
}

function SourceGrid() {
  const sources = [
    { name: "YouTube", count: "1M+" },
    { name: "NPTEL", count: "60K+" },
    { name: "Khan Academy", count: "10K+" },
    { name: "MIT OCW", count: "2500+" },
    { name: "SWAYAM", count: "5000+" },
    { name: "edX", count: "3000+" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {sources.map((s) => (
        <div
          key={s.name}
          className="rounded-lg border border-zinc-200 bg-white p-3 text-center transition-colors hover:border-orange-300"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            {s.name}
          </div>
          <div className="mt-1 font-mono text-lg font-medium text-zinc-800">{s.count}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomeEnterprise() {
  const { headingRef } = useCharReveal();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useRevealAnimation({ delay: 0.2, triggerRef: headingRef, refs: [leftRef, rightRef] });

  return (
    <Section
      variant="dark"
      className="mx-4 w-[calc(100%-32px)] rounded-xl px-4 py-16 lg:px-12 lg:py-24"
    >
      <div className="col-span-full mb-10">
        <Badge className="text-zinc-500">Built for India</Badge>
      </div>

      <div className="col-span-full mb-12">
        <h2
          ref={headingRef}
          className="text-3xl font-normal tracking-tight text-white lg:text-5xl"
        >
          Education that speaks your language
        </h2>
      </div>

      <div className="col-span-full grid gap-8 lg:grid-cols-2">
        {/* Left — Languages */}
        <div ref={leftRef} className="">
          <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              13 Languages supported
            </p>
            <h3 className="text-xl font-medium text-white">
              Learn in your mother tongue
            </h3>
            <p className="font-mono text-sm text-zinc-500">
              Voice input, course content, and assessments — all available in 13 Indian languages
              powered by Sarvam AI.
            </p>
            <LanguageGrid />
          </div>
        </div>

        {/* Right — Sources */}
        <div ref={rightRef} className="">
          <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              100% Free content
            </p>
            <h3 className="text-xl font-medium text-white">
              The world&apos;s best free courses, curated by AI
            </h3>
            <p className="font-mono text-sm text-zinc-500">
              We aggregate and rank content from the best open education platforms. Every resource
              in your plan is completely free.
            </p>
            <SourceGrid />
          </div>
        </div>
      </div>
    </Section>
  );
}
