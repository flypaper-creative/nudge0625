// Modular Shard System Interface (Codename: QuantumLattice) v1.0.0
// File: src/types/index.ts

export type ShardDataType = any; // string | Record<string, any> | Array<any> | number | boolean; Can be highly flexible.

export type VerificationStatus = 
  | 'unverified' 
  | 'user_verified' 
  | 'source_verified' // Implies multiple sources met criteria
  | 'verification_pending'
  | 'verification_failed'
  | 'system_verified'; // For internally consistent shards

export type VerificationMethod = 
  | 'user_attestation' 
  | 'multi_source_consensus' 
  | 'system_internal_check'
  | 'not_applicable';

export interface SourceDetail {
  sourceId: string; // UUID for the source reference
  description: string; // e.g., "USER_STATEMENT: Primary concern for MAYORGATE" or "URL: https://example.com/evidence_doc"
  type: 'user_attestation' | 'document_reference' | 'url' | 'expert_opinion' | 'system_log' | 'other';
  contentHash?: string; // Optional hash of the source content if applicable and available
  retrievalTimestamp?: string; // When the source was last accessed/confirmed
}

export interface VerificationDetails {
  status: VerificationStatus;
  method: VerificationMethod;
  verifiedBy?: string; // User ID, System Process ID
  verificationTimestamp?: string; // ISO string
  sources: SourceDetail[];
  notes?: string; // Any specific notes about this verification
  requiredSourcesMet?: boolean; // True if, e.g., 10 sources rule is met
}

export interface VersionEntry {
  versionId: string; // e.g., "v1.0.0", "v1.0.1-alpha", or a hash
  timestamp: string; // ISO string format for when this version was created
  author: string; // User ID, System Process, AI Adjudicator
  changesSummary: string; // Brief description of changes in this version
  dataSnapshot: ShardDataType; // Snapshot of the shard's data for this version
  verificationDetails: VerificationDetails; // Verification status specific to this version
}

export interface ShardMetadata {
  versionHistory: VersionEntry[]; // Log of all versions, current is the last entry
  currentVerification: VerificationDetails; // Denormalized for quick access, reflects last version's verification
  tags: string[];
  customProperties: Record<string, any>; // For user-defined metadata fields
  accessControls?: string[]; // (Conceptual) Roles or user IDs
  linkedShardIds?: {shardId: string, relationship: string}[]; // For explicit links beyond nesting
  processingLog?: AuditLogEntry[]; // Log of actions performed *on* this shard if not captured in version history changes
}

export interface Shard {
  shardId: string; // Unique ID for this shard (e.g., UUID)
  shardType: string; // User-defined type, e.g., "legal_motion_draft", "evidence_item", "user_profile_data", "test_case_input"
  shardName: string; // Human-readable name for the shard
  isAtomic: boolean; // Indicates if this shard is considered an indivisible unit in its current context
  
  data: ShardDataType; // The actual content of the shard
  
  metadata: ShardMetadata;
  
  nestedShards: Shard[]; // Child shards, allowing for tree-like structures

  // Timestamps for the shard object itself (distinct from version timestamps)
  createdAt: string; 
  updatedAt: string;
}

export interface AuditLogEntry { // Reused for general system/shard action logging
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  targetShardId?: string;
  status: 'success' | 'failure' | 'pending';
  hashOfLog?: string; // Optional: for log entry integrity
}

// --- Application Specific Types (Modular Shard System) ---
export type AppViewMode = 
  | "system_console" 
  | "shard_complex_explorer" // Main view for navigating shards
  | "shard_detail_editor"    // View/Edit a single shard
  | "root_shard_creator"     // Create a new top-level shard
  | "ai_interaction_panel";  // Panel for AI-assisted shard operations

export interface ShardCreationConfig {
  shardName: string;
  shardType: string;
  initialData: ShardDataType;
  isAtomic?: boolean;
  parentShardId?: string | null; // For creating nested shards
  initialVerification: Pick<VerificationDetails, 'status' | 'method' | 'sources' | 'notes'>; // User provides initial verification claim
  tags?: string[];
  customProperties?: Record<string, any>;
}

// Payload for AI interactions related to a shard
export interface ShardAIInteractionRequest {
  shardId: string;
  currentData: ShardDataType;
  shardType: string;
  prompt: string; // User's specific request for the AI
}

// Represents a top-level shard and its entire hierarchy for easier management in state
export type RootShardComplex = Shard;

// Actions that might be taken by the user, specific to the "MAYORGATE" or legal context if re-introduced
export type LegalActionType =
  | "draft_motion_to_show_cause"
  | "analyze_violations_from_evidence"
  | "compile_case_timeline"
  | "assess_harm_impact";

export interface LegalActionRequest {
  actionType: LegalActionType;
  primaryCaseFileShardId: string; // The root shard of the case
  relevantDataShardIds: string[]; // Specific shards containing data for the action
  additionalParams?: Record<string, any>;
}


// --- NudgeKernel Specific Types ---

export interface VersionHistory {
  current: string;
  log: { version: string, notes: string, timestamp: string, author: string }[];
}

export type EchoBitStatus = 'active' | 'experimental' | 'archived' | 'deprecated';

export interface BaseBitAttributes {
  title: string;
  description: string;
  tags: string[];
  authenticitySources: string[];
  dependencies?: string[];
  constraints?: string[];
}

export interface GuidingEchoAttributes extends BaseBitAttributes {
  legacyId?: string;
  influenceDomains: string; // Comma-separated or structured
  coreTraits: string; // Comma-separated or structured
  epoch: string;
  coreFocus: string;
}

export interface DataIntegrityAttributes extends BaseBitAttributes {
  appliesToDataTypes: string[];
  minCrossReferences: number;
  validationLogicFunction: string; // Placeholder for logic reference or embedded script
}

