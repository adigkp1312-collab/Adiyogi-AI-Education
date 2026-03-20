# Feature: Curation End-to-End Testing

## Context

The curation pipeline has zero test coverage. It spans 4 services (Interviewer → Question Bank → Curator → Evaluation) with external dependencies on Vertex AI Datastore and web crawling. We need E2E tests that validate the full flow plus unit tests for each service in isolation. Tests should run without GCP credentials by mocking external services.

## Architecture Under Test

```
InterviewProfile (input)
       ↓
  /api/curate  →  curatorService.curateCourse()
       ↓              ├── buildTopicPlan()
       ↓              ├── findCoursesForTopic() → vertexDatastore / webCrawler fallback
       ↓              └── getProjectTasks() → handsOnPlanner
       ↓
  CourseJSON (output)
       ↓
  /api/evaluate  →  evaluationEngine + adaptiveLearning
       ↓
  Adapted CourseJSON
```

---

## Real Payloads & Expected Outputs

### Payload 1: Beginner Profile → POST /api/curate

**Request body:**
```json
{
  "name": "Priya Sharma",
  "language": "hi",
  "currentRole": "Computer Science Student",
  "experienceLevel": "beginner",
  "programmingLanguages": ["python"],
  "aiExperience": [],
  "goals": ["Get a job in AI", "Build AI-powered apps"],
  "specificInterests": ["llm", "agents", "rag"],
  "availableHoursPerWeek": 8,
  "learningStyle": "hands_on",
  "deadline": "2026-09-01",
  "education": "B.Tech CS 3rd year",
  "preferredProjectTypes": ["chatbot", "web app"]
}
```

**Expected response (200):**
```json
{
  "course": {
    "id": "<uuid>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>",
    "status": "ready",
    "title": "Personalized AI Learning Path for Priya Sharma",
    "description": "A personalized AI learning path designed for a beginner interested in llm, agents, rag. Balanced theory and hands-on projects using only free resources.",
    "estimated_duration": "19 weeks",
    "skill_level": "beginner",
    "thumbnail": "",
    "learner": {
      "name": "Priya Sharma",
      "goal": "Get a job in AI, Build AI-powered apps",
      "prior_knowledge": ["python"],
      "weak_areas": [],
      "available_hours_per_week": 8,
      "preferred_language": "hi",
      "level": "beginner",
      "learning_style": "hands_on",
      "deadline": "2026-09-01",
      "education_background": "B.Tech CS 3rd year"
    },
    "modules": [
      {
        "module_number": 1,
        "title": "Python Programming Fundamentals",
        "objective": "Master python programming fundamentals through theory and examples",
        "duration": "2 weeks",
        "topics": ["python programming for beginners", "python from scratch"],
        "courses": "// up to 3 IndexedCourse objects matched from webCrawler",
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": []
      },
      {
        "module_number": 2,
        "title": "Introduction to AI & Machine Learning",
        "objective": "Master introduction to ai & machine learning through theory and examples",
        "duration": "2 weeks",
        "topics": ["intro to AI machine learning", "what is artificial intelligence"],
        "courses": "// matched courses",
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": ["Module 1"]
      },
      {
        "module_number": 3,
        "title": "Data Handling with Python",
        "objective": "Master data handling with python through theory and examples",
        "duration": "1 weeks",
        "topics": ["python pandas numpy", "data manipulation python"],
        "courses": "// matched courses",
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": ["Module 2"]
      },
      {
        "module_number": 4,
        "title": "Large Language Models & Prompt Engineering",
        "objective": "Master large language models & prompt engineering through theory and examples",
        "duration": "2 weeks",
        "topics": ["LLM prompt engineering", "how LLMs work"],
        "courses": "// matched courses",
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": ["Module 3"]
      },
      {
        "module_number": 5,
        "title": "AI Agents: Architecture & Frameworks",
        "objective": "Master ai agents: architecture & frameworks through theory and examples",
        "duration": "3 weeks",
        "topics": ["AI agents LangChain", "build AI agents from scratch"],
        "courses": "// matched courses (AI Agents Course from HF, LangChain course, etc.)",
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": ["Module 4"]
      }
    ],
    "matched_courses": "// all IndexedCourse[] collected across modules, deduplicated by URL",
    "tips": [
      "All resources in this course are 100% free — no credit card needed.",
      "Complete each module before moving to the next for best results.",
      "Focus on the project modules — you learn best by building.",
      "Don't rush — understanding foundations will make advanced topics much easier.",
      "AI Agents are the focus of this platform — you'll build multiple agent projects."
    ],
    "adaptive_notes": "Course curated for beginner level with focus on: llm, agents, rag. Learning style: hands_on. 8hrs/week available.",
    "completed_modules": []
  },
  "message": "Personalized course created with 5 modules covering 19 weeks."
}
```

