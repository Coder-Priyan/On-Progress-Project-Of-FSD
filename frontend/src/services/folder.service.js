// services/folder.service.js
// Patched URLs to match actual backend routes:
//   GET    /api/folders/:repositoryId
//   POST   /api/folders/:repositoryId
//   PUT    /api/folders/:folderId
//   DELETE /api/folders/:folderId

import apiClient from '@/lib/axios'

/** Get all folders for a repository */
export const getFolders = async (repoId) => {
  const response = await apiClient.get(`/folders/${repoId}`)
  return response.data
}

/** Create a new folder */
export const createFolder = async (repoId, { name, parentFolderId }) => {
  const response = await apiClient.post(`/folders/${repoId}`, {
    name,
    parentFolderId,
  })
  return response.data
}

/** Rename a folder */
export const renameFolder = async (repoId, folderId, name) => {
  // repoId not needed by this route but kept in signature
  // so useFileTree.js doesn't need to change
  const response = await apiClient.put(`/folders/${folderId}`, { name })
  return response.data
}

/** Delete a folder */
export const deleteFolder = async (repoId, folderId) => {
  // repoId not needed by this route but kept in signature
  // so useFileTree.js doesn't need to change
  const response = await apiClient.delete(`/folders/${folderId}`)
  return response.data
}