"use client";

import { useState } from "react";
import type { CoursePlan as CoursePlanType, SupportedLanguage, ContentResource } from "@/types";
import { t } from "@/lib/i18n";
import ContentCard from "./ContentCard";

interface CoursePlanProps {
  plan: CoursePlanType;
  language: SupportedLanguage;
  completedResources: Set<string>;
  onMarkComplete: (resourceId: string) => void;
  onSpeak?: (text: string) => void;
}

export default function CoursePlan({
  plan,
  language,
  completedResources,
  onMarkComplete,
  onSpeak,
}: CoursePlanProps) {
  const [expandedWeek, setExpandedWeek] = useState<number>(1);

  const totalResources = (plan.weeks || []).reduce(
    (sum: number, w: any) => sum + (w.resources?.length || 0),
    0
  );
  const completedCount = completedResources.size;
  const progressPercent =
    totalResources > 0
      ? Math.round((completedCount / totalResources) * 100)
      : 0;

  const skillBadge = ({
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  } as Record<string, string>)[plan.skill_level || "beginner"];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{plan.topic}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${skillBadge}`}>
                {t(((plan.skill_level || "beginner") as any), language)}
              </span>
              <span className="text-xs text-blue-200">
                {plan.totalWeeks || plan.weeks?.length || 4} {t("weeks", language)}
              </span>
            </div>
          </div>
          {onSpeak && (
            <button
              onClick={() => onSpeak(plan.topic || "Course plan")}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              title="Read aloud"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-200 mb-1">
            <span>{t("progress", language)}</span>
            <span>
              {completedCount}/{totalResources} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week Cards */}
      <div className="space-y-4">
        {(plan.weeks || []).map((week: any) => {
          const weekCompleted = (week.resources || []).filter((r: ContentResource) =>
            completedResources.has(r.id!)
          ).length;
          const isExpanded = expandedWeek === week.weekNumber;
          const weekDone =
            week.resources.length > 0 &&
            weekCompleted === week.resources.length;

          return (
            <div
              key={week.weekNumber}
              className={`border rounded-xl overflow-hidden transition-all ${weekDone
                ? "border-green-300 bg-green-50/50"
                : "border-slate-200"
                }`}
            >
              {/* Week Header */}
              <button
                onClick={() =>
                  setExpandedWeek(isExpanded ? -1 : week.weekNumber)
                }
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${weekDone
                      ? "bg-green-500 text-white"
                      : "bg-[#1a237e]/10 text-[#1a237e]"
                      }`}
                  >
                    {weekDone ? "✓" : week.weekNumber}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-800">
                      {t("weekLabel", language)} {week.weekNumber}:{" "}
                      {week.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {week.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {weekCompleted}/{week.resources.length}
                  </span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Week Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {week.topics?.map((topic: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-[#1a237e]/5 text-[#1a237e] px-3 py-1 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Resources */}
                  <div className="space-y-3">
                    {week.resources?.length > 0 ? (
                      week.resources.map((resource: ContentResource) => (
                        <ContentCard
                          key={resource.id}
                          resource={resource}
                          isCompleted={completedResources.has(resource.id!)}
                          onMarkComplete={onMarkComplete}
                          completedLabel={t("completed", language)}
                          markCompleteLabel={t("markComplete", language)}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic py-4 text-center">
                        {t("noResults", language)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