**Assertions:**
- `course.modules.length` <= 5 (availableHoursPerWeek=8 < 10, so maxModules=5)
- `course.skill_level` === `"beginner"`
- `course.learner.prior_knowledge` === `["python"]`
- `course.learner.weak_areas` === `[]` (beginner, not "none")
- Module 1 title is "Python Programming Fundamentals" (beginner gets foundation)
- Module 2 title is "Introduction to AI & Machine Learning"
- AI Agents module exists somewhere in modules
- `course.tips` includes "Focus on the project modules" (learningStyle=hands_on)
- `course.tips` includes "AI Agents are the focus" (specificInterests includes agents)
- `course.completed_modules` === `[]`
- Every course in `matched_courses` has `free: true`

---

### Payload 2: Advanced Profile → POST /api/curate

**Request body:**
```json
{
  "name": "Rahul Verma",
  "language": "en",
  "currentRole": "Senior ML Engineer",
  "experienceLevel": "advanced",
  "programmingLanguages": ["python", "javascript", "rust"],
  "aiExperience": ["trained models", "deployed to production", "fine-tuning"],
  "goals": ["Build production AI agents"],
  "specificInterests": ["agents", "rag", "mlops"],
  "availableHoursPerWeek": 15,
  "learningStyle": "reading",
  "education": "M.Tech AI from IIT Delhi",
  "preferredProjectTypes": ["agent", "pipeline"]
}
```

**Expected response (200):**
```json
{
  "course": {
    "id": "<uuid>",
    "status": "ready",
    "title": "Personalized AI Learning Path for Rahul Verma",
    "description": "A personalized AI learning path designed for a advanced interested in agents, rag, mlops. Balanced theory and hands-on projects using only free resources.",
    "estimated_duration": "17 weeks",
    "skill_level": "advanced",
    "learner": {
      "name": "Rahul Verma",
      "goal": "Build production AI agents",
      "prior_knowledge": ["python", "javascript", "rust", "trained models", "deployed to production", "fine-tuning"],
      "weak_areas": [],
      "available_hours_per_week": 15,
      "preferred_language": "en",
      "level": "advanced",
      "learning_style": "reading",
      "deadline": "flexible",
      "education_background": "M.Tech AI from IIT Delhi"
    },
    "modules": [
      {
        "module_number": 1,
        "title": "AI Agents: Architecture & Frameworks",
        "duration": "3 weeks"
      },
      {
        "module_number": 2,
        "title": "RAG: Retrieval Augmented Generation",
        "duration": "2 weeks"
      },
      {
        "module_number": 3,
        "title": "MLOps & Model Deployment",
        "duration": "2 weeks"
      },
      {
        "module_number": 4,
        "title": "Hands-On Project: Build Your First AI Agent",
        "duration": "2 weeks"
      },
      {
        "module_number": 5,
        "title": "Capstone Project: Deploy AI Solution",
        "duration": "3 weeks"
      }
    ],
    "tips": [
      "All resources in this course are 100% free — no credit card needed.",
      "Complete each module before moving to the next for best results.",
      "AI Agents are the focus of this platform — you'll build multiple agent projects."
    ],
    "completed_modules": []
  },
  "message": "Personalized course created with 5 modules covering 17 weeks."
}
```

**Assertions:**
- `course.modules.length` <= 8 (availableHoursPerWeek=15 >= 10, so maxModules=8)
- No "Python Programming Fundamentals" module (advanced skips foundations)
- No "Introduction to AI & Machine Learning" module
- No "Data Handling with Python" module (advanced skips this too)
- `course.learner.weak_areas` === `[]` (not experienceLevel "none")
- `course.learner.prior_knowledge` has 6 entries (3 languages + 3 aiExperience)
- `course.tips` does NOT include "Don't rush" (not beginner)
- `course.tips` does NOT include "Focus on the project modules" (learningStyle=reading, not hands_on)

---

### Payload 3: Validation Error → POST /api/curate

**Request body (missing goals):**
```json
{
  "name": "Test User",
  "language": "en",
  "experienceLevel": "beginner",
  "goals": []
}
```

**Expected response (400):**
```json
{
  "error": "Profile must include name and at least one goal"
}
```

**Request body (missing name):**
```json
{
  "goals": ["Learn AI"]
}
```

**Expected response (400):**
```json
{
  "error": "Profile must include name and at least one goal"
}
```

---

### Payload 4: Progress Update → POST /api/evaluate

