// features/workspace/hooks/useEditor.js
// Stage 6 — real API. Fetches file content on open, auto-saves on change.
//
// Auto-save flow:
//   User types → setContent() → debounce 800ms → updateFileContent() API call
//   syncStatus: 'saved' → 'saving' → 'saved' | 'error'

import { useState, useCallback, useRef } from 'react'
import { getFileById, updateFileContent } from '@/services/file.service'

const DEBOUNCE_MS = 800

export function useEditor(repoId) {
  // contentMap: fileId → string (in-memory content for each open file)
  const [contentMap, setContentMap] = useState({})

  // loadingFiles: Set of fileIds currently being fetched
  const [loadingFiles, setLoadingFiles] = useState(new Set())

  // syncStatus shown in navbar and status bar
  const [syncStatus, setSyncStatus] = useState('saved')

  // Debounce timers: fileId → timer ref
  const timers = useRef({})

  // ── Load file content from API when a file is first opened ────────────────
  const loadFile = useCallback(async (file) => {
    // Already loaded — don't refetch
    if (contentMap[file._id] !== undefined) return

    setLoadingFiles((prev) => new Set(prev).add(file._id))
    try {
      const data = await getFileById(repoId, file._id)
      const content = data.file?.content ?? data.content ?? ''
      setContentMap((prev) => ({ ...prev, [file._id]: content }))
    } catch (err) {
      console.error('[DevSync] loadFile failed:', err)
      setContentMap((prev) => ({ ...prev, [file._id]: '' }))
    } finally {
      setLoadingFiles((prev) => {
        const next = new Set(prev)
        next.delete(file._id)
        return next
      })
    }
  }, [repoId, contentMap])

  // ── Get content for a file ────────────────────────────────────────────────
  const getContent = useCallback((fileId) => {
    return contentMap[fileId] ?? ''
  }, [contentMap])

  const isFileLoading = useCallback((fileId) => {
    return loadingFiles.has(fileId)
  }, [loadingFiles])

  // ── Set content + trigger debounced save ──────────────────────────────────
  const setContent = useCallback((fileId, value) => {
    // Update in-memory immediately so editor feels instant
    setContentMap((prev) => ({ ...prev, [fileId]: value }))
    setSyncStatus('saving')

    // Clear previous debounce timer for this file
    if (timers.current[fileId]) clearTimeout(timers.current[fileId])

    // Start new debounce timer
    timers.current[fileId] = setTimeout(async () => {
      try {
        await updateFileContent(repoId, fileId, value)
        setSyncStatus('saved')
        // Stage 7: emit CODE_CHANGE socket event here
      } catch (err) {
        console.error('[DevSync] auto-save failed:', err)
        setSyncStatus('error')
      }
    }, DEBOUNCE_MS)
  }, [repoId])

  return {
    getContent,
    setContent,
    loadFile,
    isFileLoading,
    syncStatus,
  }
}