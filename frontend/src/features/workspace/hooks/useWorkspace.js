// features/workspace/hooks/useWorkspace.js
// Fetches repository metadata (name, owner, collaborators) from the real API.
// Used by WorkspacePage to get the repo name for the navbar and breadcrumb.

import { useState, useEffect } from 'react'
import { getRepositoryById } from '@/services/repository.service'

export function useWorkspace(repoId) {
  const [repo,      setRepo]      = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState('')

  useEffect(() => {
    if (!repoId) return

    let cancelled = false

    const fetch = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getRepositoryById(repoId)
        if (!cancelled) setRepo(data.repository ?? data)
      } catch (err) {
        if (!cancelled) setError('Failed to load repository.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [repoId])

  return { repo, isLoading, error }
}