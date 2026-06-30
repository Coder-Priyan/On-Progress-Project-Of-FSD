// services/file.service.js
// Patched URLs to match actual backend routes:
//   GET    /api/files/:repositoryId
//   GET    /api/files/single/:fileId
//   POST   /api/files/:repositoryId
//   PUT    /api/files/:fileId        (content update)
//   PUT    /api/files/:fileId        (rename — same endpoint, different body)
//   DELETE /api/files/:fileId

import apiClient from '@/lib/axios'

/** Get all files for a repository */
export const getFiles = async (repoId) => {
  const response = await apiClient.get(`/files/${repoId}`)
  return response.data
}

/** Get a single file with its content */
export const getFileById = async (repoId, fileId) => {
  // repoId not needed by this route but kept in signature
  // so useEditor.js doesn't need to change
  const response = await apiClient.get(`/files/single/${fileId}`)
  return response.data
}

/** Create a new file */
export const createFile = async (repoId, { name, folderId, content = '' }) => {
  const response = await apiClient.post(`/files/${repoId}`, {
    name,
    folderId,
    content,
  })
  return response.data
}

/** Update file content — called by debounced auto-save in useEditor */
export const updateFileContent = async (repoId, fileId, content) => {
  // repoId not needed by this route but kept in signature
  // so useEditor.js doesn't need to change
  const response = await apiClient.put(`/files/${fileId}`, { content })
  return response.data
}

/** Rename a file */
export const renameFile = async (repoId, fileId, name) => {
  // repoId not needed by this route but kept in signature
  // so useFileTree.js doesn't need to change
  const response = await apiClient.put(`/files/${fileId}`, { name })
  return response.data
}

/** Delete a file */
export const deleteFile = async (repoId, fileId) => {
  // repoId not needed by this route but kept in signature
  // so useFileTree.js doesn't need to change
  const response = await apiClient.delete(`/files/${fileId}`)
  return response.data
}