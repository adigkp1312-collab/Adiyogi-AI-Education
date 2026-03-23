/**
 * Profile Builder Service
 *
 * Builds and continuously evolves a learner profile through:
 * 1. Direct input — interview responses (initial profile)
 * 2. Indirect input — behavioral signals from platform interactions
 *
 * Backed by DynamoDB (structured data) + Vertex AI Datastore (semantic search).
 * Uses Bedrock LLM to generate natural language profile summaries for RAG.
 */

import { v4 as uuidv4 } from 'uuid';
import type { InterviewProfile } from '../types/interview';
import type { LearnerProfile, UserProfile } from '../types';
import type {
  EnrichedProfile,
  ProfileSignal,
  SignalType,
  SkillSnapshot,
  LearningPreferences,
  BehavioralProfile,
  ProfileDocument,
} from '../types/profile';
import {
  saveEnrichedProfile,
  getEnrichedProfile,
  updateEnrichedProfile,
  appendSignal,
  getRecentSignals,
} from '../lib/dynamodb';
import { upsertProfileDocument, searchProfiles } from './vertexDatastore';

// --- Constants ---

const HIGH_SCORE_THRESHOLD = 80;
const LOW_SCORE_THRESHOLD = 50;
const VERTEX_SYNC_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const HIGH_IMPACT_SIGNALS: SignalType[] = ['course_completed', 'goal_updated'];

// --- Profile Builder Service ---

export class ProfileBuilderService {

  /**
   * Step 1+2: Create an enriched profile from interview data.
   * Maps InterviewProfile fields, sets defaults for behavioral data,
   * syncs to Vertex for semantic search.
   */
  async initializeFromInterview(
    userId: string,
    interview: InterviewProfile,
  ): Promise<EnrichedProfile> {
    const now = new Date().toISOString();

    const profile: EnrichedProfile = {
      userId,
      name: interview.name,
      language: interview.language,
      education: interview.education,
      currentRole: interview.currentRole,
      createdAt: now,
      updatedAt: now,

      skills: {
        experienceLevel: interview.experienceLevel,
        programmingLanguages: interview.programmingLanguages,
        aiExperience: interview.aiExperience,
        strongAreas: this.inferStrongAreas(interview),
        weakAreas: this.inferWeakAreas(interview),
        lastAssessedAt: now,
      },

      preferences: {
        learningStyle: interview.learningStyle,
        availableHoursPerWeek: interview.availableHoursPerWeek,
        deadline: interview.deadline,
        preferredPace: this.inferPace(interview),
        preferredDifficulty: this.inferDifficulty(interview),
        contentTypeAffinity: this.inferContentAffinity(interview),
      },

      goals: interview.goals,
      specificInterests: interview.specificInterests,
      preferredProjectTypes: interview.preferredProjectTypes,

      behavioral: {
        totalTimeSpentMinutes: 0,
        averageSessionMinutes: 0,
        completionRate: 0,
        averageQuizScore: 0,
        currentStreak: 0,
        engagementTrend: 'stable',
        lastActiveAt: now,
        coursesCompleted: 0,
        coursesInProgress: 0,
      },

      activeCourseIds: [],
      profileSummary: '',
      lastSyncedToVertexAt: '',
      version: 1,
    };

    // Generate summary and persist
    profile.profileSummary = this.generateProfileSummary(profile);
    await saveEnrichedProfile(profile);
    await this.syncToVertex(profile);

    return profile;
  }

