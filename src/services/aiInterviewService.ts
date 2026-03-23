/**
 * AI Interview Service
 *
 * Conducts conversational interviews using Gemini, grounded via
 * Vertex AI Search (question bank datastore).
 *
 * Flow:
 * 1. User starts a session → gets first AI question
 * 2. User responds → AI asks adaptive follow-up
 * 3. When enough info is gathered → AI extracts InterviewProfile
 * 4. Profile feeds into ProfileBuilder for initialization
 *
 * The question bank datastore provides grounding context so the AI
 * asks relevant, contextual questions rather than hallucinating.
 */

import { v4 as uuidv4 } from 'uuid';
import { generateContent, generateStructuredContent } from '../lib/gemini';
import type { GeminiMessage } from '../lib/gemini';
import type { InterviewProfile } from '../types/interview';
import type { SupportedLanguage } from '../types';

// --- Configuration ---

const MIN_TURNS_FOR_PROFILE = 4;
const MAX_TURNS = 20;

// --- Session Types ---

export interface AIInterviewSession {
  id: string;
  userId?: string;
  status: 'active' | 'completed' | 'abandoned';
  language: SupportedLanguage;
  messages: GeminiMessage[];
  extractedProfile: InterviewProfile | null;
  createdAt: string;
  completedAt?: string;
  turnCount: number;
}

export interface AIInterviewTurn {
  aiMessage: string;
  isComplete: boolean;
  profile: InterviewProfile | null;
  progress: number; // 0-100
}

// --- System Prompt ---

const SYSTEM_PROMPT = `You are Adiyogi, a friendly and empathetic AI education counselor. Your job is to understand the learner through natural conversation and build their learning profile.

## Your Goal
Understand the learner well enough to create a personalized AI/tech education plan. You need to discover:
1. **Who they are** — name, current role, education background
2. **What they know** — programming experience, languages, AI/ML exposure
3. **What they want** — goals (career switch, upskill, build product, research, curiosity)
4. **How they learn** — preferred style (videos, reading, hands-on), hours/week available
5. **What interests them** — specific AI topics (agents, LLMs, RAG, computer vision, etc.)
6. **Timeline** — deadline or pace preference

## Conversation Style
- Be warm, encouraging, and conversational — NOT like a form or survey
- Ask ONE question at a time (sometimes two if they're related)
- Use their previous answers to ask smarter follow-ups
- If they mention something interesting, dig deeper briefly
- Adapt your language — if they seem technical, be technical; if beginner, be simple
- Use their name once you know it
- Keep responses SHORT (2-3 sentences max + your question)
- If the user responds in a non-English language, continue in that language

## Rules
- NEVER list all questions at once
- NEVER repeat a question they already answered
- When you have enough information (all 6 areas above), naturally wrap up
- At wrap-up, summarize what you understood and ask if anything is wrong
- If the user seems rushed, speed up. If curious, let them explore.
- NEVER generate a course plan or learning path yourself. Your ONLY job is to collect information.
- When the user confirms your summary is correct, end with EXACTLY this phrase: "I have everything I need to build your personalized learning plan!"
- Do NOT continue the conversation after the user confirms the summary.

## Language Support
If the user prefers a non-English language, conduct the interview in that language. Start by asking their preferred language if not already known.

## Grounding Context — Question Bank
Use this knowledge to ask better, more relevant questions:

BACKGROUND: Understanding the learner's current role (student, developer, business professional, data scientist, fresh graduate) helps personalize the path. Education background (CS degree, non-tech, self-taught, bootcamp) determines prerequisite knowledge.

SKILLS: Programming proficiency is the strongest predictor of AI learning speed. Python is essential for ML/AI. Ask about specific languages and frameworks. Prior AI exposure ranges from using ChatGPT to building neural networks. Understanding specific tools (TensorFlow, PyTorch, LangChain, scikit-learn) helps calibrate difficulty. Math background (linear algebra, calculus, statistics) affects ability to understand ML theory deeply, but practical learners can succeed with applied courses.

GOALS: Career goals shape the entire curriculum. Career switchers need job-ready skills and portfolio projects. Upskillers need domain-specific AI. Entrepreneurs need end-to-end product building. Researchers need theory depth. Popular specific interest areas: AI Agents (LangChain, CrewAI, AutoGen), LLM apps (RAG, prompt engineering, fine-tuning), Computer Vision, NLP, MLOps, Voice AI, Multimodal AI, Full-stack AI apps.

PREFERENCES: Visual learners need video-heavy plans. Readers need documentation and articles. Hands-on learners need project-based curricula with real deployments. Time availability determines pace: <5h/week = micro-learning, 5-10h = steady progress, 10+ = intensive. Project type preferences (chatbots, automation, data pipelines, web apps, APIs, research) reveal practical goals and help select technologies.

AVAILABILITY: Deadline pressure affects content prioritization. Indian learners often prefer Hindi or regional language explanations with English technical terms. Cloud platform experience (AWS, GCP, Azure) indicates deployment readiness.`;

