"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.fontless.min.css";

/* ── Survey JSON definition ── */

const surveyJson = {
  showProgressBar: "top",
  progressBarType: "questions",
  questionsOnPageMode: "inputPerPage",
  autoAdvanceEnabled: true,
  autoAdvanceAllowComplete: false,
  showQuestionNumbers: false,
  fitToContainer: true,
  completeText: "Start Learning →",
  pageNextText: "OK ↵",
  pagePrevText: "← Back",
  showPrevButton: true,
  showCompletedPage: false,
  pages: [
    {
      elements: [
        {
          type: "radiogroup",
          name: "language",
          title: "What language do you prefer?",
          description: "We'll serve content and voice in this language.",
          isRequired: true,
          colCount: 2,
          choices: [
            { value: "en", text: "English" },
            { value: "hi", text: "हिन्दी" },
            { value: "ta", text: "தமிழ்" },
            { value: "te", text: "తెలుగు" },
            { value: "mr", text: "मराठी" },
            { value: "kn", text: "ಕನ್ನಡ" },
            { value: "gu", text: "ગુજરાતી" },
            { value: "bn", text: "বাংলা" },
          ],
          defaultValue: "en",
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "experienceLevel",
          title: "How much experience do you have?",
          description: "In programming or tech in general.",
          isRequired: true,
          choices: [
            { value: "none", text: "None — starting from zero" },
            { value: "beginner", text: "Beginner — learning the basics" },
            { value: "intermediate", text: "Intermediate — comfortable coding" },
            { value: "advanced", text: "Advanced — production-level work" },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "comment",
          name: "goals",
          title: "What do you want to achieve?",
          description: "Write freely — be as specific as you like.",
          placeholder: "e.g. Build AI agents, prepare for GATE, get a job in ML...",
          isRequired: true,
          rows: 3,
        },
      ],
    },
    {
      elements: [
        {
          type: "checkbox",
          name: "specificInterests",
          title: "What topics excite you?",
          description: "Pick as many as you like.",
          isRequired: true,
          colCount: 3,
          choices: [
            { value: "ml", text: "Machine Learning" },
            { value: "dl", text: "Deep Learning" },
            { value: "nlp", text: "NLP & LLMs" },
            { value: "cv", text: "Computer Vision" },
            { value: "genai", text: "Generative AI" },
            { value: "python", text: "Python for AI" },
            { value: "ds", text: "Data Science" },
            { value: "mlops", text: "MLOps" },
            { value: "math", text: "Math for ML" },
            { value: "webdev", text: "Web Development" },
            { value: "mobile", text: "Mobile Dev" },
            { value: "cloud", text: "Cloud & DevOps" },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "checkbox",
          name: "programmingLanguages",
          title: "Which programming languages do you know?",
          description: "Select all that apply.",
          colCount: 4,
          choices: [
            { value: "python", text: "Python" },
            { value: "javascript", text: "JavaScript" },
            { value: "java", text: "Java" },
            { value: "cpp", text: "C/C++" },
            { value: "r", text: "R" },
            { value: "go", text: "Go" },
            { value: "rust", text: "Rust" },
            { value: "none", text: "None yet" },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "learningStyle",
          title: "How do you learn best?",
          isRequired: true,
          choices: [
            { value: "visual", text: "Video lectures — watch and follow along" },
            { value: "hands_on", text: "Hands-on projects — learn by building" },
            { value: "reading", text: "Reading & docs — articles and documentation" },
            { value: "mixed", text: "Mixed approach — a bit of everything" },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "rating",
          name: "availableHoursPerWeek",
          title: "How many hours per week can you study?",
          description: "Be realistic — consistency beats intensity.",
          rateType: "labels",
          rateValues: [
            { value: 3, text: "~3h" },
            { value: 5, text: "~5h" },
            { value: 10, text: "~10h" },
            { value: 15, text: "~15h" },
            { value: 20, text: "~20h" },
            { value: 30, text: "30h+" },
          ],
          defaultValue: 10,
        },
      ],
    },
    {
      elements: [
        {
          type: "text",
          name: "education",
          title: "What's your education background?",
          description: "Optional — helps us calibrate content difficulty.",
          placeholder: "e.g. B.Tech CS 2nd year, Self-taught, MBA...",
        },
      ],
    },
  ],
};

/* ── Custom theme (minimal, orange accent) ── */

const customTheme = {
  cssVariables: {
    "--sjs-primary-backcolor": "#f97316",
    "--sjs-primary-backcolor-light": "rgba(249,115,22,0.1)",
    "--sjs-primary-backcolor-dark": "#ea580c",
    "--sjs-primary-forecolor": "#ffffff",
    "--sjs-primary-forecolor-light": "rgba(255,255,255,0.25)",
    "--sjs-general-backcolor": "#ffffff",
    "--sjs-general-backcolor-dim": "#fafafa",
    "--sjs-general-backcolor-dim-light": "#f5f5f5",
    "--sjs-general-forecolor": "#18181b",
    "--sjs-general-forecolor-light": "#71717a",
    "--sjs-base-unit": "8px",
    "--sjs-corner-radius": "8px",
    "--sjs-font-family": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "--sjs-font-size": "16px",
    "--sjs-shadow-small": "none",
    "--sjs-shadow-inner": "none",
    "--sjs-border-default": "#e4e4e7",
    "--sjs-border-light": "#f4f4f5",
  },
  isPanelless: true,
};

/* ── Component ── */

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = useCallback(
    async (sender: Model) => {
      const data = sender.data;

      const profile = {
        name: "",
        language: data.language || "en",
        currentRole: "",
        experienceLevel: data.experienceLevel || "beginner",
        goals: [data.goals || ""],
        specificInterests: data.specificInterests || [],
        programmingLanguages: data.programmingLanguages || [],
        availableHoursPerWeek: data.availableHoursPerWeek || 10,
        learningStyle: data.learningStyle || "mixed",
        education: data.education || "",
        aiExperience: [],
        deadline: "",
        preferredProjectTypes: [],
      };

      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile }),
        });
      } catch {
        // navigate regardless
      }

      router.push("/");
    },
    [router]
  );

  const survey = new Model(surveyJson);
  survey.applyTheme(customTheme as Parameters<typeof survey.applyTheme>[0]);
  survey.onComplete.add(handleComplete);

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center gap-2.5 px-6 py-4 lg:px-10">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a237e] to-[#3949ab]">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            Adiyogi AI
          </span>
        </a>
      </header>

      {/* Survey */}
      <div className="flex-1 overflow-hidden">
        <Survey model={survey} />
      </div>
    </div>
  );
}
