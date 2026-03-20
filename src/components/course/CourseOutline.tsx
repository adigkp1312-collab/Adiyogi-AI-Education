"use client";

import type { CoursePlan } from "@/types";

interface CourseOutlineProps {
  course: CoursePlan;
}

export function CourseOutline({ course }: CourseOutlineProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-6">{course.description}</p>

      <div className="flex gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
          {course.skill_level}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
          {course.estimated_duration}
        </span>
        {course.totalWeeks && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
            {course.totalWeeks} weeks
          </span>
        )}
      </div>

      {course.weeks && course.weeks.length > 0 ? (
        <div className="space-y-6">
          {course.weeks.map((week) => (
            <div
              key={week.weekNumber}
              className="border border-gray-200 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Week {week.weekNumber}: {week.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{week.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {week.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {week.resources.length > 0 && (
                <div className="space-y-3">
                  {week.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {resource.thumbnail && (
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resource.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {resource.source} · {resource.type}
                          {resource.duration && ` · ${resource.duration}`}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : course.modules && course.modules.length > 0 ? (
        <div className="space-y-4">
          {course.modules.map((mod, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {mod.title}
              </h2>
            </div>
          ))}
        </div>
      ) : null}

      {course.tips && course.tips.length > 0 && (
        <div className="mt-8 p-6 bg-orange-50 rounded-xl">
          <h3 className="text-sm font-semibold text-orange-800 mb-3">
            Tips for Success
          </h3>
          <ul className="space-y-2">
            {course.tips.map((tip, idx) => (
              <li key={idx} className="text-sm text-orange-700 flex gap-2">
                <span>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
