"use client";

import { useState } from "react";
import type { CoursePlan, SupportedLanguage } from "@/types";
import { t } from "@/lib/i18n";
import CoursePlanView from "@/components/CoursePlan";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "\u0939\u093f\u0928\u094d\u0926\u0940" },
    { code: "ta", label: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd" },
    { code: "te", label: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41" },
    { code: "bn", label: "\u09ac\u09be\u0982\u09b2\u09be" },
    { code: "mr", label: "\u092e\u0930\u093e\u0920\u0940" },
    { code: "gu", label: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0" },
    { code: "kn", label: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1" },
    { code: "ml", label: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02" },
    { code: "pa", label: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40" },
    { code: "or", label: "\u0b13\u0b21\u0b3c\u0b3f\u0b06" },
    { code: "as", label: "\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be" },
    { code: "ur", label: "\u0627\u0631\u062f\u0648" },
];

const CATEGORIES = [
    { label: "Machine Learning", icon: "\ud83e\udd16" },
    { label: "Deep Learning", icon: "\ud83e\udde0" },
    { label: "NLP & LLMs", icon: "\ud83d\udcac" },
    { label: "Computer Vision", icon: "\ud83d\udc41\ufe0f" },
    { label: "Generative AI", icon: "\u2728" },
    { label: "Python for AI", icon: "\ud83d\udc0d" },
    { label: "Data Science", icon: "\ud83d\udcca" },
    { label: "Web Development", icon: "\ud83c\udf10" },
];

const MAX_TOPIC_LENGTH = 200;

export default function HomePage() {
    const [topic, setTopic] = useState("");
    const [language, setLanguage] = useState<SupportedLanguage>("en");
    const [skillLevel, setSkillLevel] = useState<
        "beginner" | "intermediate" | "advanced"
    >("beginner");
    const [plan, setPlan] = useState<CoursePlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [completedResources, setCompletedResources] = useState<Set<string>>(
        new Set()
    );

    const handleGenerate = async () => {
        const trimmed = topic.trim();
        if (!trimmed || trimmed.length > MAX_TOPIC_LENGTH) return;
        setLoading(true);
        setPlan(null);
        setError(null);
        try {
            const res = await fetch("/api/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: trimmed, language, skillLevel, weeks: 4 }),
            });
            if (!res.ok) throw new Error("Failed to generate");
            const data = await res.json();
            setPlan(data);
        } catch {
            setError("Failed to generate course plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = (resourceId: string) => {
        setCompletedResources((prev) => new Set(prev).add(resourceId));
    };

    return (
        <main className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab] text-white">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {t("freeForever", language)}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                        <span className="gradient-text" style={{ WebkitTextFillColor: "white" }}>
                            {t("appName", language)}
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-blue-100 mb-2">
                        {t("tagline", language)}
                    </p>
                    <p className="text-blue-200 mb-8 max-w-lg mx-auto">
                        {t("subtitle", language)}
                    </p>

                    {/* Search Input */}
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3" role="search">
                            <label htmlFor="topic-input" className="sr-only">
                                {t("placeholder", language)}
                            </label>
                            <input
                                id="topic-input"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                placeholder={t("placeholder", language)}
                                maxLength={MAX_TOPIC_LENGTH}
                                className="flex-1 px-5 py-3.5 rounded-xl text-slate-800 bg-white shadow-lg text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400 transition-all"
                                aria-describedby="topic-hint"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !topic.trim()}
                                className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                aria-label={t("generate", language)}
                            >
                                {loading ? t("generating", language) : t("generate", language)}
                            </button>
                        </div>
                        <p id="topic-hint" className="sr-only">Enter a topic to generate a personalized course plan</p>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            <label htmlFor="language-select" className="sr-only">{t("selectLanguage", language)}</label>
                            <select
                                id="language-select"
                                value={language}
                                onChange={(e) =>
                                    setLanguage(e.target.value as SupportedLanguage)
                                }
                                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 text-xs outline-none"
                            >
                                {LANGUAGES.map((l) => (
                                    <option key={l.code} value={l.code} className="text-black">
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="level-select" className="sr-only">{t("selectLevel", language)}</label>
                            <select
                                id="level-select"
                                value={skillLevel}
                                onChange={(e) =>
                                    setSkillLevel(
                                        e.target.value as "beginner" | "intermediate" | "advanced"
                                    )
                                }
                                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 text-xs outline-none"
                            >
                                <option value="beginner" className="text-black">
                                    {t("beginner", language)}
                                </option>
                                <option value="intermediate" className="text-black">
                                    {t("intermediate", language)}
                                </option>
                                <option value="advanced" className="text-black">
                                    {t("advanced", language)}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div role="alert" className="max-w-4xl mx-auto px-6 mt-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                        <p className="text-sm text-red-700">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-600 text-lg leading-none ml-4"
                            aria-label="Dismiss error"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {/* Categories */}
            {!plan && !loading && (
                <section className="max-w-4xl mx-auto px-6 py-10" aria-label="Explore categories">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                        Explore Categories
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => {
                                    setTopic(cat.label);
                                }}
                                className="card-hover flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-left hover:border-[#1a237e]/40 transition-colors"
                                aria-label={`Select ${cat.label}`}
                            >
                                <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
                                <span className="text-sm font-medium text-slate-700">
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                            <div className="text-3xl mb-3" aria-hidden="true">{"\ud83c\udfaf"}</div>
                            <h3 className="font-bold text-slate-800 mb-1">
                                AI-Powered Plans
                            </h3>
                            <p className="text-xs text-slate-500">
                                Personalized weekly course plans powered by AWS Bedrock
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
                            <div className="text-3xl mb-3" aria-hidden="true">{"\ud83d\udde3\ufe0f"}</div>
                            <h3 className="font-bold text-slate-800 mb-1">
                                {t("voiceFirst", language)}
                            </h3>
                            <p className="text-xs text-slate-500">
                                Speak in your language &mdash; powered by Sarvam AI
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                            <div className="text-3xl mb-3" aria-hidden="true">{"\ud83d\udcda"}</div>
                            <h3 className="font-bold text-slate-800 mb-1">
                                100% Free Content
                            </h3>
                            <p className="text-xs text-slate-500">
                                YouTube, NPTEL, Khan Academy &amp; more &mdash; all free
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Loading State */}
            {loading && (
                <div className="max-w-4xl mx-auto px-6 py-16 text-center" aria-live="polite">
                    <div className="inline-block">
                        <div className="w-16 h-16 border-4 border-[#1a237e]/20 border-t-[#1a237e] rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
                    </div>
                    <p className="text-slate-600 font-medium">
                        {t("generating", language)}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                        This may take a moment&hellip;
                    </p>
                </div>
            )}

            {/* Course Plan View */}
            {plan && !loading && (
                <div className="py-8 px-4">
                    <ErrorBoundary>
                        <CoursePlanView
                            plan={plan}
                            language={language}
                            completedResources={completedResources}
                            onMarkComplete={handleMarkComplete}
                        />
                    </ErrorBoundary>
                </div>
            )}

            {/* Footer */}
            <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-100">
                <p>{t("poweredBy", language)}</p>
                <p className="mt-1">{t("freeForever", language)}</p>
            </footer>
        </main>
    );
}
