import React from 'react';
import type { EchoLinkMode } from '../types'; 

interface EchoLinkModeSelectorProps {
  currentMode: EchoLinkMode; 
  onModeChange: (mode: EchoLinkMode) => void; 
  isToggleDisabled: boolean; 
  isFusionDisabled: boolean; 
}

export const EchoLinkModeSelector: React.FC<EchoLinkModeSelectorProps> = ({
  currentMode,
  onModeChange,
  isToggleDisabled,
  isFusionDisabled
}) => {
  return (
    <fieldset className="echo-link-mode-selector form-group" role="radiogroup" aria-labelledby="echo-link-mode-label"> 
      <legend id="echo-link-mode-label">Guiding Echo Link Mode:</legend>
      <label>
        <input
          type="radio"
          name="echoLinkMode"
          value="toggle"
          checked={currentMode === "toggle"}
          onChange={() => onModeChange("toggle")}
          disabled={isToggleDisabled}
          aria-label="Toggle Link Mode: Guiding Echos operate in sequence or alternate during DeltaShifts."
        />
        <span>Toggle Link</span>
      </label>
      <label>
        <input
          type="radio"
          name="echoLinkMode"
          value="fusion"
          checked={currentMode === "fusion"}
          onChange={() => onModeChange("fusion")}
          disabled={isFusionDisabled}
          aria-label="Fusion Link Mode: Guiding Echos merge their influence patterns for each DeltaShift."
        />
        <span>Fusion Link</span>
      </label>
    </fieldset>
  );
};