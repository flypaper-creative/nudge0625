
import React from 'react';
import type { NudgePathwayRecord } from '../types';

interface NudgePathwayLinkProps {
  pathway: NudgePathwayRecord;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onFork: () => void;
}

export const NudgePathwayLink: React.FC<NudgePathwayLinkProps> = ({ pathway, isActive, onSelect, onDelete, onFork }) => {
  const shiftCountForDisplay = pathway.currentDeltaShiftState.isShiftActive
    ? pathway.currentDeltaShiftState.shiftCount + 1
    : pathway.currentDeltaShiftState.shiftCount; // Show current count if not active yet

  const handleDeletePathway = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when clicking delete
    if (window.confirm(`Are you sure you want to terminate Pathway "${pathway.name}"? This action cannot be undone.`)) {
        onDelete();
    }
  };

  const handleForkPathway = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when clicking fork
    onFork();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`pathway-link ${isActive ? 'active' : ''}`} 
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="option"
      aria-selected={isActive}
      aria-label={`NudgePathway: ${pathway.name}, Version: ${pathway.currentDeltaShiftState.currentVersion}, DeltaShifts: ${shiftCountForDisplay}. Status: ${pathway.currentDeltaShiftState.isShiftActive ? 'Active' : 'Idle'}`}
    >
      <h4>{pathway.name}</h4>
      <p>
        Version: {pathway.currentDeltaShiftState.currentVersion} | Shifts: {shiftCountForDisplay}
      </p>
      <p>Status: {pathway.currentDeltaShiftState.isShiftActive ? `Active (${pathway.currentDeltaShiftState.activeEchoDisplay})` : 'Idle'}</p>
      <p style={{fontSize: '0.7rem', opacity: 0.7}}>Created: {new Date(pathway.createdAt).toLocaleDateString()}</p>
      <div className="pathway-actions">
        <button
          onClick={handleForkPathway}
          className="fork-pathway-btn"
          aria-label={`Fork NudgePathway ${pathway.name}`}
          title="Fork NudgePathway"
        >
          Fork
        </button>
        <button
          onClick={handleDeletePathway}
          className="terminate-pathway-btn" // destructive-action could also be a class
          aria-label={`Terminate NudgePathway ${pathway.name}`}
          title="Terminate NudgePathway"
        >
          Delete
        </button>
      </div>
    </div>
  );
};