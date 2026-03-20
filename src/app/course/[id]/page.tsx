"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { CourseOutline } from "@/components/course/CourseOutline";
import { useCourseStore } from "@/lib/store/course-store";

export default function CoursePage() {
  const router = useRouter();
  const { currentCourse } = useCourseStore();

  useEffect(() => {
    if (!currentCourse) {
      router.push("/");
    }
  }, [currentCourse, router]);

  if (!currentCourse) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      <CourseOutline course={currentCourse} />
    </div>
  );
}
