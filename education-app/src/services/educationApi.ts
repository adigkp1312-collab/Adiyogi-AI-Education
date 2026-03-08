/**
 * Education API Client
 *
 * All calls go through the shared Lambda backend with JWT auth.
 * Routes: /education/*
 */
import { authFetch } from './fetchPlugin';
import { CONFIG } from '../config';
import type {
  UserProfile,
  LearnerProfile,
  ProfileChatResponse,
  CourseResponse,
  CourseJSON,
  ChatResponse,
} from '../types';

function base() {
  return `${CONFIG.LAMBDA_URL}/education`;
}

// --- Profile ---

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const result = await authFetch<UserProfile>(`${base()}/profile`);
    return result.data;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: UserProfile): Promise<UserProfile | null> {
  const result = await authFetch<UserProfile>(`${base()}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  return result.data;
}

// --- Profile Chat (conversational profiling via Gemini) ---

export async function profileChat(
  message: string,
  profile?: LearnerProfile,
  courseId?: string,
): Promise<ProfileChatResponse> {
  const result = await authFetch<ProfileChatResponse>(`${base()}/profile/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, profile, course_id: courseId }),
  });
  if (!result.data) throw new Error(result.error?.message || 'Profile chat failed');
  return result.data;
}

// --- Courses ---

export async function listCourses(): Promise<CourseJSON[]> {
  const result = await authFetch<{ courses: CourseJSON[] }>(`${base()}/courses`);
  return result.data?.courses ?? [];
}

export async function createCourse(
  profile: LearnerProfile,
  topic: string = 'artificial intelligence',
): Promise<CourseResponse> {
  const result = await authFetch<CourseResponse>(`${base()}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, topic }),
  });
  if (!result.data) throw new Error(result.error?.message || 'Course creation failed');
  return result.data;
}

export async function getCourse(courseId: string): Promise<CourseResponse> {
  const result = await authFetch<CourseResponse>(`${base()}/courses/${courseId}`);
  if (!result.data) throw new Error(result.error?.message || 'Course not found');
  return result.data;
}

export async function updateProgress(
  courseId: string,
  moduleNumber: number,
): Promise<CourseResponse> {
  const result = await authFetch<CourseResponse>(`${base()}/courses/${courseId}/progress`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ module_number: moduleNumber }),
  });
  if (!result.data) throw new Error(result.error?.message || 'Progress update failed');
  return result.data;
}

// --- Chat ---

export async function sendChat(
  message: string,
  history: { role: string; content: string }[],
): Promise<ChatResponse> {
  const result = await authFetch<ChatResponse>(`${base()}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: history.slice(-10) }),
  });
  if (!result.data) throw new Error(result.error?.message || 'Chat failed');
  return result.data;
}

// --- Search ---

export async function searchCourses(query: string, maxResults: number = 5) {
  const result = await authFetch<{ query: string; results: unknown[] }>(`${base()}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, max_results: maxResults }),
  });
  return result.data;
}
