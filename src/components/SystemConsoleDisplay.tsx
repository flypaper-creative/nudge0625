
// File: src/components/SystemConsoleDisplay.tsx
import React from 'react';
import { format } from 'date-fns';

interface SystemConsoleDisplayProps {
  messages: string[]; // Assumes messages already have timestamps prefixed
  apiKeyStatus: string;
  corePrinciples: string[];
}

export const SystemConsoleDisplay: React.FC<SystemConsoleDisplayProps> = ({ messages, apiKeyStatus, corePrinciples }) => (
  <div className="system-console ui-panel">
    <h2>System Console (QuantumLattice v1.0.0)</h2>
    <div className="form-group">
      <label htmlFor="apiKeyStatusDisplay">AI Core Status:</label>
      <input type="text" id="apiKeyStatusDisplay" value={apiKeyStatus} readOnly disabled style={{backgroundColor: 'var(--ql-bg-tertiary)', cursor: 'default'}}/>
    </div>
    
    <div className="form-group">
      <h4>System Messages (Last {messages.length}):</h4>
      {messages.length === 0 ? (
        <p className="empty-message">No system messages logged yet.</p>
      ) : (
        <ul className="system-console-list">
          {messages.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      )}
    </div>

    <div className="form-group">
        <h4>Core Principles:</h4>
        <ul className="system-console-list principles-list">
            {corePrinciples.map((principle, i) => <li key={i}>{principle}</li>)}
        </ul>
    </div>
  </div>
);
