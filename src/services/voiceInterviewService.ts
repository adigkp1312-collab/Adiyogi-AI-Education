/**
 * Voice Interview Service
 *
 * Provides voice-based interview using the Web Speech API (browser-native)
 * with optional Gemini Live Chat API integration for AI-powered follow-ups.
 *
 * Flow:
 * 1. User speaks → Web Speech API transcribes
 * 2. Transcript → InterviewerService maps to question answer
 * 3. (Optional) Gemini Live generates contextual follow-up
 */

import type { SupportedLanguage } from '../types';
import type { VoiceTranscript, VoiceInterviewConfig } from '../types/interview';

// Web Speech API type declarations (not in all TS libs)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
}

declare var SpeechRecognition: {
  new (): SpeechRecognition;
};

// Language code mapping for Web Speech API (BCP-47)
const SPEECH_LANG_CODES: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
};

export interface VoiceInterviewCallbacks {
  onTranscript: (transcript: VoiceTranscript) => void;
  onListening: (isListening: boolean) => void;
  onError: (error: string) => void;
}

export class VoiceInterviewService {
  private recognition: SpeechRecognition | null = null;
  private config: VoiceInterviewConfig;
  private callbacks: VoiceInterviewCallbacks | null = null;
  private isListening = false;

  constructor(config: VoiceInterviewConfig) {
    this.config = config;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  start(callbacks: VoiceInterviewCallbacks): void {
    if (!this.isSupported()) {
      callbacks.onError('Speech recognition is not supported in this browser.');
      return;
    }

    this.callbacks = callbacks;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new SpeechRecognitionAPI();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = SPEECH_LANG_CODES[this.config.language] || 'en-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks?.onListening(true);
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0] as any;
      if (result) {
        const transcript: VoiceTranscript = {
          text: result[0].transcript as string,
          confidence: result[0].confidence as number,
          language: this.config.language,
          timestamp: new Date().toISOString(),
        };
        this.callbacks?.onTranscript(transcript);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.isListening = false;
      this.callbacks?.onListening(false);

      if (event.error === 'no-speech') {
        this.callbacks?.onError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        this.callbacks?.onError('Microphone access denied. Please allow microphone access.');
      } else {
        this.callbacks?.onError(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks?.onListening(false);
    };

    this.recognition.start();
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.callbacks?.onListening(false);
    }
  }

  setLanguage(language: SupportedLanguage): void {
    this.config.language = language;
    if (this.recognition) {
      this.recognition.lang = SPEECH_LANG_CODES[language] || 'en-IN';
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  destroy(): void {
    this.stop();
    this.recognition = null;
    this.callbacks = null;
  }
}

// --- Text-to-Speech (for reading questions aloud) ---

export function speakText(text: string, language: SupportedLanguage): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG_CODES[language] || 'en-IN';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// --- Gemini Live Chat Integration (placeholder for future) ---

export interface GeminiLiveConfig {
  apiKey: string;
  model?: string;
}

/**
 * Future: Connect to Gemini Live Chat API for real-time
 * conversational interviews. For now, the service uses
 * Web Speech API + InterviewerService for structured Q&A.
 *
 * When Gemini Live is integrated:
 * 1. Establish WebSocket connection to Gemini Live
 * 2. Stream audio bidirectionally
 * 3. AI conducts free-form interview
 * 4. Extract structured profile from conversation
 */
export async function createGeminiLiveSession(
  _config: GeminiLiveConfig,
  _language: SupportedLanguage,
): Promise<{ sessionId: string; status: 'not_implemented' }> {
  return {
    sessionId: 'gemini-live-placeholder',
    status: 'not_implemented',
  };
}
