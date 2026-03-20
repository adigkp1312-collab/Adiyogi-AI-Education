/**
 * Web Crawler Service
 *
 * Crawls public AI education platforms for:
 * 1. Interview questions (to seed the question bank)
 * 2. Course metadata (to index in Vertex Datastore)
 *
 * Uses fetch + HTML parsing (no Puppeteer dependency for serverless).
 * For more complex crawling, deploy as a Cloud Run job with Puppeteer.
 */

import { v4 as uuidv4 } from 'uuid';
import type { IndexedCourse } from '../types';
import type { StoredQuestion } from '../types/interview';

// --- Course Sources ---

interface CourseSource {
  name: string;
  platform: string;
  baseUrl: string;
  searchUrl: (query: string) => string;
}

const COURSE_SOURCES: CourseSource[] = [
  {
    name: 'Hugging Face',
    platform: 'huggingface',
    baseUrl: 'https://huggingface.co',
    searchUrl: (q) => `https://huggingface.co/learn?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Kaggle Learn',
    platform: 'kaggle',
    baseUrl: 'https://www.kaggle.com',
    searchUrl: (q) => `https://www.kaggle.com/learn?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Microsoft Learn',
    platform: 'microsoft',
    baseUrl: 'https://learn.microsoft.com',
    searchUrl: (q) =>
      `https://learn.microsoft.com/en-us/search/?terms=${encodeURIComponent(q)}&category=Learn`,
  },
  {
    name: 'Google AI',
    platform: 'google',
    baseUrl: 'https://ai.google',
    searchUrl: (q) => `https://ai.google/education/?q=${encodeURIComponent(q)}`,
  },
];

// --- Seed Question Templates ---

const SEED_QUESTIONS: Omit<StoredQuestion, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    text: 'Have you ever trained a machine learning model?',
    type: 'single_choice',
    category: 'skills',
    options: [
      { id: 'yes', label: 'Yes, multiple times', value: 'yes' },
      { id: 'once', label: 'Once or twice', value: 'once' },
      { id: 'no', label: 'Never', value: 'no' },
    ],
    usageCount: 0,
    effectivenessScore: 0.8,
    source: 'seed',
    language: 'en',
    tags: ['ml', 'experience', 'assessment'],
  },
  {
    text: 'Which AI development tools are you familiar with?',
    type: 'multi_choice',
    category: 'skills',
    options: [
      { id: 'jupyter', label: 'Jupyter Notebooks', value: 'jupyter' },
      { id: 'colab', label: 'Google Colab', value: 'colab' },
      { id: 'vscode', label: 'VS Code + Extensions', value: 'vscode' },
      { id: 'huggingface', label: 'Hugging Face Hub', value: 'huggingface' },
      { id: 'none', label: 'None of these', value: 'none' },
    ],
    usageCount: 0,
    effectivenessScore: 0.75,
    source: 'seed',
    language: 'en',
    tags: ['tools', 'experience'],
  },
  {
    text: 'What type of AI applications excite you most?',
    type: 'multi_choice',
    category: 'goals',
    options: [
      { id: 'chatbots', label: 'Conversational AI / Chatbots', value: 'chatbots' },
      { id: 'image', label: 'Image Generation / Computer Vision', value: 'image' },
      { id: 'code', label: 'Code Generation / Developer Tools', value: 'code' },
      { id: 'data', label: 'Data Analysis / Predictions', value: 'data' },
      { id: 'agents', label: 'Autonomous AI Agents', value: 'agents' },
      { id: 'robotics', label: 'Robotics / IoT', value: 'robotics' },
    ],
    usageCount: 0,
    effectivenessScore: 0.85,
    source: 'seed',
    language: 'en',
    tags: ['goals', 'interests', 'motivation'],
  },
  {
    text: 'How comfortable are you with math concepts like linear algebra and calculus?',
    type: 'single_choice',
    category: 'skills',
    options: [
      { id: 'strong', label: 'Strong — studied in depth', value: 'strong' },
      { id: 'basic', label: 'Basic — know the fundamentals', value: 'basic' },
      { id: 'rusty', label: 'Rusty — learned but forgotten', value: 'rusty' },
      { id: 'none', label: 'No math background', value: 'none' },
    ],
    usageCount: 0,
    effectivenessScore: 0.7,
    source: 'seed',
    language: 'en',
    tags: ['math', 'prerequisites', 'assessment'],
  },
  {
    text: 'Have you deployed any application to production?',
    type: 'single_choice',
    category: 'skills',
    options: [
      { id: 'many', label: 'Yes, multiple times', value: 'many' },
      { id: 'once', label: 'Once', value: 'once' },
      { id: 'learning', label: 'Learning to deploy', value: 'learning' },
      { id: 'no', label: 'Never', value: 'no' },
    ],
    usageCount: 0,
    effectivenessScore: 0.72,
    source: 'seed',
    language: 'en',
    tags: ['deployment', 'experience', 'devops'],
  },
  {
    text: 'What is your primary motivation for learning AI?',
    type: 'single_choice',
    category: 'goals',
    options: [
      { id: 'job', label: 'Get a job / better job', value: 'job' },
      { id: 'startup', label: 'Build a startup / product', value: 'startup' },
      { id: 'current_job', label: 'Use AI at current job', value: 'current_job' },
      { id: 'academic', label: 'Academic research', value: 'academic' },
      { id: 'passion', label: 'Personal passion / hobby', value: 'passion' },
    ],
    usageCount: 0,
    effectivenessScore: 0.9,
    source: 'seed',
    language: 'en',
    tags: ['motivation', 'goals', 'career'],
  },
];

