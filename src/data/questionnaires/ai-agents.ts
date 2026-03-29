import type { InterviewQuestion } from '@/types/interview';

/**
 * Questionnaire: How to Build AI Agents
 *
 * Adaptive question flow to assess where the learner stands
 * and tailor the AI Agents course to their level.
 */

export const AI_AGENTS_QUESTIONS: InterviewQuestion[] = [
  // --- Background ---
  {
    id: 'agents_python',
    text: 'How comfortable are you with Python?',
    type: 'single_choice',
    category: 'skills',
    required: true,
    options: [
      { id: 'none', label: 'Never used it', value: 'none' },
      { id: 'basic', label: 'Scripts & basics', value: 'basic' },
      { id: 'intermediate', label: 'Classes, async, packages', value: 'intermediate' },
      { id: 'advanced', label: 'Production Python — I ship code', value: 'advanced' },
    ],
  },
  {
    id: 'agents_llm_usage',
    text: 'Have you used LLMs beyond chatting with ChatGPT?',
    type: 'single_choice',
    category: 'skills',
    required: true,
    options: [
      { id: 'chat_only', label: 'Just ChatGPT / Gemini for chat', value: 'chat_only' },
      { id: 'api', label: 'Called an LLM API (OpenAI, Anthropic, etc.)', value: 'api' },
      { id: 'prompting', label: 'Serious prompt engineering / system prompts', value: 'prompting' },
      { id: 'built', label: 'Built an LLM-powered app or tool', value: 'built' },
    ],
  },
  {
    id: 'agents_frameworks',
    text: 'Which of these have you used? Pick all that apply.',
    type: 'multi_choice',
    category: 'skills',
    required: false,
    options: [
      { id: 'langchain', label: 'LangChain', value: 'langchain' },
      { id: 'langgraph', label: 'LangGraph', value: 'langgraph' },
      { id: 'crewai', label: 'CrewAI', value: 'crewai' },
      { id: 'autogen', label: 'AutoGen', value: 'autogen' },
      { id: 'openai_sdk', label: 'OpenAI Agents SDK', value: 'openai_sdk' },
      { id: 'claude_sdk', label: 'Claude Agent SDK', value: 'claude_sdk' },
      { id: 'vercel_ai', label: 'Vercel AI SDK', value: 'vercel_ai' },
      { id: 'none', label: 'None of these', value: 'none' },
    ],
  },
  {
    id: 'agents_tool_use',
    text: 'Have you built or used tool-calling / function-calling with an LLM?',
    type: 'single_choice',
    category: 'skills',
    required: true,
    options: [
      { id: 'no', label: "No — what's that?", value: 'no' },
      { id: 'heard', label: "I know the concept but haven't built it", value: 'heard' },
      { id: 'basic', label: 'Yes — simple tools (search, calculator)', value: 'basic' },
      { id: 'complex', label: 'Yes — complex multi-tool pipelines', value: 'complex' },
    ],
  },
  {
    id: 'agents_rag',
    text: 'Any experience with RAG (Retrieval-Augmented Generation)?',
    type: 'single_choice',
    category: 'skills',
    required: true,
    options: [
      { id: 'no', label: "Don't know what it is", value: 'no' },
      { id: 'concept', label: 'Understand the concept', value: 'concept' },
      { id: 'basic', label: 'Built a basic RAG pipeline', value: 'basic' },
      { id: 'prod', label: 'Production RAG with chunking, reranking, etc.', value: 'prod' },
    ],
  },

  // --- Goals ---
  {
    id: 'agents_goal',
    text: 'What do you want to build with AI agents?',
    type: 'multi_choice',
    category: 'goals',
    required: true,
    options: [
      { id: 'chatbot', label: 'Customer support / chatbot', value: 'chatbot' },
      { id: 'automation', label: 'Workflow automation (email, data, ops)', value: 'automation' },
      { id: 'coding', label: 'Coding assistant / dev tools', value: 'coding' },
      { id: 'research', label: 'Research agent (web search, analysis)', value: 'research' },
      { id: 'multiagent', label: 'Multi-agent systems', value: 'multiagent' },
      { id: 'product', label: 'Ship an agent-powered product', value: 'product' },
      { id: 'learn', label: 'Just want to understand how agents work', value: 'learn' },
    ],
  },
  {
    id: 'agents_depth',
    text: 'How deep do you want to go?',
    type: 'single_choice',
    category: 'goals',
    required: true,
    options: [
      { id: 'use', label: 'Use existing frameworks — get things working', value: 'use' },
      { id: 'customize', label: 'Customize & extend — build on top of frameworks', value: 'customize' },
      { id: 'scratch', label: 'Build from scratch — understand the internals', value: 'scratch' },
    ],
  },

  // --- Specific Knowledge Probes ---
  {
    id: 'agents_concepts',
    text: 'Which of these concepts are you comfortable with?',
    type: 'multi_choice',
    category: 'skills',
    required: false,
    options: [
      { id: 'prompts', label: 'System prompts & few-shot', value: 'prompts' },
      { id: 'chains', label: 'Chaining LLM calls', value: 'chains' },
      { id: 'memory', label: 'Conversation memory / context management', value: 'memory' },
      { id: 'planning', label: 'Agent planning (ReAct, CoT, tree-of-thought)', value: 'planning' },
      { id: 'eval', label: 'LLM evaluation & testing', value: 'eval' },
      { id: 'streaming', label: 'Streaming responses', value: 'streaming' },
      { id: 'structured', label: 'Structured output / JSON mode', value: 'structured' },
      { id: 'none', label: 'None of these yet', value: 'none' },
    ],
  },
  {
    id: 'agents_infra',
    text: 'Where do you plan to deploy your agents?',
    type: 'multi_choice',
    category: 'preferences',
    required: false,
    options: [
      { id: 'local', label: 'Local / laptop only for now', value: 'local' },
      { id: 'cloud', label: 'Cloud (AWS, GCP, Azure)', value: 'cloud' },
      { id: 'vercel', label: 'Vercel / serverless', value: 'vercel' },
      { id: 'api', label: 'As an API / backend service', value: 'api' },
      { id: 'slack', label: 'Inside Slack / Discord / Teams', value: 'slack' },
      { id: 'unsure', label: 'Not sure yet', value: 'unsure' },
    ],
  },

  // --- Preferences ---
  {
    id: 'agents_pace',
    text: 'How many hours per week can you spend on this?',
    type: 'slider',
    category: 'availability',
    required: true,
    min: 2,
    max: 30,
    step: 1,
  },
  {
    id: 'agents_style',
    text: 'How do you prefer to learn?',
    type: 'single_choice',
    category: 'preferences',
    required: true,
    options: [
      { id: 'build', label: 'Build stuff — give me projects', value: 'hands_on' },
      { id: 'video', label: 'Watch & follow along', value: 'visual' },
      { id: 'read', label: 'Read docs & code', value: 'reading' },
      { id: 'mix', label: 'Mix of everything', value: 'mixed' },
    ],
  },
  {
    id: 'agents_timeline',
    text: 'Any deadline?',
    type: 'single_choice',
    category: 'availability',
    required: false,
    options: [
      { id: 'asap', label: 'ASAP — I need this for work', value: 'asap' },
      { id: '1m', label: '1 month', value: '1_month' },
      { id: '3m', label: '3 months', value: '3_months' },
      { id: 'none', label: 'No rush — learning for fun', value: 'no_rush' },
    ],
  },
];

