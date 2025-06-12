// @version v1.0.0
import React, { useState } from 'react';
import type { EchoBit, GuidingEchoAttributes, DataIntegrityAttributes, MetaCognitionAttributes, BaseBitAttributes } from '../types'; // Added more specific types

interface EchoBitDatabaseViewerProps {
  echoBits: EchoBit<any>[]; // Use EchoBit<any> for a general list
}

const EchoBitCard: React.FC<{ bit: EchoBit<any> }> = ({ bit }) => {
  const attributes = bit.attributes as BaseBitAttributes; // Common base
  return (
    <div className="echobit-card">
      <h4>{attributes.title}</h4>
      <p><strong>ID:</strong> {bit.echo_bit_id}</p>
      <p><strong>Type:</strong> <span style={{textTransform: 'capitalize'}}>{bit.type.replace(/_/g, ' ')}</span></p>
      <p><strong>Category:</strong> {bit.category}</p>
      <p><strong>Description:</strong> {attributes.description}</p>
      <p><strong>Version:</strong> {bit.version.current} (Revisions: {bit.version.log.length})</p>
      <p><strong>Status:</strong> <span style={{textTransform: 'capitalize'}}>{bit.status}</span></p>
      <p><strong>Author:</strong> {bit.author}</p>
      <details style={{marginTop: '10px'}}>
        <summary style={{cursor: 'pointer', color: 'var(--clr-accent-primary-glacial)', fontSize: '0.9em'}}>More Details</summary>
        <div style={{marginTop: '5px', borderTop: '1px solid var(--clr-border-faint)', paddingTop: '5px'}}>
            <p><strong>Tags:</strong> {(Array.isArray(attributes.tags) && attributes.tags.length > 0) ? attributes.tags.join(', ') : 'None'}</p>
            <p><strong>Authenticity Sources:</strong></p>
            {attributes.authenticitySources && attributes.authenticitySources.length > 0 ? (
                <ul style={{paddingLeft: '20px', margin: '0'}}>
                    {attributes.authenticitySources.map((source, index) => (
                        <li key={index} style={{fontSize: '0.85em'}}>{source}</li>
                    ))}
                </ul>
            ) : (
                <p style={{paddingLeft: '20px', fontSize: '0.85em'}}>None specified.</p>
            )}
            {bit.type === 'guiding_echo' && (
                <>
                    <p><strong>Core Focus:</strong> {(attributes as GuidingEchoAttributes).coreFocus}</p>
                    <p><strong>Influence Domains:</strong> {(attributes as GuidingEchoAttributes).influenceDomains}</p>
                </>
            )}
             {bit.type === 'data_integrity_profile' && (
                <>
                    <p><strong>Applies To:</strong> {(attributes as DataIntegrityAttributes).appliesToDataTypes.join(', ')}</p>
                    <p><strong>Min Cross-Refs:</strong> {(attributes as DataIntegrityAttributes).minCrossReferences}</p>
                </>
            )}
            {bit.type === 'meta_cognition_profile' && (
                <>
                    <p><strong>Control Domain:</strong> {(attributes as MetaCognitionAttributes).controlDomain}</p>
                    <p><strong>Optimization Target:</strong> {(attributes as MetaCognitionAttributes).optimizationTarget}</p>
                </>
            )}
            <p><strong>Created:</strong> {new Date(bit.created_at).toLocaleString()}</p>
            <p><strong>Last Used:</strong> {new Date(bit.last_used).toLocaleString()}</p>
        </div>
      </details>
    </div>
  );
};


export const EchoBitDatabaseViewer: React.FC<EchoBitDatabaseViewerProps> = ({ echoBits }) => {
  const [filterType, setFilterType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredEchoBits = echoBits.filter(bit => {
    const typeMatch = filterType ? bit.type === filterType : true;
    const termMatch = searchTerm ? 
        bit.attributes.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bit.echo_bit_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bit.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(bit.attributes.tags) && bit.attributes.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        : true;
    return typeMatch && termMatch;
  });

  const echoBitTypes = Array.from(new Set(echoBits.map(bit => bit.type)));

  return (
    <div className="echobit-database-viewer ui-section">
      <h2>EchoBit Database Viewer</h2>
      <p>Browse all EchoBits currently registered within the NudgeKernel, including prime and custom-generated bits.</p>
      
      <div className="form-group" style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '25px' }}>
        <div style={{flexGrow: 1}}>
          <label htmlFor="echoBitSearch">Search EchoBits:</label>
          <input 
            type="text" 
            id="echoBitSearch" 
            placeholder="Search by ID, title, category, tags..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div style={{minWidth: '200px'}}>
          <label htmlFor="echoBitTypeFilter">Filter by Type:</label>
          <select id="echoBitTypeFilter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {echoBitTypes.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredEchoBits.length === 0 && <p style={{textAlign: 'center', color: 'var(--clr-text-secondary-silver)'}}>
        {echoBits.length === 0 ? "No EchoBits found in the database." : "No EchoBits match your current filter criteria."}
        </p>}

      <div className="echobit-grid">
        {filteredEchoBits.map(bit => (
          <EchoBitCard key={bit.echo_bit_id} bit={bit} />
        ))}
      </div>
    </div>
  );
};