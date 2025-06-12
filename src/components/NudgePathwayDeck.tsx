
import React from 'react';
import type { NudgePathwayRecord } from '../types';
import { NudgePathwayLink } from './NudgePathwayLink';

interface NudgePathwayDeckProps {
  pathways: NudgePathwayRecord[];
  activePathwayId: string | null;
  onNewRequest: () => void;
  onSelectPathway: (pathwayId: string) => void;
  onDeletePathway: (pathwayId: string) => void;
  onForkPathway: (pathwayId: string) => void;
}

export const NudgePathwayDeck: React.FC<NudgePathwayDeckProps> = ({
  pathways,
  activePathwayId,
  onNewRequest,
  onSelectPathway,
  onDeletePathway,
  onForkPathway
}) => {
  return (
    <aside className="pathway-deck" aria-labelledby="pathway-deck-title">
      <h2 id="pathway-deck-title">NudgePathways</h2>
      <button 
        onClick={onNewRequest} 
        className="new-pathway-btn" 
        aria-label="Configure a new NudgePathway"
      >
        + New Pathway
      </button>
      <div className="pathway-scroll-list" role="listbox" aria-orientation="vertical">
        {pathways.length === 0 && <p style={{textAlign: 'center', color: 'var(--clr-text-secondary-silver)', marginTop: '20px'}}>No NudgePathways active. Configure one to begin.</p>}
        {pathways.map(pathway => (
          <NudgePathwayLink
            key={pathway.id}
            pathway={pathway}
            isActive={pathway.id === activePathwayId}
            onSelect={() => onSelectPathway(pathway.id)}
            onDelete={() => onDeletePathway(pathway.id)}
            onFork={() => onForkPathway(pathway.id)}
          />
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid var(--clr-border-faint)' }}>
        <button
          className="new-pathway-btn disabled-feature-btn"
          disabled
          title="EchoBit Weaver (Interface Pending)"
          aria-label="EchoBit Weaver (Interface Pending)"
        >
          EchoBit Weaver
        </button>
        <p style={{fontSize: '0.75rem', color: 'var(--clr-text-secondary-silver)', textAlign: 'center', marginTop: '4px'}}>
            Manage atomic EchoBits (Future Update)
        </p>
      </div>
    </aside>
  );
};