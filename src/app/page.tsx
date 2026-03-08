"use client";

import { useState } from "react";
import type { CoursePlan, SupportedLanguage } from "@/types";
import { t } from "@/lib/i18n";
import CoursePlanView from "@/components/CoursePlan";

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
    { code: "bn", label: "বাংলা" },
    { code: "mr", label: "मराठी" },
    { code: "gu", label: "ગુજરાતી" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "ml", label: "മലയാളം" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "or", label: "ଓଡ଼ିଆ" },
    { code: "as", label: "অসমীয়া" },
    { code: "ur", label: "اردو" },
];

const CATEGORIES = [
    { label: "Machine Learning", icon: "🤖" },
    { label: "Deep Learning", icon: "🧠" },
    { label: "NLP & LLMs", icon: "💬" },
    { label: "Computer Vision", icon: "👁️" },
    { label: "Generative AI", icon: "✨" },
    { label: "Python for AI", icon: "🐍" },
    { label: "Data Science", icon: "📊" },
    { label: "Web Development", icon: "🌐" },
];

export default function HomePage() {
    const [topic, setTopic] = useState("");
    const [language, setLanguage] = useState<SupportedLanguage>("en");
    const [skillLevel, setSkillLevel] = useState<
        "beginner" | "intermediate" | "advanced"
    >("beginner");
    const [plan, setPlan] = useState<CoursePlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [completedResources, setCompletedResources] = useState<Set<string>>(
        new Set()
    );

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setPlan(null);
        try {
            const res = await fetch("/api/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, language, skillLevel, weeks: 4 }),
            });
            if (!res.ok) throw new Error("Failed to generate");
            const data = await res.json();
            setPlan(data);
        } catch (err) {
            console.error(err);
            alert("Failed to generate course plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = (resourceId: string) => {
        setCompletedResources((prev) => new Set([...prev, resourceId]));
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
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                placeholder={t("placeholder", language)}
                                className="flex-1 px-5 py-3.5 rounded-xl text-slate-800 bg-white shadow-lg text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400 transition-all"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !topic.trim()}
                                className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {loading ? t("generating", language) : t("generate", language)}
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                            <select
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
                            <select
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

            {/* Categories */}
            {!plan && !loading && (
                <div className="max-w-4xl mx-auto px-6 py-10">
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
                            >
                                <span className="text-2xl">{cat.icon}</span>
                                <span className="text-sm font-medium text-slate-700">
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                            <div className="text-3xl mb-3">🎯</div>
                            <h3 className="font-bold text-slate-800 mb-1">
                                AI-Powered Plans
                            </h3>
                            <p className="text-xs text-slate-500">
                                Personalized weekly course plans powered by AWS Bedrock
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
                            <div className="text-3xl mb-3">🗣️</div>
                            <h3 className="font-bold text-slate-800 mb-1">
                                {t("voiceFirst", language)}
                            </h3>
                            <p className="text-xs text-slate-500">
                                Speak in your language — powered by Sarvam AI
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                            <div className="text-3xl mb-3">📚</div>
                            <h3 className="font-bold text-slate-800 mb-1">
                                100% Free Content
                            </h3>
                            <p className="text-xs text-slate-500">
                                YouTube, NPTEL, Khan Academy & more — all free
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="inline-block">
                        <div className="w-16 h-16 border-4 border-[#1a237e]/20 border-t-[#1a237e] rounded-full animate-spin mx-auto mb-4" />
                    </div>
                    <p className="text-slate-600 font-medium">
                        {t("generating", language)}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                        This may take a moment…
                    </p>
                </div>
            )}

            {/* Course Plan View */}
            {plan && !loading && (
                <div className="py-8 px-4">
                    <CoursePlanView
                        plan={plan}
                        language={language}
                        completedResources={completedResources}
                        onMarkComplete={handleMarkComplete}
                    />
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