/**
 * Follow-up rules: skip or add questions based on answers.
 */
export const AI_AGENTS_FOLLOW_UPS: Record<string, {
  skipIf: { questionId: string; value: string }[];
  addIf?: { questionId: string; value: string; questions: string[] }[];
}> = {
  // Skip framework question if they've never used an LLM API
  agents_frameworks: {
    skipIf: [{ questionId: 'agents_llm_usage', value: 'chat_only' }],
  },
  // Skip tool-use question if they've never called an API
  agents_tool_use: {
    skipIf: [{ questionId: 'agents_llm_usage', value: 'chat_only' }],
  },
  // Skip RAG question if no API experience
  agents_rag: {
    skipIf: [{ questionId: 'agents_llm_usage', value: 'chat_only' }],
  },
  // Skip concepts probe if total beginner
  agents_concepts: {
    skipIf: [
      { questionId: 'agents_llm_usage', value: 'chat_only' },
      { questionId: 'agents_python', value: 'none' },
    ],
  },
  // Skip infra question if they just want to learn
  agents_infra: {
    skipIf: [{ questionId: 'agents_goal', value: 'learn' }],
  },
};

/**
 * Scoring: maps answers to a 0-3 skill level for adaptive course generation.
 */
export function computeAgentSkillLevel(
  responses: Record<string, string | string[]>,
): 'beginner' | 'intermediate' | 'advanced' {
  let score = 0;

  // Python
  const python = responses.agents_python as string;
  if (python === 'intermediate') score += 1;
  if (python === 'advanced') score += 2;

  // LLM usage
  const llm = responses.agents_llm_usage as string;
  if (llm === 'api') score += 1;
  if (llm === 'prompting') score += 2;
  if (llm === 'built') score += 3;

  // Frameworks
  const frameworks = responses.agents_frameworks as string[] | undefined;
  if (frameworks && !frameworks.includes('none')) {
    score += Math.min(frameworks.length, 3);
  }

  // Tool use
  const tools = responses.agents_tool_use as string;
  if (tools === 'basic') score += 1;
  if (tools === 'complex') score += 3;

  // RAG
  const rag = responses.agents_rag as string;
  if (rag === 'basic') score += 1;
  if (rag === 'prod') score += 2;

  // Concepts
  const concepts = responses.agents_concepts as string[] | undefined;
  if (concepts && !concepts.includes('none')) {
    score += Math.min(concepts.length, 3);
  }

  if (score <= 3) return 'beginner';
  if (score <= 9) return 'intermediate';
  return 'advanced';
}
