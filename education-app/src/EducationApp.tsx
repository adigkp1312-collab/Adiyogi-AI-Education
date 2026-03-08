import { useState, useRef, useEffect } from 'react'
import { Home, MessageSquare, GraduationCap, Loader2, ArrowLeft } from 'lucide-react'
import { LoginPage } from './components/LoginPage'
import { Header } from './components/Header'
import { Onboarding } from './components/Onboarding'
import { Welcome } from './components/Welcome'
import { MessageBubble } from './components/MessageBubble'
import { ChatInput } from './components/ChatInput'
import { MyCourses } from './components/MyCourses'
import { ProfileCard } from './components/ProfileCard'
import { CourseView } from './components/CourseView'
import { VoiceChat } from './components/VoiceChat'
import { useChat } from './hooks/useChat'
import { useVoice } from './hooks/useVoice'
import { useProfile } from './hooks/useProfile'
import { useCourses } from './hooks/useCourses'
import { auth, markAuthReady, prefetchJwt } from './services/authClient'
import * as api from './services/educationApi'
import type { CourseJSON } from './types'

type Tab = 'home' | 'chat' | 'courses'
type View = Tab | 'profile' | 'voicechat' | 'course'

export function EducationApp() {
  const [session, setSession] = useState<unknown>(null)
  const [authChecking, setAuthChecking] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    auth.getSession().then(async ({ data }) => {
      if (data) {
        setSession(data)
        await prefetchJwt()
      }
      markAuthReady()
      setAuthChecking(false)
    })
  }, [])

  // Show loading while checking auth
  if (authChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-3">Loading...</p>
      </div>
    )
  }

  // Show login if not authenticated
  if (!session) {
    return (
      <LoginPage
        onLoginSuccess={async (s) => {
          setSession(s)
          await prefetchJwt()
          markAuthReady()
        }}
      />
    )
  }

  return <EducationMain />
}

function EducationMain() {
  const [language, setLanguage] = useState('en-IN')
  const [view, setView] = useState<View>('home')
  const { messages, isLoading, send } = useChat()
  const { profile, isLoading: profileLoading, saveProfile, clearProfile } = useProfile()
  const { courses, addCourse, updateCourse, removeCourse } = useCourses()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeCourse, setActiveCourse] = useState<CourseJSON | null>(null)

  const { isRecording, toggleRecording } = useVoice((transcript) => {
    setView('chat')
    send(transcript)
  })

  const hasMessages = messages.length > 0

  useEffect(() => {
    if (view === 'chat') {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, isLoading, view])

  // Show loading while profile is being fetched
  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-3">Loading...</p>
      </div>
    )
  }

  // Show onboarding if no profile
  if (!profile) {
    return <Onboarding onComplete={saveProfile} />
  }

  function handleTopicClick(query: string) {
    setView('chat')
    send(query)
  }

  function handleCreateCourse() {
    setView('voicechat')
  }

  function handleCourseCreated(course: CourseJSON) {
    addCourse(course)
    setActiveCourse(course)
    setView('course')
  }

  function handleOpenCourse(course: CourseJSON) {
    setActiveCourse(course)
    setView('course')
  }

  function handleModuleComplete(moduleNumber: number) {
    if (!activeCourse) return

    const updated: CourseJSON = {
      ...activeCourse,
      completed_modules: activeCourse.completed_modules.includes(moduleNumber)
        ? activeCourse.completed_modules
        : [...activeCourse.completed_modules, moduleNumber],
      status: (activeCourse.completed_modules.length + 1 >= activeCourse.modules.length)
        ? 'completed'
        : 'in_progress',
    }
    setActiveCourse(updated)
    updateCourse(updated)

    // Persist to backend (fire-and-forget)
    api.updateProgress(activeCourse.id, moduleNumber).catch(() => {})
  }

  const TABS: { key: Tab; icon: typeof Home; label: string }[] = [
    { key: 'home', icon: Home, label: 'Home' },
    { key: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { key: 'courses', icon: GraduationCap, label: 'My Courses' },
  ]

  const showHeader = view !== 'course' && view !== 'voicechat'
  const showTabs = view !== 'course' && view !== 'voicechat'

  return (
    <div className="flex flex-col h-dvh max-w-[860px] mx-auto bg-background border-x border-border">
      {/* Header */}
      {view === 'course' ? (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
          <button onClick={() => { setView('courses'); setActiveCourse(null) }} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold truncate">{activeCourse?.title || 'Your Course'}</span>
        </div>
      ) : showHeader ? (
        <Header
          language={language}
          onLanguageChange={setLanguage}
          onSearch={handleTopicClick}
          profile={profile}
          onProfileClick={() => setView(view === 'profile' ? 'home' : 'profile')}
        />
      ) : null}

      {/* Main content */}
      <main ref={scrollRef} className={`flex-1 overflow-y-auto ${view === 'voicechat' ? 'overflow-hidden' : ''}`}>
        {view === 'home' && (
          <Welcome
            profile={profile}
            courses={courses}
            onTopicClick={handleTopicClick}
            onCreateCourse={handleCreateCourse}
            onOpenCourse={handleOpenCourse}
          />
        )}

        {view === 'chat' && (
          <>
            {!hasMessages ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <h3 className="text-base font-semibold">Ask me anything about AI</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Type a topic or use voice — Hindi bhi chalega!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Finding the best free AI courses for you...
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {view === 'courses' && (
          <MyCourses
            courses={courses}
            onOpen={handleOpenCourse}
            onRemove={removeCourse}
          />
        )}

        {view === 'profile' && (
          <ProfileCard profile={profile} onClear={clearProfile} />
        )}

        {view === 'voicechat' && (
          <VoiceChat
            profile={profile}
            onCourseCreated={handleCourseCreated}
            onBack={() => setView('home')}
          />
        )}

        {view === 'course' && activeCourse && (
          <CourseView
            course={activeCourse}
            onModuleComplete={handleModuleComplete}
          />
        )}
      </main>

      {/* Chat input */}
      {view === 'chat' && (
        <ChatInput
          onSend={(text) => send(text)}
          isLoading={isLoading}
          isRecording={isRecording}
          onToggleRecording={() => toggleRecording(language)}
        />
      )}

      {/* Bottom tab bar */}
      {showTabs && (
        <nav className="flex border-t border-border bg-white flex-shrink-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setView(t.key)}
              className={`relative flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[0.65rem] font-medium transition-colors ${
                (view === t.key || (view === 'profile' && t.key === 'home'))
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
              {t.key === 'courses' && courses.length > 0 && (
                <span className="absolute top-1.5 right-1/2 translate-x-4 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[0.5rem] flex items-center justify-center font-bold">
                  {courses.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
