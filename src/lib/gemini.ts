/**
 * Gemini Client
 *
 * Uses the Google Generative Language API via service account auth.
 * Supports grounding via Vertex AI Search datastores.
 */

import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';
import { SignJWT, importPKCS8 } from 'jose';

// --- Configuration ---

const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || 'adiyogi-ai-education-491110';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri: string;
}

// --- Access Token Management ---

let cachedToken: { token: string; expiresAt: number } | null = null;

function loadServiceAccountKey(): ServiceAccountKey {
  const raw = readFileSync(CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const key = loadServiceAccountKey();
  const now = Math.floor(Date.now() / 1000);

  const privateKey = await importPKCS8(key.private_key, 'RS256');
  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/generative-language',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(key.client_email)
    .setAudience(key.token_uri)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const resp = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!resp.ok) {
    throw new Error(`Token exchange failed: ${await resp.text()}`);
  }

  const data = await resp.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.token;
}

// --- Gemini Client ---

let clientInstance: GoogleGenAI | null = null;

async function getClient(): Promise<GoogleGenAI> {
  if (clientInstance) return clientInstance;

  const token = await getAccessToken();
  clientInstance = new GoogleGenAI({
    vertexai: false,
    apiKey: '', // not used with bearer auth
    httpOptions: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
  return clientInstance;
}

// Refresh client when token expires
async function refreshClient(): Promise<GoogleGenAI> {
  const token = await getAccessToken();
  clientInstance = new GoogleGenAI({
    vertexai: false,
    apiKey: '',
    httpOptions: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
  return clientInstance;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeminiResponse {
  text: string;
  groundingMetadata?: Record<string, unknown>;
}

/**
 * Generate content with Gemini.
 * Optionally grounded via Vertex AI Search datastore.
 */
export async function generateContent(
  systemPrompt: string,
  messages: GeminiMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    groundingDatastoreId?: string;
    responseSchema?: Record<string, unknown>;
  },
): Promise<GeminiResponse> {
  let client = await getClient();

  // Build contents from message history
  const contents = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  // Build config
  const config: Record<string, unknown> = {
    temperature: options?.temperature ?? 0.7,
    maxOutputTokens: options?.maxTokens ?? 2048,
    systemInstruction: systemPrompt,
  };

  // Grounding via Vertex AI Search requires the Vertex AI endpoint (aiplatform.googleapis.com).
  // When using the Generative Language API, grounding context should be
  // injected into the system prompt instead. The groundingDatastoreId option
  // is reserved for future use when Vertex AI endpoint access is configured.

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config,
    });

    return {
      text: response.text || '',
      groundingMetadata: response.candidates?.[0]?.groundingMetadata as Record<string, unknown> | undefined,
    };
  } catch (error: unknown) {
    // Retry once with refreshed token on auth errors
    if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
      client = await refreshClient();
      const response = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config,
      });
      return {
        text: response.text || '',
        groundingMetadata: response.candidates?.[0]?.groundingMetadata as Record<string, unknown> | undefined,
      };
    }
    throw error;
  }
}

/**
 * Generate structured JSON output with Gemini.
 */
export async function generateStructuredContent<T>(
  systemPrompt: string,
  userMessage: string,
  options?: {
    temperature?: number;
    groundingDatastoreId?: string;
  },
): Promise<T> {
  const response = await generateContent(
    systemPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no extra text.',
    [{ role: 'user', text: userMessage }],
    options,
  );

  const jsonMatch = response.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from Gemini response');
  }
  return JSON.parse(jsonMatch[0]) as T;
}
