"use client";

import type { ContentResource } from "@/types";

interface ContentCardProps {
  resource: ContentResource;
  isCompleted?: boolean;
  onMarkComplete?: (id: string) => void;
  completedLabel?: string;
  markCompleteLabel?: string;
}

const SOURCE_CONFIG: Record<
  string,
  { label: string; className: string; icon: string }
> = {
  youtube: { label: "YouTube", className: "badge-youtube", icon: "▶" },
  nptel: { label: "NPTEL", className: "badge-nptel", icon: "🎓" },
  khan_academy: { label: "Khan Academy", className: "badge-khan", icon: "📐" },
  mit_ocw: { label: "MIT OCW", className: "badge-mit", icon: "🏛" },
  swayam: { label: "SWAYAM", className: "badge-swayam", icon: "📚" },
};

export default function ContentCard({
  resource,
  isCompleted,
  onMarkComplete,
  completedLabel = "Completed",
  markCompleteLabel = "Mark Complete",
}: ContentCardProps) {
  const source = SOURCE_CONFIG[resource.source] || SOURCE_CONFIG.youtube;

  return (
    <div
      className={`card-hover border rounded-xl p-4 flex gap-4 ${isCompleted
          ? "bg-green-50 border-green-200"
          : "bg-white border-slate-200"
        }`}
    >
      {resource.thumbnail && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-slate-100">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
            {resource.duration && (
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                {resource.duration}
              </span>
            )}
          </div>
        </a>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <span
            className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${source.className}`}
          >
            {source.icon} {source.label}
          </span>
        </div>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-slate-800 hover:text-[#1a237e] line-clamp-2 transition-colors"
        >
          {resource.title}
        </a>

        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
          {resource.viewCount !== undefined && resource.viewCount > 0 && (
            <span>{(resource.viewCount / 1000).toFixed(0)}K views</span>
          )}
          {resource.rating !== undefined && resource.rating > 0 && (
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {resource.rating.toFixed(1)}
            </span>
          )}
        </div>

        {onMarkComplete && (
          <button
            onClick={() => onMarkComplete(resource.id as string)}
            disabled={isCompleted}
            className={`mt-2 text-xs px-3 py-1 rounded-full font-medium transition-colors ${isCompleted
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-slate-100 text-slate-600 hover:bg-[#1a237e] hover:text-white"
              }`}
          >
            {isCompleted ? `✓ ${completedLabel}` : markCompleteLabel}
          </button>
        )}
      </div>
    </div>
  );
}
