import { useState, useCallback } from 'react'
import type { Message } from '../types'
import { sendChat } from '../services/educationApi'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      history.push({ role: 'user', content: text })

      const data = await sendChat(text, history)

      const isConversation = 'type' in data.plan && data.plan.type === 'conversation'
      const content = isConversation && 'message' in data.plan ? data.plan.message : JSON.stringify(data.plan)
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
        plan: data.plan,
        youtubeResults: data.youtube_results,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  return { messages, isLoading, send }
}
