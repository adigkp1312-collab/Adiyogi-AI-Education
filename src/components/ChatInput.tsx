import { useState, type KeyboardEvent } from 'react'
import { Mic, ArrowUp } from 'lucide-react'

interface ChatInputProps {
  onSend: (text: string) => void
  isLoading: boolean
  isRecording: boolean
  onToggleRecording: () => void
}

export function ChatInput({ onSend, isLoading, isRecording, onToggleRecording }: ChatInputProps) {
  const [text, setText] = useState('')

  function handleSend() {
    if (!text.trim() || isLoading) return
    onSend(text)
    setText('')
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <footer className="px-4 py-3 bg-white border-t border-border">
      <div className="flex items-center gap-2 bg-muted rounded-full px-1.5 py-1">
        <button
          onClick={onToggleRecording}
          className={`rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 transition-colors ${
            isRecording
              ? 'bg-destructive text-white animate-pulse'
              : 'text-muted-foreground hover:text-foreground hover:bg-white'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to learn?"
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50 py-1"
        />

        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          className="rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  )
}
