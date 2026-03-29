"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Shuffle-glitch text ─── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@!";

function ShuffleText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 420;
    const stagger = duration / text.length;
    function tick(now: number) {
      const elapsed = now - start;
      const resolved = Math.floor(elapsed / stagger);
      const chars = text.split("").map((ch, i) => {
        if ("_/.: >".includes(ch)) return ch;
        if (i < resolved) return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
      setDisplayed(chars.join(""));
      if (resolved >= text.length) { setDisplayed(text); return; }
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [text]);
  return <span className={className}>{displayed}</span>;
}

/* ─── Stage config ─── */
interface StageConfig {
  id: string;
  agentName: string;
  layer: string;
  color: string;
  phrase: string;
  ascii: string[];
  primaryMetric: { label: string; value: string; bar: number };
  metrics: { label: string; value: string }[];
}

const STAGES: StageConfig[] = [
  {
    id: "input", agentName: "LEARNER_INPUT", layer: "INPUT", color: "#f97316",
    phrase: "> RECEIVING QUERY...",
    ascii: [
      "  ┌───────────────────┐  ",
      "  │  > your topic_    │  ",
      "  │                   │  ",
      '  │  "Deep Learning"  │  ',
      "  └───────────────────┘  ",
      "   TOKEN STREAM OPEN      ",
    ],
    primaryMetric: { label: "INPUT_TOKENS", value: "847", bar: 65 },
    metrics: [
      { label: "LANG", value: "EN" },
      { label: "LEVEL", value: "BEGINNER" },
      { label: "WEEKS", value: "4" },
      { label: "LATENCY", value: "8ms" },
    ],
  },
  {
    id: "profile", agentName: "PROFILE_ENGINE", layer: "ANALYSIS", color: "#0891b2",
    phrase: "> ANALYZING LEARNER...",
    ascii: [
      "    ○────●────○           ",
      "    │    │    │           ",
      "    ●────○────●           ",
      "    │         │           ",
      "    ○─────────●           ",
      "                          ",
      "   PROFILE MAPPED         ",
    ],
    primaryMetric: { label: "PROFILE_SCORE", value: "94.7%", bar: 95 },
    metrics: [
      { label: "SKILLS", value: "12" },
      { label: "GAPS", value: "3" },
      { label: "STYLE", value: "HANDS_ON" },
      { label: "FIT", value: "0.96" },
    ],
  },
  {
    id: "curate", agentName: "CURATOR_AI", layer: "CURATION", color: "#8b5cf6",
    phrase: "> SEARCHING RESOURCES...",
    ascii: [
      "  YouTube  ──┐            ",
      "  NPTEL    ──┤  FILTER    ",
      "  Khan     ──┤   ▼       ",
      "  MIT OCW  ──┤  RANK     ",
      "  Coursera ──┘   ▼       ",
      "                CURATED   ",
      "   247 → 18 RESOURCES     ",
    ],
    primaryMetric: { label: "RESOURCES_FOUND", value: "247", bar: 82 },
    metrics: [
      { label: "FREE", value: "100%" },
      { label: "SOURCES", value: "5" },
      { label: "FILTERED", value: "18" },
      { label: "QUALITY", value: "0.93" },
    ],
  },
  {
    id: "plan", agentName: "PLANNER_AI", layer: "GENERATION", color: "#f97316",
    phrase: "> BUILDING CURRICULUM...",
    ascii: [
      " WEEK 1 ──→ Foundations   ",
      " WEEK 2 ──→ Core Concepts",
      " WEEK 3 ──→ Applications ",
      " WEEK 4 ──→ Projects     ",
      " ─────────────────────    ",
      " PLAN: GENERATED          ",
      "   4 WEEKS / 18 RESOURCES ",
    ],
    primaryMetric: { label: "PLAN_QUALITY", value: "97.2%", bar: 97 },
    metrics: [
      { label: "MODULES", value: "4" },
      { label: "RESOURCES", value: "18" },
      { label: "HRS/WEEK", value: "10" },
      { label: "COVERAGE", value: "96%" },
    ],
  },
  {
    id: "adapt", agentName: "ADAPTIVE_ENGINE", layer: "OPTIMIZATION", color: "#0891b2",
    phrase: "> PERSONALIZING PATH...",
    ascii: [
      " difficulty                ",
      "   ^                      ",
      "   │      ╱╲              ",
      "   │     ╱  ╲             ",
      "   │    ╱    ╲──          ",
      "   │   ╱                  ",
      "   └──────────────→       ",
      "  w1    w2   w3   w4     ",
    ],
    primaryMetric: { label: "ADAPTATION_FIT", value: "0.94", bar: 94 },
    metrics: [
      { label: "DIFFICULTY", value: "ADAPTIVE" },
      { label: "PACE", value: "NORMAL" },
      { label: "CHECKPOINTS", value: "8" },
      { label: "SIGNALS", value: "READY" },
    ],
  },
  {
    id: "deliver", agentName: "DELIVERY_SYS", layer: "OUTPUT", color: "#22c55e",
    phrase: "> COURSE READY.",
    ascii: [
      "  ┌─────────────────────┐",
      "  │  ✓ COURSE DEPLOYED  │",
      "  │                     │",
      "  │  4 weeks            │",
      "  │  18 resources       │",
      "  │  100% free          │",
      "  └─────────────────────┘",
      "   HAPPY LEARNING.        ",
    ],
    primaryMetric: { label: "READY_SCORE", value: "100%", bar: 100 },
    metrics: [
      { label: "STATUS", value: "DEPLOYED" },
      { label: "FORMAT", value: "ADAPTIVE" },
      { label: "VOICE", value: "ENABLED" },
      { label: "COST", value: "₹0" },
    ],
  },
];

const STAGE_DURATION = 3200;

/* ─── Pipeline Hero ─── */
export default function PipelineHero() {
  const [stageIdx, setStageIdx] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const stage = STAGES[stageIdx];

  const advance = useCallback(() => {
    setStageIdx((i) => (i + 1) % STAGES.length);
    setBarWidth(0);
  }, []);

  useEffect(() => {
    // Animate bar fill
    requestAnimationFrame(() => setBarWidth(stage.primaryMetric.bar));
    timerRef.current = setTimeout(advance, STAGE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [stageIdx, stage.primaryMetric.bar, advance]);

  return (
    <div className="relative w-full h-full min-h-[500px] select-none" aria-hidden="true">
      {/* ── Track lines background ── */}
      <div className="absolute inset-0 overflow-hidden">
        {[60, 120, 180, 240, 300, 360, 420].map((y, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dashed"
            style={{ top: y, borderColor: `rgba(255,255,255,${0.04 + (i === 3 ? 0.04 : 0)})` }}
          />
        ))}
        {/* Nodes */}
        {[
          { t: 56, l: "12%" }, { t: 56, l: "45%" }, { t: 56, l: "78%" },
          { t: 116, l: "25%" }, { t: 116, l: "60%" }, { t: 116, l: "88%" },
          { t: 176, l: "8%" }, { t: 176, l: "40%" }, { t: 176, l: "72%" },
          { t: 236, l: "18%" }, { t: 236, l: "52%" }, { t: 236, l: "82%" },
          { t: 296, l: "30%" }, { t: 296, l: "65%" },
          { t: 356, l: "15%" }, { t: 356, l: "48%" }, { t: 356, l: "75%" },
          { t: 416, l: "22%" }, { t: 416, l: "55%" }, { t: 416, l: "85%" },
        ].map((n, i) => (
          <div
            key={`n${i}`}
            className={`absolute rounded-full ${i % 3 === 0 ? "w-2.5 h-2.5 border border-white/20" : "w-1.5 h-1.5 bg-white/25"}`}
            style={{ top: n.t, left: n.l }}
          />
        ))}
        {/* Orange accent nodes */}
        <div className="absolute w-3 h-3 rounded-full bg-orange-500/60 pipeline-node-pulse" style={{ top: 236, left: "52%" }} />
        <div className="absolute w-2 h-2 rounded-full bg-orange-500/40 pipeline-node-pulse" style={{ top: 116, left: "60%", animationDelay: "1.5s" }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-orange-500/50 pipeline-node-pulse" style={{ top: 356, left: "48%", animationDelay: "3s" }} />
      </div>

      {/* ── Stage card ── */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
          >
            <div className="bg-[#111113]/90 border border-white/[0.08] rounded-xl backdrop-blur-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                  <span className="font-mono text-[10px] tracking-wider text-zinc-400">
                    <ShuffleText text={stage.agentName} />
                  </span>
                </div>
                <span className="font-mono text-[9px] text-zinc-600 tracking-widest">{stage.layer}</span>
              </div>

              {/* ASCII art */}
              <div className="px-4 py-3 border-b border-white/[0.04]">
                <pre className="font-mono text-[10px] leading-[1.5] text-zinc-500 overflow-hidden">
                  {stage.ascii.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </pre>
              </div>

              {/* Status line */}
              <div className="px-4 py-2 border-b border-white/[0.04]">
                <span className="font-mono text-[10px] tracking-wide" style={{ color: stage.color }}>
                  <ShuffleText text={stage.phrase} />
                </span>
              </div>

              {/* Primary metric bar */}
              <div className="px-4 py-2.5 border-b border-white/[0.04]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] text-zinc-500 tracking-wider">{stage.primaryMetric.label}</span>
                  <span className="font-mono text-[11px] font-bold" style={{ color: stage.color }}>{stage.primaryMetric.value}</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: stage.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-4 divide-x divide-white/[0.04]">
                {stage.metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    className="px-2.5 py-2.5 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <div className="font-mono text-[8px] text-zinc-600 tracking-wider mb-1">{m.label}</div>
                    <div className="font-mono text-[10px] text-zinc-300 font-medium">{m.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stage counter */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {STAGES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === stageIdx ? "w-5 bg-orange-500" : i < stageIdx ? "w-2 bg-orange-500/40" : "w-2 bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Pill windows drifting on tracks ── */}
      {[
        { top: 52, dur: "18s", delay: "0s", dir: "right" },
        { top: 172, dur: "22s", delay: "3s", dir: "left" },
        { top: 292, dur: "16s", delay: "1s", dir: "right" },
        { top: 412, dur: "20s", delay: "5s", dir: "left" },
      ].map((p, i) => (
        <div
          key={`pill-${i}`}
          className={p.dir === "right" ? "absolute pipeline-pill-right" : "absolute pipeline-pill-left"}
          style={{ top: p.top, left: p.dir === "right" ? "0%" : "60%", animationDuration: p.dur, animationDelay: p.delay }}
        >
          <div className="flex items-center gap-1.5 bg-[#18181b] border border-white/[0.06] rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <div className="w-6 h-0.5 rounded-full bg-zinc-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
