import React from 'react';

interface DeltaShiftInfoProps { // Renamed from EvolutionaryCycleInfoProps
  currentVersion: string;         
  shiftCount: number;             // Renamed from cycleCount to shiftCount
  activeEchoDisplay: string;    // Renamed from activeMotifDisplay to activeEchoDisplay
}

export const DeltaShiftInfo: React.FC<DeltaShiftInfoProps> = ({ currentVersion, shiftCount, activeEchoDisplay }) => {
  return (
    <div className="delta-shift-info-panel" aria-label="Current DeltaShift Telemetry"> {/* Renamed CSS class & label */}
      <span aria-label={`Current Pathway Version is ${currentVersion}`}>Version: <strong>{currentVersion}</strong></span>
      <span aria-label={`Current DeltaShift count is ${shiftCount}`}>Shift#: <strong>{shiftCount}</strong></span>
      <span aria-label={`Active Guiding Echo or Echos are ${activeEchoDisplay}`}>Active Echo(s): <strong>{activeEchoDisplay}</strong></span>
    </div>
  );
};