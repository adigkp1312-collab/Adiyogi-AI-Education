/**
 * Interviewer Service
 *
 * Adaptive interview engine that generates questions based on previous answers.
 * Uses Vertex AI for intelligent follow-up generation, falls back to rule-based flow.
 */

import { v4 as uuidv4 } from 'uuid';
import type { SupportedLanguage } from '../types';
import type {
  InterviewQuestion,
  InterviewResponse,
  InterviewSession,
  InterviewProfile,
  QuestionOption,
} from '../types/interview';

// --- Base Question Bank (seed questions) ---

const LANGUAGE_QUESTION: InterviewQuestion = {
  id: 'q_language',
  text: 'Which language would you prefer to learn in?',
  type: 'single_choice',
  category: 'preferences',
  required: true,
  options: [
    { id: 'en', label: 'English', value: 'en' },
    { id: 'hi', label: 'हिंदी (Hindi)', value: 'hi' },
    { id: 'ta', label: 'தமிழ் (Tamil)', value: 'ta' },
    { id: 'te', label: 'తెలుగు (Telugu)', value: 'te' },
    { id: 'bn', label: 'বাংলা (Bengali)', value: 'bn' },
    { id: 'mr', label: 'मराठी (Marathi)', value: 'mr' },
    { id: 'kn', label: 'ಕನ್ನಡ (Kannada)', value: 'kn' },
    { id: 'gu', label: 'ગુજરાતી (Gujarati)', value: 'gu' },
    { id: 'ml', label: 'മലയാളം (Malayalam)', value: 'ml' },
    { id: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', value: 'pa' },
  ],
};

const BASE_QUESTIONS: InterviewQuestion[] = [
  LANGUAGE_QUESTION,
  {
    id: 'q_name',
    text: "What's your name?",
    type: 'text',
    category: 'background',
    required: true,
    placeholder: 'Enter your name',
  },
  {
    id: 'q_role',
    text: 'What best describes your current role?',
    type: 'single_choice',
    category: 'background',
    required: true,
    options: [
      { id: 'student', label: 'Student', value: 'student' },
      { id: 'fresher', label: 'Fresh Graduate', value: 'fresher' },
      { id: 'developer', label: 'Software Developer', value: 'developer' },
      { id: 'data_scientist', label: 'Data Scientist / ML Engineer', value: 'data_scientist' },
      { id: 'product_manager', label: 'Product Manager', value: 'product_manager' },
      { id: 'business', label: 'Business Professional', value: 'business' },
      { id: 'other', label: 'Other', value: 'other' },
    ],
  },
  {
    id: 'q_experience',
    text: 'How would you rate your programming experience?',
    type: 'single_choice',
    category: 'skills',
    required: true,
    options: [
      { id: 'none', label: 'No coding experience', value: 'none' },
      { id: 'beginner', label: 'Beginner — basic syntax', value: 'beginner' },
      { id: 'intermediate', label: 'Intermediate — built some projects', value: 'intermediate' },
      { id: 'advanced', label: 'Advanced — professional experience', value: 'advanced' },
    ],
  },
  {
    id: 'q_languages',
    text: 'Which programming languages do you know?',
    type: 'multi_choice',
    category: 'skills',
    required: false,
    options: [
      { id: 'python', label: 'Python', value: 'python' },
      { id: 'javascript', label: 'JavaScript / TypeScript', value: 'javascript' },
      { id: 'java', label: 'Java', value: 'java' },
      { id: 'cpp', label: 'C / C++', value: 'cpp' },
      { id: 'go', label: 'Go', value: 'go' },
      { id: 'rust', label: 'Rust', value: 'rust' },
      { id: 'none', label: 'None yet', value: 'none' },
    ],
  },
  {
    id: 'q_ai_experience',
    text: 'What AI/ML topics have you explored?',
    type: 'multi_choice',
    category: 'skills',
    required: false,
    options: [
      { id: 'none', label: 'None — completely new to AI', value: 'none' },
      { id: 'chatgpt', label: 'Used ChatGPT / Claude / Gemini', value: 'chatgpt_user' },
      { id: 'ml_basics', label: 'ML basics (linear regression, etc.)', value: 'ml_basics' },
      { id: 'deep_learning', label: 'Deep Learning (neural networks)', value: 'deep_learning' },
      { id: 'nlp', label: 'NLP / LLMs', value: 'nlp' },
      { id: 'agents', label: 'AI Agents (LangChain, CrewAI, etc.)', value: 'agents' },
      { id: 'computer_vision', label: 'Computer Vision', value: 'computer_vision' },
      { id: 'rag', label: 'RAG / Vector Databases', value: 'rag' },
    ],
  },
  {
    id: 'q_goal',
    text: 'What do you want to achieve with AI?',
    type: 'multi_choice',
    category: 'goals',
    required: true,
    options: [
      { id: 'career', label: 'Switch to an AI career', value: 'career_switch' },
      { id: 'upskill', label: 'Upskill in current job', value: 'upskill' },
      { id: 'build_product', label: 'Build an AI product / startup', value: 'build_product' },
      { id: 'agents', label: 'Learn to build AI agents', value: 'build_agents' },
      { id: 'research', label: 'AI research / academics', value: 'research' },
      { id: 'curiosity', label: 'Just curious', value: 'curiosity' },
    ],
  },
  {
    id: 'q_interests',
    text: 'Which AI topics interest you most?',
    type: 'multi_choice',
    category: 'goals',
    required: true,
    options: [
      { id: 'agents', label: 'AI Agents & Automation', value: 'agents' },
      { id: 'llm', label: 'LLMs & Prompt Engineering', value: 'llm' },
      { id: 'rag', label: 'RAG & Knowledge Systems', value: 'rag' },
      { id: 'fine_tuning', label: 'Fine-tuning Models', value: 'fine_tuning' },
      { id: 'mlops', label: 'MLOps & Deployment', value: 'mlops' },
      { id: 'multimodal', label: 'Multimodal AI (vision + text)', value: 'multimodal' },
      { id: 'voice', label: 'Voice AI & Speech', value: 'voice' },
      { id: 'full_stack', label: 'Full-stack AI Apps', value: 'full_stack_ai' },
    ],
  },
  {
    id: 'q_hours',
    text: 'How many hours per week can you dedicate to learning?',
    type: 'slider',
    category: 'availability',
    required: true,
    min: 1,
    max: 40,
    step: 1,
  },
  {
    id: 'q_learning_style',
    text: 'How do you learn best?',
    type: 'single_choice',
    category: 'preferences',
    required: true,
    options: [
      { id: 'visual', label: 'Watching videos & tutorials', value: 'visual' },
      { id: 'reading', label: 'Reading docs & articles', value: 'reading' },
      { id: 'hands_on', label: 'Building projects hands-on', value: 'hands_on' },
      { id: 'mixed', label: 'Mix of everything', value: 'mixed' },
    ],
  },
  {
    id: 'q_education',
    text: "What's your education background?",
    type: 'single_choice',
    category: 'background',
    required: true,
    options: [
      { id: 'school', label: 'High School', value: 'high_school' },
      { id: 'undergrad', label: 'Undergraduate (pursuing/completed)', value: 'undergraduate' },
      { id: 'postgrad', label: 'Postgraduate', value: 'postgraduate' },
      { id: 'self_taught', label: 'Self-taught', value: 'self_taught' },
      { id: 'bootcamp', label: 'Bootcamp / Online courses', value: 'bootcamp' },
    ],
  },
  {
    id: 'q_projects',
    text: 'What kind of projects would you like to build?',
    type: 'multi_choice',
    category: 'preferences',
    required: false,
    options: [
      { id: 'chatbot', label: 'AI Chatbots & Assistants', value: 'chatbot' },
      { id: 'automation', label: 'Workflow Automation', value: 'automation' },
      { id: 'data_pipeline', label: 'Data Pipelines', value: 'data_pipeline' },
      { id: 'web_app', label: 'AI-powered Web Apps', value: 'web_app' },
      { id: 'api', label: 'AI APIs & Microservices', value: 'api' },
      { id: 'research', label: 'Research / Experiments', value: 'research' },
    ],
  },
];

// --- Adaptive Question Rules ---

const ADAPTIVE_QUESTIONS: Record<string, InterviewQuestion> = {
  q_specific_agent_interest: {
    id: 'q_specific_agent_interest',
    text: 'Which agent frameworks interest you?',
    type: 'multi_choice',
    category: 'goals',
    required: false,
    options: [
      { id: 'langchain', label: 'LangChain / LangGraph', value: 'langchain' },
      { id: 'crewai', label: 'CrewAI', value: 'crewai' },
      { id: 'autogen', label: 'AutoGen', value: 'autogen' },
      { id: 'smolagents', label: 'smolagents (Hugging Face)', value: 'smolagents' },
      { id: 'custom', label: 'Build from scratch', value: 'custom' },
      { id: 'not_sure', label: "Not sure yet", value: 'not_sure' },
    ],
  },
  q_cloud_experience: {
    id: 'q_cloud_experience',
    text: 'Which cloud platforms have you used?',
    type: 'multi_choice',
    category: 'skills',
    required: false,
    options: [
      { id: 'none', label: 'None', value: 'none' },
      { id: 'gcp', label: 'Google Cloud', value: 'gcp' },
      { id: 'aws', label: 'AWS', value: 'aws' },
      { id: 'azure', label: 'Azure', value: 'azure' },
      { id: 'vercel', label: 'Vercel / Netlify', value: 'vercel' },
    ],
  },
  q_deadline: {
    id: 'q_deadline',
    text: 'Do you have a target date to achieve your goals?',
    type: 'single_choice',
    category: 'availability',
    required: false,
    options: [
      { id: 'asap', label: 'As soon as possible', value: 'asap' },
      { id: '1month', label: 'Within 1 month', value: '1_month' },
      { id: '3months', label: 'Within 3 months', value: '3_months' },
      { id: '6months', label: 'Within 6 months', value: '6_months' },
      { id: 'no_rush', label: 'No rush, learning at my own pace', value: 'no_rush' },
    ],
  },
};

// --- Service ---

export class InterviewerService {
  private questions: InterviewQuestion[];

  constructor() {
    this.questions = [...BASE_QUESTIONS];
  }

  createSession(language: SupportedLanguage = 'en', mode: 'typeform' | 'voice' = 'typeform'): InterviewSession {
    return {
      id: uuidv4(),
      status: 'not_started',
      language,
      mode,
      responses: [],
      currentQuestionIndex: 0,
      startedAt: new Date().toISOString(),
    };
  }

  getNextQuestion(session: InterviewSession): InterviewQuestion | null {
    const { responses } = session;

    // Check if we should inject adaptive questions
    const adaptiveQ = this.getAdaptiveQuestion(responses);
    if (adaptiveQ) return adaptiveQ;

    // Get next base question (skip already answered)
    const answeredIds = new Set(responses.map((r) => r.questionId));
    const next = this.questions.find((q) => !answeredIds.has(q.id));

    return next ?? null;
  }

  private getAdaptiveQuestion(responses: InterviewResponse[]): InterviewQuestion | null {
    const answeredIds = new Set(responses.map((r) => r.questionId));
    const responseMap = new Map(responses.map((r) => [r.questionId, r.answer]));

    // If user selected agents in interests and hasn't answered agent frameworks
    const interests = responseMap.get('q_interests');
    if (
      interests &&
      Array.isArray(interests) &&
      interests.includes('agents') &&
      !answeredIds.has('q_specific_agent_interest')
    ) {
      return ADAPTIVE_QUESTIONS.q_specific_agent_interest;
    }

    // If user is intermediate/advanced and hasn't answered cloud experience
    const experience = responseMap.get('q_experience');
    if (
      experience &&
      (experience === 'intermediate' || experience === 'advanced') &&
      !answeredIds.has('q_cloud_experience')
    ) {
      return ADAPTIVE_QUESTIONS.q_cloud_experience;
    }

    // If user wants career switch/build product, ask about deadline
    const goals = responseMap.get('q_goal');
    if (
      goals &&
      Array.isArray(goals) &&
      (goals.includes('career_switch') || goals.includes('build_product')) &&
      !answeredIds.has('q_deadline')
    ) {
      return ADAPTIVE_QUESTIONS.q_deadline;
    }

    return null;
  }

  recordResponse(
    session: InterviewSession,
    questionId: string,
    answer: string | string[] | number,
  ): InterviewSession {
    const response: InterviewResponse = {
      questionId,
      answer,
      answeredAt: new Date().toISOString(),
    };

    const updatedSession: InterviewSession = {
      ...session,
      status: 'in_progress',
      responses: [...session.responses, response],
      currentQuestionIndex: session.currentQuestionIndex + 1,
    };

    // Update language if that was the question answered
    if (questionId === 'q_language' && typeof answer === 'string') {
      updatedSession.language = answer as SupportedLanguage;
    }

    // Check if interview is complete
    const nextQ = this.getNextQuestion(updatedSession);
    if (!nextQ) {
      updatedSession.status = 'completed';
      updatedSession.completedAt = new Date().toISOString();
      updatedSession.generatedProfile = this.buildProfile(updatedSession);
    }

    return updatedSession;
  }

  buildProfile(session: InterviewSession): InterviewProfile {
    const responseMap = new Map(session.responses.map((r) => [r.questionId, r.answer]));

    const getStr = (id: string): string => {
      const v = responseMap.get(id);
      return typeof v === 'string' ? v : '';
    };

    const getArr = (id: string): string[] => {
      const v = responseMap.get(id);
      return Array.isArray(v) ? v : typeof v === 'string' ? [v] : [];
    };

    const getNum = (id: string): number => {
      const v = responseMap.get(id);
      return typeof v === 'number' ? v : 0;
    };

    return {
      name: getStr('q_name'),
      language: (getStr('q_language') || 'en') as SupportedLanguage,
      currentRole: getStr('q_role'),
      experienceLevel: (getStr('q_experience') || 'none') as InterviewProfile['experienceLevel'],
      programmingLanguages: getArr('q_languages'),
      aiExperience: getArr('q_ai_experience'),
      goals: getArr('q_goal'),
      specificInterests: getArr('q_interests'),
      availableHoursPerWeek: getNum('q_hours') || 5,
      learningStyle: (getStr('q_learning_style') || 'mixed') as InterviewProfile['learningStyle'],
      deadline: getStr('q_deadline') || undefined,
      education: getStr('q_education'),
      preferredProjectTypes: getArr('q_projects'),
    };
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }

  getProgress(session: InterviewSession): number {
    const totalBase = this.questions.length;
    const answered = session.responses.length;
    return Math.min(Math.round((answered / totalBase) * 100), 100);
  }
}

export const interviewerService = new InterviewerService();
