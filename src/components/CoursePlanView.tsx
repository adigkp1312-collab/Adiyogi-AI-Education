"use client";

import { useState } from "react";
import type { CourseJSON, CurriculumModule, IndexedCourse } from "@/types";

interface CoursePlanViewProps {
  course: CourseJSON;
  onStartModule?: (moduleNumber: number) => void;
  onCompleteModule?: (moduleNumber: number) => void;
}

export default function CoursePlanView({
  course,
  onStartModule,
  onCompleteModule,
}: CoursePlanViewProps) {
  const [expandedModule, setExpandedModule] = useState<number | null>(
    course.modules.length > 0 ? 1 : null,
  );

  const completedSet = new Set(course.completed_modules);

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
        <p className="text-slate-300 text-sm mb-4">{course.description}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Tag label={course.estimated_duration} />
          <Tag label={course.skill_level} />
          <Tag label={`${course.modules.length} modules`} />
          <Tag label={`${course.matched_courses.length} resources`} />
        </div>
      </div>

      {/* Tips */}
      {course.tips.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">
            Tips
          </h3>
          <ul className="space-y-1.5">
            {course.tips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-purple-400 shrink-0">-</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-3">
        {course.modules.map((module) => {
          const isCompleted = completedSet.has(module.module_number);
          const isExpanded = expandedModule === module.module_number;

          return (
            <div
              key={module.module_number}
              className={`rounded-2xl border transition-all ${
                isCompleted
                  ? "bg-green-900/10 border-green-500/20"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              {/* Module Header */}
              <button
                onClick={() =>
                  setExpandedModule(isExpanded ? null : module.module_number)
                }
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted
                        ? "bg-green-500/20 text-green-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {isCompleted ? "✓" : module.module_number}
                  </span>
                  <div>
                    <h3 className="text-white font-semibold">{module.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {module.duration} · {module.topics.length} topics
                    </p>
                  </div>
                </div>
                <span className="text-slate-500 text-lg">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4">
                  {/* Objective */}
                  <p className="text-sm text-slate-300">{module.objective}</p>

                  {/* Topics */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Courses / Resources */}
                  {module.courses.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Resources
                      </h4>
                      <div className="space-y-2">
                        {module.courses.map((course) => (
                          <CourseLink key={course.id} course={course} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Tasks */}
                  {module.practice.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Practice
                      </h4>
                      <ul className="space-y-1">
                        {module.practice.map((task, i) => (
                          <li key={i} className="text-sm text-slate-300 flex gap-2">
                            <span className="text-purple-400 shrink-0">□</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Assessment */}
                  <div className="bg-slate-900/50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Assessment
                    </h4>
                    <p className="text-sm text-slate-300">{module.assessment}</p>
                  </div>

                  {/* Actions */}
                  {!isCompleted && (
                    <div className="flex gap-3">
                      {onStartModule && (
                        <button
                          onClick={() => onStartModule(module.module_number)}
                          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-500 transition-colors"
                        >
                          Start Module
                        </button>
                      )}
                      {onCompleteModule && (
                        <button
                          onClick={() => onCompleteModule(module.module_number)}
                          className="px-4 py-2 bg-slate-700 text-slate-300 text-sm rounded-xl hover:bg-slate-600 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Sub-components ---

function Tag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 bg-slate-800/80 text-slate-300 text-xs rounded-full border border-slate-700">
      {label}
    </span>
  );
}

function CourseLink({ course }: { course: IndexedCourse }) {
  return (
    <a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate group-hover:text-purple-300 transition-colors">
          {course.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {course.provider} · {course.duration} · {course.level}
          {course.free && " · Free"}
        </p>
      </div>
      {course.rating > 0 && (
        <span className="text-xs text-yellow-400 shrink-0">
          ★ {course.rating}
        </span>
      )}
    </a>
  );
}
