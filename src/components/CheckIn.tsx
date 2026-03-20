"use client";

import { useState, useCallback } from "react";
import type { CheckInRecord } from "@/services/evaluationEngine";

interface CheckInProps {
  onSubmit: (
    mood: CheckInRecord["mood"],
    confusingTopics: string[],
    feedbackText?: string,
  ) => void;
  onDismiss: () => void;
  currentModuleTitle?: string;
}

const MOODS: { value: CheckInRecord["mood"]; emoji: string; label: string }[] = [
  { value: "great", emoji: "🔥", label: "Great" },
  { value: "good", emoji: "👍", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "struggling", emoji: "😅", label: "Struggling" },
  { value: "frustrated", emoji: "😤", label: "Frustrated" },
];

const COMMON_TOPICS = [
  "Python basics",
  "Math concepts",
  "Neural networks",
  "LLMs",
  "Prompt engineering",
  "AI agents",
  "RAG",
  "Deployment",
  "APIs",
  "Data handling",
];

export default function CheckIn({
  onSubmit,
  onDismiss,
  currentModuleTitle,
}: CheckInProps) {
  const [step, setStep] = useState<"mood" | "topics" | "feedback">("mood");
  const [selectedMood, setSelectedMood] = useState<CheckInRecord["mood"] | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const handleMoodSelect = useCallback((mood: CheckInRecord["mood"]) => {
    setSelectedMood(mood);
    if (mood === "great" || mood === "good") {
      // Happy users go straight to submit
      setStep("feedback");
    } else {
      // Struggling users get asked about confusing topics
      setStep("topics");
    }
  }, []);

  const handleTopicToggle = useCallback((topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedMood) return;
    onSubmit(selectedMood, selectedTopics, feedback || undefined);
  }, [selectedMood, selectedTopics, feedback, onSubmit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {step === "mood"
              ? "How are you doing?"
              : step === "topics"
              ? "What's confusing?"
              : "Anything else?"}
          </h3>
          <button
            onClick={onDismiss}
            className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {currentModuleTitle && step === "mood" && (
          <p className="text-sm text-slate-400 mb-4">
            Currently on: <span className="text-purple-300">{currentModuleTitle}</span>
          </p>
        )}

        {/* Step: Mood */}
        {step === "mood" && (
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  selectedMood === mood.value
                    ? "bg-purple-600 border-2 border-purple-400"
                    : "bg-slate-800 border border-slate-700 hover:border-purple-500"
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-slate-300">{mood.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step: Confusing Topics */}
        {step === "topics" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {COMMON_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedTopics.includes(topic)
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("feedback")}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step: Feedback */}
        {step === "feedback" && (
          <div className="space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any feedback or thoughts? (optional)"
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={onDismiss}
                className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