**Request body:**
```json
{
  "action": "update_progress",
  "evaluation": {
    "userId": "user-123",
    "courseId": "course-456",
    "moduleEvaluations": [
      {
        "moduleNumber": 1,
        "status": "completed",
        "startedAt": "2026-03-01T00:00:00Z",
        "completedAt": "2026-03-10T00:00:00Z",
        "timeSpentMinutes": 480,
        "quizScore": 85,
        "projectSubmitted": false,
        "selfRatedConfidence": 4,
        "engagementScore": 80
      },
      {
        "moduleNumber": 2,
        "status": "in_progress",
        "startedAt": "2026-03-11T00:00:00Z",
        "timeSpentMinutes": 120,
        "projectSubmitted": false,
        "selfRatedConfidence": 2,
        "engagementScore": 60
      },
      {
        "moduleNumber": 3,
        "status": "not_started",
        "timeSpentMinutes": 0,
        "projectSubmitted": false,
        "selfRatedConfidence": 0,
        "engagementScore": 0
      }
    ],
    "overallProgress": {
      "completedModules": 1,
      "totalModules": 3,
      "completionRate": 33,
      "averageQuizScore": 85,
      "averageConfidence": 4,
      "totalTimeSpentMinutes": 600,
      "currentStreak": 5,
      "longestStreak": 5,
      "lastActiveAt": "2026-03-15T00:00:00Z",
      "paceStatus": "on_track"
    },
    "checkIns": [],
    "adaptationHistory": [],
    "lastEvaluatedAt": "2026-03-15T00:00:00Z"
  },
  "data": {
    "moduleNumber": 2,
    "status": "completed",
    "completedAt": "2026-03-15T12:00:00Z",
    "timeSpentMinutes": 360,
    "quizScore": 72,
    "selfRatedConfidence": 3,
    "engagementScore": 70
  }
}
```

**Expected response (200):**
```json
{
  "evaluation": {
    "userId": "user-123",
    "courseId": "course-456",
    "moduleEvaluations": [
      {
        "moduleNumber": 1,
        "status": "completed",
        "quizScore": 85,
        "timeSpentMinutes": 480
      },
      {
        "moduleNumber": 2,
        "status": "completed",
        "completedAt": "2026-03-15T12:00:00Z",
        "timeSpentMinutes": 360,
        "quizScore": 72,
        "selfRatedConfidence": 3,
        "engagementScore": 70
      },
      {
        "moduleNumber": 3,
        "status": "not_started",
        "timeSpentMinutes": 0
      }
    ],
    "overallProgress": {
      "completedModules": 2,
      "totalModules": 3,
      "completionRate": 67,
      "averageQuizScore": 79,
      "averageConfidence": 3.5,
      "totalTimeSpentMinutes": 840,
      "paceStatus": "on_track"
    }
  }
}
```

**Assertions:**
- Module 2 status changed from `"in_progress"` to `"completed"`
- `overallProgress.completedModules` recalculated to 2
- `overallProgress.completionRate` recalculated to 67 (2/3 * 100)
- `overallProgress.averageQuizScore` recalculated to 79 ((85+72)/2 rounded)
- Module 3 still `"not_started"` (unchanged)

---

### Payload 5: Check-In → POST /api/evaluate

**Request body:**
```json
{
  "action": "check_in",
  "evaluation": {
    "userId": "user-123",
    "courseId": "course-456",
    "moduleEvaluations": [
      {
        "moduleNumber": 1,
        "status": "completed",
        "timeSpentMinutes": 480,
        "quizScore": 45,
        "projectSubmitted": false,
        "selfRatedConfidence": 2,
        "engagementScore": 40
      },
      {
        "moduleNumber": 2,
        "status": "in_progress",
        "timeSpentMinutes": 60,
        "projectSubmitted": false,
        "selfRatedConfidence": 1,
        "engagementScore": 30
      }
    ],
    "overallProgress": {
      "completedModules": 1,
      "totalModules": 5,
      "completionRate": 20,
      "averageQuizScore": 45,
      "averageConfidence": 2,
      "totalTimeSpentMinutes": 540,
      "currentStreak": 0,
      "longestStreak": 3,
      "lastActiveAt": "2026-03-10T00:00:00Z",
      "paceStatus": "behind"
    },
    "checkIns": [],
    "adaptationHistory": [],
    "lastEvaluatedAt": "2026-03-10T00:00:00Z"
  },
  "data": {
    "mood": "struggling",
    "confusingTopics": ["backpropagation", "gradient descent"],
    "feedbackText": "I don't understand the math behind neural networks"
  }
}
```

**Expected response (200):**
```json
{
  "evaluation": {
    "checkIns": [
      {
        "id": "<uuid>",
        "timestamp": "<iso-timestamp>",
        "mood": "struggling",
        "confusingTopics": ["backpropagation", "gradient descent"],
        "feedbackText": "I don't understand the math behind neural networks",
        "suggestedAction": "Review supplementary resources for: backpropagation, gradient descent. Consider slowing pace."
      }
    ]
  },
  "suggestedAction": "Review supplementary resources for: backpropagation, gradient descent. Consider slowing pace."
}
```

**Assertions:**
- `suggestedAction` references the confusingTopics since mood is "struggling"
- New check-in appended to `evaluation.checkIns`
- `checkIn.mood` === `"struggling"`
- `checkIn.confusingTopics` === `["backpropagation", "gradient descent"]`