export interface MetaCognitionAttributes extends BaseBitAttributes {
  controlDomain: string; // e.g., 'nudge_pathway', 'delta_shift_strategy'
  optimizationTarget: string; // e.g., 'efficiency', 'novelty', 'robustness'
  decisionLogicFunction: string; // Placeholder
}

export type EchoBitType =
  | 'guiding_echo'
  | 'logic_core'
  | 'artifact_ref'
  | 'param_matrix'
  | 'shift_logic_profile'
  | 'cognitive_module'
  | 'data_source_input'
  | 'data_integrity_profile'
  | 'data_purification_node'
  | 'anomaly_monitor_profile'
  | 'meta_cognition_profile'
  | 'custom_utility';

export interface EchoBit<T extends BaseBitAttributes = BaseBitAttributes> {
  echo_bit_id: string;
  type: EchoBitType;
  category: string;
  attributes: T;
  functions: { // Placeholders for potential client-side executable representations
    compute: string; // e.g., a stringified function or a reference
    validate: string;
    render: string;
  };
  version: VersionHistory;
  status: EchoBitStatus;
  last_used: string; // ISO Date string
  created_at: string; // ISO Date string
  author: string;
  hash: string; // For integrity check
}

export type EchoLinkMode = 'toggle' | 'fusion';

export type ShiftStrategy = 
  | 'exploratory' 
  | 'convergent_refinement' 
  | 'standard_toggle' 
  | 'standard_fusion' 
  | 'adversarial_dynamics' 
  | 'meta_adaptive_heuristic';

export type ShiftScale = 'micro' | 'meso' | 'macro' | 'meta_adaptive';

export type DeltaShiftProtocolStep = string;

export interface TraceLogEntry {
  id: string;
  timestamp: string; // ISO Date string
  text: string;
  type: 'system-init' | 'version-log' | 'echo-log' | 'error' | 'system-revert' | 'info' | 'curriculum-log' | 'data-ops' | 'advisor-log' | string; // Allow custom types
  annotation?: string;
}

export interface DeltaShiftState {
  currentVersion: string;
  shiftCount: number;
  isShiftActive: boolean;
  activeEchoDisplay: string;
  activeShiftStrategy: ShiftStrategy;
  activeShiftScale: ShiftScale;
  traceLog: TraceLogEntry[];
  // Potentially other dynamic state variables
}

export interface EchoClusterConfig {
  ids: string[]; // GuidingEchoBit IDs
  linkMode: EchoLinkMode;
}

export interface IterationStep {
  stepName: string;
  instruction: string;
  iterations: number;
  outputFileNameTemplate?: string; // e.g., "concept_##.txt"
  guidingEchoBitId?: string; // Optional EchoBit for this specific step
  // Potentially other step-specific configs
}

export interface IterationCurriculum {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., "Design", "Writing", "Coding"
  basePrompt?: string; // General prompt for the entire curriculum
  steps: IterationStep[];
}

export interface CurriculumProgress {
  currentStepIndex: number;
  currentIterationInStep: number;
  isComplete: boolean;
  statusMessage: string;
  // Potentially store outputs or states per step
}

export interface GeneratedOutputLogEntry {
    id: string;
    pathwayId: string;
    curriculumStepName: string;
    path: string; // file path or identifier for the generated output
    contentPreview?: string; // A short preview of the content
    fullContent?: string; // Optional: store full content, mindful of size
    timestamp: string; // ISO Date string
}

export interface NudgePathwayBlueprint {
  name: string;
  guidingEchoBitIds: string[];
  echoLinkMode: EchoLinkMode;
  shiftStrategy: ShiftStrategy;
  shiftScale: ShiftScale;
  activeCurriculumId: string | null;
  basePromptForCurriculum?: string;
}

export interface NudgePathwayRecord {
  id: string;
  name: string;
  blueprint: NudgePathwayBlueprint;
  echoClusterConfig: EchoClusterConfig;
  deltaShiftConfig: { strategy: ShiftStrategy, scale: ShiftScale };
  currentDeltaShiftState: DeltaShiftState;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  snapshots: PathwaySnapshot[];
  activeCurriculumId: string | null;
  basePromptForCurriculum?: string; // Stores the user-provided base prompt for an active curriculum
  curriculumProgress?: CurriculumProgress;
  generatedOutputs: GeneratedOutputLogEntry[];
}

export interface PathwaySnapshot {
  id: string;
  pathwayId: string;
  timestamp: string; // ISO Date string
  pathwayName: string; // Name of the pathway at time of snapshot
  deltaShiftConfig: { strategy: ShiftStrategy, scale: ShiftScale };
  echoClusterConfig: EchoClusterConfig;
  currentDeltaShiftStateValues: { // Only values, not full state object with methods
    currentVersion: string;
    shiftCount: number;
    activeEchoDisplay: string;
    // Consider if traceLog snapshot should be full or summarized
    traceLog: TraceLogEntry[]; 
  };
  activeCurriculumId: string | null;
  curriculumProgress?: CurriculumProgress; // Snapshot of progress
  generatedOutputsSnapshot: GeneratedOutputLogEntry[]; // Snapshot of generated outputs
  kernelVersion: string;
  uiVersion: string;
}

// Main application view state
export type AppView = 
  | 'main' // KernelConsole or Welcome
  | 'configurator' // NudgePathwayConfigurator
  | 'monitor' // ActiveNudgePathwayMonitor
  | 'echobit_forge' // EchoBitGenesisChamber
  | 'echobit_database' // EchoBitDatabaseViewer
  | 'snapshot_viewer'; // PathwaySnapshotViewer
  // Add other views as the NudgeKernel system expands
