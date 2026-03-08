"use client";

export default function LoadingSkeleton({ message }: { message: string }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] rounded-2xl p-6">
        <div className="h-8 w-64 bg-white/20 rounded shimmer mb-3" />
        <div className="h-4 w-40 bg-white/10 rounded shimmer" />
        <div className="h-2 w-full bg-white/10 rounded-full mt-4 shimmer" />
      </div>

      {/* Week skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full shimmer" />
            <div className="flex-1">
              <div className="h-5 w-48 shimmer rounded mb-2" />
              <div className="h-3 w-72 shimmer rounded" />
            </div>
          </div>
        </div>
      ))}

      {/* Loading message */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 bg-[#1a237e]/5 rounded-full px-6 py-3">
          <svg
            className="w-5 h-5 text-[#1a237e] animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium text-[#1a237e]">{message}</span>
        </div>
      </div>
    </div>
  );
}
