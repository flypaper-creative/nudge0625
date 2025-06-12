
// Modular Shard System Interface (Codename: QuantumLattice) v1.0.0
// File: src/ModularShardSystem.tsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import toast from 'react-hot-toast';
import { format } from 'date-fns';

import type {
  Shard,
  RootShardComplex,
  ShardCreationConfig,
  AppViewMode,
  // AuditLogEntry, // Not directly used in this component's state or props currently
  ShardDataType,
  // VersionEntry, // Used within Shard object
  VerificationDetails,
  // SourceDetail, // Used within VerificationDetails
  // ShardMetadata, // Used within Shard object
  // VerificationStatus, // Used within Shard object
  // VerificationMethod // Used within Shard object
} from './types';
import { SHARD_SYSTEM_BANNER, SHARD_ENGINE_VERSION, SHARD_UI_VERSION, CORE_PRINCIPLES_SHARD_SYSTEM } from './constants/shardSystemConfig';
import { findShardByPath, updateShardByPath, addNestedShardByPath, createVersion as createNewVersionEntry, deleteShardByPath } from './utils/shardUtils';

// Import extracted components
import { GlobalAppStyles } from './styles/GlobalAppStyles';
import { SystemConsoleDisplay } from './components/SystemConsoleDisplay';
import { ShardComplexExplorerDisplay } from './components/ShardComplexExplorerDisplay';
import { RootShardCreatorDisplay } from './components/RootShardCreatorDisplay';
import { ShardDetailEditorDisplay } from './components/ShardDetailEditorDisplay';