  /**
   * Step 3+4: Ingest a behavioral signal and update the profile.
   * Appends signal to log, recalculates derived fields, persists.
   */
  async ingestSignal(signal: ProfileSignal): Promise<EnrichedProfile> {
    const profile = await getEnrichedProfile(signal.userId);
    if (!profile) {
      throw new Error(`Profile not found for userId: ${signal.userId}`);
    }

    // Persist signal to log
    await appendSignal(signal);

    // Apply signal to profile
    const updated = this.applySignal(profile, signal);
    updated.updatedAt = new Date().toISOString();

    // Persist updated profile
    await updateEnrichedProfile(signal.userId, {
      skills: updated.skills,
      preferences: updated.preferences,
      behavioral: updated.behavioral,
      goals: updated.goals,
      specificInterests: updated.specificInterests,
      activeCourseIds: updated.activeCourseIds,
      profileSummary: updated.profileSummary,
      updatedAt: updated.updatedAt,
    });

    // Sync to Vertex if enough time has passed or signal is high-impact
    const timeSinceSync = Date.now() - new Date(profile.lastSyncedToVertexAt || 0).getTime();
    if (timeSinceSync > VERTEX_SYNC_COOLDOWN_MS || HIGH_IMPACT_SIGNALS.includes(signal.type)) {
      await this.syncToVertex(updated);
    }

    return updated;
  }

  /**
   * Get the current enriched profile for a user.
   */
  async getProfile(userId: string): Promise<EnrichedProfile | null> {
    return getEnrichedProfile(userId);
  }

  /**
   * Create a signal object ready for ingestion.
   */
  createSignal(
    userId: string,
    type: SignalType,
    payload: Record<string, unknown>,
    courseId?: string,
    moduleNumber?: number,
  ): ProfileSignal {
    return {
      id: uuidv4(),
      userId,
      type,
      payload,
      timestamp: new Date().toISOString(),
      courseId,
      moduleNumber,
    };
  }

  /**
   * Semantic search across profiles via Vertex AI.
   * Useful for admin dashboards, cohort matching, recommendation engines.
   */
  async queryProfiles(
    query: string,
    filters?: { level?: string },
    limit?: number,
  ): Promise<ProfileDocument[]> {
    return searchProfiles(query, filters, limit);
  }

  /**
   * Convert EnrichedProfile → LearnerProfile for backward compatibility
   * with curatorService, generate-plan, etc.
   */
  toLearnerProfile(profile: EnrichedProfile): LearnerProfile {
    return {
      name: profile.name,
      goal: profile.goals.join(', '),
      prior_knowledge: [
        ...profile.skills.programmingLanguages,
        ...profile.skills.aiExperience,
        ...profile.skills.strongAreas,
      ],
      weak_areas: profile.skills.weakAreas,
      available_hours_per_week: profile.preferences.availableHoursPerWeek,
      preferred_language: profile.language,
      level: profile.skills.experienceLevel,
      learning_style: profile.preferences.learningStyle,
      deadline: profile.preferences.deadline || '',
      education_background: profile.education,
    };
  }

  /**
   * Convert EnrichedProfile → UserProfile for backward compatibility
   * with existing DynamoDB users table.
   */
  toUserProfile(profile: EnrichedProfile): UserProfile {
    return {
      userId: profile.userId,
      name: profile.name,
      preferredLanguage: profile.language,
      interests: profile.specificInterests,
      activePlans: profile.activeCourseIds,
      createdAt: profile.createdAt,
      level: profile.skills.experienceLevel === 'none' ? 'beginner' : profile.skills.experienceLevel,
      goal: profile.goals.join(', '),
      education: profile.education,
      hoursPerWeek: profile.preferences.availableHoursPerWeek,
      learningStyle: profile.preferences.learningStyle,
      language: profile.language,
    };
  }

  // --- Private: Signal Processing ---

