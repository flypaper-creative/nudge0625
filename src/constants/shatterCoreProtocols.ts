// Modular Shard System Interface (Codename: QuantumLattice) v1.0.0
// File: src/constants/shardSystemConfig.ts

export const SHARD_ENGINE_VERSION = "v1.0.0-QL";
export const SHARD_UI_VERSION = "v1.0.0-QL";
export const SHARD_SYSTEM_BANNER = `Modular Shard System (QuantumLattice ${SHARD_ENGINE_VERSION} / UI ${SHARD_UI_VERSION})`;

export const DEFAULT_SHARD_TYPES: { type: string, description: string, atomicDefault: boolean }[] = [
  { type: "generic_data_container", description: "A generic container for any type of data.", atomicDefault: false },
  { type: "text_document", description: "Holds plain or rich text content.", atomicDefault: true },
  { type: "structured_json_object", description: "Stores data as a JSON object.", atomicDefault: true },
  { type: "media_reference", description: "Contains metadata and link to a media file.", atomicDefault: true },
  { type: "event_log_entry", description: "An individual log entry or event.", atomicDefault: true },
  { type: "user_profile_segment", description: "A specific piece of user profile information.", atomicDefault: true },
  { type: "configuration_settings", description: "System or component configuration data.", atomicDefault: false },
  { type: "workflow_step_definition", description: "Defines a step in a larger process.", atomicDefault: true },
  { type: "legal_clause", description: "A specific clause or section of a legal document.", atomicDefault: true },
  { type: "evidence_item_meta", description: "Metadata about a piece of evidence.", atomicDefault: true },
  { type: "test_case_data", description: "Input or output data for a test case.", atomicDefault: true },
  { type: "meeting_notes_segment", description: "A segment or action item from meeting notes.", atomicDefault: true },
];

export const CORE_PRINCIPLES_SHARD_SYSTEM: string[] = [
  "Atomicity: Shards represent the smallest indivisible unit of meaning in their context.",
  "Modularity: Shards are self-contained and independently manageable.",
  "Hierarchy: Shards can be nested to create complex data structures.",
  "Versioning: All significant changes to shard data or critical metadata are versioned.",
  "Verifiability: Each shard version's integrity and sourcing can be meticulously tracked and verified.",
  "Traceability: Actions and changes within the system are auditable.",
  "Scalability: The system architecture supports growth by adding or distributing shards.",
  "Flexibility: The generic nature of shards allows diverse applications and data types."
];

// Example of how specific case context (like MAYORGATE) could be defined via shard types and structures
export const MAYORGATE_CASE_SHARD_TYPES_EXAMPLE: string[] = [
  "mayorgate_case_overview",
  "mayorgate_timeline_event",
  "mayorgate_evidence_log_mdpde", // MDPD Evidence
  "mayorgate_legal_motion_jd", // Joshua Durden's motions
  "mayorgate_violation_record_court",
  "mayorgate_harm_impact_assessment_jd",
  "mayorgate_statutory_reference_papachristou"
];
