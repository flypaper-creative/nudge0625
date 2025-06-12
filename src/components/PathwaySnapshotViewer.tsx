// @version v1.0.0
import React, { useState, useEffect } from 'react';
import type { PathwaySnapshot, TraceLogEntry } from '../types';

interface PathwaySnapshotViewerProps {
  snapshots: PathwaySnapshot[];
  pathwayName: string;
}

const SnapshotDetailCard: React.FC<{ snapshot: PathwaySnapshot }> = ({ snapshot }) => (
  <div className="snapshot-card">
    <h4>Snapshot: {new Date(snapshot.timestamp).toLocaleString()}</h4>
    <p><strong>ID:</strong> {snapshot.id.slice(0,12)}...</p>
    <p><strong>Kernel Version:</strong> {snapshot.kernelVersion} | <strong>UI Version:</strong> {snapshot.uiVersion}</p>
    
    <div style={{marginTop: '10px'}}>
        <p><strong>DeltaShift Config:</strong> Strategy: {snapshot.deltaShiftConfig.strategy}, Scale: {snapshot.deltaShiftConfig.scale}</p>
        <p><strong>EchoCluster Config:</strong> Mode: {snapshot.echoClusterConfig.linkMode}, IDs: {snapshot.echoClusterConfig.ids.join(', ') || 'None'}</p>
    </div>
    <div style={{marginTop: '5px'}}>
        <p><strong>Shift State Values:</strong></p>
        <ul style={{paddingLeft: '20px', margin: '0', fontSize: '0.9em'}}>
            <li>Version: {snapshot.currentDeltaShiftStateValues.currentVersion}</li>
            <li>Shift Count: {snapshot.currentDeltaShiftStateValues.shiftCount}</li>
            <li>Active Display: {snapshot.currentDeltaShiftStateValues.activeEchoDisplay}</li>
        </ul>
    </div>
     {snapshot.activeCurriculumId && snapshot.curriculumProgress && (
        <div style={{marginTop: '5px'}}>
            <p><strong>Curriculum State:</strong></p>
             <ul style={{paddingLeft: '20px', margin: '0', fontSize: '0.9em'}}>
                <li>Curriculum ID: {snapshot.activeCurriculumId.slice(0,20)}...</li>
                <li>Step: {snapshot.curriculumProgress.currentStepIndex + 1}, Iteration: {snapshot.curriculumProgress.currentIterationInStep + 1}</li>
                <li>Completed: {snapshot.curriculumProgress.isComplete ? 'Yes' : 'No'}</li>
            </ul>
        </div>
    )}
    <details style={{marginTop: '15px'}}>
        <summary style={{cursor: 'pointer', color: 'var(--clr-accent-primary-glacial)', fontSize: '0.9em'}}>
            View Trace Log Snapshot ({snapshot.currentDeltaShiftStateValues.traceLog.length} entries)
        </summary>
        <div className="snapshot-log-preview trace-log-viewer" style={{maxHeight: '200px', marginTop: '5px', fontSize: '0.8em'}}>
            {snapshot.currentDeltaShiftStateValues.traceLog.slice(-20).map((entry: TraceLogEntry) => ( // Show last 20
                <p key={entry.id || entry.text} className={`log-type-${entry.type || 'info'}`} title={entry.text}>
                    {entry.text} {entry.annotation ? `(A: ${entry.annotation})` : ''}
                </p>
            ))}
        </div>
    </details>
  </div>
);


export const PathwaySnapshotViewer: React.FC<PathwaySnapshotViewerProps> = ({ snapshots, pathwayName }) => {
  const [selectedSnapshotId1, setSelectedSnapshotId1] = useState<string | null>(null);
  const [selectedSnapshotId2, setSelectedSnapshotId2] = useState<string | null>(null);

  // Set initial selections if snapshots exist
  useEffect(() => {
    if (snapshots.length > 0 && !selectedSnapshotId1) {
      setSelectedSnapshotId1(snapshots[0].id);
    }
    if (snapshots.length > 1 && !selectedSnapshotId2) {
      setSelectedSnapshotId2(snapshots[snapshots.length > 1 ? 1 : 0].id); // Default to second if available, else first
    }
  }, [snapshots, selectedSnapshotId1, selectedSnapshotId2]);


  const snapshot1 = snapshots.find(s => s.id === selectedSnapshotId1);
  const snapshot2 = snapshots.find(s => s.id === selectedSnapshotId2);

  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="pathway-snapshot-viewer ui-section">
        <h2>Pathway Snapshot Viewer</h2>
        <p>No snapshots available for pathway "{pathwayName}". Take snapshots from the Active Pathway Monitor.</p>
      </div>
    );
  }
  
  // Ensure dropdowns don't offer the same snapshot if one is already selected in the other
  const availableSnapshotsForSelect1 = snapshots.filter(s => s.id !== selectedSnapshotId2 || !selectedSnapshotId2);
  const availableSnapshotsForSelect2 = snapshots.filter(s => s.id !== selectedSnapshotId1 || !selectedSnapshotId1);

  return (
    <div className="pathway-snapshot-viewer ui-section">
      <h2>Pathway Snapshot Viewer - Pathway: {pathwayName}</h2>
      <p>Select up to two snapshots to view their configurations and states. Useful for comparing pathway evolution over time.</p>

      <div className="form-group" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px'}}>
        <div>
          <label htmlFor="snapshotSelect1">Snapshot 1:</label>
          <select 
            id="snapshotSelect1" 
            value={selectedSnapshotId1 || ''} 
            onChange={(e) => setSelectedSnapshotId1(e.target.value || null)}
            aria-label="Select first snapshot for comparison"
          >
            <option value="">-- None --</option>
            {availableSnapshotsForSelect1.map(s => (
              <option key={s.id} value={s.id}>
                {new Date(s.timestamp).toLocaleString()} (v{s.currentDeltaShiftStateValues.currentVersion})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="snapshotSelect2">Snapshot 2 (Optional):</label>
          <select 
            id="snapshotSelect2" 
            value={selectedSnapshotId2 || ''} 
            onChange={(e) => setSelectedSnapshotId2(e.target.value || null)}
            aria-label="Select second snapshot for comparison"
            disabled={snapshots.length < 2}
          >
             <option value="">-- None --</option>
            {availableSnapshotsForSelect2.map(s => (
              <option key={s.id} value={s.id}>
                 {new Date(s.timestamp).toLocaleString()} (v{s.currentDeltaShiftStateValues.currentVersion})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="snapshot-grid" style={{display: 'grid', gridTemplateColumns: (snapshot1 && snapshot2) ? '1fr 1fr' : '1fr', gap: '20px'}}>
        {snapshot1 ? <SnapshotDetailCard snapshot={snapshot1} /> : 
            (selectedSnapshotId1 === null && <p style={{textAlign: 'center', color: 'var(--clr-text-secondary-silver)'}}>Select Snapshot 1 to view details.</p>)
        }
        {snapshot2 ? <SnapshotDetailCard snapshot={snapshot2} /> : 
            (snapshot1 && selectedSnapshotId2 === null && snapshots.length > 1 && <p style={{textAlign: 'center', color: 'var(--clr-text-secondary-silver)'}}>Select Snapshot 2 to compare.</p>)
        }
      </div>
       {snapshots.length === 0 && (
           <p style={{marginTop: '20px', fontStyle: 'italic', textAlign: 'center', color: 'var(--clr-text-secondary-silver)'}}>
             No snapshots exist for this pathway yet.
           </p>
       )}
    </div>
  );
};