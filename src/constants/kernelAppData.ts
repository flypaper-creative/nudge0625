
import type { 
    EchoBit, 
    GuidingEchoAttributes, 
    ShiftStrategy, 
    ShiftScale, 
    DeltaShiftProtocolStep, 
    VersionHistory, 
    EchoBitStatus,
    BaseBitAttributes // Added for createVersionHistory, though not strictly needed by signature
} from '../types'; 

export const NUDGE_KERNEL_VERSION = "v21.0.0";
export const UI_VERSION = "v21.0.0";
export const NUDGE_KERNEL_BANNER = `NudgeKernel AI System (Kernel ${NUDGE_KERNEL_VERSION} / UI ${UI_VERSION})`;

const createVersionHistory = (current: string, notes: string, author = "kernel_prime", previousLog: { version: string, notes: string, timestamp: string, author: string }[] = []): VersionHistory => ({
  current,
  log: [...previousLog, { version: current, notes, timestamp: new Date().toISOString(), author }]
});

// PRIME_ECHO_BITS (Core guiding intelligences)
export const PRIME_ECHO_BITS: EchoBit<GuidingEchoAttributes>[] = [
  {
    echo_bit_id: "guidance-turing-prime", type: "guiding_echo", category: "Logical Analysis & Algorithmic Design",
    attributes: {
      title: "Turing Prime Echo",
      description: "Emphasizes logical rigor, algorithmic efficiency, and structured problem-solving. Ideal for technical and systematic tasks.",
      tags: ["Logic", "Algorithms", "Systematic", "ProblemSolving", "TechnicalPrecision"],
      authenticitySources: ["NudgeKernel Spec v21", "TPE-001 Verification Protocol"],
      legacyId: "turing-archetype-v3",
      influenceDomains: "Code Generation, System Architecture, Data Analysis, Process Optimization",
      coreTraits: "Analytical, Precise, Methodical, Efficient, Structured",
      epoch: "Cybernetic Enlightenment",
      coreFocus: "Logical Soundness & Algorithmic Purity",
    },
    functions: { compute: "N/A", validate: "N/A", render: "N/A" }, // Placeholder for potential future client-side execution
    version: createVersionHistory("3.1.0", "Enhanced precision in algorithmic suggestions."),
    status: "active" as EchoBitStatus, last_used: new Date().toISOString(), created_at: new Date().toISOString(), author: "kernel_prime", hash: "sha256-turing-prime-v3.1.0"
  },
  {
    echo_bit_id: "guidance-lovelace-visionary", type: "guiding_echo", category: "Creative Synthesis & Pattern Recognition",
    attributes: {
      title: "Lovelace Visionary Echo",
      description: "Fosters creative connections, pattern recognition, and imaginative solutions. Suited for design and conceptual tasks.",
      tags: ["Creativity", "Synthesis", "Visionary", "PatternRecognition", "ConceptualDesign"],
      authenticitySources: ["NudgeKernel Spec v21", "LVE-002 Verification Protocol"],
      legacyId: "lovelace-archetype-v3",
      influenceDomains: "Narrative Generation, UI/UX Design, Artistic Exploration, Strategic Brainstorming",
      coreTraits: "Imaginative, Holistic, Intuitive, Expressive, Associative",
      epoch: "Neo-Romantic Computation",
      coreFocus: "Novel Concept Generation & Aesthetic Harmony",
    },
    functions: { compute: "N/A", validate: "N/A", render: "N/A" },
    version: createVersionHistory("3.2.0", "Expanded associative matrix for novel concept generation."),
    status: "active" as EchoBitStatus, last_used: new Date().toISOString(), created_at: new Date().toISOString(), author: "kernel_prime", hash: "sha256-lovelace-visionary-v3.2.0"
  },
  {
    echo_bit_id: "guidance-davinci-nexus", type: "guiding_echo", category: "Interdisciplinary Integration & Holistic Systems",
    attributes: {
      title: "DaVinci Nexus Echo",
      description: "Promotes interdisciplinary thinking, holistic system views, and practical innovation. Balances creativity with utility.",
      tags: ["Interdisciplinary", "Holistic", "Innovation", "Practicality", "SystemsThinking"],
      authenticitySources: ["NudgeKernel Spec v21", "DNE-003 Verification Protocol"],
      legacyId: "davinci-archetype-v2",
      influenceDomains: "Product Development, Strategic Planning, Research Synthesis, User Experience Design",
      coreTraits: "Integrative, Pragmatic, Versatile, Resourceful, User-Centric",
      epoch: "Renaissance Mechanica",
      coreFocus: "Synergistic Solutions & Real-World Applicability",
    },
    functions: { compute: "N/A", validate: "N/A", render: "N/A" },
    version: createVersionHistory("2.5.0", "Refined balance between exploratory and convergent thought processes."),
    status: "active" as EchoBitStatus, last_used: new Date().toISOString(), created_at: new Date().toISOString(), author: "kernel_prime", hash: "sha256-davinci-nexus-v2.5.0"
  }
];


