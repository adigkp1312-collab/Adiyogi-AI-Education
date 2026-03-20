/**
 * Hands-On Planner
 *
 * Generates practical project plans using ONLY free-tier services.
 * Every project has step-by-step instructions so the learner spends $0.
 *
 * Free-tier services used:
 * - GitHub (repos, Actions, Codespaces)
 * - Vercel / Netlify (frontend hosting)
 * - Google Cloud free tier (Vertex AI, Cloud Run)
 * - AWS free tier (Lambda, DynamoDB, Bedrock trial)
 * - Azure free tier (OpenAI Service trial)
 * - Hugging Face (model hosting, Spaces)
 * - Kaggle (notebooks, datasets, GPUs)
 */

export interface HandsOnProject {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  tools: FreeTierTool[];
  steps: ProjectStep[];
  deliverables: string[];
  tags: string[];
}

export interface FreeTierTool {
  name: string;
  purpose: string;
  freeLimit: string;
  signupUrl: string;
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  commands?: string[];
  resources?: string[];
}

// --- Free-Tier Tool Registry ---

const FREE_TOOLS: Record<string, FreeTierTool> = {
  github: {
    name: 'GitHub',
    purpose: 'Code hosting, version control, CI/CD with Actions',
    freeLimit: 'Unlimited public repos, 2000 Actions minutes/month',
    signupUrl: 'https://github.com/signup',
  },
  vercel: {
    name: 'Vercel',
    purpose: 'Frontend deployment and serverless functions',
    freeLimit: '100GB bandwidth, serverless function executions',
    signupUrl: 'https://vercel.com/signup',
  },
  netlify: {
    name: 'Netlify',
    purpose: 'Static site hosting and serverless functions',
    freeLimit: '100GB bandwidth, 125k function invocations/month',
    signupUrl: 'https://app.netlify.com/signup',
  },
  huggingface: {
    name: 'Hugging Face',
    purpose: 'Model hosting, Spaces for demos, datasets',
    freeLimit: 'Unlimited public models, 2 free Spaces',
    signupUrl: 'https://huggingface.co/join',
  },
  kaggle: {
    name: 'Kaggle',
    purpose: 'Jupyter notebooks with free GPU/TPU',
    freeLimit: '30 hrs/week GPU, unlimited notebooks',
    signupUrl: 'https://www.kaggle.com/account/login',
  },
  gcp: {
    name: 'Google Cloud',
    purpose: 'Vertex AI, Cloud Run, BigQuery',
    freeLimit: '$300 free credits for 90 days + always-free tier',
    signupUrl: 'https://cloud.google.com/free',
  },
  aws: {
    name: 'AWS',
    purpose: 'Lambda, DynamoDB, S3, SageMaker',
    freeLimit: '12-month free tier + always-free services',
    signupUrl: 'https://aws.amazon.com/free/',
  },
  colab: {
    name: 'Google Colab',
    purpose: 'Jupyter notebooks with free GPU',
    freeLimit: 'Free tier with T4 GPU access',
    signupUrl: 'https://colab.research.google.com/',
  },
  replit: {
    name: 'Replit',
    purpose: 'Online IDE and deployment',
    freeLimit: 'Free tier for personal projects',
    signupUrl: 'https://replit.com/signup',
  },
};

// --- Project Templates ---