---

### Payload 6: Adapt Course (struggling user) → POST /api/evaluate

**Request body:**
```json
{
  "action": "adapt",
  "evaluation": {
    "userId": "user-123",
    "courseId": "course-456",
    "moduleEvaluations": [
      {
        "moduleNumber": 1,
        "status": "completed",
        "timeSpentMinutes": 600,
        "quizScore": 40,
        "projectSubmitted": false,
        "selfRatedConfidence": 2,
        "engagementScore": 35
      },
      {
        "moduleNumber": 2,
        "status": "completed",
        "timeSpentMinutes": 500,
        "quizScore": 38,
        "projectSubmitted": false,
        "selfRatedConfidence": 1,
        "engagementScore": 30
      },
      {
        "moduleNumber": 3,
        "status": "in_progress",
        "timeSpentMinutes": 60,
        "projectSubmitted": false,
        "selfRatedConfidence": 1,
        "engagementScore": 25
      }
    ],
    "overallProgress": {
      "completedModules": 2,
      "totalModules": 5,
      "completionRate": 40,
      "averageQuizScore": 39,
      "averageConfidence": 1.3,
      "totalTimeSpentMinutes": 1160,
      "currentStreak": 1,
      "longestStreak": 5,
      "lastActiveAt": "2026-03-15T00:00:00Z",
      "paceStatus": "on_track"
    },
    "checkIns": [
      {
        "id": "ci-1",
        "timestamp": "2026-03-12T00:00:00Z",
        "mood": "frustrated",
        "confusingTopics": ["transformers"],
        "suggestedAction": "Review supplementary resources for: transformers. Consider slowing pace."
      }
    ],
    "adaptationHistory": [],
    "lastEvaluatedAt": "2026-03-14T00:00:00Z"
  },
  "course": {
    "id": "course-456",
    "created_at": 1741000000000,
    "updated_at": 1741000000000,
    "status": "in_progress",
    "title": "Personalized AI Learning Path for Test User",
    "description": "A personalized AI learning path...",
    "estimated_duration": "15 weeks",
    "skill_level": "beginner",
    "thumbnail": "",
    "learner": {
      "name": "Test User",
      "goal": "Learn AI",
      "prior_knowledge": ["python"],
      "weak_areas": [],
      "available_hours_per_week": 8,
      "preferred_language": "en",
      "level": "beginner",
      "learning_style": "mixed",
      "deadline": "flexible",
      "education_background": "B.Tech"
    },
    "modules": [
      {
        "module_number": 1,
        "title": "Python Fundamentals",
        "objective": "Master python fundamentals",
        "duration": "2 weeks",
        "topics": ["python basics"],
        "courses": [],
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": []
      },
      {
        "module_number": 2,
        "title": "Intro to AI",
        "objective": "Master intro to AI",
        "duration": "2 weeks",
        "topics": ["AI basics"],
        "courses": [],
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": ["Module 1"]
      },
      {
        "module_number": 3,
        "title": "LLMs & Prompt Engineering",
        "objective": "Master LLMs",
        "duration": "2 weeks",
        "topics": ["LLMs"],
        "courses": [],
        "practice": ["Complete exercises from course materials"],
        "assessment": "Quiz on key concepts + submit summary notes",
        "prerequisites": ["Module 2"]
      }
    ],
    "matched_courses": [],
    "tips": [],
    "adaptive_notes": "",
    "completed_modules": []
  }
}
```

**Expected response (200):**
```json
{
  "adaptedCourse": {
    "id": "course-456",
    "status": "in_progress",
    "modules": [
      {
        "module_number": 1,
        "title": "Python Fundamentals",
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes"
      },
      {
        "module_number": 2,
        "title": "Intro to AI",
        "practice": ["Complete exercises from course materials", "Write notes summarizing key concepts"],
        "assessment": "Quiz on key concepts + submit summary notes"
      },
      {
        "module_number": 3,
        "title": "LLMs & Prompt Engineering",
        "practice": [
          "Complete exercises from course materials",
          "Review foundational concepts before proceeding",
          "Work through additional guided examples"
        ],
        "assessment": "Simplified assessment: demonstrate understanding with guided walkthrough"
      }
    ],
    "adaptive_notes": "Progress: 2/5 modules (40%). Average quiz score: 39%. Pace: on_track."
  },
  "adaptations": [
    {
      "id": "<uuid>",
      "timestamp": "<iso-timestamp>",
      "trigger": "quiz_score",
      "description": "Average quiz score 39% — adding remedial content",
      "changes": [
        {
          "type": "difficulty_adjust",
          "oldValue": "current",
          "newValue": "easier — additional foundational content added"
        }
      ]
    }
  ],
  "summary": "Applied 1 adaptation(s): Average quiz score 39% — adding remedial content"
}
```

