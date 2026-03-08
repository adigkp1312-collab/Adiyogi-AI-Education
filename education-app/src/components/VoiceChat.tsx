import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Loader2, Wand2, ArrowLeft } from 'lucide-react'
import { useVoice, speak, stopSpeaking } from '../hooks/useVoice'
import * as api from '../services/educationApi'
import type { LearnerProfile, CourseJSON, UserProfile } from '../types'

interface VoiceChatProps {
  profile: UserProfile
  onCourseCreated: (course: CourseJSON) => void
  onBack: () => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export function VoiceChat({ profile, onCourseCreated, onBack }: VoiceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>({
    name: profile.name,
    goal: profile.goal || '',
    prior_knowledge: profile.interests || [],
    weak_areas: [],
    available_hours_per_week: profile.hoursPerWeek || 10,
    preferred_language: profile.language || 'en-IN',
    level: profile.level || 'beginner',
    learning_style: profile.learningStyle || 'video',
    deadline: '',
    education_background: profile.education || '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleTranscript = useCallback(async (text: string) => {
    if (isProcessing) return

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setIsProcessing(true)

    try {
      const result = await api.profileChat(text, learnerProfile)

      setLearnerProfile(result.profile)
      setIsProfileComplete(result.is_complete)

      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: result.reply }
      setMessages(prev => [...prev, aiMsg])

      if (!isMuted) {
        speak(result.reply, profile.language)
      }
    } catch {
      const errMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: 'Sorry, something went wrong. Try again!' }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing, learnerProfile, isMuted, profile.language])

  const { isRecording, toggleRecording } = useVoice(handleTranscript)

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Send initial greeting
  useEffect(() => {
    async function greet() {
      setIsProcessing(true)
      try {
        const intro = [
          `Hi, my name is ${profile.name}.`,
          profile.goal ? `My goal is to ${profile.goal}.` : 'I want to learn about AI.',
          profile.interests.length ? `I'm interested in ${profile.interests.join(', ')}.` : '',
          profile.education ? `I'm ${profile.education}.` : '',
          `I'm at ${profile.level} level and can study ${profile.hoursPerWeek || 10} hours/week.`,
          profile.learningStyle ? `I prefer ${profile.learningStyle} learning.` : '',
        ].filter(Boolean).join(' ')

        const result = await api.profileChat(intro, learnerProfile)
        setLearnerProfile(result.profile)
        const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: result.reply }
        setMessages([aiMsg])
        if (!isMuted) speak(result.reply, profile.language)
      } catch {
        setMessages([{ id: crypto.randomUUID(), role: 'assistant', text: `Hey ${profile.name}! Tell me — what do you want to learn in AI?` }])
      } finally {
        setIsProcessing(false)
      }
    }
    greet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreateCourse() {
    setIsCreating(true)
    stopSpeaking()
    try {
      const topic = learnerProfile.goal || profile.interests[0] || 'artificial intelligence'
      const result = await api.createCourse(learnerProfile, topic)
      onCourseCreated(result.course)
    } catch {
      setIsCreating(false)
    }
  }

  // Text input fallback
  const [textInput, setTextInput] = useState('')
  function handleTextSend() {
    if (!textInput.trim() || isProcessing) return
    handleTranscript(textInput.trim())
    setTextInput('')
  }

  if (isCreating) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Wand2 className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <h3 className="text-base font-semibold">Creating Your Course</h3>
        <p className="text-sm text-muted-foreground mt-2">Designing adaptive curriculum with Gemini...</p>
        <div className="mt-6 flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => { stopSpeaking(); onBack() }} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-sm font-semibold">AI Course Designer</div>
            <div className="text-[0.65rem] text-muted-foreground">Voice chat powered by Gemini</div>
          </div>
        </div>
        <button
          onClick={() => { setIsMuted(!isMuted); if (!isMuted) stopSpeaking() }}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted text-foreground rounded-bl-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Profile complete banner */}
      {isProfileComplete && !isCreating && (
        <div className="px-4 pb-2">
          <button
            onClick={handleCreateCourse}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl py-3 text-sm font-medium hover:shadow-lg transition-shadow"
          >
            <Wand2 className="w-4 h-4" />
            Create My Course
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
        <input
          type="text"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleTextSend()}
          placeholder="Type or tap mic to speak..."
          disabled={isProcessing}
          className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => textInput.trim() ? handleTextSend() : toggleRecording(profile.language)}
          disabled={isProcessing}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse scale-110'
              : 'bg-primary text-primary-foreground hover:scale-105'
          } disabled:opacity-50`}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}
