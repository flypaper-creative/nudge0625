// @version v21.0.0
import React, { useState } from 'react';
// import { GoogleGenAI } from "@google/genai"; // For conceptual Gemini integration
import type { NudgePathwayRecord, TraceLogEntry } from '../types';
import { DeltaShiftInfo } from './DeltaShiftInfo';
import { DeltaShiftControls } from './DeltaShiftControls';
import { TraceLogViewer } from './TraceLogViewer';
import { PRIME_ECHO_BITS, SHIFT_STRATEGY_PROFILES, SHIFT_SCALE_PROFILES } from '../constants/kernelAppData'; // Corrected ACTIVE_ECHO_BITS to PRIME_ECHO_BITS
import { getGuidingEchoTitleById } from '../utils/guidingEchoUtils';

interface ActivePathwayMonitorProps {
  pathway: NudgePathwayRecord;
  onAdvanceShift: () => void;
  onRevertShift: () => void;
  onTakeSnapshot: () => void; 
  onAnnotateLogEntry: (logEntryId: string, annotation: string) => void; 
}

export const ActivePathwayMonitor: React.FC<ActivePathwayMonitorProps> = ({ 
  pathway, 
  onAdvanceShift, 
  onRevertShift,
  onTakeSnapshot,
  onAnnotateLogEntry
}) => {
  const { name, echoClusterConfig, deltaShiftConfig, currentDeltaShiftState } = pathway;
  const { currentVersion, shiftCount, activeEchoDisplay, isShiftActive, traceLog, activeShiftStrategy, activeShiftScale } = currentDeltaShiftState;

  const shiftCountForDisplay = isShiftActive ? shiftCount + 1 : 0;

  const [goalForAdvisor, setGoalForAdvisor] = useState<string>('');
  const [advisorResponse, setAdvisorResponse] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);

  const handleGetAdvice = async () => {
    if (!goalForAdvisor.trim()) {
      setAdvisorResponse("Please enter a goal for the NudgePathway.");
      return;
    }
    setIsLoadingAdvice(true);
    setAdvisorResponse(''); 
    
    // Conceptual Gemini API Call
    // In a real scenario, ensure process.env.API_KEY is configured.
    // For now, this is a placeholder.
    try {
      // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      // const prompt = `Given a NudgePathway named "${name}" with strategy "${activeShiftStrategy}", scale "${activeShiftScale}", current version "${currentVersion}", and ${shiftCount} shifts completed, provide advice on how to achieve the goal: "${goalForAdvisor}". Active Guiding Echos: ${activeEchoDisplay}. Consider suggesting changes to strategy, scale, or Guiding Echos if appropriate. Keep it concise.`;
      // const response = await ai.models.generateContent({
      //   model: 'gemini-2.5-flash-preview-04-17', 
      //   contents: prompt,
      // });
      // setAdvisorResponse(response.text);

      // Placeholder:
      console.log(`Conceptual Gemini Call for NudgePathway "${name}" with goal: "${goalForAdvisor}"`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      setAdvisorResponse(`Based on your goal "${goalForAdvisor}" for pathway "${name}", consider adjusting the Shift Scale to 'macro' if seeking broader changes, or 'micro' for finer tuning. If exploring new avenues, 'exploratory' strategy with diverse Guiding Echos might be beneficial. (Conceptual advice from NudgeKernel Advisor v1.0.0)`);

    } catch (error) {
      console.error("Error getting advice:", error);
      setAdvisorResponse("Error receiving advice. Please check console.");
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

      <section className="ui-section" aria-labelledby="pathway-shift-controls-title">
        <h3 id="pathway-shift-controls-title">DeltaShift Controls</h3>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <DeltaShiftControls
                isShiftActive={isShiftActive}
                onAdvanceOrInitiate={onAdvanceShift}
                onRevertToGenesis={onRevertShift}
                isInitiateDisabled={echoClusterConfig.ids.length === 0 && (activeShiftStrategy === 'standard_toggle' || activeShiftStrategy === 'standard_fusion' || activeShiftStrategy === 'adversarial_dynamics') && !isShiftActive}
            />
            <button onClick={onTakeSnapshot} className="secondary-action" aria-label="Take a snapshot of the current pathway state">
                Take Snapshot
            </button>
        </div>
      </section>

      {(activeShiftStrategy === 'standard_toggle' || activeShiftStrategy === 'standard_fusion') && echoClusterConfig.ids.length > 0 && (
        <section className="ui-section" aria-labelledby="pathway-echo-link-title">
          <h3 id="pathway-echo-link-title">Guiding Echo Link Logic</h3>
            {echoClusterConfig.linkMode === "toggle" && (
            <div className="echo-link-display">
              <p><strong>Toggle Link (Guiding Echos):</strong></p>
              {echoClusterConfig.ids.length === 1 && <p>Delta Phase N: {getGuidingEchoTitleById(echoClusterConfig.ids[0], PRIME_ECHO_BITS)}</p>}
              {echoClusterConfig.ids.length === 2 &&
                <>
                  <p>Phase Alpha (and odd): {getGuidingEchoTitleById(echoClusterConfig.ids[0], PRIME_ECHO_BITS)}</p>
                  <p>Phase Beta (and even): {getGuidingEchoTitleById(echoClusterConfig.ids[1], PRIME_ECHO_BITS)}</p>
                </>
              }
            </div>
          )}
          {echoClusterConfig.linkMode === "fusion" && (
             <div className="echo-link-display">
                <p><strong>Fusion Link (Guiding Echos):</strong></p>
                <p>Echos {echoClusterConfig.ids.map(id => getGuidingEchoTitleById(id, PRIME_ECHO_BITS)).join(' and ')} merge guidance for each DeltaShift phase where Echos operate.</p>
             </div>
          )}
        </section>
      )}

      <section className="ui-section" aria-labelledby="predictive-shift-advisor-title">
        <h3 id="predictive-shift-advisor-title">Predictive Shift Advisor (v1.0.0)</h3>
        <div className="form-group">
            <label htmlFor="advisorGoal">Define your goal for this pathway:</label>
            <textarea 
                id="advisorGoal"
                value={goalForAdvisor}
                onChange={(e) => setGoalForAdvisor(e.target.value)}
                rows={3}
                placeholder="e.g., Increase diversity of outcomes, refine solution for X, explore alternative approaches..."
                style={{width: '100%', padding: '8px', backgroundColor: '#202238', border: '1px solid var(--clr-border-main)', color: 'var(--clr-text-main)', borderRadius: '3px'}}
                aria-label="Goal for NudgePathway"
            />
        </div>
        <button onClick={handleGetAdvice} disabled={isLoadingAdvice}>
            {isLoadingAdvice ? "Getting Advice..." : "Get Advice"}
        </button>
        {advisorResponse && (
            <div className="echo-link-display" style={{marginTop: '15px', whiteSpace: 'pre-wrap'}}>
                <strong>Advisor's Response:</strong>
                <p>{advisorResponse}</p>
            </div>
        )}
      </section>

      <section className="ui-section" aria-labelledby="pathway-trace-log-title">
         <h3 id="pathway-trace-log-title">DeltaShift Trace Log (Interactive)</h3>
        <TraceLogViewer 
            entries={traceLog} 
            onAnnotateEntry={onAnnotateLogEntry}
        />
      </section>

      <style>{`
        .visually-hidden-label {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
};
