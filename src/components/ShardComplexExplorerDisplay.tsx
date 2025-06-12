
// File: src/components/ShardComplexExplorerDisplay.tsx
import React from 'react';
import type { RootShardComplex, Shard } from '../types';
import clsx from 'clsx';
import { format } from 'date-fns'; // For potential future use if displaying dates here

interface ShardComplexExplorerDisplayProps {
  rootShards: RootShardComplex[];
  onSelectShard: (shardId: string, path: string) => void;
  onCreateRootShardRequest: () => void;
  onDeleteShard: (shardId: string, path: string) => void;
  activeShardPath?: string;
}

export const ShardComplexExplorerDisplay: React.FC<ShardComplexExplorerDisplayProps> = ({
  rootShards,
  onSelectShard,
  onCreateRootShardRequest,
  onDeleteShard,
  activeShardPath,
}) => {
  const handleNodeClick = (e: React.MouseEvent | React.KeyboardEvent, shardId: string, path: string) => {
    e.stopPropagation();
    onSelectShard(shardId, path);
  };

  const handleDeleteClick = (e: React.MouseEvent, shardId: string, path: string, shardName: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete shard "${shardName}" (ID: ${shardId}) and all its nested shards? This action cannot be undone.`)) {
      onDeleteShard(shardId, path);
    }
  };

  const renderShardNode = (shard: Shard, currentPath: string, depth: number = 0) => {
    const verificationClass = `verification-status-${shard.metadata.currentVerification.status.replace(/_/g, '-')}`;
    const versionEntry = shard.metadata.versionHistory[shard.metadata.versionHistory.length - 1];
    const versionDisplay = versionEntry?.versionId || 'N/A';
    
    const nodeClasses = clsx({
      'active-shard-node': currentPath === activeShardPath,
    });

    return (
      <li key={shard.shardId} className={nodeClasses} style={{ marginLeft: `${depth * 15}px` /* Indentation */ }}>
        <div> {/* Flex container for name and delete button */}
          <span
            onClick={(e) => handleNodeClick(e, shard.shardId, currentPath)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNodeClick(e, shard.shardId, currentPath);}}
            tabIndex={0}
            role="button"
            aria-pressed={currentPath === activeShardPath}
            title={`${shard.shardName} (${shard.shardType}) - v${versionDisplay} [${shard.metadata.currentVerification.status.toUpperCase()}]\nCreated: ${format(new Date(shard.createdAt), 'Pp')}\nUpdated: ${format(new Date(shard.updatedAt), 'Pp')}`}
          >
            {`${depth > 0 ? '↳ ' : ''}${shard.shardName} `}
            <span style={{ fontSize: '0.8em', color: 'var(--ql-text-secondary)' }}>({shard.shardType})</span>
            <span style={{ fontSize: '0.75em', marginLeft: '4px' }} className={verificationClass}> [{shard.metadata.currentVerification.status.toUpperCase()}]</span>
          </span>
          <button
            onClick={(e) => handleDeleteClick(e, shard.shardId, currentPath, shard.shardName)}
            className="danger-action delete-shard-btn"
            title={`Delete shard ${shard.shardName}`}
            aria-label={`Delete shard ${shard.shardName}`}
          >
            X
          </button>
        </div>
        {shard.nestedShards && shard.nestedShards.length > 0 && (
          <ul>
            {shard.nestedShards.map(child => renderShardNode(child, `${currentPath}/${child.shardId}`, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className="ql-shard-explorer" aria-labelledby="shard-explorer-title">
      <h3 id="shard-explorer-title">Shard Complexes</h3>
      <button onClick={onCreateRootShardRequest} className="new-shard-btn">
        + New Root Shard
      </button>
      {rootShards.length === 0 ? (
        <p className="empty-message">No Shard Complexes. Create one to begin.</p>
      ) : (
        <ul>
          {rootShards.map(rootShard => renderShardNode(rootShard, rootShard.shardId, 0))}
        </ul>
      )}
    </aside>
  );
};