const PROJECT_TEMPLATES: HandsOnProject[] = [
  {
    id: 'project-chatbot-basic',
    title: 'Build a Simple AI Chatbot',
    description: 'Create a chatbot using a free LLM API. Deploy it as a web app on Vercel.',
    level: 'beginner',
    estimatedHours: 6,
    tools: [FREE_TOOLS.github, FREE_TOOLS.vercel, FREE_TOOLS.huggingface],
    steps: [
      {
        stepNumber: 1,
        title: 'Set up your project',
        description: 'Create a new Next.js project and push to GitHub.',
        commands: ['npx create-next-app@latest my-chatbot --typescript', 'cd my-chatbot && git init'],
      },
      {
        stepNumber: 2,
        title: 'Get a free LLM API key',
        description: 'Sign up for Hugging Face and get an API token for inference.',
        resources: ['https://huggingface.co/settings/tokens'],
      },
      {
        stepNumber: 3,
        title: 'Build the chat interface',
        description: 'Create a React component with message input, message history, and streaming responses.',
      },
      {
        stepNumber: 4,
        title: 'Connect to the LLM API',
        description: 'Create an API route that calls the Hugging Face Inference API with user messages.',
      },
      {
        stepNumber: 5,
        title: 'Deploy to Vercel',
        description: 'Connect your GitHub repo to Vercel for automatic deployments.',
        commands: ['npx vercel --prod'],
      },
    ],
    deliverables: ['Working chatbot deployed on Vercel', 'GitHub repo with clean code', 'README with setup instructions'],
    tags: ['chatbot', 'nextjs', 'huggingface', 'beginner'],
  },
  {
    id: 'project-rag-system',
    title: 'Build a RAG Knowledge Base',
    description: 'Create a Retrieval-Augmented Generation system that answers questions about your documents.',
    level: 'intermediate',
    estimatedHours: 10,
    tools: [FREE_TOOLS.github, FREE_TOOLS.colab, FREE_TOOLS.huggingface, FREE_TOOLS.vercel],
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare your documents',
        description: 'Collect PDF/text documents you want the system to know about. Start with 5-10 documents.',
      },
      {
        stepNumber: 2,
        title: 'Set up embeddings pipeline',
        description: 'Use a free embedding model from Hugging Face to convert documents into vectors.',
        commands: ['pip install sentence-transformers chromadb'],
      },
      {
        stepNumber: 3,
        title: 'Build the vector store',
        description: 'Use ChromaDB (free, local) to store document embeddings for fast retrieval.',
      },
      {
        stepNumber: 4,
        title: 'Create the RAG pipeline',
        description: 'Combine retrieval (ChromaDB) with generation (free LLM) to answer questions.',
      },
      {
        stepNumber: 5,
        title: 'Build a web interface',
        description: 'Create a simple Next.js app where users can ask questions about the documents.',
      },
      {
        stepNumber: 6,
        title: 'Deploy and share',
        description: 'Deploy on Vercel and share the link. Document your learnings.',
      },
    ],
    deliverables: ['RAG system answering questions about custom documents', 'Deployed web app', 'Technical blog post about what you learned'],
    tags: ['rag', 'embeddings', 'vector-database', 'intermediate'],
  },
  {
    id: 'project-ai-agent',
    title: 'Build a Multi-Tool AI Agent',
    description: 'Create an AI agent that can search the web, write code, and manage files using LangChain or smolagents.',
    level: 'intermediate',
    estimatedHours: 12,
    tools: [FREE_TOOLS.github, FREE_TOOLS.colab, FREE_TOOLS.huggingface, FREE_TOOLS.vercel],
    steps: [
      {
        stepNumber: 1,
        title: 'Learn agent fundamentals',
        description: 'Understand the ReAct pattern: Thought → Action → Observation loop.',
        resources: ['https://huggingface.co/learn/agents-course'],
      },
      {
        stepNumber: 2,
        title: 'Set up the framework',
        description: 'Install smolagents or LangChain. Configure with a free LLM.',
        commands: ['pip install smolagents', 'pip install langchain langchain-community'],
      },
      {
        stepNumber: 3,
        title: 'Build custom tools',
        description: 'Create 3+ tools: web search, calculator, file reader. Each tool is a Python function.',
      },
      {
        stepNumber: 4,
        title: 'Create the agent',
        description: 'Wire up the tools with an LLM to create an agent that decides which tool to use.',
      },
      {
        stepNumber: 5,
        title: 'Add memory',
        description: 'Implement conversation memory so the agent remembers previous interactions.',
      },
      {
        stepNumber: 6,
        title: 'Deploy as an API',
        description: 'Wrap the agent in a FastAPI server and deploy to Google Cloud Run (free tier).',
        commands: ['pip install fastapi uvicorn', 'gcloud run deploy --allow-unauthenticated'],
      },
    ],
    deliverables: ['Working AI agent with 3+ tools', 'Deployed API endpoint', 'Demo video showing agent capabilities'],
    tags: ['agents', 'langchain', 'smolagents', 'tools', 'intermediate'],
  },
  {
    id: 'project-fine-tune',
    title: 'Fine-tune a Language Model',
    description: 'Fine-tune a small LLM on your custom dataset using LoRA. Train for free on Kaggle GPUs.',
    level: 'advanced',
    estimatedHours: 15,
    tools: [FREE_TOOLS.kaggle, FREE_TOOLS.huggingface, FREE_TOOLS.github],
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare training data',
        description: 'Create or find a dataset in the instruction-following format (prompt/completion pairs).',
      },
      {
        stepNumber: 2,
        title: 'Set up Kaggle notebook',
        description: 'Create a Kaggle notebook with GPU accelerator enabled (free T4 or P100).',
      },
      {
        stepNumber: 3,
        title: 'Load base model',
        description: 'Load a small model (e.g., Mistral-7B, Phi-3) with 4-bit quantization.',
        commands: ['pip install transformers peft bitsandbytes trl'],
      },
      {
        stepNumber: 4,
        title: 'Configure LoRA',
        description: 'Set up LoRA adapters for efficient fine-tuning (only train ~1% of parameters).',
      },
      {
        stepNumber: 5,
        title: 'Train and evaluate',
        description: 'Train for 1-3 epochs. Evaluate on held-out test set. Compare with base model.',
      },
      {
        stepNumber: 6,
        title: 'Push to Hugging Face Hub',
        description: 'Upload your fine-tuned model to Hugging Face for others to use.',
        commands: ['model.push_to_hub("your-username/your-model-name")'],
      },
    ],
    deliverables: ['Fine-tuned model on Hugging Face Hub', 'Training report with metrics', 'Comparison: base vs fine-tuned'],
    tags: ['fine-tuning', 'LoRA', 'advanced', 'huggingface'],
  },
  {
    id: 'project-capstone-deploy',
    title: 'Capstone: Full-Stack AI Application',
    description: 'Build and deploy a complete AI application with frontend, backend, and AI model integration.',
    level: 'intermediate',
    estimatedHours: 20,
    tools: [FREE_TOOLS.github, FREE_TOOLS.vercel, FREE_TOOLS.gcp, FREE_TOOLS.huggingface],
    steps: [
      {
        stepNumber: 1,
        title: 'Design your application',
        description: 'Choose a problem to solve. Design the UI, API, and AI pipeline.',
      },
      {
        stepNumber: 2,
        title: 'Build the frontend',
        description: 'Create a Next.js app with a clean UI for user interaction.',
      },
      {
        stepNumber: 3,
        title: 'Build the API layer',
        description: 'Create API routes that orchestrate AI model calls, data processing, and responses.',
      },
      {
        stepNumber: 4,
        title: 'Integrate AI models',
        description: 'Connect free AI APIs (Hugging Face, Google AI) for inference. Implement caching.',
      },
      {
        stepNumber: 5,
        title: 'Add user features',
        description: 'Implement authentication, user profiles, and saved results.',
      },
      {
        stepNumber: 6,
        title: 'Deploy to production',
        description: 'Deploy frontend on Vercel, backend on Google Cloud Run (free tier).',
      },
      {
        stepNumber: 7,
        title: 'Write documentation',
        description: 'Create README, architecture diagram, and a blog post about your project.',
      },
    ],
    deliverables: ['Deployed full-stack AI application', 'Architecture documentation', 'Project blog post', 'GitHub repo with CI/CD'],
    tags: ['capstone', 'full-stack', 'deployment', 'portfolio'],
  },
];

// --- Public API ---

export function generateHandsOnPlan(
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced',
): HandsOnProject[] {
  const topicLower = topic.toLowerCase();

  // Match projects by topic and level
  const matched = PROJECT_TEMPLATES.filter((project) => {
    const levelMatch =
      level === 'beginner'
        ? project.level === 'beginner' || project.level === 'intermediate'
        : level === 'advanced'
        ? true
        : project.level !== 'advanced';

    const topicMatch = project.tags.some((tag) => topicLower.includes(tag)) ||
      project.title.toLowerCase().includes(topicLower) ||
      project.description.toLowerCase().includes(topicLower);

    return levelMatch && (topicMatch || project.tags.includes('capstone'));
  });

  // If no specific match, return level-appropriate projects
  if (matched.length === 0) {
    return PROJECT_TEMPLATES.filter((p) => p.level === level || p.level === 'intermediate');
  }

  return matched;
}

export function getAllProjects(): HandsOnProject[] {
  return [...PROJECT_TEMPLATES];
}

export function getProjectById(id: string): HandsOnProject | undefined {
  return PROJECT_TEMPLATES.find((p) => p.id === id);
}

export function getFreeTierTools(): FreeTierTool[] {
  return Object.values(FREE_TOOLS);
}