**Assertions:**
- Adaptation triggered because average quiz score (40+38)/2 = 39 < 50
- `adaptations[0].trigger` === `"quiz_score"`
- Module 3 (in_progress, not completed) gets extra practice items added
- Module 3 assessment changed to "Simplified assessment..."
- Modules 1 and 2 (completed) are NOT modified
- `adaptive_notes` is regenerated with current progress stats
- `adaptedCourse.updated_at` > original `course.updated_at`

---

### Payload 7: Get Recommendation → POST /api/evaluate

**Request body:**
```json
{
  "action": "recommend",
  "evaluation": {
    "userId": "user-123",
    "courseId": "course-456",
    "moduleEvaluations": [
      {
        "moduleNumber": 1,
        "status": "completed",
        "timeSpentMinutes": 300,
        "quizScore": 92,
        "projectSubmitted": false,
        "selfRatedConfidence": 4,
        "engagementScore": 85
      },
      {
        "moduleNumber": 2,
        "status": "in_progress",
        "startedAt": "2026-03-10T00:00:00Z",
        "timeSpentMinutes": 120,
        "projectSubmitted": false,
        "selfRatedConfidence": 3,
        "engagementScore": 70
      },
      {
        "moduleNumber": 3,
        "status": "not_started",
        "timeSpentMinutes": 0,
        "projectSubmitted": false,
        "selfRatedConfidence": 0,
        "engagementScore": 0
      }
    ],
    "overallProgress": {
      "completedModules": 1,
      "totalModules": 3,
      "completionRate": 33,
      "averageQuizScore": 92,
      "averageConfidence": 4,
      "totalTimeSpentMinutes": 420,
      "currentStreak": 3,
      "longestStreak": 3,
      "lastActiveAt": "2026-03-15T00:00:00Z",
      "paceStatus": "on_track"
    },
    "checkIns": [],
    "adaptationHistory": [],
    "lastEvaluatedAt": "2026-03-15T00:00:00Z"
  },
  "course": {
    "id": "course-456",
    "modules": [
      { "module_number": 1, "title": "Python Fundamentals" },
      { "module_number": 2, "title": "Intro to AI" },
      { "module_number": 3, "title": "LLMs" }
    ]
  }
}
```

**Expected response (200):**
```json
{
  "action": "complete_module",
  "moduleNumber": 2,
  "reason": "You seem confident — try the assessment to complete this module."
}
```

**Assertions:**
- Returns `"complete_module"` because module 2 is `in_progress` with `timeSpentMinutes > 0` and `selfRatedConfidence >= 3`
- `moduleNumber` === 2

---

### Payload 8: GET /api/questions

**Request:**
```
GET /api/questions?category=skills&limit=3
```

**Expected response (200) — Vertex unavailable, falls back to seed questions:**
```json
{
  "questions": [
    {
      "id": "<uuid>",
      "text": "Have you ever trained a machine learning model?",
      "type": "single_choice",
      "category": "skills",
      "options": [
        { "id": "yes", "label": "Yes, multiple times", "value": "yes" },
        { "id": "once", "label": "Once or twice", "value": "once" },
        { "id": "no", "label": "Never", "value": "no" }
      ],
      "usageCount": 0,
      "effectivenessScore": 0.8,
      "source": "seed",
      "language": "en",
      "tags": ["ml", "experience", "assessment"],
      "createdAt": "<iso-timestamp>",
      "updatedAt": "<iso-timestamp>"
    },
    {
      "id": "<uuid>",
      "text": "Which AI development tools are you familiar with?",
      "type": "multi_choice",
      "category": "skills",
      "options": [
        { "id": "jupyter", "label": "Jupyter Notebooks", "value": "jupyter" },
        { "id": "colab", "label": "Google Colab", "value": "colab" },
        { "id": "vscode", "label": "VS Code + Extensions", "value": "vscode" },
        { "id": "huggingface", "label": "Hugging Face Hub", "value": "huggingface" },
        { "id": "none", "label": "None of these", "value": "none" }
      ],
      "usageCount": 0,
      "effectivenessScore": 0.75,
      "source": "seed",
      "language": "en",
      "tags": ["tools", "experience"],
      "createdAt": "<iso-timestamp>",
      "updatedAt": "<iso-timestamp>"
    },
    {
      "id": "<uuid>",
      "text": "How comfortable are you with math concepts like linear algebra and calculus?",
      "type": "single_choice",
      "category": "skills",
      "options": [
        { "id": "strong", "label": "Strong — studied in depth", "value": "strong" },
        { "id": "basic", "label": "Basic — know the fundamentals", "value": "basic" },
        { "id": "rusty", "label": "Rusty — learned but forgotten", "value": "rusty" },
        { "id": "none", "label": "No math background", "value": "none" }
      ],
      "usageCount": 0,
      "effectivenessScore": 0.7,
      "source": "seed",
      "language": "en",
      "tags": ["math", "prerequisites", "assessment"],
      "createdAt": "<iso-timestamp>",
      "updatedAt": "<iso-timestamp>"
    }
  ],
  "total": 3,
  "source": "seed"
}
```

