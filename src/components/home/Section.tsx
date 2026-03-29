"use client";

import { forwardRef } from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "grey" | "dark";
  showStripes?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = "", variant = "default", showStripes = false }, ref) => {
    const bg =
      variant === "grey"
        ? "bg-[#fafafa]"
        : variant === "dark"
        ? "bg-[#09090b] text-white"
        : "bg-white";

    return (
      <section
        ref={ref}
        className={`relative mx-auto grid h-auto w-full grid-cols-4 gap-x-4 px-4 lg:grid-cols-12 lg:gap-x-6 lg:px-9 ${bg} ${className}`}
      >
        {showStripes && (
          <div className="pointer-events-none absolute inset-0 z-0">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-black/[0.04]"
                style={{ left: `${(i / 12) * 100}%` }}
              />
            ))}
          </div>
        )}
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
export default Section;
