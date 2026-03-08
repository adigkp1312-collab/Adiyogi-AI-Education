import { useState, useCallback, useEffect } from 'react'
import type { CourseJSON } from '../types'
import * as api from '../services/educationApi'

export function useCourses() {
  const [courses, setCourses] = useState<CourseJSON[]>([])

  // Load courses from Cosmos DB on mount
  useEffect(() => {
    api.listCourses()
      .then(c => setCourses(c))
      .catch(err => console.error('[useCourses] Failed to load:', err))
  }, [])

  const addCourse = useCallback((course: CourseJSON) => {
    setCourses(prev => {
      const exists = prev.some(c => c.id === course.id)
      return exists
        ? prev.map(c => c.id === course.id ? course : c)
        : [course, ...prev]
    })
  }, [])

  const updateCourse = useCallback((updated: CourseJSON) => {
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c))
  }, [])

  const removeCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id))
  }, [])

  return { courses, addCourse, updateCourse, removeCourse }
}