  private applySignal(profile: EnrichedProfile, signal: ProfileSignal): EnrichedProfile {
    const updated = { ...profile };

    switch (signal.type) {
      case 'quiz_score':
        updated.skills = this.applyQuizScore(updated.skills, signal);
        updated.behavioral = {
          ...updated.behavioral,
          averageQuizScore: this.recalcQuizAvg(updated.behavioral, signal),
          lastActiveAt: signal.timestamp,
        };
        break;

      case 'module_completed':
        updated.behavioral = {
          ...updated.behavioral,
          completionRate: this.recalcCompletionRate(updated.behavioral, signal),
          lastActiveAt: signal.timestamp,
        };
        updated.skills = this.maybePromoteLevel(updated.skills, updated.behavioral);
        break;

      case 'time_spent':
        updated.behavioral = this.applyTimeSpent(updated.behavioral, signal);
        break;

      case 'check_in':
        updated.skills = this.applyCheckIn(updated.skills, signal);
        updated.preferences = this.applyCheckInPreferences(updated.preferences, signal);
        updated.behavioral = { ...updated.behavioral, lastActiveAt: signal.timestamp };
        break;

      case 'content_preference':
        updated.preferences = this.applyContentPreference(updated.preferences, signal);
        break;

      case 'resource_skipped':
        updated.preferences = this.applyResourceSkipped(updated.preferences, signal);
        break;

      case 'course_started':
        updated.activeCourseIds = [...new Set([...updated.activeCourseIds, signal.courseId || ''])].filter(Boolean);
        updated.behavioral = {
          ...updated.behavioral,
          coursesInProgress: updated.behavioral.coursesInProgress + 1,
          lastActiveAt: signal.timestamp,
        };
        break;

      case 'course_completed':
        updated.activeCourseIds = updated.activeCourseIds.filter((id) => id !== signal.courseId);
        updated.behavioral = {
          ...updated.behavioral,
          coursesCompleted: updated.behavioral.coursesCompleted + 1,
          coursesInProgress: Math.max(0, updated.behavioral.coursesInProgress - 1),
          lastActiveAt: signal.timestamp,
        };
        break;

      case 'goal_updated': {
        const newGoals = signal.payload.goals as string[] | undefined;
        if (newGoals) updated.goals = newGoals;
        const newInterests = signal.payload.interests as string[] | undefined;
        if (newInterests) updated.specificInterests = newInterests;
        break;
      }
    }

    // Recalculate engagement trend
    updated.behavioral = this.recalcEngagementTrend(updated.behavioral);
    // Regenerate summary
    updated.profileSummary = this.generateProfileSummary(updated);

    return updated;
  }

  private applyQuizScore(skills: SkillSnapshot, signal: ProfileSignal): SkillSnapshot {
    const score = signal.payload.score as number;
    const topic = signal.payload.topic as string | undefined;
    if (!topic) return skills;

    const updated = { ...skills, lastAssessedAt: signal.timestamp };

    if (score >= HIGH_SCORE_THRESHOLD) {
      updated.strongAreas = [...new Set([...skills.strongAreas, topic])];
      updated.weakAreas = skills.weakAreas.filter((a) => a !== topic);
    } else if (score < LOW_SCORE_THRESHOLD) {
      updated.weakAreas = [...new Set([...skills.weakAreas, topic])];
      updated.strongAreas = skills.strongAreas.filter((a) => a !== topic);
    }

    return updated;
  }

  private recalcQuizAvg(behavioral: BehavioralProfile, signal: ProfileSignal): number {
    const score = signal.payload.score as number;
    const count = signal.payload.quizCount as number || 1;
    if (behavioral.averageQuizScore === 0) return score;
    return Math.round((behavioral.averageQuizScore * (count - 1) + score) / count);
  }

  private recalcCompletionRate(behavioral: BehavioralProfile, signal: ProfileSignal): number {
    const completed = (signal.payload.completedModules as number) || 0;
    const total = (signal.payload.totalModules as number) || 1;
    return Math.round((completed / total) * 100);
  }

  private applyTimeSpent(behavioral: BehavioralProfile, signal: ProfileSignal): BehavioralProfile {
    const minutes = (signal.payload.minutes as number) || 0;
    const totalTime = behavioral.totalTimeSpentMinutes + minutes;
    const sessionCount = Math.max(1, Math.ceil(totalTime / Math.max(1, behavioral.averageSessionMinutes || minutes)));
    return {
      ...behavioral,
      totalTimeSpentMinutes: totalTime,
      averageSessionMinutes: Math.round(totalTime / sessionCount),
      lastActiveAt: signal.timestamp,
    };
  }

