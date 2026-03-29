"use client";

import { useState, useCallback } from "react";
import type { UserProfile } from "@/types";

// --- Data ---

const GOAL_SUGGESTIONS = [
  "Become an ML engineer",
  "Build AI projects",
  "GATE / exam prep",
  "Career switch to AI",
  "Research in AI",
  "Start an AI company",
];

const INTEREST_OPTIONS = [
  { id: "ml", label: "Machine Learning", icon: "precision_manufacturing" },
  { id: "dl", label: "Deep Learning", icon: "psychology" },
  { id: "nlp", label: "NLP & LLMs", icon: "chat" },
  { id: "cv", label: "Computer Vision", icon: "visibility" },
  { id: "genai", label: "Generative AI", icon: "auto_awesome" },
  { id: "python", label: "Python for AI", icon: "code" },
  { id: "ds", label: "Data Science", icon: "bar_chart" },
  { id: "mlops", label: "MLOps", icon: "cloud_sync" },
  { id: "rl", label: "Reinforcement Learning", icon: "sports_esports" },
  { id: "math", label: "Math for ML", icon: "functions" },
  { id: "ethics", label: "AI Ethics", icon: "balance" },
  { id: "research", label: "Research Methods", icon: "science" },
];

const LEVELS = [
  {
    value: "beginner" as const,
    label: "Beginner",
    desc: "New to programming or AI. No worries, we start from zero.",
    icon: "eco",
  },
  {
    value: "intermediate" as const,
    label: "Intermediate",
    desc: "Comfortable with Python. Know basic ML concepts.",
    icon: "park",
  },
  {
    value: "advanced" as const,
    label: "Advanced",
    desc: "Experienced developer. Looking to specialize or go deeper.",
    icon: "forest",
  },
];

const LEARNING_STYLES = [
  { value: "video", label: "Video Lectures", desc: "Watch explanations and visual demos", icon: "play_circle" },
  { value: "hands-on", label: "Hands-on Projects", desc: "Learn by building real things", icon: "construction" },
  { value: "reading", label: "Reading & Docs", desc: "Articles, papers, documentation", icon: "menu_book" },
  { value: "mixed", label: "Mixed Approach", desc: "A balanced mix of everything", icon: "tune" },
];

const DEADLINES = ["No rush", "1 month", "3 months", "6 months", "ASAP"];

const TOTAL_STEPS = 6;

