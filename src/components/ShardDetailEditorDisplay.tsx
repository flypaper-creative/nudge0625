
// File: src/components/ShardDetailEditorDisplay.tsx
import React, { useState, useEffect } from 'react';
import type { Shard, ShardCreationConfig, ShardDataType, VerificationDetails, SourceDetail, VerificationStatus, VerificationMethod } from '../types';
import { GoogleGenAI } from "@google/genai";
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ShardDetailEditorDisplayProps {
  shard: Shard | null;
  path: string;
  onUpdateShardData: (shardId: string, path: string, newData: ShardDataType, changeSummary: string) => void;
  onAddNestedShard: (parentId: string, parentPath: string, config: ShardCreationConfig) => void;
  onUpdateVerification: (shardId: string, path: string, newVerification: VerificationDetails) => void;
  aiInstance: GoogleGenAI | null;
  onProcessWithAI: (shardId: string, path: string, prompt: string) => Promise<void>;
  isLoadingAI: boolean;
}

export const ShardDetailEditorDisplay: React.FC<ShardDetailEditorDisplayProps> = ({
  shard, path, onUpdateShardData, onAddNestedShard, onUpdateVerification, aiInstance, onProcessWithAI, isLoadingAI,
}) => {
  const [editData, setEditData] = useState('');
  const [changeSummary, setChangeSummary] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const [newNestedName, setNewNestedName] = useState('');
  const [newNestedType, setNewNestedType] = useState('generic_data_container');
  const [newNestedData, setNewNestedData] = useState('{}');
  const [newNestedVerificationNotes, setNewNestedVerificationNotes] = useState('');

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('not_applicable');
  const [newSourceDesc, setNewSourceDesc] = useState('');
  const [currentSources, setCurrentSources] = useState<SourceDetail[]>([]);

  useEffect(() => {
    if (shard) {
      setEditData(typeof shard.data === 'string' ? shard.data : JSON.stringify(shard.data, null, 2));
      setChangeSummary('');
      setAiPrompt('');
      setVerificationStatus(shard.metadata.currentVerification.status);
      setVerificationMethod(shard.metadata.currentVerification.method);
      setCurrentSources([...shard.metadata.currentVerification.sources]);
    } else {
      // Reset fields if no shard is selected
      setEditData('');
      setChangeSummary('');
      setAiPrompt('');
      setVerificationStatus('unverified');
      setVerificationMethod('not_applicable');
      setCurrentSources([]);
    }
  }, [shard]);

  if (!shard) {
    return (
      <div className="shard-editor-panel ui-panel">
        <p className="empty-message">No shard selected{path ? ` at path "${path}"` : ""}, or shard not found. Please select a shard from the explorer or create a new one.</p>
      </div>
    );
  }

  const handleDataSave = () => {
    let parsedData: ShardDataType;
    try {
      parsedData = JSON.parse(editData);
    } catch (e) {
      parsedData = editData; // Keep as string if JSON parse fails
    }
    onUpdateShardData(shard.shardId, path, parsedData, changeSummary || "Data updated via UI.");
    setChangeSummary(''); // Clear summary after save
  };

  const handleAddSource = () => {
    if (!newSourceDesc.trim()) {
      toast.error("Source description cannot be empty.");
      return;
    }
    setCurrentSources(prev => [...prev, { sourceId: crypto.randomUUID(), description: newSourceDesc, type: 'user_attestation' }]);
    setNewSourceDesc('');
  };

  const handleRemoveSource = (sourceIdToRemove: string) => {
    setCurrentSources(prev => prev.filter(s => s.sourceId !== sourceIdToRemove));
  };

  const handleVerificationUpdate = () => {
    onUpdateVerification(shard.shardId, path, {
      status: verificationStatus,
      method: verificationMethod,
      sources: currentSources,
      notes: shard.metadata.currentVerification.notes, // TODO: Add UI for editing notes
      verifiedBy: "user_ui_update",
      verificationTimestamp: new Date().toISOString(),
    });
  };

  const handleCreateNestedShard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNestedName.trim()) {
      toast.error("Nested Shard Name is required.");
      return;
    }
    let parsedNestedData: ShardDataType;
    try {
      parsedNestedData = JSON.parse(newNestedData);
    } catch {
      parsedNestedData = newNestedData;
    }

    const nestedConfig: ShardCreationConfig = {
      shardName: newNestedName,
      shardType: newNestedType,
      initialData: parsedNestedData,
      isAtomic: true,
      initialVerification: {
        status: 'user_verified', method: 'user_attestation',
        sources: [{ sourceId: crypto.randomUUID(), description: newNestedVerificationNotes || 'Nested shard created via UI', type: 'user_attestation' }],
        notes: newNestedVerificationNotes || 'Nested shard created.'
      }
    };
    onAddNestedShard(shard.shardId, path, nestedConfig);
    setNewNestedName(''); setNewNestedType('generic_data_container'); setNewNestedData('{}'); setNewNestedVerificationNotes('');
  };

  const currentVersionEntry = shard.metadata.versionHistory[shard.metadata.versionHistory.length - 1];
  const verificationClass = `verification-status-${shard.metadata.currentVerification.status.replace(/_/g, '-')}`;

  return (
    <div className="shard-editor-panel ui-panel">
      <h3>Editor: {shard.shardName} <span style={{ fontSize: '0.8em', color: 'var(--ql-text-secondary)' }}>({shard.shardId.slice(0, 8)}...)</span></h3>
      <div className="info-bar">
        <span>Path: {path || 'N/A'}</span>
        <span>Type: {shard.shardType}</span>
        <span>Atomic: {shard.isAtomic ? 'Yes' : 'No'}</span>
        <span className={verificationClass}>Verification: {shard.metadata.currentVerification.status.toUpperCase()}</span>
        <span>Version: {currentVersionEntry?.versionId || 'N/A'} (Updated: {format(new Date(shard.updatedAt), 'Pp')})</span>
      </div>

      <div className="editor-section">
        <h4>Shard Data (JSON or text)</h4>
        <div className="form-group">
          <textarea value={editData} onChange={e => setEditData(e.target.value)} rows={10} aria-label="Shard data editor" />
        </div>
        <div className="form-group">
          <label htmlFor={`changeSummary-${shard.shardId}`}>Summary of changes for new version:</label>
          <input type="text" id={`changeSummary-${shard.shardId}`} value={changeSummary} onChange={e => setChangeSummary(e.target.value)} />
        </div>
        <button onClick={handleDataSave}>Save Data (New Version)</button>
      </div>

      {aiInstance && (
        <div className="editor-section">
          <h4>AI Data Assistant (Gemini)</h4>
          <div className="form-group">
            <label htmlFor={`aiPrompt-${shard.shardId}`}>Describe how AI should modify or generate data for this shard:</label>
            <textarea id={`aiPrompt-${shard.shardId}`} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={3} />
          </div>
          <div style={{display: 'flex', gap: 'var(--ql-spacing-unit)'}}>
            <button onClick={() => onProcessWithAI(shard.shardId, path, aiPrompt)} disabled={isLoadingAI || !aiPrompt.trim()}>
              {isLoadingAI ? 'AI Processing...' : 'Process with AI'}
            </button>
            {aiPrompt && <button onClick={() => setAiPrompt('')} className="secondary-action" type="button">Clear Prompt</button>}
          </div>
        </div>
      )}

      <div className="editor-section">
        <h4>Verification Details (Current Version: {currentVersionEntry?.versionId || 'N/A'})</h4>
        <div className="form-group">
          <label htmlFor={`verificationStatus-${shard.shardId}`}>Status:</label>
          <select id={`verificationStatus-${shard.shardId}`} value={verificationStatus} onChange={e => setVerificationStatus(e.target.value as VerificationStatus)}>
            {(['unverified', 'user_verified', 'source_verified', 'verification_pending', 'verification_failed', 'system_verified'] as VerificationStatus[]).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`verificationMethod-${shard.shardId}`}>Method:</label>
          <select id={`verificationMethod-${shard.shardId}`} value={verificationMethod} onChange={e => setVerificationMethod(e.target.value as VerificationMethod)}>
            {(['user_attestation', 'multi_source_consensus', 'system_internal_check', 'not_applicable'] as VerificationMethod[]).map(m => <option key={m} value={m}>{m.replace(/_/g, ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Sources ({currentSources.length}):</label>
          {currentSources.length === 0 && <p style={{ fontSize: '0.9em', color: 'var(--ql-text-secondary)' }}>No sources listed for this version.</p>}
          <ul style={{ listStyle: 'none', paddingLeft: 0, maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--ql-border-color)', padding: 'var(--ql-spacing-unit)', borderRadius: 'var(--ql-border-radius)' }}>
            {currentSources.map(s => (
              <li key={s.sourceId} className="source-list-item">
                <span title={s.description}>{s.description.length > 50 ? `${s.description.substring(0,47)}...` : s.description} ({s.type})</span>
                <button onClick={() => handleRemoveSource(s.sourceId)} className="danger-action" type="button">Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 'var(--ql-spacing-unit)', marginTop: 'var(--ql-spacing-unit)' }}>
            <input type="text" value={newSourceDesc} onChange={e => setNewSourceDesc(e.target.value)} placeholder="New source description (e.g., URL, document ref)" style={{ flexGrow: 1 }} aria-label="New source description"/>
            <button onClick={handleAddSource} className="secondary-action" type="button">Add Source</button>
          </div>
        </div>
        <button onClick={handleVerificationUpdate}>Update Verification</button>
        <p style={{ fontSize: '0.8rem', color: 'var(--ql-text-secondary)', marginTop: 'var(--ql-spacing-unit)' }}><em>Note: For "Source Verified" status with "Multi Source Consensus", ensure sufficient (e.g., &gt;10) sources are added and validated by a robust backend (simulated here).</em></p>
      </div>

      <div className="editor-section">
        <h4>Version History ({shard.metadata.versionHistory.length} versions)</h4>
        <div className="form-group">
          {shard.metadata.versionHistory.length === 0 ? <p className="empty-message">No version history.</p> :
            <select style={{ maxHeight: '150px', overflowY: 'auto' }} size={Math.min(shard.metadata.versionHistory.length, 5) || 2} aria-label="Shard version history">
              {shard.metadata.versionHistory.slice().reverse().map(v => (
                <option key={v.versionId} value={v.versionId} title={`Data Snapshot: ${ typeof v.dataSnapshot === 'string' ? v.dataSnapshot : JSON.stringify(v.dataSnapshot, null, 2)}`}>
                  {v.versionId} - {format(new Date(v.timestamp), 'Pp')} - By: {v.author} - Verified: {v.verificationDetails.status.toUpperCase()} ({v.verificationDetails.sources.length} sources) - Changes: {v.changesSummary}
                </option>
              ))}
            </select>
          }
        </div>
        {/* TODO: Add button to revert to a selected version */}
      </div>

      <div className="editor-section">
        <h4>Nested Shards ({shard.nestedShards.length})</h4>
        {shard.nestedShards.length > 0 &&
          <ul style={{ listStyle: 'none', paddingLeft: 0, maxHeight: '100px', overflowY: 'auto', border: '1px solid var(--ql-border-color)', borderRadius: 'var(--ql-border-radius)', padding: 'var(--ql-spacing-unit)' }}>
            {shard.nestedShards.map(ns => (
              <li key={ns.shardId} style={{ fontSize: '0.9em', padding: 'calc(var(--ql-spacing-unit)/2)', background: 'var(--ql-bg-tertiary)', marginBottom: 'calc(var(--ql-spacing-unit)/2)', borderRadius: 'var(--ql-border-radius)' }}>
                {ns.shardName} ({ns.shardType})
              </li>
            ))}
          </ul>
        }
        <form onSubmit={handleCreateNestedShard}>
          <h5>Add New Nested Shard:</h5>
          <div className="form-group">
            <label htmlFor={`newNestedName-${shard.shardId}`}>Name:</label>
            <input type="text" id={`newNestedName-${shard.shardId}`} value={newNestedName} onChange={e => setNewNestedName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor={`newNestedType-${shard.shardId}`}>Type:</label>
            <input type="text" id={`newNestedType-${shard.shardId}`} value={newNestedType} onChange={e => setNewNestedType(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor={`newNestedData-${shard.shardId}`}>Initial Data (JSON or text):</label>
            <textarea id={`newNestedData-${shard.shardId}`} value={newNestedData} onChange={e => setNewNestedData(e.target.value)} rows={2} />
          </div>
          <div className="form-group">
            <label htmlFor={`newNestedVerificationNotes-${shard.shardId}`}>Verification Notes:</label>
            <textarea id={`newNestedVerificationNotes-${shard.shardId}`} value={newNestedVerificationNotes} onChange={e => setNewNestedVerificationNotes(e.target.value)} rows={1} />
          </div>
          <button type="submit">Add Nested Shard</button>
        </form>
      </div>
    </div>
  );
};