// --- Known Free AI Courses (pre-indexed) ---

const KNOWN_FREE_COURSES: Omit<IndexedCourse, 'id'>[] = [
  {
    title: 'Practical Deep Learning for Coders',
    provider: 'fast.ai',
    platform: 'fastai',
    url: 'https://course.fast.ai/',
    thumbnail: '',
    description: 'Top-down approach to deep learning. Build working models from day 1.',
    duration: '7 weeks',
    level: 'beginner',
    language: 'en',
    topics: ['deep learning', 'computer vision', 'NLP', 'PyTorch'],
    rating: 4.9,
    free: true,
  },
  {
    title: 'AI Agents Course',
    provider: 'Hugging Face',
    platform: 'huggingface',
    url: 'https://huggingface.co/learn/agents-course',
    thumbnail: '',
    description: 'From beginner to expert in AI agents. smolagents, LangGraph, LlamaIndex.',
    duration: '4 weeks',
    level: 'intermediate',
    language: 'en',
    topics: ['AI agents', 'LangGraph', 'smolagents', 'LlamaIndex'],
    rating: 4.8,
    free: true,
  },
  {
    title: 'Machine Learning Specialization',
    provider: 'DeepLearning.AI',
    platform: 'coursera',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    thumbnail: '',
    description: 'Andrew Ng\'s updated ML course. Visual concepts → coding → math.',
    duration: '3 months',
    level: 'beginner',
    language: 'en',
    topics: ['machine learning', 'regression', 'neural networks', 'decision trees'],
    rating: 4.9,
    free: true,
  },
  {
    title: 'Generative AI for Beginners',
    provider: 'Microsoft',
    platform: 'microsoft',
    url: 'https://microsoft.github.io/generative-ai-for-beginners/',
    thumbnail: '',
    description: '18-lesson course on building Generative AI applications.',
    duration: '6 weeks',
    level: 'beginner',
    language: 'en',
    topics: ['generative AI', 'LLMs', 'prompt engineering', 'RAG'],
    rating: 4.7,
    free: true,
  },
  {
    title: 'Deep Learning Specialization',
    provider: 'DeepLearning.AI',
    platform: 'coursera',
    url: 'https://www.coursera.org/specializations/deep-learning',
    thumbnail: '',
    description: '5-course specialization covering neural networks, CNNs, RNNs, and more.',
    duration: '5 months',
    level: 'intermediate',
    language: 'en',
    topics: ['deep learning', 'CNN', 'RNN', 'TensorFlow'],
    rating: 4.8,
    free: true,
  },
  {
    title: 'CS50: Introduction to AI with Python',
    provider: 'Harvard / edX',
    platform: 'edx',
    url: 'https://cs50.harvard.edu/ai/',
    thumbnail: '',
    description: 'Explore AI concepts: search, knowledge, uncertainty, optimization, learning.',
    duration: '7 weeks',
    level: 'beginner',
    language: 'en',
    topics: ['AI fundamentals', 'search algorithms', 'machine learning', 'NLP'],
    rating: 4.8,
    free: true,
  },
  {
    title: 'LangChain for LLM Application Development',
    provider: 'DeepLearning.AI',
    platform: 'deeplearningai',
    url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/',
    thumbnail: '',
    description: 'Build LLM apps with LangChain. Models, prompts, chains, agents.',
    duration: '1 hour',
    level: 'intermediate',
    language: 'en',
    topics: ['LangChain', 'LLM', 'agents', 'prompt engineering'],
    rating: 4.7,
    free: true,
  },
  {
    title: 'Building AI Agents with Vertex AI',
    provider: 'Google Cloud',
    platform: 'google',
    url: 'https://cloud.google.com/vertex-ai/docs/agents',
    thumbnail: '',
    description: 'Build, deploy, and manage AI agents using Google Cloud Vertex AI.',
    duration: '2 weeks',
    level: 'intermediate',
    language: 'en',
    topics: ['Vertex AI', 'AI agents', 'Google Cloud', 'deployment'],
    rating: 4.5,
    free: true,
  },
  {
    title: 'NPTEL: Deep Learning',
    provider: 'IIT Madras',
    platform: 'nptel',
    url: 'https://nptel.ac.in/courses/106106184',
    thumbnail: '',
    description: 'Comprehensive deep learning course from IIT Madras.',
    duration: '12 weeks',
    level: 'intermediate',
    language: 'en',
    topics: ['deep learning', 'neural networks', 'backpropagation', 'CNNs'],
    rating: 4.6,
    free: true,
  },
];

