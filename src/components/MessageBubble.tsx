import { CoursePlanCard } from './CoursePlanCard'
import type { Message, CoursePlan } from '../types'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isCoursePlan = message.plan && !('type' in message.plan && message.plan.type === 'conversation')

  if (isUser) {
    return (
      <div className="self-end max-w-[80%]">
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
          {message.content}
        </div>
      </div>
    )
  }

  if (isCoursePlan) {
    return (
      <div className="w-full">
        <CoursePlanCard
          plan={message.plan as CoursePlan}
          youtubeResults={message.youtubeResults}
        />
      </div>
    )
  }

  return (
    <div className="self-start max-w-[85%]">
      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm">
        <p>{message.plan && 'message' in message.plan ? message.plan.message : message.content}</p>
      </div>
    </div>
  )
}
