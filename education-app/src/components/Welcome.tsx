import { Sparkles, Wand2, BookOpen, Clock, ChevronRight, GraduationCap } from 'lucide-react'
import type { UserProfile, CourseJSON } from '../types'

const CATEGORIES = [
  { label: 'Machine Learning', icon: '🤖', query: 'I want to learn machine learning' },
  { label: 'Deep Learning', icon: '🧠', query: 'I want to learn deep learning and neural networks' },
  { label: 'NLP & LLMs', icon: '💬', query: 'I want to learn NLP and large language models' },
  { label: 'Computer Vision', icon: '👁️', query: 'I want to learn computer vision' },
  { label: 'Generative AI', icon: '✨', query: 'I want to learn generative AI' },
  { label: 'Python for AI', icon: '🐍', query: 'I want to learn Python for AI and ML' },
  { label: 'Data Science', icon: '📊', query: 'I want to learn data science with Python' },
  { label: 'MLOps', icon: '⚙️', query: 'I want to learn MLOps and model deployment' },
]

interface WelcomeProps {
  profile: UserProfile | null
  courses: CourseJSON[]
  onTopicClick: (query: string) => void
  onCreateCourse?: () => void
  onOpenCourse?: (course: CourseJSON) => void
}

function CourseCard({ course, onClick }: { course: CourseJSON; onClick: () => void }) {
  const progress = course.modules.length > 0
    ? Math.round((course.completed_modules.length / course.modules.length) * 100)
    : 0

  return (
    <button
      onClick={onClick}
      className="group text-left border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all w-full"
    >
      {course.thumbnail ? (
        <div className="relative w-full aspect-video bg-muted overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-primary/40" />
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
          <BookOpen className="w-3 h-3" />
          {course.modules.length} modules
          <span className="mx-0.5">·</span>
          <Clock className="w-3 h-3" />
          {course.estimated_duration}
        </div>
        <h4 className="text-sm font-semibold leading-tight mt-1 group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h4>
        {progress > 0 && (
          <div className="text-[0.65rem] text-primary font-medium mt-1">{progress}% complete</div>
        )}
      </div>
    </button>
  )
}

export function Welcome({ profile, courses, onTopicClick, onCreateCourse, onOpenCourse }: WelcomeProps) {
  const inProgress = courses.filter(c => c.status === 'in_progress')
  const ready = courses.filter(c => c.status === 'ready')
  const completed = courses.filter(c => c.status === 'completed')
  const hasCourses = courses.length > 0

  return (
    <div className="pb-8">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-xl font-bold leading-tight">
          {profile ? `Welcome back, ${profile.name}` : 'Learn Anything, Free Forever'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {hasCourses
            ? `You have ${courses.length} course${courses.length !== 1 ? 's' : ''} — keep going!`
            : 'Create your first AI-curated course'}
        </p>
      </div>

      {/* Create Course CTA */}
      {onCreateCourse && (
        <div className="px-5 pb-4">
          <button
            onClick={onCreateCourse}
            className="w-full flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl px-5 py-4 group hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Wand2 className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-bold">Create Your AI Course</div>
              <div className="text-xs opacity-80">Adaptive curriculum designed by AI, just for you</div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-60" />
          </button>
        </div>
      )}

      {/* Continue Learning — in-progress courses */}
      {inProgress.length > 0 && (
        <div className="px-5 pb-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            Continue Learning
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inProgress.map(course => (
              <CourseCard key={course.id} course={course} onClick={() => onOpenCourse?.(course)} />
            ))}
          </div>
        </div>
      )}

      {/* Ready to start */}
      {ready.length > 0 && (
        <div className="px-5 pb-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-primary" />
            Ready to Start
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ready.map(course => (
              <CourseCard key={course.id} course={course} onClick={() => onOpenCourse?.(course)} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="px-5 pb-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-primary" />
            Completed
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completed.map(course => (
              <CourseCard key={course.id} course={course} onClick={() => onOpenCourse?.(course)} />
            ))}
          </div>
        </div>
      )}

      {/* Explore categories */}
      <div className="px-5 pb-5">
        <h3 className="text-sm font-semibold mb-2.5">Explore categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => onTopicClick(cat.query)}
              className="flex items-center gap-1.5 border border-border rounded-full px-3.5 py-2 text-sm whitespace-nowrap hover:border-primary hover:text-primary transition-colors flex-shrink-0"
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick intents */}
      <div className="mx-5 p-5 bg-muted/50 rounded-2xl border border-border">
        <h3 className="text-sm font-semibold text-center mb-3">What brings you here today?</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Start AI career', query: 'I want to start a career in AI and machine learning' },
            { label: 'Build AI projects', query: 'I want to build hands-on AI projects with Python' },
            { label: 'Crack GATE AI', query: 'I want to prepare for GATE AI exam' },
            { label: 'Learn GenAI', query: 'I want to learn generative AI and build LLM apps' },
          ].map(intent => (
            <button
              key={intent.label}
              onClick={() => onTopicClick(intent.query)}
              className="flex items-center justify-center gap-2 bg-white border border-border rounded-xl px-3 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {intent.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
