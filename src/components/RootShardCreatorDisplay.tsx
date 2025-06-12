
// File: src/components/RootShardCreatorDisplay.tsx
import React, { useState } from 'react';
import type { ShardCreationConfig, ShardDataType } from '../types';
import toast from 'react-hot-toast';

interface RootShardCreatorDisplayProps {
  onSubmit: (config: ShardCreationConfig) => void;
  onCancel: () => void;
}

export const RootShardCreatorDisplay: React.FC<RootShardCreatorDisplayProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('generic_data_container');
  const [data, setData] = useState('{}');
  const [verificationNotes, setVerificationNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Shard Name is required.");
      return;
    }
    let parsedData: ShardDataType = data;
    try {
      if (data.trim()) {
        parsedData = JSON.parse(data);
      } else {
        parsedData = {};
      }
    } catch (err) {
      // Keep as string if JSON parse fails
    }

    const config: ShardCreationConfig = {
      shardName: name,
      shardType: type,
      initialData: parsedData,
      isAtomic: true,
      initialVerification: {
        status: 'user_verified',
        method: 'user_attestation',
        sources: [{ sourceId: crypto.randomUUID(), description: `Initial user attestation: ${verificationNotes || 'Created via QuantumLattice UI'}`, type: 'user_attestation' }],
        notes: verificationNotes || 'Root shard created via QuantumLattice Interface.'
      }
    };
    onSubmit(config);
  };

  return (
    <div className="root-shard-creator ui-panel">
      <h4>Create New Root Shard Complex</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rootShardName">Shard Name:</label>
          <input type="text" id="rootShardName" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="rootShardType">Shard Type (e.g., 'document', 'dataset'):</label>
          <input type="text" id="rootShardType" value={type} onChange={e => setType(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="rootShardData">Initial Data (JSON or text):</label>
          <textarea id="rootShardData" value={data} onChange={e => setData(e.target.value)} rows={5} />
        </div>
        <div className="form-group">
          <label htmlFor="rootShardVerification">Initial Verification Notes (e.g., source of this data):</label>
          <textarea id="rootShardVerification" value={verificationNotes} onChange={e => setVerificationNotes(e.target.value)} rows={2} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--ql-spacing-unit)' }}>
          <button type="submit">Create Root Shard</button>
          <button type="button" onClick={onCancel} className="secondary-action">Cancel</button>
        </div>
      </form>
    </div>
  );
};
