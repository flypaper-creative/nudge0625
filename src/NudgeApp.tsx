
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ClarityWaveFX } from './styles/ClarityStyles'; // Assuming this provides global styles
import { NudgePathwayDeck } from './components/NudgePathwayDeck';
import { PathwayConfigurator } from './components/PathwayConfigurator';
import { ActivePathwayMonitor } from './components/ActivePathwayMonitor';
import { KernelConsole }  from './components/KernelConsole';
import { EchoBitGenesisChamber } from './constants/EchoBitGenesisChamber'; 
import { EchoBitDatabaseViewer } from './components/EchoBitDatabaseViewer';
import { PathwaySnapshotViewer } from './components/PathwaySnapshotViewer';

import type { 
  NudgePathwayRecord, 
  NudgePathwayBlueprint, 
  EchoBit, 
  AppView, 
  PathwaySnapshot, 
  CurriculumProgress, 
  GeneratedOutputLogEntry, 
  TraceLogEntry, 
  GuidingEchoAttributes, 
  DeltaShiftState,
  IterationCurriculum,
  IterationStep,
  EchoLinkMode, // Added
  ShiftStrategy, // Added
  ShiftScale // Added
} from './types';
import { 
  initDeltaShiftState, 
  advanceDeltaPhase as advanceStandardDeltaPhase, 
  revertDeltaShiftToGenesis 
} from './utils/deltaShiftUtils'; // Assuming these are correctly exported from the (potentially incomplete) file
import { 
  NUDGE_KERNEL_BANNER, 
  NUDGE_KERNEL_VERSION, 
  UI_VERSION, 
  PRIME_ECHO_BITS 
} from './constants/kernelAppData'; 
import { ITERATION_CURRICULUMS } from './constants/iterationCurriculums';
import { getGuidingEchoTitleById } from './utils/guidingEchoUtils';