**Assertions:**
- All 3 questions have `category === "skills"` (filtered correctly)
- Returns exactly 3 results (limit=3)
- `source` field is `"seed"` (Vertex unavailable → seed fallback)
- Excludes "goals" category questions (e.g., "What type of AI applications excite you most?" NOT returned)
- Each question has `id`, `createdAt`, `updatedAt` populated

---

### Payload 9: GET /api/questions with adaptive context

**Request:**
```
GET /api/questions?limit=5&context={"experience":"advanced"}
```

**Expected response (200):**
```json
{
  "questions": [
    {
      "text": "Have you ever trained a machine learning model?",
      "tags": ["ml", "experience", "assessment"]
    },
    {
      "text": "Which AI development tools are you familiar with?",
      "tags": ["tools", "experience"]
    },
    {
      "text": "What type of AI applications excite you most?",
      "tags": ["goals", "interests", "motivation"]
    },
    {
      "text": "What is your primary motivation for learning AI?",
      "tags": ["motivation", "goals", "career"]
    }
  ],
  "total": 4,
  "source": "seed"
}
```

**Assertions:**
- Questions with tag `"basic"` or `"prerequisites"` are filtered OUT (advanced context)
- The math question (tags: `["math", "prerequisites", "assessment"]`) is excluded
- The deployment question (tags: `["deployment", "experience", "devops"]`) is excluded
- Remaining questions sorted by `effectivenessScore` descending
- `total` matches actual count after filtering

---

### Payload 10: Question Feedback → POST /api/questions

**Request body:**
```json
{
  "questionId": "q-abc-123",
  "useful": true
}
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "Feedback recorded for question q-abc-123: useful"
}
```

**Validation error — missing questionId:**
```json
{}
```

**Expected response (400):**
```json
{
  "error": "questionId is required"
}
```

---

### Payload 11: webCrawler — searchKnownCourses()

**Function call:**
```typescript
searchKnownCourses("agents", { level: "intermediate", free: true })
```

**Expected output:**
```json
[
  {
    "id": "<uuid>",
    "title": "AI Agents Course",
    "provider": "Hugging Face",
    "platform": "huggingface",
    "url": "https://huggingface.co/learn/agents-course",
    "description": "From beginner to expert in AI agents. smolagents, LangGraph, LlamaIndex.",
    "duration": "4 weeks",
    "level": "intermediate",
    "language": "en",
    "topics": ["AI agents", "LangGraph", "smolagents", "LlamaIndex"],
    "rating": 4.8,
    "free": true
  },
  {
    "id": "<uuid>",
    "title": "LangChain for LLM Application Development",
    "provider": "DeepLearning.AI",
    "platform": "deeplearningai",
    "url": "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/",
    "description": "Build LLM apps with LangChain. Models, prompts, chains, agents.",
    "duration": "1 hour",
    "level": "intermediate",
    "language": "en",
    "topics": ["LangChain", "LLM", "agents", "prompt engineering"],
    "rating": 4.7,
    "free": true
  },
  {
    "id": "<uuid>",
    "title": "Building AI Agents with Vertex AI",
    "provider": "Google Cloud",
    "platform": "google",
    "url": "https://cloud.google.com/vertex-ai/docs/agents",
    "description": "Build, deploy, and manage AI agents using Google Cloud Vertex AI.",
    "duration": "2 weeks",
    "level": "intermediate",
    "language": "en",
    "topics": ["Vertex AI", "AI agents", "Google Cloud", "deployment"],
    "rating": 4.5,
    "free": true
  }
]
```

**Assertions:**
- All results contain "agents" in title, description, or topics
- All results have `level === "intermediate"` (filter applied)
- All results have `free === true`
- Beginner-level courses (fast.ai, CS50) excluded by level filter
- Each result has a unique `id` (uuid generated)

---

### Payload 12: handsOnPlanner — generateHandsOnPlan()

**Function call:**
```typescript
generateHandsOnPlan("AI agents", "beginner")
```

