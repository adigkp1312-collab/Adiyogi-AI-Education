"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { SupportedLanguage } from "@/types";
import { t } from "@/lib/i18n";

interface VoiceInputProps {
  language: SupportedLanguage;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({
  language,
  onTranscript,
  disabled,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setIsProcessing(true);

        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const result = reader.result as string;
              resolve(result.split(",")[1]);
            };
            reader.onerror = () => reject(new Error("Failed to read audio"));
            reader.readAsDataURL(audioBlob);
          });

          const res = await fetch("/api/voice/stt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: base64, language }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.text) onTranscript(data.text);
          } else {
            fallbackWebSpeech();
          }
        } catch {
          fallbackWebSpeech();
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch {
      fallbackWebSpeech();
    }
  }, [language, onTranscript]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const fallbackWebSpeech = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition as (new () => Record<string, unknown>) | undefined ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition as (new () => Record<string, unknown>) | undefined;

    if (!SpeechRecognition) return;

    const recognition = new (SpeechRecognition as new () => Record<string, unknown>)();
    const langMap: Record<string, string> = {
      en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN",
      bn: "bn-IN", mr: "mr-IN", gu: "gu-IN", kn: "kn-IN",
      ml: "ml-IN", pa: "pa-IN",
    };
    (recognition as Record<string, unknown>).lang = langMap[language] || "en-IN";
    (recognition as Record<string, unknown>).interimResults = false;

    (recognition as Record<string, unknown>).onresult = (event: Record<string, unknown>) => {
      const results = event.results as { [index: number]: { [index: number]: { transcript: string } } };
      if (results?.[0]?.[0]?.transcript) {
        onTranscript(results[0][0].transcript);
      }
    };

    (recognition as Record<string, unknown>).onerror = () => setIsListening(false);
    (recognition as Record<string, unknown>).onend = () => setIsListening(false);

    (recognition as Record<string, unknown> & { start: () => void }).start();
    setIsListening(true);
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={toggleListening}
        disabled={disabled || isProcessing}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? "bg-red-500 mic-active scale-110"
            : "bg-gradient-to-br from-orange-400 to-orange-600 hover:scale-105"
        } ${disabled || isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={isListening ? t("stopListening", language) : t("speakNow", language)}
        role="button"
      >
        {isProcessing ? (
          <svg
            className="w-8 h-8 text-white animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : isListening ? (
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="voice-bar bg-white"
                style={{
                  height: `${8 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.1}s`,
                  animation: "voice-wave 0.8s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      <p className="text-sm text-slate-500 font-medium" aria-live="polite">
        {isProcessing
          ? "Processing..."
          : isListening
            ? t("listening", language)
            : t("speakNow", language)}
      </p>
    </div>
  );
}