const NudgeApp: React.FC = () => {
  const [nudgePathways, setNudgePathways] = useState<NudgePathwayRecord[]>([]);
  const [activePathwayId, setActivePathwayId] = useState<string | null>(null);
  const [isConfiguringPathway, setIsConfiguringPathway] = useState<boolean>(false);
  const [customEchoBits, setCustomEchoBits] = useState<EchoBit<any>[]>([]);
  const [currentAppView, setCurrentAppView] = useState<AppView>('main');
  const [aiInstance, setAiInstance] = useState<GoogleGenAI | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<string>("Initializing NudgeKernel AI...");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  const allEchoBits = useMemo(() => [...PRIME_ECHO_BITS, ...customEchoBits], [customEchoBits]);
  const allGuidingEchoBits = useMemo(
    () => allEchoBits.filter((bit): bit is EchoBit<GuidingEchoAttributes> => bit.type === 'guiding_echo'),
    [allEchoBits]
  );

  useEffect(() => {
    if (process.env.API_KEY) {
      try {
        const newAiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
        setAiInstance(newAiInstance);
        setApiKeyStatus("NudgeKernel AI Online. Gemini Synced.");
        console.info("NudgeApp: GoogleGenAI initialized successfully for NudgeKernel.");
      } catch (error) {
        console.error("NudgeApp: Failed to initialize GoogleGenAI:", error);
        setApiKeyStatus(`NudgeKernel AI Error: ${error instanceof Error ? error.message : String(error)}`);
        setAiInstance(null);
      }
    } else {
      console.warn("NudgeApp: API_KEY environment variable not set. NudgeKernel's advanced AI capabilities will be constrained.");
      setApiKeyStatus("API Key Missing. NudgeKernel AI Offline. Predictive features limited.");
      setAiInstance(null);
    }
  }, []);

  const logDeltaEvent = useCallback((pathwayId: string, text: string, type: TraceLogEntry['type'] = 'info', annotation?: string) => {
    const entry: TraceLogEntry = { id: crypto.randomUUID(), text, type, annotation, timestamp: new Date().toISOString() };
    setNudgePathways(prev => prev.map(p => p.id === pathwayId ? {
      ...p,
      currentDeltaShiftState: {
        ...p.currentDeltaShiftState,
        traceLog: [...p.currentDeltaShiftState.traceLog, entry]
      }
    } : p));
  }, []);

  const handleNewPathwayRequest = () => {
    setActivePathwayId(null);
    setIsConfiguringPathway(true);
    setCurrentAppView('configurator');
  };

  const handleSelectPathway = (pathwayId: string) => {
    setIsConfiguringPathway(false);
    setActivePathwayId(pathwayId);
    setCurrentAppView('monitor');
  };
  
  const handleCommitBlueprint = (blueprint: NudgePathwayBlueprint) => {
    const initialDeltaState = initDeltaShiftState(
      blueprint.guidingEchoBitIds,
      blueprint.echoLinkMode,
      blueprint.shiftStrategy,
      blueprint.shiftScale
    );
    
    let initialCurriculumProgress: CurriculumProgress | undefined = undefined;
    if (blueprint.activeCurriculumId) {
      const curriculum = ITERATION_CURRICULUMS.find(c => c.id === blueprint.activeCurriculumId);
      initialCurriculumProgress = {
        currentStepIndex: 0,
        currentIterationInStep: 0,
        isComplete: false,
        statusMessage: `Curriculum "${curriculum?.name || 'Unknown'}" activated.`
      };
      initialDeltaState.traceLog.push({
        id: crypto.randomUUID(), timestamp: new Date().toISOString(),
        text: `Curriculum Activated: "${curriculum?.name || 'Unknown'}" - Base Prompt: "${blueprint.basePromptForCurriculum || curriculum?.basePrompt || 'Not set'}"`,
        type: 'curriculum-log'
      });
    }

    const newPathway: NudgePathwayRecord = {
      id: `NP-${Date.now()}`,
      name: blueprint.name,
      blueprint: blueprint, // Store the blueprint
      echoClusterConfig: { ids: blueprint.guidingEchoBitIds, linkMode: blueprint.echoLinkMode },
      deltaShiftConfig: { strategy: blueprint.shiftStrategy, scale: blueprint.shiftScale },
      currentDeltaShiftState: initialDeltaState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      snapshots: [],
      activeCurriculumId: blueprint.activeCurriculumId,
      basePromptForCurriculum: blueprint.basePromptForCurriculum,
      curriculumProgress: initialCurriculumProgress,
      generatedOutputs: [],
    };
    setNudgePathways(prev => [...prev, newPathway]);
    setActivePathwayId(newPathway.id);
    setIsConfiguringPathway(false);
    setCurrentAppView('monitor');
  };
  
  const handleDeletePathway = useCallback((pathwayIdToDelete: string) => {
    setNudgePathways(prev => prev.filter(p => p.id !== pathwayIdToDelete));
    if (activePathwayId === pathwayIdToDelete) {
      setActivePathwayId(null);
      setIsConfiguringPathway(false);
      setCurrentAppView('main');
    }
  }, [activePathwayId]);

  const handleAddCustomEchoBit = (newEchoBit: EchoBit<any>) => {
    setCustomEchoBits(prev => [...prev, newEchoBit]);
    setCurrentAppView('echobit_database'); // Navigate to viewer after creation
  };

  const handleTakeSnapshot = useCallback((pathwayId: string) => {
    setNudgePathways(prevPathways =>
      prevPathways.map(p => {
        if (p.id === pathwayId) {
          const newSnapshot: PathwaySnapshot = {
            id: `SNAP-${p.id}-${Date.now()}`,
            pathwayId: p.id,
            timestamp: new Date().toISOString(),
            pathwayName: p.name,
            deltaShiftConfig: { ...p.deltaShiftConfig },
            echoClusterConfig: { ...p.echoClusterConfig },
            currentDeltaShiftStateValues: { // Deep copy relevant state values
                currentVersion: p.currentDeltaShiftState.currentVersion,
                shiftCount: p.currentDeltaShiftState.shiftCount,
                activeEchoDisplay: p.currentDeltaShiftState.activeEchoDisplay,
                traceLog: [...p.currentDeltaShiftState.traceLog], // Deep copy log
            },
            activeCurriculumId: p.activeCurriculumId,
            curriculumProgress: p.curriculumProgress ? { ...p.curriculumProgress } : undefined,
            generatedOutputsSnapshot: p.generatedOutputs ? [...p.generatedOutputs] : [],
            kernelVersion: NUDGE_KERNEL_VERSION,
            uiVersion: UI_VERSION,
          };
          logDeltaEvent(pathwayId, `Snapshot taken: ${newSnapshot.id}`, 'info');
          return { ...p, snapshots: [...p.snapshots, newSnapshot] };
        }
        return p;
      })
    );
  }, [logDeltaEvent]);

  const processSimulatedAIForCurriculumStep = async (
    pathway: NudgePathwayRecord,
    curriculum: IterationCurriculum,
    step: IterationStep,
    stepIndex: number,
    iteration: number
  ): Promise<{ content: string; traceEntries: TraceLogEntry[] }> => {
    const traceEntries: TraceLogEntry[] = [];
    let generatedContent = `AI Generated Content for: ${curriculum.name} - Step ${stepIndex + 1}: "${step.stepName}" (Iteration ${iteration + 1})`;

    if (!aiInstance) {
      traceEntries.push({
        id: crypto.randomUUID(), timestamp: new Date().toISOString(),
        text: `AI Content Generation SKIPPED for Step "${step.stepName}": NudgeKernel AI Offline. Using placeholder.`,
        type: 'error'
      });
      return { content: `${generatedContent}\n\n[Placeholder - AI Offline]`, traceEntries };
    }

    setIsLoadingAI(true);
    const basePrompt = pathway.basePromptForCurriculum || curriculum.basePrompt || "Perform the following task.";
    const stepInstruction = step.instruction;
    const guidingEcho = step.guidingEchoBitId ? allGuidingEchoBits.find(eb => eb.echo_bit_id === step.guidingEchoBitId) : null;
    
    const prompt = `NudgeKernel AI Task for Pathway "${pathway.name}":
Curriculum: "${curriculum.name}"
Current Step (${stepIndex + 1}/${curriculum.steps.length}): "${step.stepName}" (Iteration ${iteration + 1}/${step.iterations})
Base Prompt/Goal for Curriculum: "${basePrompt}"
Specific Instruction for this Step: "${stepInstruction}"
${guidingEcho ? `Consider the principles of Guiding Echo: "${guidingEcho.attributes.title}" - ${guidingEcho.attributes.description}.` : ''}
PREVIOUSLY GENERATED OUTPUTS (last 2 for context, if any):
${pathway.generatedOutputs.slice(-2).map(o => `- ${o.path}: ${o.contentPreview?.substring(0,100) || 'N/A'}`).join('\n') || 'No previous outputs in this pathway.'}

Generate the content as requested by the step instruction. Be concise and directly address the task.`;

    try {
      traceEntries.push({
        id: crypto.randomUUID(), timestamp: new Date().toISOString(),
        text: `AI Task Sent to Gemini for Step "${step.stepName}": ${prompt.substring(0,150)}...`,
        type: 'curriculum-log'
      });
      const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: { temperature: 0.6, topK: 40 }
      });
      generatedContent = response.text;
      traceEntries.push({
        id: crypto.randomUUID(), timestamp: new Date().toISOString(),
        text: `AI Content Received for Step "${step.stepName}": ${generatedContent.substring(0, 100)}...`,
        type: 'curriculum-log'
      });
    } catch (error) {
      console.error("Error during AI content generation for curriculum:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      generatedContent += `\n\n[AI Generation Error: ${errorMessage}]`;
      traceEntries.push({
        id: crypto.randomUUID(), timestamp: new Date().toISOString(),
        text: `AI Content Generation FAILED for Step "${step.stepName}": ${errorMessage}. Using placeholder.`,
        type: 'error'
      });
    } finally {
      setIsLoadingAI(false);
    }
    return { content: generatedContent, traceEntries };
  };

  const handleAdvanceDeltaPhase = useCallback(async (pathwayId: string) => {
    let pathway = nudgePathways.find(p => p.id === pathwayId);
    if (!pathway) return;

    let { newDeltaState, newTraceEntries } = { newDeltaState: {} as Partial<DeltaShiftState>, newTraceEntries: [] as TraceLogEntry[] };
    let updatedGeneratedOutputs = [...pathway.generatedOutputs];
    let updatedCurriculumProgress = pathway.curriculumProgress ? { ...pathway.curriculumProgress } : undefined;

    const curriculum = pathway.activeCurriculumId ? ITERATION_CURRICULUMS.find(c => c.id === pathway.activeCurriculumId) : undefined;

    if (curriculum && updatedCurriculumProgress && !updatedCurriculumProgress.isComplete) {
      const currentStepConfig = curriculum.steps[updatedCurriculumProgress.currentStepIndex];
      
      const { content: aiContent, traceEntries: aiTraceEntries } = await processSimulatedAIForCurriculumStep(
        pathway, curriculum, currentStepConfig, updatedCurriculumProgress.currentStepIndex, updatedCurriculumProgress.currentIterationInStep
      );
      newTraceEntries.push(...aiTraceEntries);

      const outputFileName = currentStepConfig.outputFileNameTemplate 
          ? currentStepConfig.outputFileNameTemplate.replace('##', String(updatedCurriculumProgress.currentIterationInStep + 1).padStart(2, '0'))
          : `curriculum_output_s${updatedCurriculumProgress.currentStepIndex+1}_i${updatedCurriculumProgress.currentIterationInStep+1}.txt`;
      
      const outputEntry: GeneratedOutputLogEntry = {
        id: crypto.randomUUID(),
        pathwayId: pathway.id,
        curriculumStepName: currentStepConfig.stepName,
        path: outputFileName,
        contentPreview: aiContent.substring(0, 200) + (aiContent.length > 200 ? "..." : ""),
        timestamp: new Date().toISOString(),
        // fullContent: aiContent // Store full content if needed, be mindful of state size
      };
      updatedGeneratedOutputs.push(outputEntry);
      newTraceEntries.push({
          id: crypto.randomUUID(), timestamp: new Date().toISOString(),
          text: `Output Generated (Simulated): ${outputFileName}. Preview: ${outputEntry.contentPreview}`, type: 'data-ops'
      });

      // Advance curriculum progress
      updatedCurriculumProgress.currentIterationInStep++;
      if (updatedCurriculumProgress.currentIterationInStep >= currentStepConfig.iterations) {
        updatedCurriculumProgress.currentIterationInStep = 0;
        updatedCurriculumProgress.currentStepIndex++;
        if (updatedCurriculumProgress.currentStepIndex >= curriculum.steps.length) {
          updatedCurriculumProgress.isComplete = true;
          updatedCurriculumProgress.statusMessage = "Curriculum completed successfully!";
          newTraceEntries.push({id: crypto.randomUUID(), timestamp: new Date().toISOString(), text: `Curriculum "${curriculum.name}" COMPLETED.`, type: 'curriculum-log'});
        } else {
           const nextStep = curriculum.steps[updatedCurriculumProgress.currentStepIndex];
           updatedCurriculumProgress.statusMessage = `Advanced to Step ${updatedCurriculumProgress.currentStepIndex + 1}: "${nextStep.stepName}".`;
           newTraceEntries.push({id: crypto.randomUUID(), timestamp: new Date().toISOString(), text: updatedCurriculumProgress.statusMessage, type: 'curriculum-log'});
        }
      } else {
        updatedCurriculumProgress.statusMessage = `Step ${updatedCurriculumProgress.currentStepIndex + 1} ("${currentStepConfig.stepName}"): Iteration ${updatedCurriculumProgress.currentIterationInStep + 1}/${currentStepConfig.iterations}.`;
         newTraceEntries.push({id: crypto.randomUUID(), timestamp: new Date().toISOString(), text: updatedCurriculumProgress.statusMessage, type: 'curriculum-log'});
      }
       // Use standard advance for versioning and basic state update, but echo display might be curriculum-driven
      const standardAdvanceResult = advanceStandardDeltaPhase(
        pathway.currentDeltaShiftState,
        pathway.echoClusterConfig,
        pathway.deltaShiftConfig.strategy, // Use pathway's base strategy/scale
        pathway.deltaShiftConfig.scale
      );
      newDeltaState = { ...standardAdvanceResult.newDeltaState };
      newTraceEntries.push(...standardAdvanceResult.newTraceEntries.filter(t => !t.text.includes("Active Guiding Echo(s):"))); // Avoid duplicate echo log

      // Override activeEchoDisplay if curriculum step defines one
      const stepGuidingEchoId = currentStepConfig.guidingEchoBitId;
      if (stepGuidingEchoId) {
        newDeltaState.activeEchoDisplay = getGuidingEchoTitleById(stepGuidingEchoId, allGuidingEchoBits) + " (Curriculum Step)";
      } else if (pathway.blueprint.guidingEchoBitIds.length > 0) {
         // Fallback to default blueprint echos if curriculum step doesn't specify
         newDeltaState.activeEchoDisplay = pathway.blueprint.guidingEchoBitIds.map(id => getGuidingEchoTitleById(id, allGuidingEchoBits)).join(' + ') + ` (${pathway.blueprint.echoLinkMode})`;
      } else {
        newDeltaState.activeEchoDisplay = "NudgeKernel System (Curriculum Guided)";
      }
       newTraceEntries.push({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), text: `Active Guidance: ${newDeltaState.activeEchoDisplay}`, type: 'echo-log' });


    } else { // No active curriculum or curriculum complete, use standard advance
      const standardAdvanceResult = advanceStandardDeltaPhase(
        pathway.currentDeltaShiftState,
        pathway.echoClusterConfig,
        pathway.deltaShiftConfig.strategy,
        pathway.deltaShiftConfig.scale
      );
      newDeltaState = standardAdvanceResult.newDeltaState;
      newTraceEntries.push(...standardAdvanceResult.newTraceEntries);
    }
    
    setNudgePathways(prev => prev.map(p => p.id === pathwayId ? {
      ...p,
      currentDeltaShiftState: {
        ...p.currentDeltaShiftState,
        ...newDeltaState,
        traceLog: [...p.currentDeltaShiftState.traceLog, ...newTraceEntries]
      },
      curriculumProgress: updatedCurriculumProgress,
      generatedOutputs: updatedGeneratedOutputs,
      updatedAt: new Date().toISOString()
    } : p));

  }, [nudgePathways, aiInstance, logDeltaEvent, allGuidingEchoBits]);
  
  const handleRevertToGenesis = useCallback((pathwayId: string) => {
      setNudgePathways(prevPathways => 
          prevPathways.map(p => {
              if (p.id === pathwayId) {
                  const { genesisDeltaState, traceEntry } = revertDeltaShiftToGenesis(p.blueprint);
                  // Reset curriculum progress as well
                  let resetCurriculumProgress: CurriculumProgress | undefined = undefined;
                  if (p.blueprint.activeCurriculumId) {
                      const curriculum = ITERATION_CURRICULUMS.find(c => c.id === p.blueprint.activeCurriculumId);
                      resetCurriculumProgress = {
                          currentStepIndex: 0,
                          currentIterationInStep: 0,
                          isComplete: false,
                          statusMessage: `Curriculum "${curriculum?.name || 'Unknown'}" reset to beginning.`
                      };
                      genesisDeltaState.traceLog.push({
                          id: crypto.randomUUID(), timestamp: new Date().toISOString(),
                          text: resetCurriculumProgress.statusMessage, type: 'curriculum-log'
                      });
                  }
                  return {
                      ...p,
                      currentDeltaShiftState: genesisDeltaState,
                      curriculumProgress: resetCurriculumProgress,
                      generatedOutputs: [], // Clear generated outputs on revert
                      updatedAt: new Date().toISOString(),
                  };
              }
              return p;
          })
      );
  }, []);

  const handleAnnotateLogEntry = useCallback((pathwayId: string, logEntryId: string, annotation: string) => {
    setNudgePathways(prevPathways =>
      prevPathways.map(p => {
        if (p.id === pathwayId) {
          const existingEntryIndex = p.currentDeltaShiftState.traceLog.findIndex(entry => entry.id === logEntryId);
          if (existingEntryIndex > -1) {
            const updatedTraceLog = [...p.currentDeltaShiftState.traceLog];
            updatedTraceLog[existingEntryIndex] = { ...updatedTraceLog[existingEntryIndex], annotation };
            return {
              ...p,
              currentDeltaShiftState: {
                ...p.currentDeltaShiftState,
                traceLog: updatedTraceLog,
              },
            };
          } else { // If entry not found by ID, assume it's a new log text to add (like from advisor)
            const newLogEntry: TraceLogEntry = {
              id: logEntryId, // The passed ID is used (e.g. crypto.randomUUID() from advisor)
              text: annotation, // The "annotation" here is the full log text
              type: 'info', // Default type for new logs added this way
              timestamp: new Date().toISOString()
            };
            return {
              ...p,
              currentDeltaShiftState: {
                ...p.currentDeltaShiftState,
                traceLog: [...p.currentDeltaShiftState.traceLog, newLogEntry],
              },
            };
          }
        }
        return p;
      })
    );
  }, []);

  const handleForkPathway = useCallback((pathwayIdToFork: string) => {
    const parentPathway = nudgePathways.find(p => p.id === pathwayIdToFork);
    if (!parentPathway) return;

    const newForkedId = `NP-${Date.now()}-fork`;
    const forkedPathway: NudgePathwayRecord = {
      ...JSON.parse(JSON.stringify(parentPathway)), // Deep copy essential parts
      id: newForkedId,
      name: `${parentPathway.name} (Fork)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      snapshots: [], // Forks don't inherit snapshots directly but start fresh
      // Deep copy specific mutable states if JSON.parse/stringify isn't sufficient or desired
      currentDeltaShiftState: {
          ...parentPathway.currentDeltaShiftState,
          traceLog: [
              ...parentPathway.currentDeltaShiftState.traceLog,
              { id: crypto.randomUUID(), text: `Forked from NudgePathway ${parentPathway.id} ("${parentPathway.name}").`, type: 'info', timestamp: new Date().toISOString()}
          ]
      },
      curriculumProgress: parentPathway.curriculumProgress ? { ...parentPathway.curriculumProgress } : undefined,
      generatedOutputs: parentPathway.generatedOutputs ? [...parentPathway.generatedOutputs] : [], // Optionally copy generated outputs
    };

    setNudgePathways(prev => [...prev, forkedPathway]);
    logDeltaEvent(parentPathway.id, `Pathway forked into new Pathway ID: ${newForkedId} ("${forkedPathway.name}").`, 'info');
    handleSelectPathway(newForkedId); // Optionally select the new fork
  }, [nudgePathways, logDeltaEvent]);


  // Navigation
  const navigateToMainConsole = () => { setIsConfiguringPathway(false); setActivePathwayId(null); setCurrentAppView('main'); };
  const navigateToEchoBitForge = () => setCurrentAppView('echobit_forge');
  const navigateToEchoBitDatabase = () => setCurrentAppView('echobit_database');
  const navigateToSnapshotViewer = () => {
    if (activePathway) setCurrentAppView('snapshot_viewer');
    else alert("Please select an active NudgePathway to view its snapshots.");
  };

  const activePathway = useMemo(() => nudgePathways.find(p => p.id === activePathwayId), [nudgePathways, activePathwayId]);

  const renderView = () => {
    if (isConfiguringPathway || currentAppView === 'configurator') {
      return <PathwayConfigurator onCommitBlueprint={handleCommitBlueprint} onCancelConfiguration={navigateToMainConsole} />;
    }
    if (activePathway && currentAppView === 'monitor') {
      return (
        <ActivePathwayMonitor
          pathway={activePathway}
          onAdvanceShift={() => handleAdvanceDeltaPhase(activePathway.id)}
          onRevertShift={() => handleRevertToGenesis(activePathway.id)}
          onTakeSnapshot={() => handleTakeSnapshot(activePathway.id)}
          onAnnotateLogEntry={(logEntryId, annotation) => handleAnnotateLogEntry(activePathway.id, logEntryId, annotation)}
          aiInstance={aiInstance}
        />
      );
    }
     if (currentAppView === 'echobit_forge') {
      return <EchoBitGenesisChamber onSubmit={handleAddCustomEchoBit} />;
    }
    if (currentAppView === 'echobit_database') {
      return <EchoBitDatabaseViewer echoBits={allEchoBits} />;
    }
    if (currentAppView === 'snapshot_viewer' && activePathway) {
      return <PathwaySnapshotViewer snapshots={activePathway.snapshots} pathwayName={activePathway.name} />;
    }
    return <KernelConsole message={nudgePathways.length === 0 ? "No NudgePathways initiated. Click 'New Pathway' to begin." : undefined} />;
  };

  return (
    <>
      <ClarityWaveFX />
      <div className="kernel-superstructure">
        <header className="kernel-header">
          <h1>{NUDGE_KERNEL_BANNER}</h1>
          <nav className="kernel-navigation">
            <button onClick={navigateToMainConsole} className="nav-button" disabled={currentAppView === 'main' && !activePathwayId && !isConfiguringPathway}>Console</button>
            <button onClick={navigateToEchoBitForge} className="nav-button" disabled={currentAppView === 'echobit_forge'}>EchoBit Forge</button>
            <button onClick={navigateToEchoBitDatabase} className="nav-button" disabled={currentAppView === 'echobit_database'}>EchoBit Database</button>
            <button onClick={navigateToSnapshotViewer} className="nav-button" disabled={!activePathway || currentAppView === 'snapshot_viewer'}>Snapshot Viewer</button>
          </nav>
        </header>
        <main className="kernel-layout">
          <NudgePathwayDeck
            pathways={nudgePathways}
            activePathwayId={activePathwayId}
            onNewRequest={handleNewPathwayRequest}
            onSelectPathway={handleSelectPathway}
            onDeletePathway={handleDeletePathway}
            onForkPathway={handleForkPathway}
          />
          <section className="main-content-deck" role="region" aria-label="Main Content Area">
            {isLoadingAI && <div role="status" aria-live="polite" style={{position:'fixed', top: 'var(--header-height)', right: '20px', background: 'var(--clr-accent-secondary-pulsar)', color: 'var(--clr-text-primary-starlight)', padding: '10px 20px', borderRadius: 'var(--border-radius-medium)', zIndex: 2000 }}>NudgeKernel AI Processing...</div>}
            {renderView()}
          </section>
        </main>
        <footer className="kernel-footer">
          <p>NudgeKernel Interface v{UI_VERSION} | Engine v{NUDGE_KERNEL_VERSION} | API Status: {apiKeyStatus}</p>
        </footer>
      </div>
    </>
  );
};

export default NudgeApp;