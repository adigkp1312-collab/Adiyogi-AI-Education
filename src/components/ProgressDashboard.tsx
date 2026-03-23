"use client";

import type { ProgressMetrics, ModuleEvaluation, AdaptationRecord } from "@/services/evaluationEngine";

interface ProgressDashboardProps {
  progress: ProgressMetrics;
  moduleEvaluations: ModuleEvaluation[];
  adaptationHistory: AdaptationRecord[];
  onStartModule?: (moduleNumber: number) => void;
}

const PACE_CONFIG: Record<string, { color: string; label: string }> = {
  ahead: { color: "text-green-400", label: "Ahead of schedule" },
  on_track: { color: "text-blue-400", label: "On track" },
  behind: { color: "text-yellow-400", label: "Behind schedule" },
  stalled: { color: "text-red-400", label: "Inactive" },
};

export default function ProgressDashboard({
  progress,
  moduleEvaluations,
  adaptationHistory,
  onStartModule,
}: ProgressDashboardProps) {
  const paceConfig = PACE_CONFIG[progress.paceStatus] || PACE_CONFIG.on_track;

  return (
    <div className="space-y-6" role="region" aria-label="Learning progress dashboard">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Completed"
          value={`${progress.completedModules}/${progress.totalModules}`}
          subtext="modules"
          color="text-purple-400"
        />
        <StatCard
          label="Avg Score"
          value={progress.averageQuizScore > 0 ? `${progress.averageQuizScore}%` : "\u2014"}
          subtext="quiz average"
          color="text-blue-400"
        />
        <StatCard
          label="Time Spent"
          value={formatTime(progress.totalTimeSpentMinutes)}
          subtext="total learning"
          color="text-green-400"
        />
        <StatCard
          label="Streak"
          value={`${progress.currentStreak}`}
          subtext={`days (best: ${progress.longestStreak})`}
          color="text-orange-400"
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
          <span className={`text-sm font-medium ${paceConfig.color}`} role="status">
            {paceConfig.label}
          </span>
        </div>
        <div
          className="w-full h-3 bg-slate-700 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress.completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall completion progress"
        >
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${progress.completionRate}%` }}
          />
        </div>
        <p className="text-sm text-slate-400 mt-2">
          {progress.completionRate}% complete
        </p>
      </div>

      {/* Module List */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Modules</h3>
        <div className="space-y-3" role="list" aria-label="Module list">
          {moduleEvaluations.map((mod) => (
            <ModuleRow
              key={mod.moduleNumber}
              evaluation={mod}
              onStart={onStartModule}
            />
          ))}
        </div>
      </div>

      {/* Adaptation History */}
      {adaptationHistory.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Course Adaptations</h3>
          <div className="space-y-3" role="list" aria-label="Adaptation history">
            {adaptationHistory.slice(-5).reverse().map((adaptation) => (
              <div
                key={adaptation.id}
                role="listitem"
                className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl"
              >
                <span className="text-purple-400 mt-0.5" aria-hidden="true">*</span>
                <div>
                  <p className="text-sm text-white">{adaptation.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    <time dateTime={adaptation.timestamp}>
                      {new Date(adaptation.timestamp).toLocaleDateString()}
                    </time>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function StatCard({
  label,
  value,
  subtext,
  color,
}: {
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtext}</p>
    </div>
  );
}

function ModuleRow({
  evaluation,
  onStart,
}: {
  evaluation: ModuleEvaluation;
  onStart?: (moduleNumber: number) => void;
}) {
  const statusConfig = {
    not_started: { icon: "\u25cb", color: "text-slate-500", bg: "bg-slate-700", label: "Not started" },
    in_progress: { icon: "\u25d1", color: "text-blue-400", bg: "bg-blue-500/20", label: "In progress" },
    completed: { icon: "\u25cf", color: "text-green-400", bg: "bg-green-500/20", label: "Completed" },
    skipped: { icon: "\u2014", color: "text-slate-600", bg: "bg-slate-800", label: "Skipped" },
  };

  const config = statusConfig[evaluation.status];

  return (
    <div
      role="listitem"
      className={`flex items-center justify-between p-3 rounded-xl ${config.bg} transition-all`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg ${config.color}`} aria-hidden="true">{config.icon}</span>
        <div>
          <p className={`text-sm font-medium ${config.color}`}>
            Module {evaluation.moduleNumber}
            <span className="sr-only"> - {config.label}</span>
          </p>
          {evaluation.timeSpentMinutes > 0 && (
            <p className="text-xs text-slate-500">
              {formatTime(evaluation.timeSpentMinutes)} spent
              {evaluation.quizScore !== undefined && ` \u00b7 Score: ${evaluation.quizScore}%`}
            </p>
          )}
        </div>
      </div>

      {evaluation.status === "not_started" && onStart && (
        <button
          onClick={() => onStart(evaluation.moduleNumber)}
          className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          aria-label={`Start module ${evaluation.moduleNumber}`}
        >
          Start
        </button>
      )}

      {evaluation.selfRatedConfidence > 0 && (
        <div className="flex gap-0.5" aria-label={`Confidence: ${evaluation.selfRatedConfidence} out of 5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xs ${
                star <= evaluation.selfRatedConfidence
                  ? "text-yellow-400"
                  : "text-slate-700"
              }`}
              aria-hidden="true"
            >
              \u2605
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
