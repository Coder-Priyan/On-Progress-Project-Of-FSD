// features/workspace/components/FileExplorer/FileContextMenu.jsx
// Stage 6 — real create / rename / delete actions.
// Alerts are gone. Actions call handler functions from useFileTree.

import { useEffect, useRef, useState } from 'react'

export function FileContextMenu({ contextMenu, onClose, onCreateFile, onCreateFolder, onRename, onDelete }) {
  if (!contextMenu) return null

  const { x, y, node } = contextMenu
  const isFolder = node.type === 'folder'

  // Close on outside click or Escape
  useEffect(() => {
    const handle = (e) => {
      if (e.type === 'keydown' && e.key !== 'Escape') return
      onClose()
    }
    window.addEventListener('mousedown', handle)
    window.addEventListener('keydown', handle)
    return () => {
      window.removeEventListener('mousedown', handle)
      window.removeEventListener('keydown', handle)
    }
  }, [onClose])

  const items = isFolder
    ? [
        { label: 'New File',   action: () => { onCreateFile(node._id);   onClose() } },
        { label: 'New Folder', action: () => { onCreateFolder(node._id); onClose() } },
        { label: 'Rename',     action: () => { onRename(node);           onClose() } },
        { label: 'Delete',     action: () => { onDelete(node);           onClose() }, danger: true },
      ]
    : [
        { label: 'Rename',     action: () => { onRename(node);           onClose() } },
        { label: 'Delete',     action: () => { onDelete(node);           onClose() }, danger: true },
      ]

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed', zIndex: 100,
        left: x, top: y,
        backgroundColor: '#21262D',
        border: '1px solid #30363D',
        borderRadius: '6px',
        padding: '4px',
        minWidth: '160px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '7px 12px', borderRadius: '4px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontFamily: 'inherit',
            color: item.danger ? '#F85149' : '#C9D1D9',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#30363D'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
