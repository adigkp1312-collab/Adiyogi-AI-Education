"use client";

import type { ProgressMetrics, ModuleEvaluation, AdaptationRecord } from "@/services/evaluationEngine";

interface ProgressDashboardProps {
  progress: ProgressMetrics;
  moduleEvaluations: ModuleEvaluation[];
  adaptationHistory: AdaptationRecord[];
  onStartModule?: (moduleNumber: number) => void;
}

const PACE_COLORS: Record<string, string> = {
  ahead: "text-green-400",
  on_track: "text-blue-400",
  behind: "text-yellow-400",
  stalled: "text-red-400",
};

const PACE_LABELS: Record<string, string> = {
  ahead: "Ahead of schedule",
  on_track: "On track",
  behind: "Behind schedule",
  stalled: "Inactive",
};

export default function ProgressDashboard({
  progress,
  moduleEvaluations,
  adaptationHistory,
  onStartModule,
}: ProgressDashboardProps) {
  return (
    <div className="space-y-6">
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
          value={progress.averageQuizScore > 0 ? `${progress.averageQuizScore}%` : "—"}
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
          <span className={`text-sm font-medium ${PACE_COLORS[progress.paceStatus]}`}>
            {PACE_LABELS[progress.paceStatus]}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
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
        <div className="space-y-3">
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
          <div className="space-y-3">
            {adaptationHistory.slice(-5).reverse().map((adaptation) => (
              <div
                key={adaptation.id}
                className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl"
              >
                <span className="text-purple-400 mt-0.5">*</span>
                <div>
                  <p className="text-sm text-white">{adaptation.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(adaptation.timestamp).toLocaleDateString()}
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
    not_started: { icon: "○", color: "text-slate-500", bg: "bg-slate-700" },
    in_progress: { icon: "◑", color: "text-blue-400", bg: "bg-blue-500/20" },
    completed: { icon: "●", color: "text-green-400", bg: "bg-green-500/20" },
    skipped: { icon: "—", color: "text-slate-600", bg: "bg-slate-800" },
  };

  const config = statusConfig[evaluation.status];

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl ${config.bg} transition-all`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg ${config.color}`}>{config.icon}</span>
        <div>
          <p className={`text-sm font-medium ${config.color}`}>
            Module {evaluation.moduleNumber}
          </p>
          {evaluation.timeSpentMinutes > 0 && (
            <p className="text-xs text-slate-500">
              {formatTime(evaluation.timeSpentMinutes)} spent
              {evaluation.quizScore !== undefined && ` · Score: ${evaluation.quizScore}%`}
            </p>
          )}
        </div>
      </div>

      {evaluation.status === "not_started" && onStart && (
        <button
          onClick={() => onStart(evaluation.moduleNumber)}
          className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          Start
        </button>
      )}

      {evaluation.selfRatedConfidence > 0 && (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xs ${
                star <= evaluation.selfRatedConfidence
                  ? "text-yellow-400"
                  : "text-slate-700"
              }`}
            >
              ★
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
