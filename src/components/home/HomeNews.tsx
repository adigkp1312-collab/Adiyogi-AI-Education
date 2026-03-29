"use client";

import { useRef } from "react";
import Section from "./Section";
import Badge from "./Badge";
import { useCharReveal } from "@/hooks/useCharReveal";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

interface NewsItem {
  tag: string;
  isNew?: boolean;
  title: string;
  description: string;
  href: string;
}

const NEWS: NewsItem[] = [
  {
    tag: "Feature",
    isNew: true,
    title: "Voice-First Learning",
    description:
      "Speak your topic in Hindi, Tamil, or any of 13 languages. Sarvam AI powers voice input and text-to-speech for a truly accessible experience.",
    href: "/onboarding",
  },
  {
    tag: "AI Engine",
    isNew: true,
    title: "Adaptive Curriculum Engine",
    description:
      "Our AI doesn't just pick videos — it builds a week-by-week plan with difficulty curves, check-ins, and hands-on projects tailored to your level.",
    href: "/onboarding",
  },
  {
    tag: "Open Source",
    title: "Free Forever, For Everyone",
    description:
      "Every resource curated by Adiyogi is 100% free — YouTube, NPTEL, Khan Academy, MIT OCW, and more. No paywalls, no subscriptions.",
    href: "/onboarding",
  },
  {
    tag: "Community",
    title: "Built for India's Next 500 Million Learners",
    description:
      "From IIT aspirants to career changers — our AI adapts to every level and learning style across India's diverse education landscape.",
    href: "/onboarding",
  },
];

export default function HomeNews() {
  const { headingRef } = useCharReveal();
  const gridRef = useRef<HTMLDivElement>(null);

  useRevealAnimation({ delay: 0.1, triggerRef: headingRef, refs: [gridRef] });

  return (
    <Section className="my-20 lg:mt-20 lg:mb-30">
      <span className="relative col-span-full mb-5 w-full border-t border-zinc-200 pt-4">
        <Badge>Features</Badge>
      </span>

      <div className="col-span-full mb-8 flex items-end justify-between">
        <h2
          ref={headingRef}
          className="text-3xl font-normal tracking-tight lg:text-5xl"
        >
          What makes Adiyogi different
        </h2>
        <a
          href="/onboarding"
          className="hidden items-center gap-1 font-mono text-xs text-zinc-500 transition-colors hover:text-orange-500 lg:flex"
        >
          Get Started
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div ref={gridRef} className="col-span-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {NEWS.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="group flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {item.tag}
                </span>
                {item.isNew && (
                  <span className="rounded bg-orange-100 px-2 py-0.5 font-mono text-[10px] font-medium text-orange-600">
                    New
                  </span>
                )}
              </div>
              <h3 className="text-base font-medium tracking-tight transition-colors group-hover:text-orange-500">
                {item.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-zinc-500">
                {item.description}
              </p>
              <span className="mt-auto flex items-center gap-1 font-mono text-xs text-zinc-400 transition-colors group-hover:text-orange-500">
                Learn more
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
