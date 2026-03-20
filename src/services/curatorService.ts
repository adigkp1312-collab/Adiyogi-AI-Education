/**
 * Curator Service
 *
 * Takes a user's InterviewProfile and generates a personalized course plan.
 * Combines:
 * 1. Vertex AI Search for matching indexed courses
 * 2. Known free courses from web crawler
 * 3. YouTube/NPTEL content
 * 4. Hands-on project plans using free-tier services
 *
 * Outputs a balanced plan: theory modules + practical projects.
 */

import { v4 as uuidv4 } from 'uuid';
import type { InterviewProfile } from '../types/interview';
import type { IndexedCourse, CurriculumModule, CourseJSON, LearnerProfile } from '../types';
import { searchCourseIndex } from './vertexDatastore';
import { searchKnownCourses, getKnownCourses } from './webCrawler';
import { generateHandsOnPlan, type HandsOnProject } from './handsOnPlanner';

// --- Profile to Curriculum Mapping ---

interface CurationConfig {
  maxModules: number;
  theoryToHandsOnRatio: number; // e.g., 0.6 = 60% theory, 40% hands-on
  prioritizeAgents: boolean;
}

function getDefaultConfig(profile: InterviewProfile): CurationConfig {
  const isAdvanced = profile.experienceLevel === 'advanced' || profile.experienceLevel === 'intermediate';

  return {
    maxModules: profile.availableHoursPerWeek >= 10 ? 8 : 5,
    theoryToHandsOnRatio: profile.learningStyle === 'hands_on' ? 0.4 : 0.6,
    prioritizeAgents: profile.specificInterests.includes('agents'),
  };
}

// --- Topic Planning ---

interface TopicPlan {
  topic: string;
  level: string;
  weekEstimate: number;
  isTheory: boolean;
  searchQueries: string[];
}

function buildTopicPlan(profile: InterviewProfile): TopicPlan[] {
  const plan: TopicPlan[] = [];

  // Foundation modules based on experience level
  if (profile.experienceLevel === 'none' || profile.experienceLevel === 'beginner') {
    plan.push({
      topic: 'Python Programming Fundamentals',
      level: 'beginner',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['python programming for beginners', 'learn python from scratch'],
    });
    plan.push({
      topic: 'Introduction to AI & Machine Learning',
      level: 'beginner',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['intro to AI machine learning', 'what is artificial intelligence'],
    });
  }

  if (profile.experienceLevel !== 'advanced') {
    plan.push({
      topic: 'Data Handling with Python',
      level: 'beginner',
      weekEstimate: 1,
      isTheory: true,
      searchQueries: ['python pandas numpy tutorial', 'data manipulation python'],
    });
  }

  // Core AI topics based on interests
  const interestModules: Record<string, TopicPlan> = {
    llm: {
      topic: 'Large Language Models & Prompt Engineering',
      level: 'intermediate',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['LLM prompt engineering tutorial', 'how LLMs work'],
    },
    agents: {
      topic: 'AI Agents: Architecture & Frameworks',
      level: 'intermediate',
      weekEstimate: 3,
      isTheory: true,
      searchQueries: ['AI agents tutorial LangChain', 'build AI agents from scratch'],
    },
    rag: {
      topic: 'RAG: Retrieval Augmented Generation',
      level: 'intermediate',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['RAG tutorial vector database', 'retrieval augmented generation'],
    },
    fine_tuning: {
      topic: 'Fine-tuning Language Models',
      level: 'advanced',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['fine tune LLM LoRA', 'model fine tuning tutorial'],
    },
    mlops: {
      topic: 'MLOps & Model Deployment',
      level: 'intermediate',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['MLOps tutorial', 'deploy ML model production'],
    },
    multimodal: {
      topic: 'Multimodal AI: Vision + Language',
      level: 'intermediate',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['multimodal AI tutorial', 'vision language models'],
    },
    voice: {
      topic: 'Voice AI & Speech Processing',
      level: 'intermediate',
      weekEstimate: 2,
      isTheory: true,
      searchQueries: ['speech recognition AI', 'voice AI tutorial'],
    },
    full_stack_ai: {
      topic: 'Full-Stack AI Application Development',
      level: 'intermediate',
      weekEstimate: 3,
      isTheory: false,
      searchQueries: ['full stack AI app tutorial', 'build AI web application'],
    },
  };

  for (const interest of profile.specificInterests) {
    if (interestModules[interest]) {
      plan.push(interestModules[interest]);
    }
  }

  // Always include agents module if not already present (platform focus)
  if (!profile.specificInterests.includes('agents')) {
    plan.push(interestModules.agents);
  }

  // Add hands-on project modules
  plan.push({
    topic: 'Hands-On Project: Build Your First AI Agent',
    level: profile.experienceLevel === 'none' ? 'beginner' : 'intermediate',
    weekEstimate: 2,
    isTheory: false,
    searchQueries: ['build AI agent project tutorial', 'AI agent hands on'],
  });

  plan.push({
    topic: 'Capstone Project: Deploy AI Solution',
    level: 'intermediate',
    weekEstimate: 3,
    isTheory: false,
    searchQueries: ['deploy AI project free tier', 'AI capstone project'],
  });

  return plan;
}

// --- Course Matching ---

