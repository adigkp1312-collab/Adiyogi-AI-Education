"use client";

import { useState, useCallback, useEffect } from "react";
import { interviewerService } from "@/services/interviewerService";
import type { InterviewSession, InterviewQuestion, InterviewProfile } from "@/types/interview";
import type { SupportedLanguage } from "@/types";

interface AdaptiveInterviewProps {
  language?: SupportedLanguage;
  onComplete: (profile: InterviewProfile) => void;
  onCancel?: () => void;
}

export default function AdaptiveInterview({
  language = "en",
  onComplete,
  onCancel,
}: AdaptiveInterviewProps) {
  const [session, setSession] = useState<InterviewSession>(() =>
    interviewerService.createSession(language)
  );
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | number>("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);

  useEffect(() => {
    const next = interviewerService.getNextQuestion(session);
    setCurrentQuestion(next);
    if (next?.type === "slider") {
      setSliderValue(next.min ?? 1);
    }
  }, [session]);

  const progress = interviewerService.getProgress(session);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion) return;

    let answer = currentAnswer;
    if (currentQuestion.type === "slider") {
      answer = sliderValue;
    }

    // Validate required
    if (currentQuestion.required) {
      if (Array.isArray(answer) && answer.length === 0) return;
      if (typeof answer === "string" && !answer.trim()) return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      const updated = interviewerService.recordResponse(
        session,
        currentQuestion.id,
        answer
      );
      setSession(updated);
      setCurrentAnswer("");
      setIsTransitioning(false);

      if (updated.status === "completed" && updated.generatedProfile) {
        onComplete(updated.generatedProfile);
      }
    }, 300);
  }, [currentQuestion, currentAnswer, sliderValue, session, onComplete]);

  const handleMultiSelect = useCallback(
    (value: string) => {
      setCurrentAnswer((prev) => {
        const arr = Array.isArray(prev) ? prev : [];
        return arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value];
      });
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && currentQuestion?.type === "text") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, currentQuestion]
  );

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg opacity-70">Preparing your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Progress bar */}
      <div className="w-full px-6 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-purple-300 font-medium">
            {progress}% complete
          </span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question area */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-300 ${
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Category badge */}
        <span className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-4">
          {currentQuestion.category}
        </span>

        {/* Question text */}
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 max-w-2xl leading-relaxed">
          {currentQuestion.text}
        </h2>

        {/* Answer input */}
        <div className="w-full max-w-xl space-y-3">
          {/* Text input */}
          {currentQuestion.type === "text" && (
            <input
              type="text"
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder || "Type your answer..."}
              autoFocus
              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          )}

          {/* Single choice */}
          {currentQuestion.type === "single_choice" &&
            currentQuestion.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setCurrentAnswer(option.value);
                  // Auto-advance for single choice
                  setTimeout(() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      const updated = interviewerService.recordResponse(
                        session,
                        currentQuestion.id,
                        option.value
                      );
                      setSession(updated);
                      setCurrentAnswer("");
                      setIsTransitioning(false);
                      if (updated.status === "completed" && updated.generatedProfile) {
                        onComplete(updated.generatedProfile);
                      }
                    }, 300);
                  }, 150);
                }}
                className={`w-full px-6 py-4 rounded-2xl text-left text-lg font-medium transition-all duration-200 ${
                  currentAnswer === option.value
                    ? "bg-purple-600 text-white border-2 border-purple-400"
                    : "bg-slate-800/50 text-slate-200 border border-slate-700 hover:border-purple-500 hover:bg-slate-800"
                }`}
              >
                {option.label}
              </button>
            ))}

          {/* Multi choice */}
          {currentQuestion.type === "multi_choice" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options?.map((option) => {
                  const selected =
                    Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option.value);
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleMultiSelect(option.value)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selected
                          ? "bg-purple-600 text-white border-2 border-purple-400"
                          : "bg-slate-800/50 text-slate-200 border border-slate-700 hover:border-purple-500"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleSubmit}
                disabled={
                  currentQuestion.required &&
                  (!Array.isArray(currentAnswer) || currentAnswer.length === 0)
                }
                className="mt-4 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-2xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            </>
          )}

          {/* Slider */}
          {currentQuestion.type === "slider" && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-white">
                  {sliderValue}
                </span>
                <span className="text-xl text-slate-400 ml-2">hrs/week</span>
              </div>
              <input
                type="range"
                min={currentQuestion.min ?? 1}
                max={currentQuestion.max ?? 40}
                step={currentQuestion.step ?? 1}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-sm text-slate-500">
                <span>{currentQuestion.min ?? 1}h</span>
                <span>{currentQuestion.max ?? 40}h</span>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {/* Text submit button */}
          {currentQuestion.type === "text" && (
            <button
              onClick={handleSubmit}
              disabled={
                currentQuestion.required &&
                typeof currentAnswer === "string" &&
                !currentAnswer.trim()
              }
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-2xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-6 pb-6 text-center">
        <p className="text-sm text-slate-500">
          {currentQuestion.type === "text"
            ? "Press Enter to continue"
            : currentQuestion.type === "multi_choice"
            ? "Select all that apply"
            : ""}
        </p>
      </div>
    </div>
  );
}
