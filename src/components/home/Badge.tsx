"use client";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500 ${className}`}
    >
      <div className="size-2 rounded-full bg-orange-400 will-change-[background-color]" />
      <p className="whitespace-nowrap">{children}</p>
    </div>
  );
}
