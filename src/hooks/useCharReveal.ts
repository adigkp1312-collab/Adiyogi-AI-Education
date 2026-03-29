"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);

interface CharRevealOptions {
  duration?: number;
  stagger?: number;
  initialY?: number;
  initialColor?: string;
  finalColor?: string;
  threshold?: number;
  rootMargin?: string;
  ease?: string;
}

export function useCharReveal(options: CharRevealOptions = {}) {
  const {
    duration = 0.5,
    stagger = 0.015,
    initialY = 50,
    initialColor = "#f97316",
    finalColor = "var(--color-foreground)",
    threshold = 0.3,
    rootMargin = "0px 0px -100px 0px",
    ease = "reveal",
  } = options;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasPlayed = useRef(false);
  const splitRef = useRef<SplitText | null>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    CustomEase.create("reveal", "0.645, 0.045, 0.355, 1");

    const el = headingRef.current;
    const split = new SplitText(el, {
      type: "chars",
      charsClass: "char-reveal",
      tag: "span",
    });
    splitRef.current = split;

    const chars = split.chars;
    gsap.set(chars, { autoAlpha: 0, y: initialY, color: initialColor });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed.current) {
            hasPlayed.current = true;
            gsap.to(chars, {
              autoAlpha: 1,
              y: 0,
              color: finalColor,
              duration,
              stagger,
              ease,
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(headingRef.current);

    return () => {
      observer.disconnect();
      if (splitRef.current) splitRef.current.revert();
    };
  }, [duration, stagger, initialY, initialColor, finalColor, threshold, rootMargin, ease]);

  return { headingRef };
}
