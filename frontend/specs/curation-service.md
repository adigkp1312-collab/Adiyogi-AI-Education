# Feature: AI-Powered Curation Platform

## Deployment: Google Cloud Run

All backend services deploy as containerized Cloud Run services on GCP.
The existing codebase uses AWS Lambda (`infrastructure/lambda-deploy.sh`) — new services migrate to Cloud Run for Vertex AI proximity and cost.

### Cloud Run Service Architecture
```
┌─────────────────────────────────────────────┐
│  Frontend (Netlify / Next.js)               │
│  └── Calls Cloud Run services via REST      │
├─────────────────────────────────────────────┤
│  Cloud Run Services (GCP):                  │
│  ├── interviewer-service   (port 8080)      │
│  ├── question-bank-service (port 8080)      │
│  ├── curator-service       (port 8080)      │
│  └── evaluation-service    (port 8080)      │
├─────────────────────────────────────────────┤
│  Data Layer:                                │
│  ├── Vertex AI Search + Datastore           │
│  ├── Firestore (per-user evaluation data)   │
│  └── Cloud Storage (crawled content cache)  │
└─────────────────────────────────────────────┘
```

### Deployment files
- `services/Dockerfile` — shared multi-stage Dockerfile
- `services/<service>/` — individual service directories
- `infrastructure/cloudrun-deploy.sh` — deploy script
- `infrastructure/cloudbuild.yaml` — CI/CD pipeline

## Context

We are building an AI-first education platform focused on AI/Agent development courses. Unlike Coursera, courses are created and curated by AI, personalized per user. The platform serves all of India with multilingual support.

The system has 4 core services that work together:

```
User → Interviewer Service → User Profile
                                  ↓
Question Bank (Vertex Datastore) ← Web Crawler (pre-seeded)
                                  ↓
                          Curator Service → Personalized Course Plan
                                  ↓
                          Evaluation Engine → Adaptive Progress Tracking
```

## Architecture

### Service 1: Interviewer Service
- Adaptive typeform-style interview that changes questions based on answers
- Voice chat option using Gemini Live Chat API for spoken interviews
- Multilingual — interview conducted in user's preferred language (13 Indian languages)
- Outputs a detailed `UserProfile` with: skill level, goals, interests, learning style, available time, prior experience

### Service 2: Question Bank (Vertex AI Datastore)
- Vertex AI Search Engine + Vertex Datastore stores all interview questions
- Web crawler pre-seeds the datastore from day 0 with questions sourced from public platforms
- Questions asked by real users feed back into the bank, evolving the questionnaire over time
- Adaptive selection — questions are chosen dynamically based on previous answers, not served linearly

### Service 3: Curator Service
- Takes `UserProfile` + question bank data → queries Vertex Search Engine + Datastore
- Indexes publicly available AI/ML courses worldwide via web crawler
- Generates a balanced course plan: theory + hands-on tasks
- Hands-on plans use free-tier resources only: GitHub, Vercel/Netlify, Google Cloud, Vertex AI, AWS, Azure free tiers, open-source libraries
- Outputs a structured `CoursePlan` with modules, resources, and practical projects

### Service 4: Evaluation Engine
- Regular check-ins that interact with the user to assess progress
- Per-user dedicated data storage (primary source for adaptation decisions)
- Dynamically adapts the course: easier/slower if struggling, faster/harder if excelling
- Tracks completion, quiz scores, project submissions, engagement metrics

## Steps

### Phase 0: Research & Documentation
1. Web crawl existing AI education platforms (Coursera, Udacity, fast.ai, DeepLearning.AI, etc.) to document how their courses are structured, what content they offer, and how they handle progression. Save findings to `docs/research/existing-platforms.md`.

### Phase 1: Interviewer Service
2. Create `src/services/interviewerService.ts` — adaptive interview engine that generates next question based on previous answers using Vertex AI. Define question flow logic with branching paths.
3. Create `src/types/interview.ts` — types for `InterviewQuestion`, `InterviewSession`, `InterviewResponse`, `AdaptiveQuestionFlow`.
4. Create `src/components/AdaptiveInterview.tsx` — typeform-style full-screen interview UI with animated transitions between questions. Supports text input, multiple choice, sliders, and multi-select.
5. Integrate Gemini Live Chat API in `src/services/voiceInterviewService.ts` — voice-based interview alternative that transcribes, processes, and generates follow-up questions in real-time.
6. Add language detection and auto-switch in the interview flow — detect user's language preference early and conduct remaining interview in that language.

