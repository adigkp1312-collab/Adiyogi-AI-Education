/**
 * Adaptive Learning Algorithm
 *
 * Takes evaluation data and adapts the course plan.
 * Adjusts: difficulty, pace, module ordering, content suggestions.
 */

import type { CourseJSON, CurriculumModule } from '../types';
import type { EvaluationData, AdaptationRecord, ProgressMetrics } from './evaluationEngine';
import { evaluationEngine } from './evaluationEngine';

export interface AdaptationResult {
  adaptedCourse: CourseJSON;
  adaptations: AdaptationRecord[];
  summary: string;
}

/**
 * Run the adaptive learning algorithm on a course.
 * Evaluates progress and applies changes.
 */
export function adaptCourse(
  course: CourseJSON,
  evaluation: EvaluationData,
): AdaptationResult {
  const adaptations: AdaptationRecord[] = [];
  let adaptedCourse = { ...course };

  // 1. Check if adaptation is needed
  const adaptation = evaluationEngine.evaluateForAdaptation(evaluation);
  if (adaptation) {
    adaptations.push(adaptation);
    adaptedCourse = applyAdaptation(adaptedCourse, adaptation, evaluation);
  }

  // 2. Reorder upcoming modules based on performance
  adaptedCourse = reorderByStrength(adaptedCourse, evaluation);

  // 3. Update adaptive notes
  adaptedCourse = {
    ...adaptedCourse,
    adaptive_notes: generateAdaptiveNotes(evaluation),
    updated_at: Date.now(),
  };

  const summary = adaptations.length > 0
    ? `Applied ${adaptations.length} adaptation(s): ${adaptations.map((a) => a.description).join('; ')}`
    : 'No adaptations needed — course is on track.';

  return { adaptedCourse, adaptations, summary };
}

/**
 * Apply a specific adaptation to the course.
 */
function applyAdaptation(
  course: CourseJSON,
  adaptation: AdaptationRecord,
  evaluation: EvaluationData,
): CourseJSON {
  const adapted = { ...course, modules: [...course.modules] };

  for (const change of adaptation.changes) {
    switch (change.type) {
      case 'difficulty_adjust':
        adapted.modules = adjustDifficulty(adapted.modules, evaluation);
        break;
      case 'pace_adjust':
        adapted.modules = adjustPace(adapted.modules, evaluation);
        break;
      case 'add_module':
        // Could add remedial modules based on weak areas
        break;
      case 'remove_module':
        if (change.moduleNumber) {
          adapted.modules = adapted.modules.filter(
            (m) => m.module_number !== change.moduleNumber,
          );
        }
        break;
      case 'reorder':
        adapted.modules = reorderByStrength(adapted, evaluation).modules;
        break;
    }
  }

  return adapted;
}

/**
 * Adjust module difficulty based on quiz scores and confidence.
 */
function adjustDifficulty(
  modules: CurriculumModule[],
  evaluation: EvaluationData,
): CurriculumModule[] {
  return modules.map((module) => {
    const moduleEval = evaluation.moduleEvaluations.find(
      (e) => e.moduleNumber === module.module_number,
    );

    // Only adjust incomplete modules
    if (!moduleEval || moduleEval.status === 'completed') return module;

    const isStruggling =
      (moduleEval.quizScore !== undefined && moduleEval.quizScore < 50) ||
      moduleEval.selfRatedConfidence < 2;

    if (isStruggling) {
      return {
        ...module,
        practice: [
          ...module.practice,
          'Review foundational concepts before proceeding',
          'Work through additional guided examples',
        ],
        assessment: 'Simplified assessment: demonstrate understanding with guided walkthrough',
      };
    }

    return module;
  });
}

/**
 * Adjust module pacing based on time spent and progress rate.
 */
