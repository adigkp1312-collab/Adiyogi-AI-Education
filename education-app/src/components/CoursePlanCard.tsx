import { Clock, BarChart3, BookOpen, CheckCircle2, Youtube, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { CoursePlan, YouTubeResult } from '../types'

interface CoursePlanCardProps {
  plan: CoursePlan
  youtubeResults?: YouTubeResult[]
}

export function CoursePlanCard({ plan, youtubeResults }: CoursePlanCardProps) {
  const [showModules, setShowModules] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground leading-tight">{plan.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{plan.description}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap pl-11">
        <span className="inline-flex items-center gap-1 bg-muted rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Clock className="w-3 h-3" /> {plan.estimated_duration}
        </span>
        <span className="inline-flex items-center gap-1 bg-muted rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <BarChart3 className="w-3 h-3" /> {plan.skill_level}
        </span>
        <span className="inline-flex items-center gap-1 bg-muted rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <BookOpen className="w-3 h-3" /> {plan.modules?.length ?? 0} modules
        </span>
      </div>

      {youtubeResults && youtubeResults.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2.5 flex items-center gap-1.5 pl-11">
            <Youtube className="w-4 h-4 text-red-500" /> Start with these courses
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
            {youtubeResults.map((yt, i) => (
              <a
                key={i}
                href={yt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                  {yt.thumbnail ? (
                    <img src={yt.thumbnail} alt={yt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                      <Youtube className="w-8 h-8 text-red-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[0.6rem] font-medium px-1.5 py-0.5 rounded">FREE</div>
                </div>
                <div className="p-3">
                  <div className="text-[0.65rem] text-muted-foreground">{yt.channel}</div>
                  <h5 className="text-sm font-semibold leading-tight mt-0.5 line-clamp-2 group-hover:text-primary transition-colors">{yt.title}</h5>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {plan.modules?.length > 0 && (
        <div className="pl-11">
          <button
            onClick={() => setShowModules(!showModules)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {showModules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showModules ? 'Hide' : 'Show'} full learning path ({plan.modules.length} modules)
          </button>

          {showModules && (
            <div className="mt-3 space-y-3">
              {plan.modules.map((mod) => (
                <div key={mod.module_number} className="border-l-2 border-primary/20 pl-3">
                  <h4 className="text-sm font-semibold">{mod.module_number}. {mod.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{mod.description} &middot; {mod.duration}</p>
                  {mod.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {mod.topics.map((t) => (
                        <span key={t} className="text-[0.65rem] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  )}
                  {mod.resources?.map((res, ri) => (
                    <div key={ri} className="mt-1.5 p-2 bg-muted/50 rounded-lg text-xs">
                      <span className="font-medium">{res.title}</span>
                      <span className="text-muted-foreground ml-1">({res.type.replace(/_/g, ' ')})</span>
                      <p className="text-muted-foreground mt-0.5">{res.description}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {plan.tips?.length > 0 && (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 ml-11">
          <h4 className="text-xs font-semibold text-primary mb-1.5">Tips for Success</h4>
          <ul className="space-y-1">
            {plan.tips.map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
