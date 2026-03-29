"use client";

import { useRef, useEffect, RefObject } from "react";
import { gsap } from "gsap";

interface RevealOptions {
  delay?: number;
  initialY?: number;
  triggerRef?: RefObject<HTMLElement | null>;
  refs?: RefObject<HTMLElement | null>[];
}

export function useRevealAnimation(options: RevealOptions = {}) {
  const { delay = 0.2, initialY = 30, triggerRef, refs = [] } = options;
  const hasPlayed = useRef(false);

  useEffect(() => {
    const trigger = triggerRef?.current;
    if (!trigger) return;

    const elements = refs
      .map((r) => r.current)
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    gsap.set(elements, { autoAlpha: 0, y: initialY });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed.current) {
            hasPlayed.current = true;
            gsap.to(elements, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              delay,
              stagger: 0.1,
              ease: "power2.out",
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [delay, initialY, triggerRef, refs]);
}
