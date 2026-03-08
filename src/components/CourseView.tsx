import { useState } from 'react'
import { BookOpen, Clock, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Circle, Lightbulb, GraduationCap } from 'lucide-react'
import type { CourseJSON, CurriculumModule } from '../types'

interface CourseViewProps {
  course: CourseJSON
  onModuleComplete?: (moduleNumber: number) => void
}

function ModuleCard({ module, isCompleted, onComplete }: {
  module: CurriculumModule
  isCompleted: boolean
  onComplete?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${isCompleted ? 'border-green-300 bg-green-50/50' : 'border-border'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            Module {module.module_number}: {module.title}
          </div>
          <div className="text-xs text-muted-foreground">{module.duration}</div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <div className="text-sm text-muted-foreground">{module.objective}</div>

          {module.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {module.topics.map(t => (
                <span key={t} className="text-[0.65rem] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {t}
                </span>
              ))}
            </div>
          )}

          {module.courses.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Courses</div>
              {module.courses.map(c => (
                <a
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {c.thumbnail && (
                    <img src={c.thumbnail} alt="" className="w-20 h-12 rounded object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium line-clamp-2">{c.title}</div>
                    <div className="text-[0.65rem] text-muted-foreground">{c.provider} · {c.duration} · {c.language}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          )}

          {module.practice.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Practice</div>
              {module.practice.map((p, i) => (
                <div key={i} className="text-xs text-foreground pl-3 border-l-2 border-primary/30">{p}</div>
              ))}
            </div>
          )}

          {module.assessment && (
            <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <span className="font-medium">Assessment:</span> {module.assessment}
            </div>
          )}

          {!isCompleted && onComplete && (
            <button
              onClick={onComplete}
              className="w-full text-xs font-medium text-primary border border-primary rounded-lg py-2 hover:bg-primary/5 transition-colors"
            >
              Mark as Completed
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function CourseView({ course, onModuleComplete }: CourseViewProps) {
  const completedSet = new Set(course.completed_modules)
  const progress = course.modules.length > 0
    ? Math.round((course.completed_modules.length / course.modules.length) * 100)
    : 0

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        {course.thumbnail && (
          <img src={course.thumbnail} alt="" className="w-full h-40 rounded-xl object-cover" />
        )}
        <h2 className="text-lg font-bold">{course.title}</h2>
        <p className="text-sm text-muted-foreground">{course.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-3 py-1">
            <Clock className="w-3 h-3" /> {course.estimated_duration}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-3 py-1">
            <GraduationCap className="w-3 h-3" /> {course.skill_level}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-3 py-1">
            <BookOpen className="w-3 h-3" /> {course.modules.length} modules
          </span>
        </div>
      </div>

      {course.completed_modules.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {course.adaptive_notes && (
        <div className="text-xs bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <div className="font-medium text-blue-700 mb-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> Why this path?
          </div>
          <div className="text-blue-600">{course.adaptive_notes}</div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Curriculum</h3>
        {course.modules.map(mod => (
          <ModuleCard
            key={mod.module_number}
            module={mod}
            isCompleted={completedSet.has(mod.module_number)}
            onComplete={onModuleComplete ? () => onModuleComplete(mod.module_number) : undefined}
          />
        ))}
      </div>

      {course.tips.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Tips</h3>
          <div className="space-y-1">
            {course.tips.map((tip, i) => (
              <div key={i} className="text-xs text-muted-foreground pl-3 border-l-2 border-primary/20">
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
