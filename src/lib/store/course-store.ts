import { create } from "zustand";
import type { CoursePlan } from "@/types";

interface CourseStore {
  currentCourse: CoursePlan | null;
  setCurrentCourse: (course: CoursePlan | null) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  currentCourse: null,
  setCurrentCourse: (course) => set({ currentCourse: course }),
}));
