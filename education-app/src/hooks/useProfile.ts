import { useState, useCallback, useEffect } from 'react'
import type { UserProfile } from '../types'
import * as api from '../services/educationApi'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load profile from Cosmos DB on mount
  useEffect(() => {
    api.getProfile()
      .then(p => setProfile(p))
      .finally(() => setIsLoading(false))
  }, [])

  const saveProfile = useCallback(async (p: UserProfile) => {
    setProfile(p)
    try {
      await api.saveProfile(p)
    } catch (err) {
      console.error('[useProfile] Failed to save profile:', err)
    }
  }, [])

  const clearProfile = useCallback(() => {
    setProfile(null)
  }, [])

  return { profile, isLoading: isLoading, saveProfile, clearProfile }
}
