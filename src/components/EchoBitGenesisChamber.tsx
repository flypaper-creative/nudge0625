// @version v1.0.0
import React, { useState } from 'react';
import type { 
    EchoBit, 
    BaseBitAttributes, 
    GuidingEchoAttributes, 
    DataIntegrityAttributes, 
    MetaCognitionAttributes, 
    EchoBitType, 
    VersionHistory, 
    EchoBitStatus 
} from '../types';
import { NUDGE_KERNEL_VERSION } from '../constants/kernelAppData';

interface EchoBitGenesisChamberProps {
  onSubmit: (newEchoBit: EchoBit<any>) => void; // Using EchoBit<any> for general submission
}

// Explicitly define the shape of attributes specific to GuidingEcho that are not in BaseBitAttributes
type GuidingSpecificAttributes = {
    legacyId?: string;
    influenceDomains: string;
    coreTraits: string;
    epoch: string;
    coreFocus: string;
};


const initialBaseAttributes: Omit<BaseBitAttributes, 'authenticitySources'> = {
  title: '',
  description: '',
  tags: [],
  dependencies: [],
  constraints: [],
};

const initialGuidingAttributes: GuidingSpecificAttributes = { 
  legacyId: '', 
  influenceDomains: '', 
  coreTraits: '', 
  epoch: '', 
  coreFocus: ''
};


