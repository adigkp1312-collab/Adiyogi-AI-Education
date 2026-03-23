import { useState, useRef, useCallback, useEffect } from 'react'

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } }
}

interface SpeechRecognitionInstance {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

function createRecognition(
  Ctor: new () => SpeechRecognitionInstance,
  lang: string,
): SpeechRecognitionInstance {
  const r = new Ctor()
  r.lang = lang === 'hi-IN' ? 'hi-IN' : 'en-IN'
  r.interimResults = false
  r.continuous = false
  return r
}

export function useVoice(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const onTranscriptRef = useRef(onTranscript)

  // Keep ref in sync to avoid stale closures
  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        try { recognitionRef.current.stop() } catch { /* already stopped */ }
        recognitionRef.current = null
      }
    }
  }, [])

  const toggleRecording = useCallback(async (languageCode: string) => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition
      || (window as unknown as Record<string, unknown>).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice not supported in this browser. Use Chrome or Edge.')
      return
    }

    const recognition = createRecognition(SpeechRecognition as new () => SpeechRecognitionInstance, languageCode)
    recognitionRef.current = recognition

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (event.results?.[0]?.[0]?.transcript) {
        const transcript = event.results[0][0].transcript
        if (transcript.trim()) {
          onTranscriptRef.current(transcript)
        }
      }
    }

    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)

    recognition.start()
    setIsRecording(true)
  }, [isRecording])

  return { isRecording, toggleRecording }
}

export function speak(text: string, lang: string = 'en-IN') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'hi-IN' ? 'hi-IN' : 'en-IN'
  utterance.rate = 1.05
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined') {
    window.speechSynthesis?.cancel()
  }
}