// --- Main ModularShardSystem Component ---
const ModularShardSystem: React.FC = () => {
  const [rootShards, setRootShards] = useState<RootShardComplex[]>([]);
  const [activeShardPath, setActiveShardPath] = useState<string>('');
  
  const [currentAppView, setCurrentAppView] = useState<AppViewMode>('system_console');
  const [systemMessages, setSystemMessages] = useState<string[]>([]);
  
  const [aiInstance, setAiInstance] = useState<GoogleGenAI | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<string>("Initializing QuantumLattice AI Core...");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.API_KEY) {
      try {
        const newAiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
        setAiInstance(newAiInstance);
        const onlineMsg = "QuantumLattice AI Core Online. Gemini Synced & Verified.";
        setApiKeyStatus(onlineMsg);
        logSystemMessage(onlineMsg);
        toast.success("AI Core Initialized!", {id: "aiInitSuccess"});
      } catch (error) {
        console.error("ModularShardSystem: Failed to initialize GoogleGenAI:", error);
        const errorMsg = `AI Core Error: ${error instanceof Error ? error.message : String(error)}`;
        setApiKeyStatus(errorMsg);
        logSystemMessage(`${errorMsg}. Advanced AI features disabled.`);
        setAiInstance(null);
        toast.error("AI Core Initialization Failed.", {id: "aiInitFail"});
      }
    } else {
      console.warn("ModularShardSystem: API_KEY environment variable not set. AI Core constrained.");
      const offlineMsg = "API Key Missing. AI Core Offline. Advanced AI features limited.";
      setApiKeyStatus(offlineMsg);
      logSystemMessage(offlineMsg);
      setAiInstance(null);
      toast.error("API Key for AI not found.", {id: "aiApiKeyMissing"});
    }
  }, []); // Empty dependency array means this runs once on mount

  const logSystemMessage = useCallback((message: string, type: 'info' | 'error' | 'success' = 'info') => {
    const formattedMessage = `${format(new Date(), 'HH:mm:ss')}: ${message}`;
    setSystemMessages(prev => [formattedMessage, ...prev.slice(0, 49)]); // Keep last 50
    console.log(`System Log (${type}): ${message}`);
    if (type === 'error') toast.error(message, {id: `sysError-${Date.now()}`});
    // else if (type === 'success') toast.success(message); // Optional: toast for system success logs
  },[]);
  
  const createNewShardObject = (config: ShardCreationConfig, idToUse?: string): Shard => {
    const now = new Date().toISOString();
    const shardId = idToUse || `SHD-${crypto.randomUUID()}`;
    
    const initialVersion = createNewVersionEntry(
        null,
        config.initialData,
        "user_creation",
        "Initial shard creation.",
        config.initialVerification
    );

    return {
      shardId,
      shardName: config.shardName,
      shardType: config.shardType,
      isAtomic: config.isAtomic !== undefined ? config.isAtomic : true,
      data: config.initialData,
      metadata: {
        versionHistory: [initialVersion],
        currentVerification: { ...initialVersion.verificationDetails },
        tags: config.tags || [],
        customProperties: config.customProperties || {},
        accessControls: [],
        linkedShardIds: [],
        processingLog: [{
            id: crypto.randomUUID(), timestamp: now, actor: "system",
            action: "Shard Created", details: `Shard "${config.shardName}" initialized.`, status: 'success', targetShardId: shardId
        }]
      },
      nestedShards: [],
      createdAt: now,
      updatedAt: now,
    };
  };

  const handleCreateRootShard = (config: ShardCreationConfig) => {
    const newRootShard = createNewShardObject(config);
    setRootShards(prev => [...prev, newRootShard]);
    const successMsg = `New Root Shard Complex "${config.shardName}" created with ID ${newRootShard.shardId}.`;
    logSystemMessage(successMsg, 'success');
    toast.success(`Root Shard "${config.shardName}" created!`);
    setCurrentAppView('shard_complex_explorer');
    setActiveShardPath(newRootShard.shardId);
  };

  const handleSelectShard = (shardId: string, path: string) => {
    setActiveShardPath(path);
    setCurrentAppView('shard_detail_editor');
    const shard = findShardByPath(rootShards, path);
    logSystemMessage(`Selected shard: ${shard?.shardName || shardId} at path: ${path}`);
  };

  const handleDeleteShardFromExplorer = (shardId: string, path: string) => {
    const shardToDelete = findShardByPath(rootShards, path);
    if (!shardToDelete) {
      logSystemMessage(`Error: Could not find shard "${shardId}" at path "${path}" for deletion.`, 'error');
      toast.error(`Shard not found for deletion.`);
      return;
    }
    setRootShards(prev => deleteShardByPath(prev, path));
    const successMsg = `Deleted shard "${shardToDelete.shardName}" and its children from path "${path}".`;
    logSystemMessage(successMsg, 'success');
    toast.success(`Shard "${shardToDelete.shardName}" deleted.`);
    if (activeShardPath && activeShardPath.startsWith(path)) {
        setActiveShardPath('');
        setCurrentAppView('shard_complex_explorer');
    }
  };

  const handleUpdateShardData = (shardIdToUpdate: string, pathToShard: string, newData: ShardDataType, changesSummary: string) => {
    setRootShards(prevRootShards => 
      updateShardByPath(prevRootShards, pathToShard, (shard) => {
        const lastVersion = shard.metadata.versionHistory[shard.metadata.versionHistory.length - 1];
        const newVersionEntry = createNewVersionEntry(
            lastVersion,
            newData,
            "user_edit",
            changesSummary || "Data updated via UI.",
            { status: 'unverified', method: 'not_applicable', sources: [], notes: 'Data changed, re-verification required.'}
        );
        
        return {
          ...shard,
          data: newData,
          metadata: {
            ...shard.metadata,
            versionHistory: [...shard.metadata.versionHistory, newVersionEntry],
            currentVerification: { ...newVersionEntry.verificationDetails },
            processingLog: [
                ...(shard.metadata.processingLog || []),
                { id: crypto.randomUUID(), timestamp: new Date().toISOString(), actor: "user", action: "Shard Data Updated", details: `Version ${newVersionEntry.versionId}. ${changesSummary}`, status: 'success', targetShardId: shard.shardId }
            ]
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
    const msg = `Data updated for shard ${shardIdToUpdate} at path ${pathToShard}. New version created.`;
    logSystemMessage(msg, 'success');
    toast.success("Shard data updated and versioned!");
  };
  
  const handleUpdateShardVerification = (shardIdToUpdate: string, pathToShard: string, newVerification: VerificationDetails) => {
     setRootShards(prevRootShards => 
      updateShardByPath(prevRootShards, pathToShard, (shard) => {
        const now = new Date().toISOString();
        const currentVersionIndex = shard.metadata.versionHistory.length - 1;
        const updatedVersionHistory = [...shard.metadata.versionHistory];
        
        if (currentVersionIndex >= 0) { // Ensure there is a version to update
            updatedVersionHistory[currentVersionIndex] = {
                ...updatedVersionHistory[currentVersionIndex],
                verificationDetails: newVerification,
            };
        }
        
        return {
          ...shard,
          metadata: {
            ...shard.metadata,
            versionHistory: updatedVersionHistory,
            currentVerification: newVerification,
            processingLog: [
                ...(shard.metadata.processingLog || []),
                { id: crypto.randomUUID(), timestamp: now, actor: "user", action: "Shard Verification Updated", details: `Status: ${newVerification.status}, Method: ${newVerification.method}, Sources: ${newVerification.sources.length}`, status: 'success', targetShardId: shard.shardId }
            ]
          },
          updatedAt: now,
        };
      })
    );
    const msg = `Verification updated for shard ${shardIdToUpdate}. Status: ${newVerification.status}.`;
    logSystemMessage(msg, 'success');
    toast.success("Shard verification updated!");
  };

  const handleAddNestedShard = (parentId: string, parentPath: string, config: ShardCreationConfig) => {
    const newNestedShard = createNewShardObject(config);
    setRootShards(prevRootShards => 
      addNestedShardByPath(prevRootShards, parentPath, newNestedShard)
    );
    const msg = `New nested shard "${config.shardName}" added to parent ${parentId} at path ${parentPath}/${newNestedShard.shardId}.`;
    logSystemMessage(msg, 'success');
    toast.success(`Nested shard "${config.shardName}" added!`);
    setActiveShardPath(`${parentPath}/${newNestedShard.shardId}`);
    setCurrentAppView('shard_detail_editor');
  };

  const handleProcessShardWithAI = async (shardIdForAI: string, pathForAI: string, userPrompt: string) => {
    if (!aiInstance) {
      logSystemMessage("AI Core offline. Cannot process shard with AI.", 'error');
      toast.error("AI is not available. Please check API Key configuration.");
      return;
    }
    const targetShard = findShardByPath(rootShards, pathForAI);
    if (!targetShard) {
      logSystemMessage(`AI Processing Error: Shard not found at path ${pathForAI}`, 'error');
      toast.error("Target shard for AI processing not found.");
      return;
    }

    setIsLoadingAI(true);
    const processToastId = toast.loading(`AI processing for shard "${targetShard.shardName}"...`);
    logSystemMessage(`Sending data from shard "${targetShard.shardName}" to AI with prompt: "${userPrompt.substring(0,50)}..."`);

    const geminiPrompt = `Context: You are an AI assistant helping to manage data within a "Shard" of a modular system.
Shard Name: "${targetShard.shardName}"
Shard Type: "${targetShard.shardType}"
Current Shard Data (JSON format, or text if not parsable as JSON):
\`\`\`
${typeof targetShard.data === 'string' ? targetShard.data : JSON.stringify(targetShard.data, null, 2)}
\`\`\`
User Request: "${userPrompt}"

Based on the user request, transform or generate new data for this shard. Output ONLY the new data. If the current data is JSON, try to maintain JSON format. If the user asks for analysis or a summary not resulting in new data, provide that analysis as plain text.`;

    try {
      const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: geminiPrompt,
        config: { temperature: 0.5 }
      });
      let aiResponseText = response.text.trim();
      logSystemMessage(`AI Response Received for shard "${targetShard.shardName}": ${aiResponseText.substring(0,100)}...`);
      
      let newShardData;
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = aiResponseText.match(fenceRegex);
      if (match && match[2]) {
        aiResponseText = match[2].trim();
      }
      
      try {
        newShardData = JSON.parse(aiResponseText);
      } catch (parseError) {
        newShardData = aiResponseText;
      }
      handleUpdateShardData(targetShard.shardId, pathForAI, newShardData, `AI Modified: ${userPrompt.substring(0, 50)}...`);
      toast.success(`AI successfully processed shard "${targetShard.shardName}"!`, { id: processToastId });

    } catch (error) {
      console.error("AI processing error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      logSystemMessage(`AI Processing Error for shard "${targetShard.shardName}": ${errorMessage}`, 'error');
      toast.error(`AI Processing Error: ${errorMessage}`, { id: processToastId });
      handleUpdateShardData(targetShard.shardId, pathForAI, { ...targetShard.data, ai_error_log: `Error processing prompt "${userPrompt.substring(0,50)}...": ${errorMessage}` }, `AI Processing Error Logged`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const activeShard = useMemo(() => {
    if (!activeShardPath) return null;
    return findShardByPath(rootShards, activeShardPath);
  }, [rootShards, activeShardPath]);

  const renderCurrentView = () => {
    switch (currentAppView) {
      case 'root_shard_creator':
        return <RootShardCreatorDisplay onSubmit={handleCreateRootShard} onCancel={() => setCurrentAppView('system_console')} />;
      case 'shard_detail_editor':
      case 'shard_complex_explorer': // Explorer view now defaults to showing editor for selected/first shard or empty state.
        return <ShardDetailEditorDisplay
                  shard={activeShard} // activeShard is derived from activeShardPath
                  path={activeShardPath}
                  onUpdateShardData={handleUpdateShardData}
                  onAddNestedShard={handleAddNestedShard}
                  onUpdateVerification={handleUpdateShardVerification}
                  aiInstance={aiInstance}
                  onProcessWithAI={handleProcessShardWithAI}
                  isLoadingAI={isLoadingAI}
                />;
      case 'system_console':
      default:
        return <SystemConsoleDisplay messages={systemMessages} apiKeyStatus={apiKeyStatus} corePrinciples={CORE_PRINCIPLES_SHARD_SYSTEM} />;
    }
  };

  return (
    <>
      <GlobalAppStyles />
      <div className="modular-shard-system-interface">
        <header className="ql-header">
          <h1>{SHARD_SYSTEM_BANNER}</h1>
          <nav>
            <button onClick={() => setCurrentAppView('system_console')} disabled={currentAppView === 'system_console'}>Console</button>
            <button 
              onClick={() => { 
                setCurrentAppView('shard_complex_explorer'); 
                if (!activeShardPath && rootShards.length > 0) {
                  // If no shard is active when switching to explorer, select the first root shard
                  setActiveShardPath(rootShards[0].shardId);
                } else if (!activeShardPath && rootShards.length === 0) {
                  // If no shards exist, explorer view will show editor with "no shard selected"
                  setActiveShardPath('');
                }
              }} 
              disabled={currentAppView === 'shard_complex_explorer'}
            >
              Explorer
            </button>
          </nav>
        </header>
        <main className="ql-main-workspace">
          <ShardComplexExplorerDisplay
            rootShards={rootShards}
            onSelectShard={handleSelectShard}
            onCreateRootShardRequest={() => setCurrentAppView('root_shard_creator')}
            onDeleteShard={handleDeleteShardFromExplorer}
            activeShardPath={activeShardPath}
          />
          <section className="ql-main-content-area" role="main" aria-live="polite">
            {isLoadingAI && <div className="ql-ai-loading-indicator" role="status">QuantumLattice AI Processing...</div>}
            {renderCurrentView()}
          </section>
        </main>
        <footer className="ql-footer">
          <p>Modular Shard System (QuantumLattice) UI v{SHARD_UI_VERSION} | Engine v{SHARD_ENGINE_VERSION} | AI Status: {apiKeyStatus}</p>
        </footer>
      </div>
    </>
  );
};

export default ModularShardSystem;
