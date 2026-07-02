// frontend/src/features/workspace/hooks/useSocket.js
// Milestone 3 change: listens for PRESENCE_UPDATE, returns onlineUsers.

import { useEffect, useState } from 'react'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { EVENTS } from '@/constants/events'

export function useSocket(repoId, reloadTree) {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [joinError,   setJoinError]   = useState(null)

  useEffect(() => {
    if (!repoId) return

    const socket = connectSocket()

    // ── Connection state ────────────────────────────────────────────────────
    const onConnect = () => {
      setIsConnected(true)
      socket.emit(EVENTS.WORKSPACE_JOIN, { repositoryId: repoId })
    }

    const onDisconnect = () => {
      setIsConnected(false)
      // Clear presence on disconnect — stale list is worse than empty list
      setOnlineUsers([])
    }

    // ── Workspace joined ack — server sends initial presence list ───────────
    const onWorkspaceJoined = ({ repositoryId, users }) => {
      console.log("🔥 JOINED:", users)
      console.log(`[Socket] Workspace joined | repoId: ${repositoryId}`)
      if (Array.isArray(users)) {
        setOnlineUsers(users)
      }
    }

    // ── Live presence updates ───────────────────────────────────────────────
    // Fires every time someone joins or leaves this repository room.
    // Replace the entire list — don't try to patch it incrementally.
    const onPresenceUpdate = ({ users }) => {
      console.log("🔥 PRESENCE UPDATE:", users)
      
      if (Array.isArray(users)) {
        setOnlineUsers(users)
      }
    }

    // ── Realtime File System ──────────────────────────────────────────────

    const onFileCreated = (data) => {
      console.log("🟢 FILE_CREATED EVENT RECEIVED", data)
      reloadTree?.()
    }
    
    const onFileRenamed = (data) => {
      console.log("🟢 FILE_RENAMED EVENT RECEIVED", data)
      reloadTree?.()
    }

    const onFileDeleted = (data) => {
      console.log("🟢 FILE_DELETED EVENT RECEIVED", data)
      reloadTree?.()
    }

    const onFolderCreated = (data) => {
      console.log("🟢 FOLDER_CREATED EVENT RECEIVED", data)
      reloadTree?.()
    }

    const onFolderRenamed = (data) => {
      console.log("🟢 FOLDER_RENAMED EVENT RECEIVED", data)
      reloadTree?.()
    }

    const onFolderDeleted = (data) => {
      console.log("🟢 FOLDER_DELETED EVENT RECEIVED", data)
      reloadTree?.()
    }

    // ── Error ───────────────────────────────────────────────────────────────
    const onError = ({ message }) => {
      console.error('[Socket] Server error:', message)
      setJoinError(message)
    }

    // Register listeners
    socket.on(EVENTS.CONNECT,          onConnect)
    socket.on(EVENTS.DISCONNECT,       onDisconnect)
    socket.on(EVENTS.WORKSPACE_JOINED, onWorkspaceJoined)
    socket.on(EVENTS.PRESENCE_UPDATE,  onPresenceUpdate)
    socket.on(EVENTS.ERROR,            onError)

    socket.on(EVENTS.FILE_CREATED, onFileCreated)
    socket.on(EVENTS.FILE_RENAMED, onFileRenamed)
    socket.on(EVENTS.FILE_DELETED, onFileDeleted)

    socket.on(EVENTS.FOLDER_CREATED, onFolderCreated)
    socket.on(EVENTS.FOLDER_RENAMED, onFolderRenamed)
    socket.on(EVENTS.FOLDER_DELETED, onFolderDeleted)

    // Already connected (e.g. hot reload) — emit join immediately
    if (socket.connected) {
      setIsConnected(true)
      socket.emit(EVENTS.WORKSPACE_JOIN, { repositoryId: repoId })
    }

    // Cleanup
    return () => {
      socket.off(EVENTS.CONNECT,          onConnect)
      socket.off(EVENTS.DISCONNECT,       onDisconnect)
      socket.off(EVENTS.WORKSPACE_JOINED, onWorkspaceJoined)
      socket.off(EVENTS.PRESENCE_UPDATE,  onPresenceUpdate)
      socket.off(EVENTS.ERROR,            onError)

      socket.off(EVENTS.FILE_CREATED, onFileCreated)
      socket.off(EVENTS.FILE_RENAMED, onFileRenamed)
      socket.off(EVENTS.FILE_DELETED, onFileDeleted)

      socket.off(EVENTS.FOLDER_CREATED, onFolderCreated)
      socket.off(EVENTS.FOLDER_RENAMED, onFolderRenamed)
      socket.off(EVENTS.FOLDER_DELETED, onFolderDeleted)

      if (socket.connected) {
        socket.emit(EVENTS.WORKSPACE_LEAVE, { repositoryId: repoId })
      }

      disconnectSocket()
    }
  }, [repoId])

  return {
    isConnected,
    onlineUsers,  // replaces the mock MOCK_PRESENCE array
    joinError,
  }
}