import React, { useState, useEffect } from 'react';
import { GuidingEchoGlyph } from './GuidingEchoGlyph'; // Renamed PersonaCard
import { EchoLinkModeSelector } from './EchoLinkModeSelector'; // Renamed ModeSelector
import { PRIME_ECHO_BITS, SHIFT_STRATEGY_PROFILES, SHIFT_SCALE_PROFILES } from '../constants/kernelAppData'; // Renamed constants
import { ITERATION_CURRICULUMS } from '../constants/iterationCurriculums'; // New import
import type { NudgePathwayBlueprint, ShiftStrategy, ShiftScale, EchoLinkMode, IterationCurriculum, EchoBit, GuidingEchoAttributes } from '../types'; // Renamed types, Added EchoBit, GuidingEchoAttributes

interface PathwayConfiguratorProps {
  onCommitBlueprint: (blueprint: NudgePathwayBlueprint) => void; // Renamed onSaveSession
  onCancelConfiguration: () => void; // Renamed onCancelInitiation
}

export const PathwayConfigurator: React.FC<PathwayConfiguratorProps> = ({ onCommitBlueprint, onCancelConfiguration }) => {
  const [pathwayName, setPathwayName] = useState<string>(''); // Renamed processName
  const [selectedGuidingEchoBitIds, setSelectedGuidingEchoBitIds] = useState<string[]>([]); // Renamed selectedEidolonFragmentIds
  const [echoLinkMode, setEchoLinkMode] = useState<EchoLinkMode>('toggle'); // Renamed eidolonSynergyMode

  const [shiftStrategy, setShiftStrategy] = useState<ShiftStrategy>('standard_toggle'); // Renamed fluxStrategy
  const [shiftScale, setShiftScale] = useState<ShiftScale>('micro'); // Renamed fluxScale

  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null);
  const [basePromptForCurriculum, setBasePromptForCurriculum] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [echoError, setEchoError] = useState<string>(''); // Renamed eidolonError

  const handleSelectGuidingEcho = (bitId: string) => { // Renamed handleSelectEidolonFragment
    setSelectedGuidingEchoBitIds(prevSelected => {
      if (prevSelected.includes(bitId)) {
        return prevSelected.filter(id => id !== bitId);
      }
      if (prevSelected.length < 2) { // Max 2 Guiding Echos for simplicity in standard modes
        return [...prevSelected, bitId];
      }
      // If already 2 selected, replace the oldest one (simple FIFO for UI)
      return [prevSelected[1], bitId];
    });
    setEchoError(''); // Clear error on selection change
  };

  useEffect(() => {
    // Adjust EchoLinkMode and ShiftStrategy based on number of selected GuidingEchos
    if (selectedGuidingEchoBitIds.length === 0) {
      setEchoLinkMode('toggle');
      if (shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics') {
        setShiftStrategy('exploratory'); // Default to exploratory if no echos and strategy requires them
      }
    } else if (selectedGuidingEchoBitIds.length === 1) {
      setEchoLinkMode('toggle'); // Fusion mode requires 2 echos
       if (shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics') {
        setShiftStrategy('standard_toggle'); // If strategy implied two, revert to toggle with one.
      }
    } else if (selectedGuidingEchoBitIds.length === 2) {
        // If strategy is standard_toggle, ensure linkMode is toggle
        if(shiftStrategy === 'standard_toggle') setEchoLinkMode('toggle');
        // If strategy is standard_fusion, ensure linkMode is fusion
        if(shiftStrategy === 'standard_fusion') setEchoLinkMode('fusion');
    }
  }, [selectedGuidingEchoBitIds, echoLinkMode, shiftStrategy]);


  useEffect(() => {
    // Auto-set link mode based on strategy if 2 echos are selected
    if (selectedGuidingEchoBitIds.length === 2) {
      if (shiftStrategy === 'standard_toggle') {
        setEchoLinkMode('toggle');
      } else if (shiftStrategy === 'standard_fusion') {
        setEchoLinkMode('fusion');
      }
    }
  }, [shiftStrategy, selectedGuidingEchoBitIds.length]);

  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const curriculumId = e.target.value;
    setSelectedCurriculumId(curriculumId === "none" ? null : curriculumId);
    const selected = ITERATION_CURRICULUMS.find(c => c.id === curriculumId);
    if (selected && selected.basePrompt) {
        setBasePromptForCurriculum(selected.basePrompt);
    } else {
        setBasePromptForCurriculum('');
    }
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (!pathwayName.trim()) {
      setNameError('NudgePathway name is required.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!selectedCurriculumId) { // Guiding Echos are optional if a curriculum isn't guiding them explicitly per step
        if (selectedGuidingEchoBitIds.length === 0 && (shiftStrategy === 'standard_toggle' || shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics')) {
          setEchoError(`At least one Guiding Echo must be selected for ${shiftStrategy.replace('_', ' ')} strategy if no curriculum is chosen or curriculum steps do not define echos.`);
          isValid = false;
        } else if (selectedGuidingEchoBitIds.length < 2 && (shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics')) {
          setEchoError(`At least two Guiding Echos must be selected for ${shiftStrategy.replace('_', ' ')} strategy if no curriculum is chosen or curriculum steps do not define echos.`);
          isValid = false;
        }
        else {
          setEchoError('');
        }
    } else {
        setEchoError(''); // Curriculum steps might define their own echos
    }
    return isValid;
  };

  const handleCommit = () => {
    if (validateInputs()) {
      onCommitBlueprint({
        name: pathwayName,
        guidingEchoBitIds: selectedGuidingEchoBitIds,
        echoLinkMode: (shiftStrategy === 'standard_toggle' || shiftStrategy === 'standard_fusion')
                                ? echoLinkMode
                                : (selectedGuidingEchoBitIds.length === 1 ? 'toggle' : echoLinkMode),
        shiftStrategy,
        shiftScale,
        activeCurriculumId: selectedCurriculumId,
        basePromptForCurriculum: selectedCurriculumId ? basePromptForCurriculum : undefined,
      });
    }
  };

  const isGuidingEchoDisabled = (bitId: string): boolean => { // Renamed isEidolonDisabled
    return selectedGuidingEchoBitIds.length >= 2 && !selectedGuidingEchoBitIds.includes(bitId);
  };

  const availableEchos: EchoBit<GuidingEchoAttributes>[] = PRIME_ECHO_BITS; // Renamed availableEidolons, use PRIME_ECHO_BITS
  const selectedCurriculumDetails = ITERATION_CURRICULUMS.find(c => c.id === selectedCurriculumId);

  return (
    <div className="pathway-configurator" aria-labelledby="configurator-view-title"> {/* Renamed CSS class */}
      <h2 id="configurator-view-title">Configure New NudgePathway (v17 Kernel Interface)</h2>

      <div className="form-group"> {/* Renamed CSS class */}
        <label htmlFor="pathwayName">NudgePathway Name:</label>
        <input
          type="text" id="pathwayName" value={pathwayName}
          onChange={(e) => { setPathwayName(e.target.value); if (nameError) setNameError(''); }}
          aria-required="true" aria-describedby={nameError ? "name-error-msg" : undefined}
        />
        {nameError && <p id="name-error-msg" className="error-message-text" role="alert">{nameError}</p>} {/* Renamed CSS class */}
      </div>

      <fieldset className="form-group">
        <legend>Iteration Curriculum (Optional):</legend>
        <select id="curriculumSelect" value={selectedCurriculumId || "none"} onChange={handleCurriculumChange}>
            <option value="none">-- No Curriculum (Manual Mode) --</option>
            {ITERATION_CURRICULUMS.map(curr => (
                <option key={curr.id} value={curr.id}>{curr.name} ({curr.category})</option>
            ))}
        </select>
        {selectedCurriculumDetails && (
            <div style={{marginTop: '10px', padding: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px'}}>
                <p style={{fontSize: '0.9em', margin: '0 0 5px 0'}}><em>{selectedCurriculumDetails.description}</em></p>
                <p style={{fontSize: '0.8em', margin: '0'}}>Steps: {selectedCurriculumDetails.steps.length}</p>
            </div>
        )}
      </fieldset>

      {selectedCurriculumId && (
        <div className="form-group">
            <label htmlFor="basePromptForCurriculum">Base Prompt for Curriculum (can be modified by steps):</label>
            <textarea 
                id="basePromptForCurriculum"
                value={basePromptForCurriculum}
                onChange={(e) => setBasePromptForCurriculum(e.target.value)}
                rows={3}
                placeholder="Enter a general theme or goal for the curriculum's iterations..."
            />
        </div>
      )}


      <fieldset className="form-group"> {/* Renamed CSS class */}
        <legend>DeltaShift Strategy Configuration (Used if no curriculum or curriculum steps don't override):</legend>
        <div className="shift-strategy-selectors"> {/* Renamed CSS class */}
            <div>
                <label htmlFor="shiftStrategySelect">Shift Strategy:</label>
                <select id="shiftStrategySelect" value={shiftStrategy} onChange={e => setShiftStrategy(e.target.value as ShiftStrategy)}>
                {Object.entries(SHIFT_STRATEGY_PROFILES).map(([key, desc]) => (
                    <option key={key} value={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {desc}</option>
                ))}
                </select>
            </div>
            <div>
                <label htmlFor="shiftScaleSelect">Shift Scale:</label>
                <select id="shiftScaleSelect" value={shiftScale} onChange={e => setShiftScale(e.target.value as ShiftScale)}>
                {Object.entries(SHIFT_SCALE_PROFILES).map(([key, desc]) => (
                    <option key={key} value={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {desc}</option>
                ))}
                </select>
            </div>
        </div>
      </fieldset>

      <fieldset className="form-group"> {/* Renamed CSS class */}
        <legend>Select Default Guiding Echos (Max 2 for Standard Strategies, can be overridden by curriculum):</legend>
        {echoError && <p id="echo-error-msg" className="error-message-text" role="alert">{echoError}</p>} {/* Renamed CSS class */}
        <div className="echo-glyph-grid" role="group" aria-label="Selectable Guiding Echos"> {/* Renamed CSS class */}
          {availableEchos.map(echoBit => (
            <GuidingEchoGlyph // Renamed component
              key={echoBit.echo_bit_id} echoBit={echoBit} // Use echoBit prop
              isSelected={selectedGuidingEchoBitIds.includes(echoBit.echo_bit_id)}
              isDisabled={isGuidingEchoDisabled(echoBit.echo_bit_id)}
              onSelect={handleSelectGuidingEcho}
            />
          ))}
        </div>
      </fieldset>

      {(shiftStrategy === 'standard_toggle' || shiftStrategy === 'standard_fusion') && selectedGuidingEchoBitIds.length > 0 && (
        <EchoLinkModeSelector // Renamed component
          currentMode={echoLinkMode} // Use currentMode prop
          onModeChange={setEchoLinkMode} // Use onModeChange prop
          isToggleDisabled={selectedGuidingEchoBitIds.length === 0 || shiftStrategy === 'standard_fusion'}
          isFusionDisabled={selectedGuidingEchoBitIds.length < 2 || shiftStrategy === 'standard_toggle'}
        />
      )}

      <fieldset className="form-group placeholder-ui-section"> {/* Renamed CSS classes */}
          <legend>Data Integrity & Quality Assurance (Conceptual)</legend>
          <p><em>Future parameters for Data Integrity EchoBit selection, data purification pipeline configuration, and anomaly detection sensitivity will be available here. Currently employing v17 Kernel defaults.</em></p>
      </fieldset>

      <div className="config-actions-group"> {/* Renamed CSS class */}
        <button
          onClick={handleCommit}
          aria-label="Commit NudgePathway Blueprint and Engage DeltaShift"
        >
          Commit & Engage
        </button>
        <button onClick={onCancelConfiguration} className="secondary-action" aria-label="Cancel NudgePathway Configuration"> {/* Renamed CSS class */}
          Cancel Configuration
        </button>
      </div>
    </div>
  );
};