**Expected output:**
```json
[
  {
    "id": "project-chatbot-basic",
    "title": "Build a Simple AI Chatbot",
    "description": "Create a chatbot using a free LLM API. Deploy it as a web app on Vercel.",
    "level": "beginner",
    "estimatedHours": 6,
    "tools": [
      { "name": "GitHub", "purpose": "Code hosting, version control, CI/CD with Actions", "freeLimit": "Unlimited public repos, 2000 Actions minutes/month", "signupUrl": "https://github.com/signup" },
      { "name": "Vercel", "purpose": "Frontend deployment and serverless functions", "freeLimit": "100GB bandwidth, serverless function executions", "signupUrl": "https://vercel.com/signup" },
      { "name": "Hugging Face", "purpose": "Model hosting, Spaces for demos, datasets", "freeLimit": "Unlimited public models, 2 free Spaces", "signupUrl": "https://huggingface.co/join" }
    ],
    "steps": [
      { "stepNumber": 1, "title": "Set up your project" },
      { "stepNumber": 2, "title": "Get a free LLM API key" },
      { "stepNumber": 3, "title": "Build the chat interface" },
      { "stepNumber": 4, "title": "Connect to the LLM API" },
      { "stepNumber": 5, "title": "Deploy to Vercel" }
    ],
    "deliverables": ["Working chatbot deployed on Vercel", "GitHub repo with clean code", "README with setup instructions"],
    "tags": ["chatbot", "nextjs", "huggingface", "beginner"]
  },
  {
    "id": "project-ai-agent",
    "title": "Build a Multi-Tool AI Agent",
    "level": "intermediate",
    "estimatedHours": 12,
    "tags": ["agents", "langchain", "smolagents", "tools", "intermediate"]
  },
  {
    "id": "project-capstone-deploy",
    "title": "Capstone: Full-Stack AI Application",
    "level": "intermediate",
    "estimatedHours": 20,
    "tags": ["capstone", "full-stack", "deployment", "portfolio"]
  }
]
```

