/**
 * Evaluation Engine
 *
 * Tracks user progress, conducts periodic assessments, and provides
 * data for adaptive course adjustment.
 *
 * Per-user data stored in DynamoDB (primary source for adaptation).
 */

import { v4 as uuidv4 } from 'uuid';
import type { CourseJSON, CurriculumModule } from '../types';

// --- Evaluation Types ---

export interface EvaluationData {
  userId: string;
  courseId: string;
  moduleEvaluations: ModuleEvaluation[];
  overallProgress: ProgressMetrics;
  checkIns: CheckInRecord[];
  adaptationHistory: AdaptationRecord[];
  lastEvaluatedAt: string;
}

export interface ModuleEvaluation {
  moduleNumber: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  timeSpentMinutes: number;
  quizScore?: number;
  projectSubmitted: boolean;
  selfRatedConfidence: number; // 1-5
  engagementScore: number; // 0-100
}

export interface ProgressMetrics {
  completedModules: number;
  totalModules: number;
  completionRate: number;
  averageQuizScore: number;
  averageConfidence: number;
  totalTimeSpentMinutes: number;
  currentStreak: number; // consecutive days active
  longestStreak: number;
  lastActiveAt: string;
  paceStatus: 'ahead' | 'on_track' | 'behind' | 'stalled';
}

export interface CheckInRecord {
  id: string;
  timestamp: string;
  mood: 'great' | 'good' | 'okay' | 'struggling' | 'frustrated';
  confusingTopics: string[];
  feedbackText?: string;
  suggestedAction: string;
}

export interface AdaptationRecord {
  id: string;
  timestamp: string;
  trigger: 'quiz_score' | 'pace' | 'check_in' | 'inactivity' | 'manual';
  description: string;
  changes: AdaptationChange[];
}

export interface AdaptationChange {
  type: 'difficulty_adjust' | 'pace_adjust' | 'add_module' | 'remove_module' | 'reorder';
  moduleNumber?: number;
  oldValue?: string;
  newValue?: string;
}

// --- Evaluation Engine ---

export class EvaluationEngine {
  /**
   * Initialize evaluation data for a new course enrollment.
   */
  createEvaluation(userId: string, course: CourseJSON): EvaluationData {
    return {
      userId,
      courseId: course.id,
      moduleEvaluations: course.modules.map((m) => ({
        moduleNumber: m.module_number,
        status: 'not_started',
        timeSpentMinutes: 0,
        projectSubmitted: false,
        selfRatedConfidence: 0,
        engagementScore: 0,
      })),
      overallProgress: {
        completedModules: 0,
        totalModules: course.modules.length,
        completionRate: 0,
        averageQuizScore: 0,
        averageConfidence: 0,
        totalTimeSpentMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveAt: new Date().toISOString(),
        paceStatus: 'on_track',
      },
      checkIns: [],
      adaptationHistory: [],
      lastEvaluatedAt: new Date().toISOString(),
    };
  }

  /**
   * Record module progress update.
   */
  updateModuleProgress(
    evaluation: EvaluationData,
    moduleNumber: number,
    update: Partial<ModuleEvaluation>,
  ): EvaluationData {
    const moduleIndex = evaluation.moduleEvaluations.findIndex(
      (m) => m.moduleNumber === moduleNumber,
    );

    if (moduleIndex === -1) return evaluation;

    const updated = { ...evaluation };
    updated.moduleEvaluations = [...evaluation.moduleEvaluations];
    updated.moduleEvaluations[moduleIndex] = {
      ...updated.moduleEvaluations[moduleIndex],
      ...update,
    };

    // Recalculate overall progress
    updated.overallProgress = this.calculateProgress(updated);
    updated.lastEvaluatedAt = new Date().toISOString();

    return updated;
  }

  /**
   * Record a check-in with the user.
   */
  recordCheckIn(
    evaluation: EvaluationData,
    mood: CheckInRecord['mood'],
    confusingTopics: string[],
    feedbackText?: string,
  ): { evaluation: EvaluationData; suggestedAction: string } {
    const suggestedAction = this.determineSuggestedAction(evaluation, mood, confusingTopics);

    const checkIn: CheckInRecord = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      mood,
      confusingTopics,
      feedbackText,
      suggestedAction,
    };

    const updated = {
      ...evaluation,
      checkIns: [...evaluation.checkIns, checkIn],
    };