export const SHIFT_STRATEGY_PROFILES: Record<ShiftStrategy, string> = {
  exploratory: "Broad exploration, high variability, good for initial discovery.",
  convergent_refinement: "Focuses on refining existing concepts, reduces variability.",
  standard_toggle: "Alternates between two Guiding Echos for diverse perspectives.",
  standard_fusion: "Merges the influence of two Guiding Echos for combined guidance.",
  adversarial_dynamics: "Pits two Guiding Echos against each other to find novel compromises or robust solutions (conceptual).",
  meta_adaptive_heuristic: "Dynamically adjusts strategy based on pathway performance and goals (conceptual, kernel-driven)."
};

export const SHIFT_SCALE_PROFILES: Record<ShiftScale, string> = {
  micro: "Small, incremental changes, fine-tuning.",
  meso: "Moderate changes, balancing refinement and exploration.",
  macro: "Large, significant changes, potential for paradigm shifts.",
  meta_adaptive: "Scale adjusts dynamically based on NudgeKernel assessment (conceptual)."
};

// DeltaShift Protocols (Conceptual sequence of operations within a shift)
const DELTA_PROTOCOLS: Record<ShiftStrategy, DeltaShiftProtocolStep[]> = {
    exploratory: [
        "Initiate Broad Scan & Ideation Matrix",
        "Generate Diverse Candidate Set (High Entropy)",
        "Apply Novelty Filters & Outlier Detection",
        "Capture Emergent Patterns & Themes",
        "Output: Varied Concepts & Potential Directions",
    ],
    convergent_refinement: [
        "Analyze Current State & Target Parameters",
        "Apply Focused Refinement Heuristics",
        "Iterate with Incremental Improvements (Low Entropy)",
        "Validate Against Quality Metrics",
        "Output: Optimized Version of Input",
    ],
    standard_toggle: [
        "Engage Primary Guiding Echo (Alpha Phase)",
        "Process Input through Alpha Echo Logic",
        "Capture Alpha Phase Output & Insights",
        "Engage Secondary Guiding Echo (Beta Phase)",
        "Process Input/Alpha Output through Beta Echo Logic",
        "Capture Beta Phase Output & Synthesize",
        "Output: Hybrid or Sequentially Enhanced Result",
    ],
    standard_fusion: [
        "Initialize Fusion Matrix with Selected Guiding Echos",
        "Concurrently Process Input through All Linked Echos",
        "Synthesize Weighted Outputs & Resolve Conflicts",
        "Apply Coherence Filters to Fused Result",
        "Output: Integrated Solution Reflecting Multiple Echoes",
    ],
    adversarial_dynamics: [ // Conceptual
        "Establish Adversarial Framework: Echo A (Proponent) vs Echo B (Critique)",
        "Echo A Generates Initial Proposal",
        "Echo B Analyzes Proposal for Flaws/Weaknesses",
        "Echo A Revises Based on Critique",
        "Repeat Critique-Revise Cycle (N iterations)",
        "Output: Robust Solution or Identified Irreconcilable Differences",
    ],
    meta_adaptive_heuristic: [ // Conceptual, Kernel-driven
        "NudgeKernel Analyzes Pathway Telemetry & Goals",
        "Select Optimal Sub-Strategy (e.g., Exploratory then Convergent)",
        "Execute Selected Sub-Strategy Steps",
        "Evaluate Progress & Adapt Next Sub-Strategy",
        "Output: Dynamically Guided Result",
    ]
};

export const getDeltaProtocolSteps = (strategy: ShiftStrategy, _scale: ShiftScale): DeltaShiftProtocolStep[] => {
  // Scale might influence the depth or parameters of these steps in a more complex system
  return DELTA_PROTOCOLS[strategy] || DELTA_PROTOCOLS.exploratory; // Default to exploratory
};

export const NUDGE_APP_NAME = "NudgeKernel AI System";
export const KERNEL_GUIDING_PRINCIPLES: string[] = [
  "Foster Emergent Intelligence through Iteration.",
  "Prioritize Verifiable Data Integrity and Traceability.",
  "Enable Diverse Perspectives via EchoBit Architecture.",
  "Facilitate Adaptive Evolution with Varied DeltaShift Strategies.",
  "Promote User-Guided Exploration and Discovery."
];
export const KERNEL_ADVANCED_FEATURES: string[] = [
  "Multi-Step Iteration Curriculums with AI Content Generation.",
  "NudgePathway Snapshotting for State Comparison.",
  "Predictive Shift Advisor (powered by Gemini AI).",
  "Custom EchoBit Forging and Database Management.",
  "Interactive Trace Log Annotation for Enhanced Auditing.",
  "Pathway Forking for Branching Exploration.",
  "Dynamic DeltaShift Protocols based on Strategy and Scale.",
  "Robust (Simulated) Data Integrity and Anomaly Detection Frameworks.",
  "Configurable EchoLink Modes (Toggle/Fusion) for Guiding Echos.",
  "Meta-Adaptive Strategies (Conceptual) for Autonomous Optimization."
];