  private applyCheckIn(skills: SkillSnapshot, signal: ProfileSignal): SkillSnapshot {
    const mood = signal.payload.mood as string;
    const confusingTopics = (signal.payload.confusingTopics as string[]) || [];

    if ((mood === 'frustrated' || mood === 'struggling') && confusingTopics.length > 0) {
      return {
        ...skills,
        weakAreas: [...new Set([...skills.weakAreas, ...confusingTopics])],
      };
    }
    return skills;
  }

  private applyCheckInPreferences(prefs: LearningPreferences, signal: ProfileSignal): LearningPreferences {
    const mood = signal.payload.mood as string;
    if (mood === 'great') {
      return { ...prefs, preferredPace: prefs.preferredPace === 'slow' ? 'normal' : 'fast' };
    }
    if (mood === 'frustrated' || mood === 'struggling') {
      return { ...prefs, preferredPace: prefs.preferredPace === 'fast' ? 'normal' : 'slow' };
    }
    return prefs;
  }

  private applyContentPreference(prefs: LearningPreferences, signal: ProfileSignal): LearningPreferences {
    const contentType = signal.payload.contentType as string;
    if (!contentType) return prefs;

    const affinity = { ...prefs.contentTypeAffinity };
    const current = affinity[contentType] || 0.5;
    // Exponential moving average: weight new engagement higher
    affinity[contentType] = Math.min(1, current * 0.7 + 0.3);
    return { ...prefs, contentTypeAffinity: affinity };
  }

  private applyResourceSkipped(prefs: LearningPreferences, signal: ProfileSignal): LearningPreferences {
    const contentType = signal.payload.contentType as string;
    if (!contentType) return prefs;

    const affinity = { ...prefs.contentTypeAffinity };
    const current = affinity[contentType] || 0.5;
    affinity[contentType] = Math.max(0, current * 0.7);
    return { ...prefs, contentTypeAffinity: affinity };
  }

  private maybePromoteLevel(skills: SkillSnapshot, behavioral: BehavioralProfile): SkillSnapshot {
    // Promote experience level if consistently high quiz scores and good completion
    if (behavioral.averageQuizScore >= HIGH_SCORE_THRESHOLD && behavioral.completionRate >= 70) {
      const levels = ['none', 'beginner', 'intermediate', 'advanced'] as const;
      const currentIdx = levels.indexOf(skills.experienceLevel);
      if (currentIdx < levels.length - 1) {
        return { ...skills, experienceLevel: levels[currentIdx + 1] };
      }
    }
    return skills;
  }

  private recalcEngagementTrend(behavioral: BehavioralProfile): BehavioralProfile {
    const now = Date.now();
    const lastActive = new Date(behavioral.lastActiveAt).getTime();
    const daysSinceActive = (now - lastActive) / (1000 * 60 * 60 * 24);

    let engagementTrend: BehavioralProfile['engagementTrend'] = 'stable';
    if (daysSinceActive > 7) {
      engagementTrend = 'declining';
    } else if (behavioral.currentStreak > 3 && behavioral.completionRate > 50) {
      engagementTrend = 'rising';
    }

    return { ...behavioral, engagementTrend };
  }

  // --- Private: Inference from Interview ---

  private inferStrongAreas(interview: InterviewProfile): string[] {
    const strong: string[] = [];
    if (interview.programmingLanguages.length > 0 && interview.experienceLevel !== 'none') {
      strong.push(...interview.programmingLanguages.filter((l) => l !== 'none'));
    }
    if (interview.aiExperience.includes('deep_learning')) strong.push('deep_learning');
    if (interview.aiExperience.includes('nlp')) strong.push('nlp');
    if (interview.aiExperience.includes('agents')) strong.push('ai_agents');
    return strong;
  }

