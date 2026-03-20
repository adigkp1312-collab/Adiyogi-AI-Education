/**
 * Vertex AI Datastore Service
 *
 * Client for Vertex AI Search Engine + Datastore.
 * Handles: question bank storage, course index, adaptive search.
 *
 * Requires:
 * - GCP Project with Vertex AI Search enabled
 * - GOOGLE_CLOUD_PROJECT env var
 * - VERTEX_DATASTORE_ID env var
 * - Service account credentials (GOOGLE_APPLICATION_CREDENTIALS)
 */

import type { StoredQuestion } from '../types/interview';
import type { IndexedCourse } from '../types';

// --- Configuration ---

const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || 'adiyogi-ai-education';
const DATASTORE_LOCATION = process.env.VERTEX_DATASTORE_LOCATION || 'global';
const QUESTION_DATASTORE_ID = process.env.VERTEX_QUESTION_DATASTORE_ID || '';
const COURSE_DATASTORE_ID = process.env.VERTEX_COURSE_DATASTORE_ID || '';

function getAccessToken(): string {
  return process.env.GOOGLE_ACCESS_TOKEN || '';
}

function datastoreEndpoint(datastoreId: string): string {
  return `https://discoveryengine.googleapis.com/v1/projects/${GCP_PROJECT}/locations/${DATASTORE_LOCATION}/dataStores/${datastoreId}`;
}

// --- Generic Vertex AI Search ---

interface SearchResult<T> {
  results: T[];
  totalSize: number;
  nextPageToken?: string;
}

async function vertexSearch<T>(
  datastoreId: string,
  query: string,
  pageSize: number = 10,
  filter?: string,
): Promise<SearchResult<T>> {
  const endpoint = `${datastoreEndpoint(datastoreId)}/servingConfigs/default_search:search`;
  const token = getAccessToken();

  if (!GCP_PROJECT || !datastoreId || !token) {
    console.warn('[VertexDatastore] Missing GCP configuration, returning empty results');
    return { results: [], totalSize: 0 };
  }

  const body = {
    query,
    pageSize,
    ...(filter ? { filter } : {}),
    queryExpansionSpec: { condition: 'AUTO' },
    spellCorrectionSpec: { mode: 'AUTO' },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[VertexDatastore] Search failed:', error);
    return { results: [], totalSize: 0 };
  }

  const data = await response.json();
  const results = (data.results || []).map((r: { document: { structData: T } }) => r.document.structData);

  return {
    results,
    totalSize: data.totalSize || results.length,
    nextPageToken: data.nextPageToken,
  };
}

// --- Document CRUD ---

async function upsertDocument(
  datastoreId: string,
  documentId: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  const endpoint = `${datastoreEndpoint(datastoreId)}/branches/default_branch/documents`;
  const token = getAccessToken();

  if (!GCP_PROJECT || !datastoreId || !token) {
    console.warn('[VertexDatastore] Missing GCP configuration, skipping upsert');
    return false;
  }

  const response = await fetch(`${endpoint}?documentId=${documentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: documentId,
      structData: data,
    }),
  });

  return response.ok;
}

async function deleteDocument(
  datastoreId: string,
  documentId: string,
): Promise<boolean> {
  const endpoint = `${datastoreEndpoint(datastoreId)}/branches/default_branch/documents/${documentId}`;
  const token = getAccessToken();

  if (!GCP_PROJECT || !datastoreId || !token) return false;

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.ok;
}

// --- Question Bank Operations ---

export async function searchQuestions(
  query: string,
  category?: string,
  limit: number = 10,
): Promise<StoredQuestion[]> {
  const filter = category ? `category: "${category}"` : undefined;
  const result = await vertexSearch<StoredQuestion>(
    QUESTION_DATASTORE_ID,
    query,
    limit,
    filter,
  );
  return result.results;
}

export async function upsertQuestion(question: StoredQuestion): Promise<boolean> {
  return upsertDocument(QUESTION_DATASTORE_ID, question.id, question as unknown as Record<string, unknown>);
}

export async function deleteQuestion(questionId: string): Promise<boolean> {
  return deleteDocument(QUESTION_DATASTORE_ID, questionId);
}

export async function incrementQuestionUsage(questionId: string): Promise<boolean> {
  // In production, use atomic increment via Vertex or a separate counter service
  // For now, fetch-update-put pattern
  const results = await searchQuestions(questionId, undefined, 1);
  if (results.length === 0) return false;

  const question = results[0];
  question.usageCount += 1;
  question.updatedAt = new Date().toISOString();
  return upsertQuestion(question);
}

export async function updateQuestionEffectiveness(
  questionId: string,
  score: number,
): Promise<boolean> {
  const results = await searchQuestions(questionId, undefined, 1);
  if (results.length === 0) return false;

  const question = results[0];
  // Running average
  question.effectivenessScore =
    (question.effectivenessScore * question.usageCount + score) /
    (question.usageCount + 1);
  question.updatedAt = new Date().toISOString();
  return upsertQuestion(question);
}

// --- Course Index Operations ---

export async function searchCourseIndex(
  query: string,
  filters?: { level?: string; language?: string; free?: boolean },
  limit: number = 10,
): Promise<IndexedCourse[]> {
  const filterParts: string[] = [];
  if (filters?.level) filterParts.push(`level: "${filters.level}"`);
  if (filters?.language) filterParts.push(`language: "${filters.language}"`);
  if (filters?.free !== undefined) filterParts.push(`free: ${filters.free}`);

  const filter = filterParts.length > 0 ? filterParts.join(' AND ') : undefined;

  const result = await vertexSearch<IndexedCourse>(
    COURSE_DATASTORE_ID,
    query,
    limit,
    filter,
  );
  return result.results;
}

export async function upsertCourse(course: IndexedCourse): Promise<boolean> {
  return upsertDocument(COURSE_DATASTORE_ID, course.id, course as unknown as Record<string, unknown>);
}

export async function deleteCourse(courseId: string): Promise<boolean> {
  return deleteDocument(COURSE_DATASTORE_ID, courseId);
}

// --- Batch Import ---

export async function batchImportQuestions(questions: StoredQuestion[]): Promise<number> {
  let successCount = 0;
  for (const question of questions) {
    const ok = await upsertQuestion(question);
    if (ok) successCount++;
  }
  return successCount;
}

export async function batchImportCourses(courses: IndexedCourse[]): Promise<number> {
  let successCount = 0;
  for (const course of courses) {
    const ok = await upsertCourse(course);
    if (ok) successCount++;
  }
  return successCount;
}
