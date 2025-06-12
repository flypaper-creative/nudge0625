import React from 'react';

interface DeltaShiftControlsProps { // Renamed from EvolutionaryCycleControlsProps
  isShiftActive: boolean; // Renamed from isCycleActive
  onAdvanceOrInitiate: () => void; // Renamed from onAdvanceOrInitiateCycle
  onRevertToGenesis: () => void;
  isInitiateDisabled: boolean;
}

export const DeltaShiftControls: React.FC<DeltaShiftControlsProps> = ({
  isShiftActive,
  onAdvanceOrInitiate,
  onRevertToGenesis,
  isInitiateDisabled
}) => {
  return (
    <div className="delta-shift-controls-group"> {/* Renamed CSS class */}
      <button
          onClick={onAdvanceOrInitiate}
          disabled={isInitiateDisabled && !isShiftActive}
          aria-live="polite"
          aria-label={isShiftActive ? "Advance to next DeltaShift Phase" : "Initiate DeltaShift with selected configuration"}
      >
        {isShiftActive ? "Next Shift Phase" : "Initiate Shift"}
      </button>
      <button
        onClick={onRevertToGenesis}
        className="revert-shift-button secondary-action" // Renamed CSS class, added secondary for style
        aria-label="Revert DeltaShift state and parameters to Genesis values"
        disabled={!isShiftActive && !isInitiateDisabled} 
      >
        Revert to Genesis
      </button>
    </div>
  );
};