async function findCoursesForTopic(
  topicPlan: TopicPlan,
  language: string,
): Promise<IndexedCourse[]> {
  // Try Vertex Datastore first
  let courses = await searchCourseIndex(topicPlan.topic, {
    level: topicPlan.level,
    free: true,
  });

  // Fallback to local known courses
  if (courses.length === 0) {
    courses = searchKnownCourses(topicPlan.topic, {
      level: topicPlan.level,
      free: true,
    });
  }

  // Broader search if still empty
  if (courses.length === 0) {
    for (const query of topicPlan.searchQueries) {
      const results = searchKnownCourses(query, { free: true });
      courses.push(...results);
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return courses.filter((c) => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });
}

// --- Main Curation Function ---

export async function curateCourse(
  profile: InterviewProfile,
): Promise<CourseJSON> {
  const config = getDefaultConfig(profile);
  const topicPlans = buildTopicPlan(profile);

  // Build modules
  const modules: CurriculumModule[] = [];
  const allCourses: IndexedCourse[] = [];
  let moduleNumber = 1;

  for (const topicPlan of topicPlans.slice(0, config.maxModules)) {
    const courses = await findCoursesForTopic(topicPlan, profile.language);
    allCourses.push(...courses);

    // Generate hands-on tasks for project modules
    const practice: string[] = topicPlan.isTheory
      ? [`Complete exercises from course materials`, `Write notes summarizing key concepts`]
      : await getProjectTasks(topicPlan, profile);

    modules.push({
      module_number: moduleNumber,
      title: topicPlan.topic,
      objective: `Master ${topicPlan.topic.toLowerCase()} through ${topicPlan.isTheory ? 'theory and examples' : 'hands-on building'}`,
      duration: `${topicPlan.weekEstimate} weeks`,
      topics: topicPlan.searchQueries.map((q) =>
        q.replace(/tutorial|course|learn/gi, '').trim()
      ),
      courses: courses.slice(0, 3),
      practice,
      assessment: topicPlan.isTheory
        ? 'Quiz on key concepts + submit summary notes'
        : 'Submit working project with documentation',
      prerequisites: moduleNumber === 1 ? [] : [`Module ${moduleNumber - 1}`],
    });

    moduleNumber++;
  }

  // Convert InterviewProfile to LearnerProfile for storage
  const learner: LearnerProfile = {
    name: profile.name,
    goal: profile.goals.join(', '),
    prior_knowledge: [
      ...profile.programmingLanguages,
      ...profile.aiExperience,
    ],
    weak_areas: profile.experienceLevel === 'none'
      ? ['programming basics', 'math fundamentals']
      : [],
    available_hours_per_week: profile.availableHoursPerWeek,
    preferred_language: profile.language,
    level: profile.experienceLevel === 'none' ? 'beginner' : profile.experienceLevel,
    learning_style: profile.learningStyle,
    deadline: profile.deadline || 'flexible',
    education_background: profile.education,
  };

  // Calculate estimated duration
  const totalWeeks = topicPlans
    .slice(0, config.maxModules)
    .reduce((sum, t) => sum + t.weekEstimate, 0);

  const courseJSON: CourseJSON = {
    id: uuidv4(),
    created_at: Date.now(),
    updated_at: Date.now(),
    status: 'ready',
    title: `Personalized AI Learning Path for ${profile.name}`,
    description: buildDescription(profile),
    estimated_duration: `${totalWeeks} weeks`,
    skill_level: profile.experienceLevel === 'none' ? 'beginner' : profile.experienceLevel,
    thumbnail: '',
    learner,
    modules,
    matched_courses: allCourses,
    tips: generateTips(profile),
    adaptive_notes: `Course curated for ${profile.experienceLevel} level with focus on: ${profile.specificInterests.join(', ')}. Learning style: ${profile.learningStyle}. ${profile.availableHoursPerWeek}hrs/week available.`,
    completed_modules: [],
  };

  return courseJSON;
}

// --- Helpers ---

async function getProjectTasks(
  topicPlan: TopicPlan,
  profile: InterviewProfile,
): Promise<string[]> {
  const projects = generateHandsOnPlan(
    topicPlan.topic,
    profile.experienceLevel === 'none' ? 'beginner' : profile.experienceLevel,
  );

  return projects.slice(0, 3).map((p) => `${p.title}: ${p.description}`);
}

function buildDescription(profile: InterviewProfile): string {
  const level = profile.experienceLevel === 'none' ? 'complete beginner' : profile.experienceLevel;
  const interests = profile.specificInterests.slice(0, 3).join(', ');
  return `A personalized AI learning path designed for a ${level} interested in ${interests}. Balanced theory and hands-on projects using only free resources.`;
}

function generateTips(profile: InterviewProfile): string[] {
  const tips: string[] = [
    'All resources in this course are 100% free — no credit card needed.',
    'Complete each module before moving to the next for best results.',
  ];

  if (profile.learningStyle === 'hands_on') {
    tips.push('Focus on the project modules — you learn best by building.');
  }

  if (profile.availableHoursPerWeek < 5) {
    tips.push('With limited time, prioritize core modules and skip optional readings.');
  }

  if (profile.experienceLevel === 'none' || profile.experienceLevel === 'beginner') {
    tips.push('Don\'t rush — understanding foundations will make advanced topics much easier.');
  }

  if (profile.specificInterests.includes('agents')) {
    tips.push('AI Agents are the focus of this platform — you\'ll build multiple agent projects.');
  }

  return tips;
}