// --- Crawler Functions ---

export function getSeedQuestions(): StoredQuestion[] {
  const now = new Date().toISOString();
  return SEED_QUESTIONS.map((q) => ({
    ...q,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }));
}

export function getKnownCourses(): IndexedCourse[] {
  return KNOWN_FREE_COURSES.map((c) => ({
    ...c,
    id: uuidv4(),
  }));
}

/**
 * Crawl a course source for AI-related courses.
 * In production, this would use Puppeteer or a headless browser.
 * For now, returns pre-indexed known courses from the source.
 */
export async function crawlCourseSource(
  source: CourseSource,
  _query: string = 'AI agents',
): Promise<IndexedCourse[]> {
  // Filter known courses by platform
  return getKnownCourses().filter((c) => c.platform === source.platform);
}

/**
 * Crawl all course sources and return combined results.
 */
export async function crawlAllSources(query: string = 'AI agents'): Promise<IndexedCourse[]> {
  const results = await Promise.all(
    COURSE_SOURCES.map((source) => crawlCourseSource(source, query))
  );
  return results.flat();
}

/**
 * Search known courses by topic locally (no API needed).
 */
export function searchKnownCourses(
  query: string,
  filters?: { level?: string; free?: boolean },
): IndexedCourse[] {
  const q = query.toLowerCase();
  return getKnownCourses().filter((course) => {
    const matchesQuery =
      course.title.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      course.topics.some((t) => t.toLowerCase().includes(q));

    const matchesLevel = !filters?.level || course.level === filters.level;
    const matchesFree = filters?.free === undefined || course.free === filters.free;

    return matchesQuery && matchesLevel && matchesFree;
  });
}

export { COURSE_SOURCES };
