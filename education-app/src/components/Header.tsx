import { Search, Globe, User } from 'lucide-react'
import type { UserProfile } from '../types'

const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'en-IN', label: 'English' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'od-IN', label: 'Odia' },
]

interface HeaderProps {
  language: string
  onLanguageChange: (lang: string) => void
  onSearch: (query: string) => void
  profile: UserProfile | null
  onProfileClick: () => void
}

export function Header({ language, onLanguageChange, onSearch, profile, onProfileClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-sm text-primary-foreground">
            A
          </div>
          <span className="text-[15px] font-semibold text-foreground tracking-tight hidden sm:block">
            Adiyogi AI
          </span>
        </div>

        <div className="flex-1 max-w-lg">
          <div className="flex items-center bg-muted rounded-full px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  onSearch((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = ''
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs border-none outline-none cursor-pointer text-muted-foreground"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onProfileClick}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            {profile ? (
              <span className="text-xs font-bold">{profile.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