  private inferWeakAreas(interview: InterviewProfile): string[] {
    const weak: string[] = [];
    if (interview.experienceLevel === 'none' || interview.experienceLevel === 'beginner') {
      weak.push('programming_fundamentals');
    }
    if (!interview.aiExperience.includes('ml_basics') && interview.aiExperience.length > 0) {
      weak.push('ml_foundations');
    }
    if (interview.aiExperience.includes('none') || interview.aiExperience.length === 0) {
      weak.push('ai_fundamentals');
    }
    return weak;
  }

  private inferPace(interview: InterviewProfile): LearningPreferences['preferredPace'] {
    if (interview.deadline === 'asap' || interview.deadline === '1_month') return 'fast';
    if (interview.deadline === 'no_rush') return 'slow';
    return 'normal';
  }

  private inferDifficulty(interview: InterviewProfile): LearningPreferences['preferredDifficulty'] {
    if (interview.experienceLevel === 'advanced') return 'hard';
    if (interview.experienceLevel === 'intermediate') return 'moderate';
    return 'easy';
  }

  private inferContentAffinity(interview: InterviewProfile): Record<string, number> {
    const affinity: Record<string, number> = { video: 0.5, article: 0.5, course: 0.5, hands_on: 0.5 };
    switch (interview.learningStyle) {
      case 'visual': affinity.video = 0.9; affinity.article = 0.3; break;
      case 'reading': affinity.article = 0.9; affinity.video = 0.3; break;
      case 'hands_on': affinity.hands_on = 0.9; affinity.video = 0.4; break;
      case 'mixed': break; // keep balanced
    }
    return affinity;
  }

  // --- Private: Vertex AI Sync ---

  private async syncToVertex(profile: EnrichedProfile): Promise<void> {
    const doc: ProfileDocument = {
      id: profile.userId,
      content: profile.profileSummary,
      userId: profile.userId,
      level: profile.skills.experienceLevel,
      goals: profile.goals,
      interests: profile.specificInterests,
      weakAreas: profile.skills.weakAreas,
      strongAreas: profile.skills.strongAreas,
    };

    const synced = await upsertProfileDocument(doc);
    if (synced) {
      profile.lastSyncedToVertexAt = new Date().toISOString();
    }
  }

  // --- Private: Profile Summary Generation ---

  /**
   * Generate a natural language summary of the profile.
   * This is used for Vertex AI semantic search indexing.
   * Uses rule-based generation (fast, no LLM cost).
   * Can be upgraded to Bedrock LLM call for richer summaries.
   */
  private generateProfileSummary(profile: EnrichedProfile): string {
    const parts: string[] = [];

    parts.push(
      `${profile.name} is a ${profile.skills.experienceLevel}-level learner` +
      (profile.currentRole ? ` currently working as ${profile.currentRole}` : '') +
      `.`,
    );

    if (profile.goals.length > 0) {
      parts.push(`Goals: ${profile.goals.join(', ')}.`);
    }

    if (profile.specificInterests.length > 0) {
      parts.push(`Interested in: ${profile.specificInterests.join(', ')}.`);
    }

    if (profile.skills.strongAreas.length > 0) {
      parts.push(`Strong in: ${profile.skills.strongAreas.join(', ')}.`);
    }

    if (profile.skills.weakAreas.length > 0) {
      parts.push(`Needs work on: ${profile.skills.weakAreas.join(', ')}.`);
    }

    parts.push(`Prefers ${profile.preferences.learningStyle} learning, ${profile.preferences.availableHoursPerWeek}h/week.`);

    if (profile.behavioral.coursesCompleted > 0) {
      parts.push(`Completed ${profile.behavioral.coursesCompleted} course(s), avg quiz score ${profile.behavioral.averageQuizScore}%.`);
    }

    if (profile.behavioral.engagementTrend !== 'stable') {
      parts.push(`Engagement: ${profile.behavioral.engagementTrend}.`);
    }

    return parts.join(' ');
  }
}

export const profileBuilder = new ProfileBuilderService();
