import { BookOpen, Clock, GraduationCap, Trash2, ChevronRight } from 'lucide-react'
import type { CourseJSON } from '../types'

interface MyCoursesProps {
  courses: CourseJSON[]
  onOpen: (course: CourseJSON) => void
  onRemove: (id: string) => void
}

export function MyCourses({ courses, onOpen, onRemove }: MyCoursesProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <h3 className="text-base font-semibold">No courses yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Tap "Create Your AI Course" on the home page to design your first adaptive learning path
        </p>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-lg font-bold">My Courses</h2>

      {courses.map(course => {
        const progress = course.modules.length > 0
          ? Math.round((course.completed_modules.length / course.modules.length) * 100)
          : 0
        const statusLabel = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'
        const statusColor = progress === 100 ? 'text-green-600' : progress > 0 ? 'text-primary' : 'text-muted-foreground'

        return (
          <div
            key={course.id}
            className="border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <button onClick={() => onOpen(course)} className="w-full text-left">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-primary/25" />
                </div>
              )}

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-3 text-[0.65rem] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {course.estimated_duration}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <GraduationCap className="w-3 h-3" /> {course.skill_level}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <BookOpen className="w-3 h-3" /> {course.modules.length} modules
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[0.65rem] font-medium ${statusColor}`}>
                      {statusLabel}
                    </span>
                    <span className="text-[0.65rem] text-muted-foreground">
                      {course.completed_modules.length}/{course.modules.length} modules
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-primary font-medium flex items-center gap-0.5">
                    {progress === 0 ? 'Start Learning' : progress === 100 ? 'Review' : 'Continue'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>

            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-[0.6rem] text-muted-foreground">
                Created {new Date(course.created_at * 1000).toLocaleDateString()}
              </span>
              <button
                onClick={() => onRemove(course.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