    return { evaluation: updated, suggestedAction };
  }

  /**
   * Evaluate if course should be adapted based on current data.
   */
  evaluateForAdaptation(evaluation: EvaluationData): AdaptationRecord | null {
    const { overallProgress, moduleEvaluations, checkIns } = evaluation;

    // Check for stalled progress
    if (overallProgress.paceStatus === 'stalled') {
      return this.createAdaptation('inactivity', 'User inactive for extended period', [
        {
          type: 'pace_adjust',
          oldValue: 'normal',
          newValue: 'extended — deadlines pushed back',
        },
      ]);
    }

    // Check for low quiz scores
    const completedWithQuiz = moduleEvaluations.filter(
      (m) => m.status === 'completed' && m.quizScore !== undefined,
    );
    if (completedWithQuiz.length >= 2) {
      const avgScore = completedWithQuiz.reduce(
        (sum, m) => sum + (m.quizScore || 0), 0,
      ) / completedWithQuiz.length;

      if (avgScore < 50) {
        return this.createAdaptation('quiz_score', `Average quiz score ${avgScore}% — adding remedial content`, [
          {
            type: 'difficulty_adjust',
            oldValue: 'current',
            newValue: 'easier — additional foundational content added',
          },
        ]);
      }

      if (avgScore > 90) {
        return this.createAdaptation('quiz_score', `Average quiz score ${avgScore}% — accelerating pace`, [
          {
            type: 'pace_adjust',
            oldValue: 'normal',
            newValue: 'accelerated — skipping introductory content',
          },
        ]);
      }
    }

    // Check recent check-ins for frustration
    const recentCheckIns = checkIns.slice(-3);
    const frustratedCount = recentCheckIns.filter(
      (c) => c.mood === 'frustrated' || c.mood === 'struggling',
    ).length;

    if (frustratedCount >= 2) {
      return this.createAdaptation('check_in', 'User reported frustration in recent check-ins', [
        {
          type: 'difficulty_adjust',
          oldValue: 'current',
          newValue: 'reduced — more guided examples added',
        },
        {
          type: 'pace_adjust',
          oldValue: 'normal',
          newValue: 'slower — extra time allocated per module',
        },
      ]);
    }

    return null;
  }

  // --- Private Helpers ---

  private calculateProgress(evaluation: EvaluationData): ProgressMetrics {
    const { moduleEvaluations } = evaluation;
    const completed = moduleEvaluations.filter((m) => m.status === 'completed');
    const withQuiz = completed.filter((m) => m.quizScore !== undefined);
    const withConfidence = moduleEvaluations.filter((m) => m.selfRatedConfidence > 0);

    const totalTime = moduleEvaluations.reduce((sum, m) => sum + m.timeSpentMinutes, 0);

    const now = new Date();
    const lastActive = new Date(evaluation.overallProgress.lastActiveAt);
    const daysSinceActive = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
    );

    let paceStatus: ProgressMetrics['paceStatus'] = 'on_track';
    if (daysSinceActive > 14) paceStatus = 'stalled';
    else if (daysSinceActive > 7) paceStatus = 'behind';

    const completionRate = moduleEvaluations.length > 0
      ? (completed.length / moduleEvaluations.length) * 100
      : 0;

    return {
      completedModules: completed.length,
      totalModules: moduleEvaluations.length,
      completionRate: Math.round(completionRate),
      averageQuizScore: withQuiz.length > 0
        ? Math.round(withQuiz.reduce((sum, m) => sum + (m.quizScore || 0), 0) / withQuiz.length)
        : 0,
      averageConfidence: withConfidence.length > 0
        ? Math.round(
            (withConfidence.reduce((sum, m) => sum + m.selfRatedConfidence, 0) / withConfidence.length) * 10,
          ) / 10
        : 0,
      totalTimeSpentMinutes: totalTime,
      currentStreak: daysSinceActive <= 1 ? evaluation.overallProgress.currentStreak : 0,
      longestStreak: evaluation.overallProgress.longestStreak,
      lastActiveAt: now.toISOString(),
      paceStatus,
    };
  }

  private determineSuggestedAction(
    evaluation: EvaluationData,
    mood: CheckInRecord['mood'],
    confusingTopics: string[],
  ): string {
    if (mood === 'frustrated' || mood === 'struggling') {
      if (confusingTopics.length > 0) {
        return `Review supplementary resources for: ${confusingTopics.join(', ')}. Consider slowing pace.`;
      }
      return 'Take a break and revisit the current module tomorrow. Consider reaching out in the community.';
    }

    if (mood === 'great' && evaluation.overallProgress.averageQuizScore > 80) {
      return 'You\'re doing excellent! Consider accelerating to the next module.';
    }

    return 'Keep up the steady progress. Complete current module before moving on.';
  }

  private createAdaptation(
    trigger: AdaptationRecord['trigger'],
    description: string,
    changes: AdaptationChange[],
  ): AdaptationRecord {
    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      trigger,
      description,
      changes,
    };
  }
}

export const evaluationEngine = new EvaluationEngine();
