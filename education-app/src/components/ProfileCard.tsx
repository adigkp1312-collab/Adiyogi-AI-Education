import { User, LogOut, Target, Clock, GraduationCap, BookOpen } from 'lucide-react'
import type { UserProfile } from '../types'

interface ProfileCardProps {
  profile: UserProfile
  onClear: () => void
}

export function ProfileCard({ profile, onClear }: ProfileCardProps) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Profile</h2>

      <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="font-semibold">{profile.name}</div>
          <div className="text-xs text-muted-foreground capitalize">{profile.level} learner</div>
        </div>
      </div>

      {profile.goal && (
        <div className="p-4 bg-card border border-border rounded-2xl">
          <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-primary" /> Goal
          </div>
          <div className="text-sm text-muted-foreground">{profile.goal}</div>
        </div>
      )}

      <div className="p-4 bg-card border border-border rounded-2xl">
        <div className="text-sm font-medium mb-2">Interests</div>
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map(i => (
            <span key={i} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
              {i}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {profile.education && (
          <div className="p-3 bg-card border border-border rounded-2xl">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
              <GraduationCap className="w-3 h-3" /> Education
            </div>
            <div className="text-sm font-medium">{profile.education}</div>
          </div>
        )}
        {profile.hoursPerWeek > 0 && (
          <div className="p-3 bg-card border border-border rounded-2xl">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3" /> Study time
            </div>
            <div className="text-sm font-medium">{profile.hoursPerWeek} hrs/week</div>
          </div>
        )}
        {profile.learningStyle && (
          <div className="p-3 bg-card border border-border rounded-2xl">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
              <BookOpen className="w-3 h-3" /> Style
            </div>
            <div className="text-sm font-medium capitalize">{profile.learningStyle}</div>
          </div>
        )}
      </div>

      <button
        onClick={onClear}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-1"
      >
        <LogOut className="w-4 h-4" /> Reset profile
      </button>
    </div>
  )
}
