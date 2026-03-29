"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  inverted?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 1,
  inverted = true,
  className = "",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const posRef = useRef(-50);
  const targetRef = useRef(-50);
  const scrollYRef = useRef(0);
  const lastScrollRef = useRef(0);
  const dirRef = useRef<number>(1);

  useEffect(() => {
    if (!trackRef.current) return;

    scrollYRef.current = window.scrollY;
    lastScrollRef.current = window.scrollY;

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      const sy = scrollYRef.current;
      const delta = sy - lastScrollRef.current;
      lastScrollRef.current = sy;

      const scrollDir = Math.sign(delta);
      if (scrollDir !== 0 && scrollDir !== dirRef.current) {
        dirRef.current = scrollDir;
      }

      const direction = inverted ? -1 : 1;
      targetRef.current +=
        ((dt / 1000) * speed + 0.005 * Math.abs(delta)) * dirRef.current * direction;

      // Wrap to -50..0
      targetRef.current = -50 + (((targetRef.current + 50) % 50) + 50) % 50;

      // Lerp
      let diff = targetRef.current - posRef.current;
      if (Math.abs(diff) > 25) {
        diff = diff > 0 ? diff - 50 : diff + 50;
      }
      posRef.current += diff * 0.1;

      if (posRef.current > 0) posRef.current -= 50;
      if (posRef.current < -50) posRef.current += 50;

      if (trackRef.current) {
        gsap.set(trackRef.current, { x: `${posRef.current}%` });
      }
    };

    setReady(true);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, [speed, inverted]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className={`flex w-fit will-change-transform transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
