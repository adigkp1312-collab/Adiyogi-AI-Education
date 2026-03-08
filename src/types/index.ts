// --- Education types (migrated from SeekhoFree, Cosmos DB backed) ---

export type SupportedLanguage = "en" | "hi" | "ta" | "te" | "mr" | "kn" | "gu" | "bn" | "ml" | "pa" | "or" | "as" | "ur";

export interface ContentResource {
  id?: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'course';
  source: 'youtube' | 'nptel' | 'other';
  thumbnail?: string;
  duration?: string;
  description?: string;
  viewCount?: number;
  rating?: number;
}

export interface CourseWeek {
  weekNumber: number;
  title: string;
  description: string;
  topics: string[];
  resources: ContentResource[];
}

export interface UserProfile {
  userId: string;
  name: string;
  preferredLanguage: string;
  interests: string[];
  activePlans: string[];
  createdAt: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  goal: string;
  education: string;
  hoursPerWeek: number;
  learningStyle: string;
}

export interface UserProgress {
  userId: string;
  planId: string;
  completedResources: string[];
  currentWeek: number;
  lastAccessedAt: string;
  progressPercent: number;
}

export interface LearnerProfile {
  name: string
  goal: string
  prior_knowledge: string[]
  weak_areas: string[]
  available_hours_per_week: number
  preferred_language: string
  level: string
  learning_style: string
  deadline: string
  education_background: string
}

export interface IndexedCourse {
  id: string
  title: string
  provider: string
  platform: string
  url: string
  thumbnail: string
  description: string
  duration: string
  level: string
  language: string
  topics: string[]
  rating: number
  free: boolean
}

export interface CurriculumModule {
  module_number: number
  title: string
  objective: string
  duration: string
  topics: string[]
  courses: IndexedCourse[]
  practice: string[]
  assessment: string
  prerequisites: string[]
}

export type CourseStatus = 'profiling' | 'searching' | 'designing' | 'ready' | 'in_progress' | 'completed'

export interface CourseJSON {
  id: string
  created_at: number
  updated_at: number
  status: CourseStatus
  title: string
  description: string
  estimated_duration: string
  skill_level: string
  thumbnail: string
  learner: LearnerProfile
  modules: CurriculumModule[]
  matched_courses: IndexedCourse[]
  tips: string[]
  adaptive_notes: string
  completed_modules: number[]
}

export interface ProfileChatResponse {
  reply: string
  profile: LearnerProfile
  is_complete: boolean
}

export interface CourseResponse {
  course: CourseJSON
  message: string
}

export interface Resource {
  title: string
  type: string
  url_hint: string
  language: string
  description: string
}

export interface Module {
  module_number: number
  title: string
  description: string
  duration: string
  topics: string[]
  resources: Resource[]
}

export interface CoursePlan {
  id?: string;
  topic?: string;
  language?: string;
  totalWeeks?: number;
  createdAt?: string;
  title: string;
  description: string;
  estimated_duration: string;
  skill_level: string;
  modules: Module[];
  tips: string[];
  weeks?: CourseWeek[];
}

export interface ConversationResponse {
  type: 'conversation'
  message: string
}

export type PlanResponse = CoursePlan | ConversationResponse

export interface YouTubeResult {
  title: string
  channel: string
  video_id: string
  url: string
  thumbnail: string
  description: string
}

export interface ChatResponse {
  plan: PlanResponse
  youtube_results: YouTubeResult[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  plan?: PlanResponse
  youtubeResults?: YouTubeResult[]
}
