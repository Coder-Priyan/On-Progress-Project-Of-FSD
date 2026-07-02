// features/workspace/hooks/useFileTree.js
// Stage 6 — real API. Replaces the mock data version entirely.
//
// Responsibilities:
//   - Fetch files + folders from backend on mount
//   - Build nested tree from flat API response
//   - Create / rename / delete files and folders
//   - Emit socket events AFTER successful API call (Stage 7 adds this)

import { useState, useEffect, useCallback } from 'react'
import { getFiles, createFile, updateFileContent, renameFile, deleteFile } from '@/services/file.service'
import { getFolders, createFolder, renameFolder, deleteFolder } from '@/services/folder.service'
import { buildFileTree } from '@/utils/fileHelpers'

export function useFileTree(repoId) {
  const [tree,           setTree]           = useState([])
  const [isLoading,      setIsLoading]      = useState(true)
  const [error,          setError]          = useState('')
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [contextMenu,    setContextMenu]    = useState(null)

  // ── Inline rename state ────────────────────────────────────────────────────
  // When user triggers rename, we store the node being renamed here.
  // FileContextMenu sets this, TreeNode renders the input.
  const [renamingNode, setRenamingNode] = useState(null)

  // ── Folder open/close state ────────────────────────────────────────────────
  const [openFolders, setOpenFolders] = useState({})

  // ── Fetch files and folders ────────────────────────────────────────────────
  const loadTree = useCallback(async () => {

    console.log("🔄 loadTree called")
    if (!repoId) return
    setIsLoading(true)
    setError('')
    try {
      const [foldersData, filesData] = await Promise.all([
        getFolders(repoId),
        getFiles(repoId),
      ])

      console.log("📁 foldersData:", foldersData)
      console.log("📄 filesData:", filesData)

      const folders = Array.isArray(foldersData) ? foldersData : (foldersData.folders ?? [])
      const files   = Array.isArray(filesData)   ? filesData   : (filesData.files   ?? [])

      const built = buildFileTree(folders, files)
      console.log("🌳 BUILT TREE:", built)
      setTree(built)

      // Auto-open root-level folders
      const rootFolderIds = {}
      folders
        .filter((f) => !f.parentFolderId)
        .forEach((f) => { rootFolderIds[f._id] = true })
      setOpenFolders(rootFolderIds)

    } catch (err) {
      setError('Failed to load files.')
    } finally {
      setIsLoading(false)
    }
  }, [repoId])

  useEffect(() => { loadTree() }, [loadTree])

  // ── Toggle folder open/close ───────────────────────────────────────────────
  const toggleFolder = useCallback((folderId) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }))
  }, [])

  const isFolderOpen = useCallback((folderId) => {
    return !!openFolders[folderId]
  }, [openFolders])

  // ── Select file ───────────────────────────────────────────────────────────
  const selectFile = useCallback((fileId) => {
    setSelectedFileId(fileId)
  }, [])

  // ── Context menu ──────────────────────────────────────────────────────────
  const openContextMenu = useCallback((e, node) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, node })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  // ── Create file ───────────────────────────────────────────────────────────
  const handleCreateFile = useCallback(async (name, folderId = null) => {
    if (!name?.trim()) return
    try {
      await createFile(repoId, { name: name.trim(), folderId, content: '' })
      await loadTree()
    } catch (err) {
      console.error('[DevSync] createFile failed:', err)
    }
  }, [repoId, loadTree])

  // ── Create folder ─────────────────────────────────────────────────────────
  const handleCreateFolder = useCallback(async (name, parentFolderId = null) => {
    if (!name?.trim()) return
    try {
      await createFolder(repoId, { name: name.trim(), parentFolderId })
      await loadTree()
    } catch (err) {
      console.error('[DevSync] createFolder failed:', err)
    }
  }, [repoId, loadTree])

  // ── Rename file ───────────────────────────────────────────────────────────
  const handleRenameFile = useCallback(async (fileId, newName) => {
    if (!newName?.trim()) return
    try {
      await renameFile(repoId, fileId, newName.trim())
      await loadTree()
    } catch (err) {
      console.error('[DevSync] renameFile failed:', err)
    } finally {
      setRenamingNode(null)
    }
  }, [repoId, loadTree])

  // ── Rename folder ─────────────────────────────────────────────────────────
  const handleRenameFolder = useCallback(async (folderId, newName) => {
    if (!newName?.trim()) return
    try {
      await renameFolder(repoId, folderId, newName.trim())
      await loadTree()
    } catch (err) {
      console.error('[DevSync] renameFolder failed:', err)
    } finally {
      setRenamingNode(null)
    }
  }, [repoId, loadTree])

  // ── Delete file ───────────────────────────────────────────────────────────
  const handleDeleteFile = useCallback(async (fileId) => {
    try {
      await deleteFile(repoId, fileId)
      if (selectedFileId === fileId) setSelectedFileId(null)
      await loadTree()
    } catch (err) {
      console.error('[DevSync] deleteFile failed:', err)
    }
  }, [repoId, loadTree, selectedFileId])

  // ── Delete folder ─────────────────────────────────────────────────────────
  const handleDeleteFolder = useCallback(async (folderId) => {
    try {
      await deleteFolder(repoId, folderId)
      await loadTree()
    } catch (err) {
      console.error('[DevSync] deleteFolder failed:', err)
    }
  }, [repoId, loadTree])

  return {
    tree,
    isLoading,
    error,
    selectedFileId,
    contextMenu,
    renamingNode,
    isFolderOpen,
    selectFile,
    toggleFolder,
    openContextMenu,
    closeContextMenu,
    setRenamingNode,
    handleCreateFile,
    handleCreateFolder,
    handleRenameFile,
    handleRenameFolder,
    handleDeleteFile,
    handleDeleteFolder,
    reloadTree: loadTree,
  }
}