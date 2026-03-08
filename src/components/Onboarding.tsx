import { useState } from 'react'
import type { UserProfile } from '../types'

const AI_INTEREST_OPTIONS = [
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
  'Generative AI', 'LLMs', 'Data Science', 'Python for AI',
  'Math for ML', 'MLOps', 'Reinforcement Learning', 'Robotics',
]

const LEARNING_STYLES = [
  { value: 'video', label: 'Video lectures', desc: 'Watch and learn' },
  { value: 'hands-on', label: 'Hands-on coding', desc: 'Learn by building' },
  { value: 'reading', label: 'Reading/docs', desc: 'Text-based learning' },
  { value: 'mixed', label: 'Mixed', desc: 'A bit of everything' },
]

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [level, setLevel] = useState<UserProfile['level']>('beginner')
  const [goal, setGoal] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [learningStyle, setLearningStyle] = useState('video')
  const [education, setEducation] = useState('')

  function toggleInterest(topic: string) {
    setInterests(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  function finish() {
    onComplete({
      userId: `user_${Date.now()}`,
      name,
      preferredLanguage: "en",
      activePlans: [],
      createdAt: new Date().toISOString(),
      interests,
      level,
      language: 'en-IN',
      goal,
      education,
      hoursPerWeek,
      learningStyle,
    })
  }

  const totalSteps = 5

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 py-12 max-w-md mx-auto">
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
              }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="w-full space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto">
            A
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome to Adiyogi AI</h1>
            <p className="text-muted-foreground text-sm mt-1">Free AI courses designed just for you</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-left block">What should we call you?</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() => name.trim() && setStep(1)}
            disabled={!name.trim()}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-30 transition-opacity"
          >
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">What's your goal, {name}?</h2>
            <p className="text-muted-foreground text-sm mt-1">Tell us what you want to achieve</p>
          </div>
          <div className="space-y-3">
            <textarea
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. I want to become an ML engineer, prepare for GATE AI, build an AI startup..."
              rows={3}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-primary transition-colors resize-none"
            />
            <div className="flex flex-wrap gap-2">
              {['Become an ML engineer', 'Build AI projects', 'GATE/exam prep', 'Career switch to AI'].map(g => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className="text-xs rounded-full px-3 py-1.5 border border-border hover:border-primary/50 transition-colors"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="flex-1 border border-border rounded-xl py-3 text-sm font-medium">Back</button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">What AI topics interest you?</h2>
            <p className="text-muted-foreground text-sm mt-1">Pick as many as you like</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {AI_INTEREST_OPTIONS.map(topic => (
              <button
                key={topic}
                onClick={() => toggleInterest(topic)}
                className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${interests.includes(topic)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-foreground hover:border-primary/50'
                  }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 border border-border rounded-xl py-3 text-sm font-medium">Back</button>
            <button
              onClick={() => interests.length > 0 && setStep(3)}
              disabled={interests.length === 0}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-30 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">Your experience level?</h2>
            <p className="text-muted-foreground text-sm mt-1">We'll design the right difficulty</p>
          </div>
          <div className="space-y-2">
            {([
              { value: 'beginner', label: 'Beginner', desc: 'New to AI/ML' },
              { value: 'intermediate', label: 'Intermediate', desc: 'Know Python + basic ML' },
              { value: 'advanced', label: 'Advanced', desc: 'Looking to specialize' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setLevel(opt.value)}
                className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${level === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-left block">Education (optional)</label>
            <input
              type="text"
              value={education}
              onChange={e => setEducation(e.target.value)}
              placeholder="e.g. B.Tech CS 2nd year"
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 border border-border rounded-xl py-3 text-sm font-medium">Back</button>
            <button onClick={() => setStep(4)} className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium">Continue</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">How do you learn best?</h2>
            <p className="text-muted-foreground text-sm mt-1">We'll match your style</p>
          </div>
          <div className="space-y-2">
            {LEARNING_STYLES.map(opt => (
              <button
                key={opt.value}
                onClick={() => setLearningStyle(opt.value)}
                className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${learningStyle === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-left block">Hours per week you can study</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2}
                max={40}
                value={hoursPerWeek}
                onChange={e => setHoursPerWeek(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-medium w-14 text-right">{hoursPerWeek} hrs</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(3)} className="flex-1 border border-border rounded-xl py-3 text-sm font-medium">Back</button>
            <button
              onClick={finish}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