**Assertions:**
- Beginner profile gets `beginner` + `intermediate` level projects (not advanced)
- "Build a Multi-Tool AI Agent" matched because tags include "agents"
- "Capstone" always included (tags include "capstone")
- "Fine-tune a Language Model" excluded (level=advanced, beginner can't see it)
- Steps are ordered by `stepNumber` (1, 2, 3...)
- All tools have `signupUrl` (verifiable free-tier)

---

### Payload 13: evaluationEngine — createEvaluation()

**Function call:**
```typescript
evaluationEngine.createEvaluation("user-789", courseWithThreeModules)
```

**Expected output:**
```json
{
  "userId": "user-789",
  "courseId": "<course.id>",
  "moduleEvaluations": [
    { "moduleNumber": 1, "status": "not_started", "timeSpentMinutes": 0, "projectSubmitted": false, "selfRatedConfidence": 0, "engagementScore": 0 },
    { "moduleNumber": 2, "status": "not_started", "timeSpentMinutes": 0, "projectSubmitted": false, "selfRatedConfidence": 0, "engagementScore": 0 },
    { "moduleNumber": 3, "status": "not_started", "timeSpentMinutes": 0, "projectSubmitted": false, "selfRatedConfidence": 0, "engagementScore": 0 }
  ],
  "overallProgress": {
    "completedModules": 0,
    "totalModules": 3,
    "completionRate": 0,
    "averageQuizScore": 0,
    "averageConfidence": 0,
    "totalTimeSpentMinutes": 0,
    "currentStreak": 0,
    "longestStreak": 0,
    "lastActiveAt": "<iso-timestamp>",
    "paceStatus": "on_track"
  },
  "checkIns": [],
  "adaptationHistory": [],
  "lastEvaluatedAt": "<iso-timestamp>"
}
```

**Assertions:**
- One `moduleEvaluation` entry per module in the course
- All modules start as `"not_started"`
- All numeric fields start at 0
- `paceStatus` starts as `"on_track"`

---

## Steps

### Phase 1: Test Infrastructure

1. Set up Jest + ts-jest for the project — add `jest.config.ts`, `tsconfig.test.json`, and test scripts to `package.json`. Configure path aliases to match existing `tsconfig.json`.

2. Create test fixtures in `src/__tests__/fixtures/` — use the exact `InterviewProfile` payloads from this spec (Priya Sharma beginner, Rahul Verma advanced, zero-hours edge case, all-interests edge case). Create mock `CourseJSON` objects for snapshot comparison.

3. Create a shared mock module `src/__tests__/mocks/vertexDatastore.mock.ts` that stubs `searchCourseIndex` to return `[]` (forces webCrawler fallback) and `searchQuestions` to return `[]` (forces seed question fallback).

4. Create a shared mock module `src/__tests__/mocks/webCrawler.mock.ts` that stubs `searchKnownCourses`, `getKnownCourses`, and `getSeedQuestions` with the real data from `KNOWN_FREE_COURSES` and `SEED_QUESTIONS` (not custom fixtures — use the actual seed data so tests catch regressions if seed data changes).

### Phase 2: Unit Tests — Services

5. Create `src/__tests__/services/curatorService.test.ts` — test `curateCourse()` using the beginner (Payload 1) and advanced (Payload 2) profiles. Assert exact module counts, titles, tip content, and learner profile mapping as specified in the assertion blocks above.

6. Create `src/__tests__/services/handsOnPlanner.test.ts` — test `generateHandsOnPlan()` with the exact calls from Payload 12. Assert returned project IDs, levels, tool names, step ordering, and that advanced projects are excluded for beginners.

7. Create `src/__tests__/services/webCrawler.test.ts` — test `searchKnownCourses()` with the exact call from Payload 11. Assert the 3 returned courses match by title. Test `getSeedQuestions()` returns 6 questions with all required fields.

8. Create `src/__tests__/services/evaluationEngine.test.ts` — test `createEvaluation()` (Payload 13), `updateModuleProgress()` (Payload 4 data), and `recordCheckIn()` (Payload 5 data). Assert the exact response shapes and recalculated progress metrics.

9. Create `src/__tests__/services/adaptiveLearning.test.ts` — test `adaptCourse()` with Payload 6 data (struggling user, avgScore < 50). Assert adaptation triggers, module modifications, and `getNextRecommendation()` with Payload 7 data.

### Phase 3: API Route Tests

10. Create `src/__tests__/api/curate.test.ts` — test POST `/api/curate` with Payload 1 (beginner, 200), Payload 2 (advanced, 200), and Payload 3 (validation errors, 400). Assert HTTP status codes and response bodies match spec.

11. Create `src/__tests__/api/evaluate.test.ts` — test POST `/api/evaluate` with Payload 4 (update_progress), Payload 5 (check_in), Payload 6 (adapt), and Payload 7 (recommend). Also test missing evaluation → 400 and unknown action → 400.

12. Create `src/__tests__/api/questions.test.ts` — test GET `/api/questions` with Payload 8 (category filter), Payload 9 (adaptive context), and POST with Payload 10 (feedback). Assert question count, filtering, and seed fallback.

### Phase 4: E2E Integration Tests

13. Create `src/__tests__/e2e/curation-flow.test.ts` — full pipeline: send Payload 1 → validate response matches Payload 1 assertions → use returned `CourseJSON` to create evaluation (Payload 13) → send progress update (Payload 4) → send check-in (Payload 5) → adapt (Payload 6) → get recommendation (Payload 7). Assert data integrity at each stage.

14. Create `src/__tests__/e2e/multilingual.test.ts` — test curation with `language: "hi"`, `"ta"`, `"te"`. Assert `course.learner.preferred_language` matches, `adaptive_notes` is generated, questions fallback works for non-English languages.

15. Create `src/__tests__/e2e/edge-cases.test.ts` — test with:
    - `availableHoursPerWeek: 0` — should still produce a valid course
    - `specificInterests: ["llm", "agents", "rag", "fine_tuning", "mlops", "multimodal", "voice", "full_stack_ai"]` — all interests, verify maxModules cap
    - `experienceLevel: "none"` — verify `weak_areas` includes `["programming basics", "math fundamentals"]`
    - `experienceLevel: "advanced"` with `programmingLanguages: []` — no foundation modules added

### Phase 5: CI Integration

16. Add `test` and `test:ci` scripts to `package.json`. The CI script should run with `--coverage --forceExit`. Add a GitHub Actions workflow `.github/workflows/test.yml` that runs tests on push/PR.

17. Add coverage thresholds in `jest.config.ts` — minimum 80% for services, 70% for API routes. Generate HTML + lcov reports to `coverage/`.

## Files to create
- `jest.config.ts`
- `tsconfig.test.json`
- `src/__tests__/fixtures/profiles.ts`
- `src/__tests__/fixtures/courses.ts`
- `src/__tests__/mocks/vertexDatastore.mock.ts`
- `src/__tests__/mocks/webCrawler.mock.ts`
- `src/__tests__/services/curatorService.test.ts`
- `src/__tests__/services/handsOnPlanner.test.ts`
- `src/__tests__/services/webCrawler.test.ts`
- `src/__tests__/services/evaluationEngine.test.ts`
- `src/__tests__/services/adaptiveLearning.test.ts`
- `src/__tests__/api/curate.test.ts`
- `src/__tests__/api/evaluate.test.ts`
- `src/__tests__/api/questions.test.ts`
- `src/__tests__/e2e/curation-flow.test.ts`
- `src/__tests__/e2e/multilingual.test.ts`
- `src/__tests__/e2e/edge-cases.test.ts`
- `.github/workflows/test.yml`

## Files to modify
- `package.json` — add jest, ts-jest, @types/jest, test scripts

## Notes
- All tests must run without GCP credentials — mock Vertex AI and external APIs
- Use deterministic fixtures so tests are reproducible (no random data)
- UUIDs and timestamps should be asserted with `expect.any(String)` or regex matchers, not exact values
- E2E tests mock at the service boundary (vertexDatastore), not at the HTTP level
- Keep test files co-located under `src/__tests__/` for clear separation from source
- The real payloads in this spec serve as the source of truth — tests should copy them verbatim
