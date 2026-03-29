"use client";

import { useRef } from "react";
import Section from "./Section";
import { useCharReveal } from "@/hooks/useCharReveal";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function HomeCTA() {
  const { headingRef } = useCharReveal({
    initialColor: "#fff",
    finalColor: "#fff",
  });
  const btnRef = useRef<HTMLDivElement>(null);

  useRevealAnimation({ delay: 0.3, triggerRef: headingRef, refs: [btnRef] });

  return (
    <Section
      variant="dark"
      className="mx-4 mb-20 w-[calc(100%-32px)] rounded-xl px-4 py-20 text-center lg:px-12 lg:py-28"
    >
      <div className="col-span-full flex flex-col items-center gap-8">
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          start learning
        </p>
        <h2
          ref={headingRef}
          className="text-3xl font-normal tracking-tight text-white lg:text-5xl"
        >
          Ready to learn anything, for free?
        </h2>
        <div ref={btnRef} className="">
          <a
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-4 font-mono text-sm font-medium text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
          >
            Start Building Your Course
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </Section>
  );
}
