import React, { useState, useEffect } from 'react';
import { GuidingEchoGlyph } from './GuidingEchoGlyph';
import { EchoLinkModeSelector } from './EchoLinkModeSelector';
import { PRIME_ECHO_BITS, SHIFT_STRATEGY_PROFILES, SHIFT_SCALE_PROFILES } from '../constants/kernelAppData';
import { ITERATION_CURRICULUMS } from '../constants/iterationCurriculums';
import type { NudgePathwayBlueprint, ShiftStrategy, ShiftScale, EchoLinkMode, IterationCurriculum, EchoBit, GuidingEchoAttributes } from '../types';

interface PathwayConfiguratorProps {
  onCommitBlueprint: (blueprint: NudgePathwayBlueprint) => void;
  onCancelConfiguration: () => void;
}

export const PathwayConfigurator: React.FC<PathwayConfiguratorProps> = ({ onCommitBlueprint, onCancelConfiguration }) => {
  const [pathwayName, setPathwayName] = useState<string>('');
  const [selectedGuidingEchoBitIds, setSelectedGuidingEchoBitIds] = useState<string[]>([]);
  const [echoLinkMode, setEchoLinkMode] = useState<EchoLinkMode>('toggle');

  const [shiftStrategy, setShiftStrategy] = useState<ShiftStrategy>('standard_toggle');
  const [shiftScale, setShiftScale] = useState<ShiftScale>('micro');

  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null);
  const [basePromptForCurriculum, setBasePromptForCurriculum] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [echoError, setEchoError] = useState<string>('');

  const handleSelectGuidingEcho = (bitId: string) => {
    setSelectedGuidingEchoBitIds(prevSelected => {
      if (prevSelected.includes(bitId)) {
        return prevSelected.filter(id => id !== bitId);
      }
      if (prevSelected.length < 2) {
        return [...prevSelected, bitId];
      }
      return [prevSelected[1], bitId]; // Max 2, FIFO
    });
    setEchoError('');
  };

  useEffect(() => {
    if (selectedGuidingEchoBitIds.length === 0) {
      setEchoLinkMode('toggle');
      if (shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics') {
        setShiftStrategy('exploratory');
      }
    } else if (selectedGuidingEchoBitIds.length === 1) {
      setEchoLinkMode('toggle');
       if (shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics') {
        setShiftStrategy('standard_toggle');
      }
    } else if (selectedGuidingEchoBitIds.length === 2) {
        if(shiftStrategy === 'standard_toggle') setEchoLinkMode('toggle');
        if(shiftStrategy === 'standard_fusion') setEchoLinkMode('fusion');
    }
  }, [selectedGuidingEchoBitIds, echoLinkMode, shiftStrategy]);

  useEffect(() => {
    if (selectedGuidingEchoBitIds.length === 2) {
      if (shiftStrategy === 'standard_toggle') setEchoLinkMode('toggle');
      else if (shiftStrategy === 'standard_fusion') setEchoLinkMode('fusion');
    }
  }, [shiftStrategy, selectedGuidingEchoBitIds.length]);

  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const curriculumId = e.target.value;
    setSelectedCurriculumId(curriculumId === "none" ? null : curriculumId);
    const selected = ITERATION_CURRICULUMS.find(c => c.id === curriculumId);
    setBasePromptForCurriculum(selected?.basePrompt || '');
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (!pathwayName.trim()) {
      setNameError('NudgePathway name is required.');
      isValid = false;
    } else setNameError('');

    const curriculumRequiresEchos = !selectedCurriculumId || 
        (selectedCurriculumId && ITERATION_CURRICULUMS.find(c => c.id === selectedCurriculumId)?.steps.some(s => !s.guidingEchoBitId));

    if (curriculumRequiresEchos) {
        if (selectedGuidingEchoBitIds.length === 0 && (shiftStrategy === 'standard_toggle' || shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics')) {
          setEchoError(`At least one Guiding Echo must be selected for ${shiftStrategy.replace('_', ' ')} strategy if not overridden by all curriculum steps.`);
          isValid = false;
        } else if (selectedGuidingEchoBitIds.length < 2 && (shiftStrategy === 'standard_fusion' || shiftStrategy === 'adversarial_dynamics')) {
          setEchoError(`At least two Guiding Echos must be selected for ${shiftStrategy.replace('_', ' ')} strategy if not overridden by all curriculum steps.`);
          isValid = false;
        } else setEchoError('');
    } else setEchoError('');
    
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

  const isGuidingEchoDisabled = (bitId: string): boolean => {
    return selectedGuidingEchoBitIds.length >= 2 && !selectedGuidingEchoBitIds.includes(bitId);
  };

  const availableEchos: EchoBit<GuidingEchoAttributes>[] = PRIME_ECHO_BITS;
  const selectedCurriculumDetails = ITERATION_CURRICULUMS.find(c => c.id === selectedCurriculumId);

  return (
    <div className="pathway-configurator ui-section" aria-labelledby="configurator-view-title">
      <h2 id="configurator-view-title">Configure New NudgePathway</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset className="form-group">
            <legend>Basic Information</legend>
            <label htmlFor="pathwayName">NudgePathway Name:</label>
            <input
            type="text" id="pathwayName" value={pathwayName}
            onChange={(e) => { setPathwayName(e.target.value); if (nameError) setNameError(''); }}
            aria-required="true" aria-describedby={nameError ? "name-error-msg" : undefined}
            />
            {nameError && <p id="name-error-msg" className="error-message-text" role="alert">{nameError}</p>}
        </fieldset>

        <fieldset className="form-group">
            <legend>Iteration Curriculum (Optional)</legend>
            <label htmlFor="curriculumSelect">Select Curriculum:</label>
            <select id="curriculumSelect" value={selectedCurriculumId || "none"} onChange={handleCurriculumChange}>
                <option value="none">-- No Curriculum (Manual Mode) --</option>
                {ITERATION_CURRICULUMS.map(curr => (
                    <option key={curr.id} value={curr.id}>{curr.name} ({curr.category})</option>
                ))}
            </select>
            {selectedCurriculumDetails && (
                <div className="curriculum-progress-display" style={{marginTop: '10px'}}>
                    <p><strong>Description:</strong> <em>{selectedCurriculumDetails.description}</em></p>
                    <p><strong>Steps:</strong> {selectedCurriculumDetails.steps.length}</p>
                    {selectedCurriculumDetails.basePrompt && !basePromptForCurriculum && <p><strong>Default Base Prompt:</strong> "{selectedCurriculumDetails.basePrompt}"</p>}
                </div>
            )}
             {selectedCurriculumId && (
                <div className="form-group" style={{marginTop: '15px'}}>
                    <label htmlFor="basePromptForCurriculum">Base Prompt for Curriculum:</label>
                    <textarea 
                        id="basePromptForCurriculum"
                        value={basePromptForCurriculum}
                        onChange={(e) => setBasePromptForCurriculum(e.target.value)}
                        rows={3}
                        placeholder={selectedCurriculumDetails?.basePrompt || "Enter a general theme or goal for the curriculum..."}
                    />
                    <p style={{fontSize: '0.8rem', color: 'var(--clr-text-secondary-silver)'}}>This prompt can be modified by individual curriculum steps.</p>
                </div>
            )}
        </fieldset>

        <fieldset className="form-group">
            <legend>DeltaShift Strategy Configuration</legend>
             <p style={{fontSize: '0.8rem', color: 'var(--clr-text-secondary-silver)', marginBottom: '10px'}}>Used if no curriculum is active or if curriculum steps do not override.</p>
            <div className="shift-strategy-selectors">
                <div>
                    <label htmlFor="shiftStrategySelect">Shift Strategy:</label>
                    <select id="shiftStrategySelect" value={shiftStrategy} onChange={e => setShiftStrategy(e.target.value as ShiftStrategy)}>
                    {Object.entries(SHIFT_STRATEGY_PROFILES).map(([key, desc]) => (
                        <option key={key} value={key as ShiftStrategy}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {desc}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="shiftScaleSelect">Shift Scale:</label>
                    <select id="shiftScaleSelect" value={shiftScale} onChange={e => setShiftScale(e.target.value as ShiftScale)}>
                    {Object.entries(SHIFT_SCALE_PROFILES).map(([key, desc]) => (
                        <option key={key} value={key as ShiftScale}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {desc}</option>
                    ))}
                    </select>
                </div>
            </div>
        </fieldset>

        <fieldset className="form-group">
            <legend>Default Guiding Echos (Max 2 for Standard Strategies)</legend>
            <p style={{fontSize: '0.8rem', color: 'var(--clr-text-secondary-silver)', marginBottom: '10px'}}>Can be overridden by curriculum steps if a curriculum is active.</p>
            {echoError && <p id="echo-error-msg" className="error-message-text" role="alert">{echoError}</p>}
            <div className="echo-glyph-grid" role="group" aria-label="Selectable Guiding Echos">
            {availableEchos.map(echoBit => (
                <GuidingEchoGlyph
                key={echoBit.echo_bit_id} echoBit={echoBit}
                isSelected={selectedGuidingEchoBitIds.includes(echoBit.echo_bit_id)}
                isDisabled={isGuidingEchoDisabled(echoBit.echo_bit_id)}
                onSelect={handleSelectGuidingEcho}
                />
            ))}
            </div>
        </fieldset>

        {(shiftStrategy === 'standard_toggle' || shiftStrategy === 'standard_fusion') && selectedGuidingEchoBitIds.length > 0 && (
            <EchoLinkModeSelector
            currentMode={echoLinkMode}
            onModeChange={setEchoLinkMode}
            isToggleDisabled={selectedGuidingEchoBitIds.length === 0 || shiftStrategy === 'standard_fusion'}
            isFusionDisabled={selectedGuidingEchoBitIds.length < 2 || shiftStrategy === 'standard_toggle'}
            />
        )}

        <fieldset className="form-group placeholder-ui-section">
            <legend>Data Integrity & Quality Assurance (Conceptual)</legend>
            <p><em>Future parameters for Data Integrity EchoBit selection, data purification pipeline configuration, and anomaly detection sensitivity will be available here. Currently employing Kernel defaults.</em></p>
        </fieldset>

        <div className="config-actions-group">
            <button type="button" onClick={handleCommit} aria-label="Commit NudgePathway Blueprint and Engage DeltaShift">
            Commit & Engage
            </button>
            <button type="button" onClick={onCancelConfiguration} className="secondary-action" aria-label="Cancel NudgePathway Configuration">
            Cancel Configuration
            </button>
        </div>
      </form>
    </div>
  );
};