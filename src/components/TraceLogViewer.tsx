import React, { useEffect, useRef, useState } from 'react';
import type { TraceLogEntry } from '../types'; 

interface TraceLogViewerProps {
  entries: TraceLogEntry[]; 
  onAnnotateEntry: (entryId: string, annotation: string) => void; 
}

export const TraceLogViewer: React.FC<TraceLogViewerProps> = ({ entries, onAnnotateEntry }) => {
  const traceEndRef = useRef<HTMLDivElement>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState<string>('');
  const annotationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    traceEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  useEffect(() => {
    if (editingEntryId && annotationInputRef.current) {
        annotationInputRef.current.focus();
    }
  }, [editingEntryId]);

  const handleEntryClick = (entry: TraceLogEntry) => {
    setEditingEntryId(entry.id);
    setCurrentAnnotation(entry.annotation || '');
  };

  const handleSaveAnnotation = (entryId: string) => {
    onAnnotateEntry(entryId, currentAnnotation);
    setEditingEntryId(null);
    setCurrentAnnotation('');
  };
  
  const handleCancelAnnotation = () => {
    setEditingEntryId(null);
    setCurrentAnnotation('');
  };

  const handleAnnotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAnnotation(e.target.value);
  };
  
  const handleAnnotationKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, entryId: string) => {
    if (event.key === 'Enter') {
        handleSaveAnnotation(entryId);
    } else if (event.key === 'Escape') {
        handleCancelAnnotation();
    }
  };

  return (
    <>
      <div className="trace-log-viewer" aria-live="polite" role="log"> 
        {entries.length === 0 && <p className="empty-log-message">Trace Log empty. Initiate a DeltaShift or await next phase.</p>}
        {entries.map((entry) => (
          <div key={entry.id} className="log-entry-container"> {/* Renamed CSS class */}
            <div 
              className={`log-entry log-type-${entry.type || 'info'} ${editingEntryId === entry.id ? 'editing' : ''}`} 
              onClick={() => handleEntryClick(entry)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEntryClick(entry);}}
              tabIndex={0}
              role="button"
              aria-expanded={editingEntryId === entry.id}
              aria-controls={`annotation-editor-${entry.id}`}
              title={entry.annotation ? `Annotation: ${entry.annotation}` : "Click to annotate this log entry"}
            >
              <span className="log-timestamp">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
              <span className="log-text">{entry.text}</span>
              {entry.annotation && !(editingEntryId === entry.id) && <span className="log-annotation-indicator" aria-label="Has annotation">(A)</span>}
            </div>
            {editingEntryId === entry.id && (
              <div id={`annotation-editor-${entry.id}`} className="annotation-editor"> 
                <input
                  ref={annotationInputRef}
                  type="text"
                  value={currentAnnotation}
                  onChange={handleAnnotationChange}
                  onKeyDown={(e) => handleAnnotationKeyDown(e, entry.id)}
                  placeholder="Add or edit annotation..."
                  aria-label={`Annotation for log entry: ${entry.text.substring(0,50)}...`}
                />
                <button onClick={() => handleSaveAnnotation(entry.id)} title="Save annotation">Save</button>
                <button onClick={handleCancelAnnotation} className="secondary-action" title="Cancel annotation">Cancel</button>
              </div>
            )}
          </div>
        ))}
        <div ref={traceEndRef} />
      </div>
    </>
  );
};