export const EchoBitGenesisChamber: React.FC<EchoBitGenesisChamberProps> = ({ onSubmit }) => {
  const [echoBitId, setEchoBitId] = useState<string>(`custom-echo-${crypto.randomUUID().slice(0,8)}`);
  const [type, setType] = useState<EchoBitType>('guiding_echo');
  const [category, setCategory] = useState<string>('Custom Guidance');
  const [baseAttributes, setBaseAttributes] = useState<Omit<BaseBitAttributes, 'authenticitySources'>>(initialBaseAttributes);
  const [guidingAttributes, setGuidingAttributes] = useState<GuidingSpecificAttributes>(initialGuidingAttributes);
  // Add states for other attribute types if needed for the form
  const [authenticitySourcesInput, setAuthenticitySourcesInput] = useState<string>('');
  const [status, setStatus] = useState<EchoBitStatus>('experimental');
  const [formError, setFormError] = useState<string>('');

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBaseAttributes(prev => ({ ...prev, [name]: name === 'tags' || name === 'dependencies' || name === 'constraints' ? value.split(',').map(t => t.trim()).filter(t => t) : value }));
  };

  const handleGuidingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGuidingAttributes(prev => ({ ...prev, [name]: value } as GuidingSpecificAttributes));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!echoBitId.trim() || !baseAttributes.title.trim() || !category.trim()) {
        setFormError('EchoBit ID, Title, and Category are required.');
        return;
    }
    if (type === 'guiding_echo' && (!guidingAttributes.coreFocus.trim() || !guidingAttributes.influenceDomains.trim())) {
        setFormError('For Guiding Echos, Core Focus and Influence Domains are required.');
        return;
    }
    // Add more validation for other types if forms are extended


    const finalAuthenticitySources = authenticitySourcesInput.split(',').map(s => s.trim()).filter(s => s);
    if (finalAuthenticitySources.length === 0) {
        finalAuthenticitySources.push(`User-defined via NudgeKernel ${NUDGE_KERNEL_VERSION} Genesis Chamber`);
    }

    const newVersionHistory: VersionHistory = {
      current: "v1.0.0",
      log: [{ version: "v1.0.0", notes: "Initial user creation via Genesis Chamber.", timestamp: new Date().toISOString(), author: "user/genesis_chamber" }]
    };
    
    let attributesPayload: BaseBitAttributes = {
        ...baseAttributes,
        authenticitySources: finalAuthenticitySources,
    };

    if (type === 'guiding_echo') {
        attributesPayload = {
            ...attributesPayload, // Base attributes (including authenticitySources now)
            ...guidingAttributes, // Guiding specific attributes
        } as GuidingEchoAttributes;
    } else if (type === 'data_integrity_profile') {
        // Placeholder for DataIntegrityAttributes form fields
        attributesPayload = {
            ...attributesPayload,
            appliesToDataTypes: ['text_stream'], // Example
            minCrossReferences: 1, // Example
            validationLogicFunction: '/* Custom Validation Logic */' // Example
        } as DataIntegrityAttributes;
    } else if (type === 'meta_cognition_profile') {
        // Placeholder for MetaCognitionAttributes form fields
         attributesPayload = {
            ...attributesPayload,
            controlDomain: 'nudge_pathway', // Example
            optimizationTarget: 'custom_target', // Example
            decisionLogicFunction: '/* Custom Decision Logic */' // Example
        } as MetaCognitionAttributes;
    }
    // Add other EchoBit types here

    const newEchoBit: EchoBit<any> = { // Use 'any' for attributes here due to dynamic type
      echo_bit_id: echoBitId,
      type,
      category,
      attributes: attributesPayload,
      functions: { 
        compute: "async function(context, inputs) { console.log('[CustomEchoBitCompute:" + type + "] Executing'); return { success: true, output: 'custom_output_for_" + type + "' }; }",
        validate: "async function(data) { console.log('[CustomEchoBitValidate:" + type + "] Validating'); return true; }",
        render: "function(props) { return `<div>Custom ${props?.title || 'EchoBit'} (" + type + ")</div>`; }",
      },
      version: newVersionHistory,
      status,
      last_used: new Date().toISOString(),
      created_at: new Date().toISOString(),
      author: "user/genesis_chamber",
      hash: `custom-sha256-${echoBitId}-${new Date().getTime()}`, 
    };

    onSubmit(newEchoBit);
    // Reset form
    setEchoBitId(`custom-echo-${crypto.randomUUID().slice(0,8)}`);
    setBaseAttributes(initialBaseAttributes);
    setGuidingAttributes(initialGuidingAttributes);
    setAuthenticitySourcesInput('');
    setCategory(type === 'guiding_echo' ? 'Custom Guidance' : 'Custom Utility');
    // setType('guiding_echo'); // Or keep current type for next creation
  };

  return (
    <div className="echobit-genesis-chamber ui-section">
      <h2>EchoBit Genesis Chamber</h2>
      <p>Define and instantiate new EchoBits into the NudgeKernel. These EchoBits can then be utilized in NudgePathways.</p>
      
      {formError && <p className="error-message-text" role="alert">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
            <legend>Core Definition</legend>
            <div className="form-group">
                <label htmlFor="echoBitId">EchoBit ID (Unique):</label>
                <input type="text" id="echoBitId" value={echoBitId} onChange={(e) => setEchoBitId(e.target.value)} required />
            </div>

            <div className="form-group">
            <label htmlFor="type">EchoBit Type:</label>
            <select id="type" value={type} onChange={(e) => {
                setType(e.target.value as EchoBitType);
                setCategory(e.target.value === 'guiding_echo' ? 'Custom Guidance' : 'Custom Utility'); // Auto-category suggestion
            }}>
                <option value="guiding_echo">Guiding Echo</option>
                <option value="logic_core">Logic Core</option>
                <option value="artifact_ref">Artifact Reference</option>
                <option value="param_matrix">Parameter Matrix</option>
                <option value="shift_logic_profile">Shift Logic Profile</option>
                <option value="cognitive_module">Cognitive Module</option>
                <option value="data_source_input">Data Source Input</option>
                <option value="data_integrity_profile">Data Integrity Profile</option>
                <option value="data_purification_node">Data Purification Node</option>
                <option value="anomaly_monitor_profile">Anomaly Monitor Profile</option>
                <option value="meta_cognition_profile">Meta Cognition Profile</option>
                <option value="custom_utility">Custom Utility (Other)</option>
            </select>
            </div>

            <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g., AI Guidance, Data Validation, Custom Tool"/>
            </div>
        </fieldset>
        
        <fieldset className="form-group">
            <legend>Base Attributes</legend>
            <div className="form-group">
            <label htmlFor="baseTitle">Title:</label>
            <input type="text" id="baseTitle" name="title" value={baseAttributes.title} onChange={handleBaseChange} required />
            </div>
            <div className="form-group">
            <label htmlFor="baseDescription">Description / Principle / Focus:</label>
            <textarea id="baseDescription" name="description" value={baseAttributes.description} onChange={handleBaseChange} rows={3} required />
            </div>
            <div className="form-group">
            <label htmlFor="baseTags">Tags (comma-separated):</label>
            <input type="text" id="baseTags" name="tags" value={Array.isArray(baseAttributes.tags) ? baseAttributes.tags.join(', ') : ''} onChange={handleBaseChange} placeholder="e.g., creative, analytical, data-processing"/>
            </div>
        </fieldset>

        {type === 'guiding_echo' && (
          <fieldset className="form-group">
            <legend>Guiding Echo Specifics:</legend>
            <div className="form-group">
              <label htmlFor="guidingCoreFocus">Core Focus:</label>
              <input type="text" id="guidingCoreFocus" name="coreFocus" value={guidingAttributes.coreFocus} onChange={handleGuidingChange} required/>
            </div>
            <div className="form-group">
              <label htmlFor="guidingInfluenceDomains">Influence Domains (comma-separated):</label>
              <input type="text" id="guidingInfluenceDomains" name="influenceDomains" value={guidingAttributes.influenceDomains} onChange={handleGuidingChange} required/>
            </div>
            <div className="form-group">
              <label htmlFor="guidingCoreTraits">Core Traits (comma-separated):</label>
              <input type="text" id="guidingCoreTraits" name="coreTraits" value={guidingAttributes.coreTraits} onChange={handleGuidingChange} />
            </div>
            <div className="form-group">
              <label htmlFor="guidingEpoch">Epoch:</label>
              <input type="text" id="guidingEpoch" name="epoch" value={guidingAttributes.epoch} onChange={handleGuidingChange} placeholder="e.g., Renaissance, Quantum Age"/>
            </div>
             <div className="form-group">
              <label htmlFor="guidingLegacyId">Legacy ID (Optional):</label>
              <input type="text" id="guidingLegacyId" name="legacyId" value={guidingAttributes.legacyId || ''} onChange={handleGuidingChange} />
            </div>
          </fieldset>
        )}
        
        {/* TODO: Add form fields for other EchoBit types (DataIntegrity, MetaCognition etc.) if needed */}

        <fieldset className="form-group">
            <legend>Metadata & Status</legend>
            <div className="form-group">
            <label htmlFor="authenticitySourcesInput">Authenticity Sources (comma-separated):</label>
            <input type="text" id="authenticitySourcesInput" value={authenticitySourcesInput} onChange={(e) => setAuthenticitySourcesInput(e.target.value)} placeholder="e.g., Internal Spec v1.2, User Verification"/>
            <p style={{fontSize: '0.8rem', color: 'var(--clr-text-secondary-silver)'}}>If blank, defaults to "User-defined via NudgeKernel Genesis Chamber".</p>
            </div>

            <div className="form-group">
            <label htmlFor="status">Initial Status:</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as EchoBitStatus)}>
                <option value="experimental">Experimental</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
            </select>
            </div>
        </fieldset>

        <div className="config-actions-group">
          <button type="submit">Create EchoBit</button>
        </div>
      </form>
    </div>
  );
};