function adjustPace(
  modules: CurriculumModule[],
  evaluation: EvaluationData,
): CurriculumModule[] {
  const { paceStatus } = evaluation.overallProgress;

  return modules.map((module) => {
    const moduleEval = evaluation.moduleEvaluations.find(
      (e) => e.moduleNumber === module.module_number,
    );

    if (!moduleEval || moduleEval.status === 'completed') return module;

    if (paceStatus === 'behind' || paceStatus === 'stalled') {
      // Extend duration
      const currentDuration = parseInt(module.duration) || 2;
      return {
        ...module,
        duration: `${currentDuration + 1} weeks (extended)`,
      };
    }

    if (
      paceStatus === 'ahead' &&
      evaluation.overallProgress.averageQuizScore > 85
    ) {
      // Compress duration
      const currentDuration = parseInt(module.duration) || 2;
      return {
        ...module,
        duration: `${Math.max(1, currentDuration - 1)} weeks (accelerated)`,
      };
    }

    return module;
  });
}

/**
 * Reorder upcoming modules: put stronger topics later, weaker ones next.
 * This ensures the learner builds confidence first.
 */
function reorderByStrength(
  course: CourseJSON,
  evaluation: EvaluationData,
): CourseJSON {
  const { moduleEvaluations } = evaluation;

  // Split into completed and upcoming
  const completedNums = new Set(
    moduleEvaluations
      .filter((m) => m.status === 'completed')
      .map((m) => m.moduleNumber),
  );

  const completed = course.modules.filter((m) => completedNums.has(m.module_number));
  const upcoming = course.modules.filter((m) => !completedNums.has(m.module_number));

  // Don't reorder if not enough data
  if (completed.length < 2) {
    return course;
  }

  // Keep upcoming order as-is (prerequisite chain matters more than optimization)
  return { ...course, modules: [...completed, ...upcoming] };
}

/**
 * Generate human-readable adaptive notes for the course.
 */
function generateAdaptiveNotes(evaluation: EvaluationData): string {
  const { overallProgress, checkIns } = evaluation;
  const parts: string[] = [];

  parts.push(
    `Progress: ${overallProgress.completedModules}/${overallProgress.totalModules} modules (${overallProgress.completionRate}%).`,
  );

  if (overallProgress.averageQuizScore > 0) {
    parts.push(`Average quiz score: ${overallProgress.averageQuizScore}%.`);
  }

  if (overallProgress.currentStreak > 0) {
    parts.push(`Current streak: ${overallProgress.currentStreak} days.`);
  }

  parts.push(`Pace: ${overallProgress.paceStatus}.`);

  const recentMood = checkIns.length > 0 ? checkIns[checkIns.length - 1].mood : null;
  if (recentMood) {
    parts.push(`Last check-in mood: ${recentMood}.`);
  }

  if (evaluation.adaptationHistory.length > 0) {
    const lastAdaptation = evaluation.adaptationHistory[evaluation.adaptationHistory.length - 1];
    parts.push(`Last adaptation: ${lastAdaptation.description}`);
  }

  return parts.join(' ');
}

/**
 * Calculate recommended next action for the user.
 */
export function getNextRecommendation(
  course: CourseJSON,
  evaluation: EvaluationData,
): { action: string; moduleNumber?: number; reason: string } {
  const { moduleEvaluations, overallProgress } = evaluation;

  // Find current in-progress module
  const inProgress = moduleEvaluations.find((m) => m.status === 'in_progress');
  if (inProgress) {
    if (inProgress.timeSpentMinutes > 0 && inProgress.selfRatedConfidence >= 3) {
      return {
        action: 'complete_module',
        moduleNumber: inProgress.moduleNumber,
        reason: 'You seem confident — try the assessment to complete this module.',
      };
    }
    return {
      action: 'continue_module',
      moduleNumber: inProgress.moduleNumber,
      reason: 'Continue working on your current module.',
    };
  }

  // Find next not-started module
  const nextModule = moduleEvaluations.find((m) => m.status === 'not_started');
  if (nextModule) {
    return {
      action: 'start_module',
      moduleNumber: nextModule.moduleNumber,
      reason: `Ready for Module ${nextModule.moduleNumber}. Let's begin!`,
    };
  }

  // All completed
  if (overallProgress.completionRate >= 100) {
    return {
      action: 'course_complete',
      reason: 'Congratulations! You\'ve completed the entire course!',
    };
  }

  return {
    action: 'review',
    reason: 'Review your progress and check for any incomplete modules.',
  };
}
