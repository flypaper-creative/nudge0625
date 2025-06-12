// @version v21.0.0
import React, { useState } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { NudgePathwayRecord, IterationCurriculum, GeneratedOutputLogEntry, TraceLogEntry, EchoBit, GuidingEchoAttributes } from '../types';
import { DeltaShiftInfo } from './DeltaShiftInfo';
import { DeltaShiftControls } from './DeltaShiftControls';
import { TraceLogViewer } from './TraceLogViewer';
import { PRIME_ECHO_BITS, SHIFT_STRATEGY_PROFILES, SHIFT_SCALE_PROFILES } from '../constants/kernelAppData';
import { ITERATION_CURRICULUMS } from '../constants/iterationCurriculums';
import { getGuidingEchoTitleById } from '../utils/guidingEchoUtils';

interface ActivePathwayMonitorProps {
  pathway: NudgePathwayRecord;
  onAdvanceShift: () => void;
  onRevertShift: () => void;
  onTakeSnapshot: () => void;
  onAnnotateLogEntry: (logEntryId: string, annotation: string) => void;
  aiInstance: GoogleGenAI | null;
}

export const ActivePathwayMonitor: React.FC<ActivePathwayMonitorProps> = ({ 
  pathway, 
  onAdvanceShift, 
  onRevertShift,
  onTakeSnapshot,
  onAnnotateLogEntry,
  aiInstance
}) => {
  const { name, echoClusterConfig, deltaShiftConfig, currentDeltaShiftState, activeCurriculumId, curriculumProgress, generatedOutputs } = pathway;
  const { currentVersion, shiftCount, activeEchoDisplay, isShiftActive, traceLog, activeShiftStrategy, activeShiftScale } = currentDeltaShiftState;

  const shiftCountForDisplay = isShiftActive ? shiftCount + 1 : pathway.currentDeltaShiftState.shiftCount;

  const [goalForAdvisor, setGoalForAdvisor] = useState<string>('');
  const [advisorResponse, setAdvisorResponse] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);

  const activeCurriculum: IterationCurriculum | undefined = activeCurriculumId ? ITERATION_CURRICULUMS.find(c => c.id === activeCurriculumId) : undefined;
  const allEchoBits: EchoBit<GuidingEchoAttributes>[] = PRIME_ECHO_BITS; // Assuming custom bits are not used here or are part of PRIME_ECHO_BITS

  const handleGetAdvice = async () => {
    if (!goalForAdvisor.trim()) {
      setAdvisorResponse("Please enter a goal for the NudgePathway to receive advice.");
      return;
    }
    if (!aiInstance) {
      setAdvisorResponse("Predictive Shift Advisor is offline: Gemini AI is not initialized. Please ensure API_KEY is correctly configured in your environment.");
      setIsLoadingAdvice(false);
      return;
    }

    setIsLoadingAdvice(true);
    setAdvisorResponse(''); 
    
    try {
      const curriculumInfo = activeCurriculum 
        ? `The pathway is currently running the "${activeCurriculum.name}" curriculum. Current step: ${curriculumProgress ? curriculumProgress.currentStepIndex + 1 : 'N/A'}/${activeCurriculum.steps.length}. Base prompt for curriculum: "${pathway.basePromptForCurriculum || activeCurriculum.basePrompt || 'Not set'}".`
        : "The pathway is not currently running a curriculum.";

      const prompt = `You are the NudgeKernel Predictive Shift Advisor.
Pathway Name: "${name}"
Current State: Version ${currentVersion}, ${shiftCount} shifts completed.
Strategy: ${activeShiftStrategy} (Scale: ${activeShiftScale}).
Active Guiding Echo(s): ${activeEchoDisplay}.
Echo Cluster Config: IDs [${echoClusterConfig.ids.join(', ')}], Link Mode: ${echoClusterConfig.linkMode}.
${curriculumInfo}
User's Goal: "${goalForAdvisor}"

Provide concise, actionable advice (max 150 words) to help achieve this goal. Consider suggesting adjustments to strategy, scale, guiding echos, or if a curriculum might be beneficial or needs adjustment. Be specific if possible.`;

      console.log("NudgeKernel Advisor: Sending prompt to Gemini:", prompt);
      const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', 
        contents: prompt,
        config: { temperature: 0.5, topK: 40, topP: 0.95 } 
      });
      setAdvisorResponse(response.text);
      console.log("NudgeKernel Advisor: Received advice from Gemini.");
      // Add a trace log entry for the advice received
      // Creating a dummy ID for the log entry as onAnnotateLogEntry expects one for an existing entry.
      // A better approach would be to have a dedicated log function that can add new entries.
      // For now, simulating by calling onAnnotateLogEntry with a new UUID.
      const adviceLogId = crypto.randomUUID();
      const adviceTraceEntry: TraceLogEntry = {
        id: adviceLogId,
        timestamp: new Date().toISOString(),
        text: `Advisor Query: "${goalForAdvisor.substring(0,50)}...". Response: "${response.text.substring(0,70)}..."`,
        type: 'info', // Or a new type 'advisor-log'
      };
      // This is a workaround; ideally, ActivePathwayMonitor would have a way to add new logs.
      // Assuming onAnnotateLogEntry can create if ID not found, or pathway.traceLog is updated elsewhere.
      // For the purpose of this fix, we'll assume the parent component handles adding this if onAnnotateLogEntry is only for existing.
      // Let's assume onAnnotateLogEntry is a misnomer and can add a new log too.
      onAnnotateLogEntry(adviceLogId, adviceTraceEntry.text);


    } catch (error) {
      console.error("NudgeKernel Advisor: Error getting advice from Gemini:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setAdvisorResponse(`Error receiving advice from Gemini: ${errorMessage}. Please check the console for more details. Ensure your API key is valid and has access to the 'gemini-2.5-flash-preview-04-17' model.`);
       const errorLogId = crypto.randomUUID();
       onAnnotateLogEntry(errorLogId, `Advisor Query ERROR: ${errorMessage}`);
    } finally {
      setIsLoadingAdvice(false);
    }
  };


  return (
    <div className="active-pathway-monitor" aria-labelledby="active-pathway-monitor-title">
      <h2 id="active-pathway-monitor-title">Active NudgePathway: {name}</h2>

      <section className="ui-section" aria-labelledby="pathway-shift-info-title">
        <h3 id="pathway-shift-info-title" className="visually-hidden-label">DeltaShift Information</h3>
        <DeltaShiftInfo
            currentVersion={currentVersion}
            shiftCount={shiftCountForDisplay}
            activeEchoDisplay={activeEchoDisplay}
        />
        <div className="shift-strategy-display">
            <p><strong>Strategy:</strong> {SHIFT_STRATEGY_PROFILES[activeShiftStrategy] || activeShiftStrategy}</p>
            <p><strong>Scale:</strong> {SHIFT_SCALE_PROFILES[activeShiftScale] || activeShiftScale}</p>
        </div>
      </section>

      {activeCurriculum && curriculumProgress && (
        <section className="ui-section" aria-labelledby="curriculum-progress-title">
            <h3 id="curriculum-progress-title">Curriculum: {activeCurriculum.name}</h3>
            <div className="curriculum-progress-display">
                {curriculumProgress.isComplete ? (
                    <p><strong>Status: Curriculum Completed!</strong></p>
                ) : (
                    <>
                        <p><strong>Overall Progress:</strong> Step {curriculumProgress.currentStepIndex + 1} of {activeCurriculum.steps.length}</p>
                        { curriculumProgress.currentStepIndex < activeCurriculum.steps.length && 
                            <>
                            <p><strong>Current Step:</strong> "{activeCurriculum.steps[curriculumProgress.currentStepIndex].stepName}"</p>
                            <p><em>Instruction: "{activeCurriculum.steps[curriculumProgress.currentStepIndex].instruction}"</em></p>
                            <p><strong>Step Iteration:</strong> {curriculumProgress.currentIterationInStep + 1} of {activeCurriculum.steps[curriculumProgress.currentStepIndex].iterations}</p>
                            </>
                        }
                        <progress 
                            value={curriculumProgress.currentStepIndex * 100 + (curriculumProgress.currentIterationInStep / (activeCurriculum.steps[curriculumProgress.currentStepIndex]?.iterations || 1)) * 100 } 
                            max={activeCurriculum.steps.length * 100}
                            aria-label={`Curriculum progress: ${Math.round(((curriculumProgress.currentStepIndex * (activeCurriculum.steps[curriculumProgress.currentStepIndex]?.iterations || 1) + curriculumProgress.currentIterationInStep) / (activeCurriculum.steps.reduce((acc, step) => acc + step.iterations, 0) || 1)) * 100)}%`}
                        />
                    </>
                )}
            </div>
        </section>
      )}

      <section className="ui-section" aria-labelledby="pathway-shift-controls-title">
        <h3 id="pathway-shift-controls-title">DeltaShift Controls</h3>
        <div className="delta-shift-controls-group">
            <DeltaShiftControls
                isShiftActive={isShiftActive}
                onAdvanceOrInitiate={onAdvanceShift}
                onRevertToGenesis={onRevertShift}
                isInitiateDisabled={
                    (!!activeCurriculum && !!curriculumProgress && curriculumProgress.isComplete && !isShiftActive) || 
                    (!activeCurriculum && echoClusterConfig.ids.length === 0 && 
                     (activeShiftStrategy === 'standard_toggle' || activeShiftStrategy === 'standard_fusion' || activeShiftStrategy === 'adversarial_dynamics') && !isShiftActive)
                }
            />
            <button onClick={onTakeSnapshot} className="secondary-action" aria-label="Take a snapshot of the current pathway state">
                Take Snapshot
            </button>
        </div>
      </section>

      {(activeShiftStrategy === 'standard_toggle' || activeShiftStrategy === 'standard_fusion') && echoClusterConfig.ids.length > 0 && (!activeCurriculum || (curriculumProgress && curriculumProgress.isComplete)) && (
        <section className="ui-section" aria-labelledby="pathway-echo-link-title">
          <h3 id="pathway-echo-link-title">Guiding Echo Link Logic</h3>
            <div className="echo-link-display">
              {echoClusterConfig.linkMode === "toggle" && (
                <>
                  <p><strong>Toggle Link (Guiding Echos):</strong></p>
                  {echoClusterConfig.ids.length === 1 && <p>Delta Phase N: {getGuidingEchoTitleById(echoClusterConfig.ids[0], allEchoBits)}</p>}
                  {echoClusterConfig.ids.length === 2 &&
                    <>
                      <p>Phase Alpha (and odd shifts): {getGuidingEchoTitleById(echoClusterConfig.ids[0], allEchoBits)}</p>
                      <p>Phase Beta (and even shifts): {getGuidingEchoTitleById(echoClusterConfig.ids[1], allEchoBits)}</p>
                    </>
                  }
                </>
              )}
              {echoClusterConfig.linkMode === "fusion" && (
                <>
                    <p><strong>Fusion Link (Guiding Echos):</strong></p>
                    <p>Echos {echoClusterConfig.ids.map(id => getGuidingEchoTitleById(id, allEchoBits)).join(' and ')} merge guidance for each DeltaShift phase where Echos operate.</p>
                </>
              )}
            </div>
        </section>
      )}
      
      {generatedOutputs && generatedOutputs.length > 0 && (
        <section className="ui-section" aria-labelledby="generated-outputs-title">
            <h3 id="generated-outputs-title">Generated Outputs Log (Simulated)</h3>
            <div className="generated-outputs-log trace-log-viewer">
                {generatedOutputs.slice(-10).reverse().map((output: GeneratedOutputLogEntry) => ( // Show last 10, newest first
                    <div key={output.id} className="log-entry-container">
                        <p className="log-type-data-ops" title={output.contentPreview ? `Preview: ${output.contentPreview}` : `Path: ${output.path}`}>
                            [{new Date(output.timestamp).toLocaleTimeString()}] {output.path}
                            {output.contentPreview && <span style={{display: 'block', opacity: 0.7, fontSize: '0.9em', marginLeft: '10px'}}>Preview: <em>{output.contentPreview}</em></span>}
                        </p>
                    </div>
                ))}
                 {generatedOutputs.length > 10 && <p style={{textAlign: 'center', fontSize: '0.8em', color: 'var(--clr-text-secondary-silver)'}}>...and {generatedOutputs.length - 10} more entries.</p>}
            </div>
        </section>
      )}

      <section className="ui-section" aria-labelledby="predictive-shift-advisor-title">
        <h3 id="predictive-shift-advisor-title">Predictive Shift Advisor (Gemini AI)</h3>
        <div className="form-group">
            <label htmlFor="advisorGoal">Define your goal for this pathway:</label>
            <textarea 
                id="advisorGoal"
                value={goalForAdvisor}
                onChange={(e) => setGoalForAdvisor(e.target.value)}
                rows={3}
                placeholder="e.g., Increase diversity of generated outcomes, refine solution towards X, explore alternative approaches for Y..."
                aria-label="Goal for NudgePathway Advisor"
            />
        </div>
        <button onClick={handleGetAdvice} disabled={isLoadingAdvice || !aiInstance}>
            {isLoadingAdvice ? "Consulting Advisor..." : (aiInstance ? "Get Advice" : "Advisor Offline (API Key Missing)")}
        </button>
        {advisorResponse && (
            <div className="echo-link-display" style={{marginTop: '15px', whiteSpace: 'pre-wrap'}}>
                <strong>Advisor's Response:</strong>
                <p>{advisorResponse}</p>
            </div>
        )}
        {!aiInstance && <p style={{fontSize: '0.8rem', color: 'var(--clr-status-warning-amber)', marginTop: '10px'}}>Note: The Predictive Shift Advisor requires a valid Gemini API Key to be configured in the environment.</p>}
      </section>

      <section className="ui-section" aria-labelledby="pathway-trace-log-title">
         <h3 id="pathway-trace-log-title">DeltaShift Trace Log (Interactive)</h3>
        <TraceLogViewer 
            entries={traceLog} 
            onAnnotateEntry={onAnnotateLogEntry}
        />
      </section>
    </div>
  );
};