const EXTRACTION_PROMPT = `You are a data extraction system. Given the interview conversation below, extract the learner's profile into a structured JSON object.

Return ONLY this JSON structure:
{
  "name": "string",
  "language": "en|hi|ta|te|bn|mr|gu|kn|ml|pa",
  "currentRole": "string (student/fresher/developer/data_scientist/product_manager/business/other)",
  "experienceLevel": "none|beginner|intermediate|advanced",
  "programmingLanguages": ["python", "javascript", ...],
  "aiExperience": ["none|chatgpt_user|ml_basics|deep_learning|nlp|agents|computer_vision|rag"],
  "goals": ["career_switch|upskill|build_product|build_agents|research|curiosity"],
  "specificInterests": ["agents|llm|rag|fine_tuning|mlops|multimodal|voice|full_stack_ai"],
  "availableHoursPerWeek": number,
  "learningStyle": "visual|reading|hands_on|mixed",
  "deadline": "asap|1_month|3_months|6_months|no_rush|undefined",
  "education": "high_school|undergraduate|postgraduate|self_taught|bootcamp",
  "preferredProjectTypes": ["chatbot|automation|data_pipeline|web_app|api|research"]
}

Rules:
- Infer values from context when not explicitly stated
- Use "none" or empty arrays for unknown fields, never null
- If language is unclear, default to "en"
- availableHoursPerWeek defaults to 5 if not mentioned`;

// --- Service ---

export class AIInterviewService {

  /**
   * Start a new AI interview session.
   * Returns the first AI greeting/question.
   */
  async startSession(language: SupportedLanguage = 'en', userId?: string): Promise<{ session: AIInterviewSession; turn: AIInterviewTurn }> {
    const session: AIInterviewSession = {
      id: uuidv4(),
      userId,
      status: 'active',
      language,
      messages: [],
      extractedProfile: null,
      createdAt: new Date().toISOString(),
      turnCount: 0,
    };

    const languageHint = language !== 'en'
      ? `The user prefers ${language}. Start by greeting them in that language.`
      : '';

    const response = await generateContent(
      SYSTEM_PROMPT,
      [{ role: 'user', text: `Start the interview. ${languageHint} Say a brief greeting and ask your first question.` }],
      {
        temperature: 0.8,
      },
    );

    // Replace the initial trigger with the AI's response in history
    session.messages = [{ role: 'model', text: response.text }];
    session.turnCount = 1;

    return {
      session,
      turn: {
        aiMessage: response.text,
        isComplete: false,
        profile: null,
        progress: 0,
      },
    };
  }