### Phase 2: Question Bank & Datastore
7. Set up Vertex AI Search Engine + Datastore configuration in `src/services/vertexDatastore.ts` — CRUD operations for questions, search queries, and course metadata.
8. Create `src/services/webCrawler.ts` — crawler that scrapes public AI education platforms for interview questions, course structures, and content metadata. Stores results in Vertex Datastore.
9. Build question evolution pipeline — when users complete interviews, their Q&A pairs feed back into the datastore. A scoring mechanism promotes high-signal questions and retires low-value ones.
10. Create API route `src/app/api/questions/route.ts` — serves adaptive questions from the datastore, accepting context (previous answers) and returning the next best question.

### Phase 3: Curator Service
11. Create `src/services/curatorService.ts` — takes UserProfile + Vertex Datastore query results → generates a personalized course plan. Balances theory modules with hands-on projects.
12. Create `src/services/courseCrawler.ts` — web crawler that indexes free AI/ML courses from YouTube, NPTEL, fast.ai, Hugging Face, Kaggle Learn, Google AI, Microsoft Learn, AWS Skill Builder, etc. Stores in Vertex Datastore.
13. Create `src/services/handsOnPlanner.ts` — generates practical project plans using only free-tier services (GitHub repos, Vercel/Netlify deploys, GCP/AWS/Azure free tiers, open-source libraries). Each project has step-by-step instructions.
14. Create API route `src/app/api/curate/route.ts` — endpoint that accepts a UserProfile and returns a full `CoursePlan` with theory + hands-on modules.
15. Create `src/components/CoursePlanView.tsx` — rich UI for displaying the curated plan with module cards, resource links, project briefs, and estimated time per section.

### Phase 4: Evaluation Engine
16. Create `src/services/evaluationEngine.ts` — tracks user progress, conducts periodic assessments, and adapts the course plan. Uses per-user data storage in DynamoDB/Vertex Datastore.
17. Create `src/services/adaptiveLearning.ts` — algorithm that adjusts course difficulty and pace based on: completion rate, quiz scores, time spent, engagement patterns, self-reported confidence.
18. Create `src/components/ProgressDashboard.tsx` — visual dashboard showing learning progress, upcoming milestones, streak tracking, and adaptation history ("We made Module 3 easier based on your Quiz 2 results").
19. Create API route `src/app/api/evaluate/route.ts` — endpoint for submitting progress data and receiving adapted course updates.
20. Create `src/components/CheckIn.tsx` — periodic check-in modal that asks the user how they're doing, what's confusing, and whether to adjust pace.

## Files to create
- `docs/research/existing-platforms.md` — platform research findings
- `src/types/interview.ts` — interview types
- `src/services/interviewerService.ts` — adaptive interview engine
- `src/services/voiceInterviewService.ts` — Gemini Live voice interview
- `src/services/vertexDatastore.ts` — Vertex AI datastore client
- `src/services/webCrawler.ts` — question/content web crawler
- `src/services/courseCrawler.ts` — course indexing crawler
- `src/services/curatorService.ts` — course plan generation
- `src/services/handsOnPlanner.ts` — free-tier project planner
- `src/services/evaluationEngine.ts` — progress tracking & adaptation
- `src/services/adaptiveLearning.ts` — difficulty adjustment algorithm
- `src/components/AdaptiveInterview.tsx` — typeform-style interview UI
- `src/components/CoursePlanView.tsx` — curated plan display
- `src/components/ProgressDashboard.tsx` — learning progress UI
- `src/components/CheckIn.tsx` — periodic check-in modal
- `src/app/api/questions/route.ts` — question bank API
- `src/app/api/curate/route.ts` — curation API
- `src/app/api/evaluate/route.ts` — evaluation API

## Files to modify
- `src/types/index.ts` — add new shared types
- `src/app/page.tsx` — integrate interview entry point
- `src/components/Header.tsx` — add navigation to new pages
- `src/lib/dynamodb.ts` — add per-user evaluation data storage

## Tech Stack Additions
- **Vertex AI Search Engine + Datastore** — question bank, course index, adaptive search
- **Gemini Live Chat API** — voice-based interviews
- **Web crawling** — Puppeteer/Cheerio for course and question sourcing

## Jira Integration
- All phases to be tracked as Epics in Jira
- Each step becomes a Jira ticket with estimate, assignee, and status
- Progress, cost, and time tracking updated in Jira throughout

## Notes
- All hands-on projects must use free-tier services only — zero cost to learners
- Every service must support 13 Indian languages via existing i18n system
- Phases can be built and shipped independently
- Phase 0 (research) should complete before implementation begins
- Vertex AI Datastore requires GCP project setup and API keys


