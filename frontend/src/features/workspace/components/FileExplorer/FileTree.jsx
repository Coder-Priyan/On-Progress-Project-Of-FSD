// features/workspace/components/FileExplorer/FileTree.jsx

import { TreeNode } from './TreeNode'

export function FileTree({
  tree,
  selectedFileId,
  renamingNode,
  isFolderOpen,
  onFileClick,
  onToggleFolder,
  onContextMenu,
  onRenameConfirm,
  onRenameCancel,
  RenameInput,
}) {
  if (!tree || tree.length === 0) {
    return (
      <div style={{
        padding: '16px 12px',
        fontSize: '11px',
        color: '#484F58',
        textAlign: 'center',
      }}>
        No files yet. Create one above.
      </div>
    )
  }

  return (
    <div style={{ padding: '4px 0' }}>
      {tree.map((node) => (
        <TreeNode
          key={node._id}
          node={node}
          depth={0}
          selectedFileId={selectedFileId}
          renamingNode={renamingNode}
          isFolderOpen={isFolderOpen}
          onFileClick={onFileClick}
          onToggleFolder={onToggleFolder}
          onContextMenu={onContextMenu}
          onRenameConfirm={onRenameConfirm}
          onRenameCancel={onRenameCancel}
          RenameInput={RenameInput}
        />
      ))}
    </div>
  )
}
