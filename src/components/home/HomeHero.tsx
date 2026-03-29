"use client";

import { useRef } from "react";
import Section from "./Section";
import Badge from "./Badge";
import Marquee from "./Marquee";
import PipelineHero from "../PipelineHero";
import { useCharReveal } from "@/hooks/useCharReveal";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

const TRUSTED_BY = [
  "YouTube",
  "NPTEL",
  "Khan Academy",
  "MIT OCW",
  "Coursera",
  "SWAYAM",
  "edX",
  "IIT Lectures",
];

export default function HomeHero() {
  const { headingRef } = useCharReveal();
  const descRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useRevealAnimation({ delay: 0.2, triggerRef: headingRef, refs: [descRef, ctaRef] });

  return (
    <>
      <Section className="my-20 first:mt-4 lg:mt-20 lg:mb-30 lg:h-[calc(100dvh-160px)] lg:max-h-[725px] lg:min-h-[620px] first:lg:mt-10">
        <div className="z-10 col-span-4 flex max-w-[650px] flex-col justify-between lg:col-span-6 lg:max-w-none">
          <div className="flex flex-col gap-y-6 lg:gap-y-8">
            <Badge className="pt-4">Education</Badge>

            <h1
              ref={headingRef}
              className="text-[40px] font-normal leading-[100%] tracking-[-0.16rem] text-foreground lg:-ml-1 lg:text-6xl lg:tracking-[-0.18rem] 2xl:text-7xl"
              aria-label="AI-Powered Free Education For Every Indian"
            >
              AI-Powered Free
              <br />
              Education For
              <br />
              Every Indian
            </h1>

            <div
              ref={descRef}
              className="flex flex-col gap-y-4 lg:max-w-[600px] lg:gap-y-6"
            >
              <p className="font-mono text-sm leading-relaxed text-zinc-500 text-balance lg:text-base">
                The only AI that organizes free education from YouTube, NPTEL, Khan Academy, and
                open universities — personalized for you.
              </p>
              <p className="font-mono text-sm leading-relaxed text-zinc-500 text-balance lg:text-base">
                From topic to curriculum — get AI-curated learning paths in your language, at your
                level, completely free.
              </p>
            </div>

            <div ref={ctaRef} className="max-w-[600px]">
              <a
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-mono text-sm font-medium text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
              >
                Start Learning — It&apos;s Free
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
        </div>

        {/* Right side — Pipeline animation */}
        <div className="z-0 col-span-full aspect-[3/2] max-w-[700px] lg:absolute lg:-top-[clamp(20px,11dvh,130px)] lg:-right-12 lg:aspect-[4/3] lg:max-h-[clamp(650px,50vw,1000px)] lg:w-[clamp(600px,54vw,1000px)] lg:max-w-none">
          <PipelineHero />
        </div>

        {/* Trusted by marquee */}
        <div className="col-span-full mt-auto pt-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            Curating from the best free sources
          </p>
          <Marquee speed={0.8}>
            <div className="flex items-center gap-12 px-6">
              {TRUSTED_BY.map((name) => (
                <span
                  key={name}
                  className="whitespace-nowrap font-mono text-sm text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  {name}
                </span>
              ))}
            </div>
          </Marquee>
        </div>
      </Section>
    </>
  );
}
