"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Section from "./Section";
import Badge from "./Badge";
import { useCharReveal } from "@/hooks/useCharReveal";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

gsap.registerPlugin(ScrollTrigger, CustomEase);

interface ProductStep {
  heading: string;
  description: string;
  tagLine: string;
  tag: string;
  icon: string;
}

const STEPS: ProductStep[] = [
  {
    heading: "Tell us what you want to learn",
    description:
      "Type any topic — from Machine Learning to Sanskrit — in any of 13 Indian languages. Our AI understands your intent and maps it to the best available free content.",
    tagLine: "Topic Input",
    tag: "INPUT",
    icon: "🎯",
  },
  {
    heading: "AI builds your learner profile",
    description:
      "Through an adaptive interview, we understand your current level, learning style, available time, and goals. No two learning paths are the same.",
    tagLine: "Profile Engine",
    tag: "PROFILE",
    icon: "🧠",
  },
  {
    heading: "Curate from the best free sources",
    description:
      "We search YouTube, NPTEL, Khan Academy, MIT OCW, SWAYAM, and more. Then rank, filter, and select the best free resources for your exact needs.",
    tagLine: "Curation",
    tag: "CURATE",
    icon: "📚",
  },
  {
    heading: "Generate your personalized curriculum",
    description:
      "A week-by-week learning plan with curated videos, readings, and hands-on projects. Adapted to your pace and skill level.",
    tagLine: "Plan Generator",
    tag: "PLAN",
    icon: "📋",
  },
  {
    heading: "Adapt as you learn",
    description:
      "Track your progress, take check-ins, and watch the curriculum adapt. Too easy? We'll challenge you. Struggling? We'll provide more foundation.",
    tagLine: "Adaptive Learning",
    tag: "ADAPT",
    icon: "📈",
  },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function HomeProduct() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const labelsRef = useRef<number[]>([]);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { headingRef } = useCharReveal();
  const subRef = useRef<HTMLParagraphElement>(null);
  useRevealAnimation({ delay: 0.02, triggerRef: headingRef, refs: [subRef] });

  CustomEase.create("customBezier", "(0.075, 0.82, 0.165, 1)");

  // Transition between steps
  const transitionTo = useCallback(
    (from: number, to: number) => {
      if (from === to) return;
      const goingUp = to < from;

      gsap.killTweensOf(contentRefs.current.filter(Boolean));

      const tl = gsap.timeline();

      // Hide all non-target
      for (let i = 0; i < STEPS.length; i++) {
        if (i !== to && contentRefs.current[i]) {
          const el = contentRefs.current[i]!;
          if (Number(gsap.getProperty(el, "autoAlpha")) > 0) {
            tl.to(
              el,
              { y: goingUp ? -30 : 30, autoAlpha: 0, duration: 0.4, ease: "power2.inOut" },
              0
            );
          }
          el.style.pointerEvents = "none";
          el.style.zIndex = "1";
        }
      }

      // Show target
      if (contentRefs.current[to]) {
        const el = contentRefs.current[to]!;
        el.style.zIndex = "10";
        el.style.pointerEvents = "auto";
        tl.fromTo(
          el,
          { y: goingUp ? 35 : -35, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "customBezier" },
          0.4
        );
      }
    },
    []
  );

  // ScrollTrigger pinned section
  useEffect(() => {
    if (!containerRef.current || !isDesktop) return;

    // Init first visible
    STEPS.forEach((_, i) => {
      if (contentRefs.current[i]) {
        gsap.set(contentRefs.current[i]!, { autoAlpha: i === 0 ? 1 : 0, y: 0 });
      }
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          anticipatePin: 0.8,
          scrub: true,
        },
        defaults: { ease: "customBezier" },
      });

      tl.addLabel("step0");
      for (let i = 1; i < STEPS.length; i++) {
        tl.to({}, { duration: 1 });
        tl.addLabel(`step${i}`);
      }
      tl.to({}, { duration: 1 });

      labelsRef.current = Array.from({ length: STEPS.length }, (_, i) => tl.labels[`step${i}`] ?? 0);
      const totalDuration = tl.duration();

      let prevIdx = 0;

      tl.eventCallback("onUpdate", () => {
        const time = tl.time();
        const labels = labelsRef.current;
        let idx = 0;
        for (let i = 0; i < labels.length; i++) {
          if (time >= labels[i]) idx = i;
        }

        const start = labels[idx] || 0;
        const end = (labels[idx + 1] || totalDuration) - start;
        setScrollProgress(end > 0 ? Math.min(1, Math.max(0, (time - start) / end)) : 0);

        if (idx !== prevIdx) {
          transitionTo(prevIdx, idx);
          prevIdx = idx;
          setActiveIndex(idx);
        }
      });

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [isDesktop, transitionTo]);

  // Mobile: simple click
  const handleStepClick = (idx: number) => {
    if (isDesktop) return;
    transitionTo(activeIndex, idx);
    setActiveIndex(idx);
  };

  return (
    <div ref={containerRef} className="relative">
      <Section
        showStripes
        variant="grey"
        className="min-h-screen pt-20 pb-8 lg:grid-rows-[auto_1fr] lg:place-content-center"
      >
        {/* Badge */}
        <span className="relative col-span-full mb-5 w-full border-t border-zinc-200 pt-4">
          <Badge>How It Works</Badge>
        </span>

        <div className="relative col-span-full flex max-h-full flex-col gap-y-13 lg:col-span-6 lg:gap-y-6">
          {/* Heading */}
          <div className="flex max-w-[600px] flex-col gap-y-6">
            <h2
              ref={headingRef}
              className="text-3xl font-normal tracking-tight text-balance lg:text-5xl"
            >
              From topic to curriculum in seconds.
            </h2>
            <p
              ref={subRef}
              className="font-mono text-sm text-zinc-500 text-balance lg:max-w-[550px] lg:text-base"
            >
              Tell us what you want to learn. Our AI interviews you, curates free content, and
              builds a personalized plan — all in your language.
            </p>
          </div>

          {/* Desktop: Step labels + content */}
          <div className="mt-auto hidden gap-6 lg:grid lg:grid-cols-6 lg:justify-between lg:gap-6">
            {/* Step tabs */}
            <div className="mt-auto max-w-fit lg:col-span-2">
              {STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => handleStepClick(i)}
                  className={`block w-full text-left py-2 font-mono text-xs transition-colors duration-300 ${
                    i === activeIndex
                      ? "text-orange-500"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <span className="mr-2">0{i + 1}</span>
                  {step.tagLine}
                  {/* Progress bar */}
                  {i === activeIndex && (
                    <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-100"
                        style={{ width: `${scrollProgress * 100}%` }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Step content */}
            <div className="relative min-h-[310px] lg:col-span-4 lg:col-start-3">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    contentRefs.current[i] = el;
                  }}
                  className={i === 0 ? "relative" : "absolute inset-0"}
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    zIndex: i === activeIndex ? 30 : 1,
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-medium tracking-tight">{step.heading}</h3>
                    <p className="font-mono text-sm leading-relaxed text-zinc-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="col-span-full mt-8 flex flex-col gap-4 lg:hidden">
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => handleStepClick(i)}
              className={`w-full rounded-xl border p-5 text-left transition-all ${
                i === activeIndex
                  ? "border-orange-300 bg-orange-50 shadow-sm"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{step.icon}</span>
                <span className="font-mono text-xs text-zinc-500">
                  0{i + 1} — {step.tagLine}
                </span>
              </div>
              <h3 className="mb-1 text-base font-medium">{step.heading}</h3>
              {i === activeIndex && (
                <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