// --- Component ---

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
  onSkip?: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [education, setEducation] = useState("");
  const [learningStyle, setLearningStyle] = useState("video");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [deadline, setDeadline] = useState("No rush");
  const [transitioning, setTransitioning] = useState(false);

  const goNext = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 250);
  }, []);

  const goBack = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => Math.max(0, s - 1));
      setTransitioning(false);
    }, 250);
  }, []);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const finish = () => {
    onComplete({
      userId: `user_${Date.now()}`,
      name,
      preferredLanguage: "en",
      activePlans: [],
      createdAt: new Date().toISOString(),
      interests: interests.map(
        (id) => INTEREST_OPTIONS.find((o) => o.id === id)?.label || id
      ),
      level,
      language: "en-IN",
      goal,
      education,
      hoursPerWeek,
      learningStyle,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf8ff] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-[0_0_40px_rgba(27,27,33,0.06)]">
        <div className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1a237e] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <h1 className="font-bold text-xl tracking-tight text-[#1a237e]">
              Adiyogi AI
            </h1>
          </div>
          {onSkip && step < TOTAL_STEPS - 1 && (
            <button
              onClick={onSkip}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
        {/* Progress */}
        <div className="px-6 pb-3 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < step
                    ? "flex-1 bg-gradient-to-r from-orange-500 to-orange-600"
                    : i === step
                    ? "flex-[2] bg-gradient-to-r from-orange-500 to-orange-600"
                    : "flex-1 bg-slate-200"
                }`}
              />
            ))}
            <span className="ml-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold whitespace-nowrap">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        className={`flex-1 overflow-y-auto px-6 pb-40 transition-all duration-250 ${
          transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-lg mx-auto w-full pt-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-[#1a237e] to-[#3949ab] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#1a237e] leading-tight tracking-tight mb-3">
                Welcome to Adiyogi AI
              </h2>
              <p className="text-slate-500 text-lg mb-10 max-w-xs">
                Your free, personalized AI learning journey starts here.
              </p>
              <div className="w-full space-y-3">
                <label className="text-xs font-bold text-[#1a237e] uppercase tracking-wider block text-left ml-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && goNext()}
                  placeholder="Enter your name"
                  autoFocus
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl text-lg focus:bg-white focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]/30 transition-all placeholder:text-slate-300 outline-none"
                />
              </div>
              {/* Proactive AI hint */}
              <div className="mt-6 w-full bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-orange-500 text-xl">lightbulb</span>
                  <p className="text-sm text-slate-500 text-left">
                    We'll use your name to personalize your entire learning experience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1a237e] mb-1">
                  What&apos;s your goal, {name}?
                </h2>
                <p className="text-slate-400">Tell us what you want to achieve</p>
              </div>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. I want to become an ML engineer and build production AI systems..."
                rows={3}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-base focus:bg-white focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]/30 transition-all placeholder:text-slate-300 outline-none resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {GOAL_SUGGESTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`text-sm rounded-full px-4 py-2 border transition-all ${
                      goal === g
                        ? "bg-[#1a237e] text-white border-[#1a237e]"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#1a237e]/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1a237e] mb-1">
                  What AI topics excite you?
                </h2>
                <p className="text-slate-400">Pick as many as you like</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((opt) => {
                  const selected = interests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? "bg-[#1a237e]/5 border-[#1a237e] shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          selected ? "text-[#1a237e]" : "text-slate-400"
                        }`}
                        style={selected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {opt.icon}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          selected ? "text-[#1a237e]" : "text-slate-600"
                        }`}
                      >
                        {opt.label}
                      </span>
                      {selected && (
                        <span className="absolute top-2 right-2 material-symbols-outlined text-[#1a237e] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1a237e] mb-1">
                  What&apos;s your experience level?
                </h2>
                <p className="text-slate-400">We'll tailor the difficulty perfectly</p>
              </div>
              <div className="space-y-3">
                {LEVELS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLevel(opt.value)}
                    className={`w-full flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                      level === opt.value
                        ? "bg-[#1a237e]/5 border-[#1a237e] border-l-4"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        level === opt.value
                          ? "bg-[#1a237e] text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <span className="material-symbols-outlined" style={level === opt.value ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                        {opt.icon}
                      </span>
                    </div>
                    <div>
                      <p className={`font-semibold ${level === opt.value ? "text-[#1a237e]" : "text-slate-700"}`}>
                        {opt.label}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">
                  Education (optional)
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. B.Tech CS 2nd year, Self-taught developer"
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]/30 transition-all placeholder:text-slate-300 outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Learning Style */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1a237e] mb-1">
                  How do you learn best?
                </h2>
                <p className="text-slate-400">We'll match content to your style</p>
              </div>
              <div className="space-y-3">
                {LEARNING_STYLES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLearningStyle(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      learningStyle === opt.value
                        ? "bg-[#1a237e]/5 border-[#1a237e]"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        learningStyle === opt.value ? "text-[#1a237e]" : "text-slate-400"
                      }`}
                      style={learningStyle === opt.value ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {opt.icon}
                    </span>
                    <div>
                      <p className={`font-semibold text-sm ${learningStyle === opt.value ? "text-[#1a237e]" : "text-slate-700"}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Hours slider */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Hours per week
                </label>
                <div className="text-center">
                  <span className="text-5xl font-extrabold text-[#1a237e]">{hoursPerWeek}</span>
                  <span className="text-lg text-slate-400 ml-2">hrs/week</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={40}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#1a237e]"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>2h</span>
                  <span>40h</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">
                  Any deadline?
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEADLINES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDeadline(d)}
                      className={`text-sm rounded-full px-4 py-2 border transition-all ${
                        deadline === d
                          ? "bg-[#1a237e] text-white border-[#1a237e]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#1a237e]/40"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Ready */}
          {step === 5 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/20 mb-4">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    celebration
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#1a237e] mb-2">
                  You&apos;re all set, {name}!
                </h2>
                <p className="text-slate-400 text-lg">
                  Your personalized AI learning path is ready.
                </p>
              </div>

              {/* Profile summary */}
              <div className="bg-white p-6 rounded-2xl border-2 border-orange-500/20 shadow-sm space-y-5">
                <h3 className="font-bold text-lg text-[#1a237e]">Your Learning Profile</h3>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1a237e] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-xl">flag</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Goal</p>
                    <p className="font-semibold text-[#1a237e]">{goal || "Explore AI"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Level</p>
                    <p className="font-medium capitalize">{level}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Commitment</p>
                    <p className="font-medium">{hoursPerWeek} hrs/week</p>
                  </div>
                </div>

                {interests.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((id) => (
                        <span
                          key={id}
                          className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600"
                        >
                          {INTEREST_OPTIONS.find((o) => o.id === id)?.label || id}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                    <p className="text-sm font-medium">
                      {LEARNING_STYLES.find((s) => s.value === learningStyle)?.label}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    STYLE
                  </span>
                </div>
              </div>

              {/* Proactive tip */}
              <div className="p-5 bg-slate-50 rounded-xl flex gap-4 items-start">
                <span className="material-symbols-outlined text-[#1a237e] text-2xl">lightbulb</span>
                <p className="text-sm text-slate-500">
                  <span className="font-bold text-slate-700">Proactive Tip:</span> Based on your profile, we recommend starting with a hands-on introductory course tailored to your level.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom CTA */}
      <footer className="fixed bottom-0 left-0 w-full px-6 pb-8 pt-4 bg-white/90 backdrop-blur-sm z-40">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-3">
          {step > 0 && step < 5 && (
            <div className="w-full flex gap-3">
              <button
                onClick={goBack}
                className="flex-1 h-14 border-2 border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={goNext}
                disabled={step === 1 && !goal.trim() || step === 2 && interests.length === 0}
                className="flex-[2] h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold text-base shadow-lg shadow-orange-500/30 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          )}

          {step === 0 && (
            <button
              onClick={goNext}
              disabled={!name.trim()}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Let&apos;s Go
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          )}

          {step === 5 && (
            <>
              <button
                onClick={finish}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
              >
                Start My First Course
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </button>
              <button
                onClick={finish}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Explore on my own
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