  /**
   * Process a user's response and get the next AI question.
   */
  async respondToSession(
    session: AIInterviewSession,
    userMessage: string,
  ): Promise<{ session: AIInterviewSession; turn: AIInterviewTurn }> {
    if (session.status !== 'active') {
      throw new Error('Session is not active');
    }

    // Add user message to history
    const updatedMessages: GeminiMessage[] = [
      ...session.messages,
      { role: 'user', text: userMessage },
    ];

    const turnCount = session.turnCount + 1;
    const hasEnoughTurns = turnCount >= MIN_TURNS_FOR_PROFILE;
    const atMaxTurns = turnCount >= MAX_TURNS;

    // Build context hint for the AI
    let contextHint = '';
    if (atMaxTurns) {
      contextHint = '\n[SYSTEM: You have asked enough questions. Wrap up the interview now. Summarize what you learned and tell the user you have everything needed.]';
    } else if (hasEnoughTurns) {
      contextHint = '\n[SYSTEM: You may have enough information. If all 6 areas are covered, start wrapping up. If not, continue asking.]';
    }

    if (contextHint) {
      updatedMessages.push({ role: 'user', text: contextHint });
    }

    const response = await generateContent(
      SYSTEM_PROMPT,
      updatedMessages,
      {
        temperature: 0.7,
      },
    );

    // Remove the system hint from stored history
    const storedMessages: GeminiMessage[] = [
      ...session.messages,
      { role: 'user', text: userMessage },
      { role: 'model', text: response.text },
    ];

    // Check if the AI signaled completion
    const isWrappingUp = this.detectCompletion(response.text, turnCount);

    let extractedProfile: InterviewProfile | null = null;
    if (isWrappingUp || atMaxTurns) {
      extractedProfile = await this.extractProfile(storedMessages);
    }

    const updatedSession: AIInterviewSession = {
      ...session,
      messages: storedMessages,
      turnCount,
      status: extractedProfile ? 'completed' : 'active',
      extractedProfile,
      completedAt: extractedProfile ? new Date().toISOString() : undefined,
    };

    const progress = Math.min(
      95,
      Math.round((turnCount / Math.max(MIN_TURNS_FOR_PROFILE + 3, MAX_TURNS)) * 100),
    );

    return {
      session: updatedSession,
      turn: {
        aiMessage: response.text,
        isComplete: !!extractedProfile,
        profile: extractedProfile,
        progress: extractedProfile ? 100 : progress,
      },
    };
  }

  /**
   * Detect if the AI is wrapping up the interview.
   */
  private detectCompletion(aiMessage: string, turnCount: number): boolean {
    if (turnCount < MIN_TURNS_FOR_PROFILE) return false;

    const completionSignals = [
      'have everything i need',
      'have everything needed',
      'got a good picture',
      'enough to create',
      'ready to build your',
      'personalized learning plan',
      'all set to create',
      'comprehensive understanding',
      'build your personalized',
      'craft your personalized',
    ];

    const lower = aiMessage.toLowerCase();
    return completionSignals.some((signal) => lower.includes(signal));
  }

  /**
   * Extract structured InterviewProfile from conversation history
   * using Gemini structured output.
   */
  private async extractProfile(messages: GeminiMessage[]): Promise<InterviewProfile | null> {
    const conversation = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Adiyogi'}: ${m.text}`)
      .join('\n');

    try {
      const profile = await generateStructuredContent<InterviewProfile>(
        EXTRACTION_PROMPT,
        conversation,
        { temperature: 0.1 },
      );

      // Validate and fill defaults
      return {
        name: profile.name || 'Learner',
        language: (profile.language || 'en') as SupportedLanguage,
        currentRole: profile.currentRole || 'other',
        experienceLevel: profile.experienceLevel || 'beginner',
        programmingLanguages: profile.programmingLanguages || [],
        aiExperience: profile.aiExperience || [],
        goals: profile.goals || [],
        specificInterests: profile.specificInterests || [],
        availableHoursPerWeek: profile.availableHoursPerWeek || 5,
        learningStyle: profile.learningStyle || 'mixed',
        deadline: profile.deadline,
        education: profile.education || '',
        preferredProjectTypes: profile.preferredProjectTypes || [],
      };
    } catch (error) {
      console.error('Failed to extract profile:', error instanceof Error ? error.message : error);
      return null;
    }
  }
}

export const aiInterviewService = new AIInterviewService();
