
import React from 'react';

// Renamed AethericHarmonics to ClarityWaveFX
export const ClarityWaveFX: React.FC = () => (
  <style>{`
    :root {
      --clr-bg-deep-void: #070A18; /* Deepest background */
      --clr-bg-void: #0B0F20; /* General background for main content */
      --clr-surface-primary: #12182B; /* Primary surface for panels, cards */
      --clr-surface-secondary: #1A2035; /* Secondary surface, slightly lighter */
      --clr-surface-tertiary: #232A44; /* For interactive elements or highlights */

      --clr-accent-primary-glacial: #00E5FF; /* Glacial Blue - Primary Accent */
      --clr-accent-primary-glacial-rgb: 0, 229, 255;
      --clr-accent-secondary-pulsar: #B026FF; /* Pulsar Violet - Secondary Accent */
      --clr-accent-secondary-pulsar-rgb: 176, 38, 255;
      --clr-accent-tertiary-gold: #FFD700; /* Quantum Gold - For data/special logs */
      
      --clr-text-primary-starlight: #F0F8FF; /* Starlight White - Main text */
      --clr-text-secondary-silver: #A0B0C0; /* Cyber Silver - Secondary text, muted */
      --clr-text-disabled: #607080;

      --clr-border-faint: rgba(0, 229, 255, 0.15); /* Faint Glacial Blue for subtle borders */
      --clr-border-medium: rgba(0, 229, 255, 0.3);
      --clr-border-strong: rgba(0, 229, 255, 0.5);

      --clr-status-error-solar: #FF4D4D;
      --clr-status-success-verdant: #39FF14;
      --clr-status-warning-amber: #FFBF00;
      --clr-status-info-azure: var(--clr-accent-primary-glacial);


      --font-family-main: 'Roboto', sans-serif;
      --font-family-accent: 'Orbitron', sans-serif; /* For titles, headers */

      --deck-panel-main-width: 320px;
      --header-height: 97px; /* Approximate height based on content */
      --footer-height: 48px;

      --transition-speed-fast: 0.15s;
      --transition-speed-medium: 0.25s;
      --border-radius-small: 4px;
      --border-radius-medium: 6px;
      --border-radius-large: 8px;

      --box-shadow-light: 0 2px 8px rgba(0,0,0,0.3);
      --box-shadow-medium: 0 4px 15px rgba(var(--clr-accent-primary-glacial-rgb), 0.1);
      --box-shadow-strong: 0 6px 20px rgba(var(--clr-accent-secondary-pulsar-rgb), 0.15);
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    html {
      font-size: 16px; /* Base font size */
    }

    body {
      margin: 0;
      font-family: var(--font-family-main);
      background-color: var(--clr-bg-deep-void);
      color: var(--clr-text-primary-starlight);
      line-height: 1.65;
      overflow-x: hidden; /* Prevent horizontal scroll on body */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #root {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .kernel-superstructure {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .kernel-header {
      background-color: var(--clr-surface-primary);
      padding: 15px 25px;
      text-align: center;
      border-bottom: 1px solid var(--clr-border-medium);
      box-shadow: var(--box-shadow-medium);
      position: sticky;
      top: 0;
      z-index: 1000; /* Keep header on top */
    }
    .kernel-header h1 {
      font-family: var(--font-family-accent);
      color: var(--clr-accent-primary-glacial);
      font-size: 1.7rem; /* Slightly reduced for balance */
      font-weight: 700; /* Bolder Orbitron */
      margin: 0 0 10px 0;
      letter-spacing: 1.5px;
      text-shadow: 0 0 5px rgba(var(--clr-accent-primary-glacial-rgb), 0.5);
    }
    .kernel-navigation {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    /* General Button Styles - to be refined by specific button classes */
    button, .button-mimic {
      font-family: var(--font-family-accent);
      background-color: var(--clr-accent-primary-glacial);
      color: var(--clr-bg-deep-void) !important; /* High contrast for primary action */
      border: none;
      padding: 10px 18px;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all var(--transition-speed-medium) ease;
      text-decoration: none; 
      display: inline-block;
      line-height: 1.2; /* Ensure text is centered */
    }
    button:hover:not(:disabled), .button-mimic:hover:not(:disabled) {
      background-color: var(--clr-accent-secondary-pulsar);
      color: var(--clr-text-primary-starlight) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(var(--clr-accent-secondary-pulsar-rgb), 0.3);
    }
    button:focus-visible, .button-mimic:focus-visible {
        outline: 2px solid var(--clr-accent-secondary-pulsar);
        outline-offset: 2px;
    }
    button:disabled, .button-mimic:disabled {
      background-color: var(--clr-surface-tertiary) !important;
      color: var(--clr-text-disabled) !important;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      opacity: 0.7;
    }

    /* Navigation Buttons */
    .nav-button {
      background-color: transparent;
      color: var(--clr-text-secondary-silver) !important;
      border: 1px solid var(--clr-border-faint);
      padding: 8px 14px; /* Slightly smaller */
      font-size: 0.8rem;
    }
    .nav-button:hover:not(:disabled) {
      color: var(--clr-accent-primary-glacial) !important;
      border-color: var(--clr-accent-primary-glacial);
      background-color: rgba(var(--clr-accent-primary-glacial-rgb), 0.1);
      transform: translateY(-1px); /* Subtle lift */
      box-shadow: none;
    }
    .nav-button:disabled { /* Active nav button style */
      color: var(--clr-accent-primary-glacial) !important;
      border-color: var(--clr-accent-primary-glacial) !important;
      background-color: rgba(var(--clr-accent-primary-glacial-rgb), 0.2) !important;
      cursor: default;
      opacity: 1;
      transform: none;
    }
    
    /* Secondary Action Buttons */
    button.secondary-action, .button-mimic.secondary-action {
      background-color: var(--clr-surface-secondary);
      color: var(--clr-accent-primary-glacial) !important;
      border: 1px solid var(--clr-accent-primary-glacial);
    }
    button.secondary-action:hover:not(:disabled), .button-mimic.secondary-action:hover:not(:disabled) {
      background-color: var(--clr-surface-tertiary);
      border-color: var(--clr-accent-secondary-pulsar);
      color: var(--clr-accent-secondary-pulsar) !important;
      box-shadow: 0 2px 8px rgba(var(--clr-accent-secondary-pulsar-rgb), 0.2);
    }

    /* Revert/Destructive Action Buttons */
    button.revert-shift-button, button.destructive-action {
      background-color: var(--clr-status-error-solar) !important;
      color: var(--clr-text-primary-starlight) !important;
      border: 1px solid rgba(255,255,255,0.2);
    }
    button.revert-shift-button:hover:not(:disabled), button.destructive-action:hover:not(:disabled) {
      background-color: #D94040 !important; /* Darker red on hover */
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(255, 77, 77, 0.3);
    }


    .kernel-layout {
      display: flex;
      flex-grow: 1;
      overflow: hidden; /* Critical for independent scrolling columns */
    }

    .pathway-deck { /* Sidebar for NudgePathways */
      width: var(--deck-panel-main-width);
      min-width: var(--deck-panel-main-width); /* Prevent shrinking */
      background-color: var(--clr-surface-primary);
      padding: 20px;
      border-right: 1px solid var(--clr-border-medium);
      display: flex;
      flex-direction: column;
      /* Height calculation to allow independent scroll */
      height: calc(100vh - var(--header-height) - var(--footer-height)); 
      overflow-y: auto;
    }
    .pathway-deck h2 {
      font-family: var(--font-family-accent);
      font-size: 1.4rem; /* Adjusted size */
      color: var(--clr-accent-secondary-pulsar);
      margin-top: 0;
      border-bottom: 1px solid var(--clr-border-faint);
      padding-bottom: 12px;
      font-weight: 500;
    }
    .new-pathway-btn { /* Specific button in pathway deck */
      width: 100%;
      margin-bottom: 20px;
      font-size: 0.9rem;
      padding: 12px 15px;
    }
    
    .pathway-scroll-list {
      flex-grow: 1;
      overflow-y: auto;
      margin-right: -15px; /* Hide scrollbar space */
      padding-right: 15px; /* Add padding back */
    }
    .pathway-link {
      background-color: var(--clr-surface-secondary);
      padding: 12px 18px;
      margin-bottom: 12px;
      border-radius: var(--border-radius-medium);
      border-left: 4px solid transparent; /* Placeholder for active state */
      cursor: pointer;
      transition: all var(--transition-speed-medium) ease;
      position: relative;
      box-shadow: var(--box-shadow-light);
    }
    .pathway-link:hover {
      background-color: rgba(var(--clr-accent-primary-glacial-rgb), 0.1);
      border-left-color: var(--clr-accent-primary-glacial);
      transform: translateX(4px);
    }
    .pathway-link.active {
      background-color: rgba(var(--clr-accent-secondary-pulsar-rgb), 0.15);
      border-left-color: var(--clr-accent-secondary-pulsar);
      box-shadow: 0 0 12px rgba(var(--clr-accent-secondary-pulsar-rgb), 0.3);
    }
    .pathway-link h4 {
      margin: 0 0 6px 0;
      font-family: var(--font-family-main);
      font-weight: 500;
      color: var(--clr-text-primary-starlight);
      font-size: 1rem;
    }
    .pathway-link p {
      margin: 0 0 4px 0;
      font-size: 0.8rem;
      color: var(--clr-text-secondary-silver);
    }
    .pathway-actions { /* Container for fork/delete buttons */
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
    }
    .terminate-pathway-btn, .fork-pathway-btn {
      background: transparent !important;
      border: none !important;
      color: var(--clr-text-secondary-silver) !important;
      font-size: 0.8rem !important; /* Smaller icon-like buttons */
      font-weight: normal !important;
      text-transform: none !important;
      padding: 4px 8px !important;
      line-height: 1;
      border-radius: var(--border-radius-small);
      transition: color var(--transition-speed-fast) ease, background-color var(--transition-speed-fast) ease;
      position: static; /* Ensure they are part of the flow */
    }
    .terminate-pathway-btn:hover {
      color: var(--clr-status-error-solar) !important;
      background-color: rgba(255, 77, 77, 0.1) !important;
    }
    .fork-pathway-btn:hover {
      color: var(--clr-accent-primary-glacial) !important;
      background-color: rgba(var(--clr-accent-primary-glacial-rgb), 0.1) !important;
    }

    .pathway-deck .disabled-feature-btn { 
        background-color: var(--clr-surface-secondary) !important;
        color: var(--clr-text-disabled) !important;
        border: 1px dashed var(--clr-border-faint) !important;
        cursor: not-allowed;
        opacity: 0.6;
    }
    .pathway-deck .disabled-feature-btn:hover {
        transform: none;
        box-shadow: none;
    }


    .main-content-deck {
      flex-grow: 1;
      padding: 25px;
      overflow-y: auto;
      background-color: var(--clr-bg-void); 
      height: calc(100vh - var(--header-height) - var(--footer-height));
    }

    /* Titles for main content views */
    .kernel-console h2, .pathway-configurator h2, .active-pathway-monitor h2, 
    .echobit-genesis-chamber h2, .echobit-database-viewer h2, .pathway-snapshot-viewer h2 {
        font-family: var(--font-family-accent);
        color: var(--clr-accent-primary-glacial);
        font-size: 1.8rem; /* Slightly smaller than header H1 */
        margin-top: 0;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--clr-border-medium);
        font-weight: 700;
        letter-spacing: 1px;
    }
    /* Sub-titles within main content views */
    .active-pathway-monitor h3, .echobit-genesis-chamber h3, .echobit-database-viewer h3, 
    .pathway-snapshot-viewer h3, .pathway-configurator h3, .kernel-console h3 {
      font-family: var(--font-family-accent);
      font-size: 1.4rem; /* Adjusted size */
      color: var(--clr-accent-secondary-pulsar);
      margin-top: 2em;
      margin-bottom: 1em;
      font-weight: 500;
      padding-bottom: 0.3em;
      border-bottom: 1px solid var(--clr-border-faint);
    }

    .ui-section { /* General purpose section wrapper */
      background-color: var(--clr-surface-primary);
      padding: 20px 25px;
      margin-bottom: 25px;
      border-radius: var(--border-radius-large);
      box-shadow: var(--box-shadow-light);
      border: 1px solid var(--clr-border-faint);
    }
    .ui-section h2 { /* For sections within a view that might use h2 as sub-sub-title */
      font-size: 1.4rem !important;
      border-bottom: 1px solid var(--clr-border-faint) !important;
      padding-bottom: 0.5em !important;
      margin-bottom: 1rem !important;
      color: var(--clr-accent-secondary-pulsar) !important;
      font-weight: 500 !important;
    }
     .ui-section h3 { /* For sub-sections within ui-section */
      font-size: 1.2rem !important; /* Standardized */
      color: var(--clr-accent-primary-glacial) !important;
      font-family: var(--font-family-accent) !important;
      font-weight: 400 !important;
      margin-top: 1.5em !important;
      margin-bottom: 0.8rem !important;
      padding-bottom: 0 !important;
      border-bottom: none !important;
    }
    
    /* Lists in Kernel Console */
    .kernel-principles-list, .kernel-features-list {
        list-style: none;
        padding-left: 20px;
    }
    .kernel-principles-list li, .kernel-features-list li {
      margin-bottom: 8px;
      padding-left: 10px;
      position: relative;
      font-size: 0.95rem;
    }
    .kernel-principles-list li::before { content: "✧"; color: var(--clr-accent-primary-glacial); position: absolute; left: -15px; font-size: 1.1em; }
    .kernel-features-list li::before { content: "✦"; color: var(--clr-accent-secondary-pulsar); position: absolute; left: -15px; font-size: 1.1em; }
    
    .kernel-features-details summary {
        cursor: pointer;
        color: var(--clr-accent-primary-glacial);
        margin-top: 15px;
        font-style: italic;
        font-size: 0.9rem;
        transition: color var(--transition-speed-fast) ease;
        display: inline-block;
    }
    .kernel-features-details summary:hover { color: var(--clr-accent-secondary-pulsar); text-decoration: underline;}
    .kernel-features-details[open] summary { margin-bottom: 10px; }

    /* Telemetry Grids */
    .kernel-telemetry-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;
      font-size: 0.9rem;
    }
    .kernel-telemetry-grid div {
      background-color: var(--clr-surface-secondary);
      padding: 12px 15px;
      border-radius: var(--border-radius-small);
      border-left: 3px solid var(--clr-accent-primary-glacial);
    }
    .kernel-telemetry-grid strong { color: var(--clr-accent-secondary-pulsar); }

    /* Form Styling */
    .form-group {
      margin-bottom: 20px;
    }
    .form-group legend {
      font-family: var(--font-family-accent);
      font-weight: 500;
      color: var(--clr-accent-primary-glacial);
      padding-bottom: 8px; 
      width: 100%; 
      border-bottom: 1px solid var(--clr-border-faint); 
      margin-bottom: 15px; 
      font-size: 1.1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--clr-text-secondary-silver);
      font-size: 0.9rem;
    }
    .form-group input[type="text"], 
    .form-group input[type="number"],
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px 12px;
      background-color: var(--clr-surface-secondary);
      border: 1px solid var(--clr-border-medium);
      border-radius: var(--border-radius-small);
      color: var(--clr-text-primary-starlight);
      font-size: 1rem;
      font-family: var(--font-family-main);
      transition: border-color var(--transition-speed-fast) ease, box-shadow var(--transition-speed-fast) ease;
    }
    .form-group input[type="text"]:focus, 
    .form-group input[type="number"]:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--clr-accent-primary-glacial);
      box-shadow: 0 0 8px rgba(var(--clr-accent-primary-glacial-rgb), 0.3);
    }
    .form-group textarea {
        min-height: 80px;
        resize: vertical;
    }
     .form-group input[type="checkbox"], .form-group input[type="radio"] {
        margin-right: 8px;
        accent-color: var(--clr-accent-secondary-pulsar);
        vertical-align: middle;
        height: 1em; width: 1em;
    }
    .form-group input[type="checkbox"] + span, .form-group input[type="radio"] + span {
        vertical-align: middle;
    }


    /* Shift Strategy Selectors in Configurator */
    .shift-strategy-selectors {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 15px;
    }
    
    /* EchoBit Glyph Grid (PathwayConfigurator, EchoBitDatabaseViewer) */
    .echo-glyph-grid, .echobit-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 1rem;
    }
    .echo-glyph, .echobit-card, .snapshot-card { /* Card style for EchoBits and Snapshots */
      background-color: var(--clr-surface-secondary);
      border: 1px solid var(--clr-border-faint);
      padding: 18px;
      border-radius: var(--border-radius-medium);
      transition: transform var(--transition-speed-medium) ease, box-shadow var(--transition-speed-medium) ease, border-color var(--transition-speed-medium) ease;
      display: flex;
      flex-direction: column;
      box-shadow: var(--box-shadow-light);
    }
    .echo-glyph { cursor: pointer; } /* Only glyphs are selectable */

    .echo-glyph:not(.disabled):hover, 
    .echo-glyph:not(.disabled):focus-visible { 
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(var(--clr-accent-primary-glacial-rgb), 0.2);
      border-color: var(--clr-accent-primary-glacial);
      outline: none;
    }
    .echo-glyph.selected {
      border-left: 5px solid var(--clr-accent-secondary-pulsar);
      background-color: var(--clr-surface-tertiary); 
      box-shadow: 0 0 10px rgba(var(--clr-accent-secondary-pulsar-rgb), 0.3);
      border-color: var(--clr-accent-secondary-pulsar);
    }
     .echo-glyph.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: var(--clr-surface-primary); 
      border-color: var(--clr-border-faint); 
    }
    .echo-glyph.disabled:hover,
    .echo-glyph.disabled:focus-visible { 
      transform: none; 
      box-shadow: var(--box-shadow-light); /* Keep original shadow */
    }
    .echo-glyph h4, .echobit-card h4, .snapshot-card h4 {
      font-family: var(--font-family-accent);
      color: var(--clr-accent-primary-glacial);
      margin-top: 0;
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
    .echo-glyph p, .echobit-card p, .snapshot-card p { 
        font-size: 0.85rem; 
        margin-bottom: 0.5em; 
        color: var(--clr-text-secondary-silver); 
        line-height: 1.5;
    }
    .echo-glyph strong, .echobit-card strong, .snapshot-card strong { 
        color: var(--clr-text-primary-starlight); 
        font-weight: 500;
    }
    .echobit-card ul {
        padding-left: 20px;
        margin: 5px 0;
        font-size: 0.85rem;
        color: var(--clr-text-secondary-silver);
    }
    .echobit-card li { margin-bottom: 3px; }

    /* EchoLinkModeSelector */
    .echo-link-mode-selector { 
        margin-top: 20px; 
        margin-bottom: 20px; 
        border: none; 
        padding: 15px;
        background-color: rgba(var(--clr-surface-secondary-rgb), 0.5);
        border-radius: var(--border-radius-medium);
    }
    .echo-link-mode-selector legend {
      font-family: var(--font-family-main);
      font-weight: 500; 
      color: var(--clr-text-secondary-silver);
      padding-bottom: 8px;
      margin-bottom: 10px; 
      font-size: 1rem; 
      display: block; 
    }
    .echo-link-mode-selector label { margin-right: 20px; font-size: 0.95rem; cursor: pointer; user-select: none;}
    .echo-link-mode-selector input[type="radio"] { margin-right: 8px; accent-color: var(--clr-accent-secondary-pulsar); vertical-align: middle; }
    .echo-link-mode-selector input[type="radio"]:disabled + span { opacity: 0.6; cursor: not-allowed; }
    
    /* Placeholder sections */
    .placeholder-ui-section {
        background-color: rgba(var(--clr-surface-primary-rgb), 0.7);
        border: 1px dashed var(--clr-border-faint);
        padding: 15px;
        margin-top: 20px;
        border-radius: var(--border-radius-small);
    }
    .placeholder-ui-section p {
        font-style: italic;
        color: var(--clr-text-secondary-silver);
        font-size: 0.9rem;
        margin:0;
    }
    
    /* Action button groups */
    .config-actions-group, .delta-shift-controls-group {
      display: flex;
      gap: 15px;
      margin-top: 25px;
      flex-wrap: wrap;
      align-items: center; /* Align items vertically */
    }
    
    /* DeltaShift Info Panel (ActivePathwayMonitor) */
    .delta-shift-info-panel {
        display: flex;
        justify-content: space-around; 
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 20px;
        padding: 15px;
        background-color: var(--clr-surface-secondary);
        border-radius: var(--border-radius-medium);
        font-family: var(--font-family-accent);
        font-size: 0.95rem;
    }
    .delta-shift-info-panel span {
        background-color: var(--clr-surface-tertiary);
        padding: 10px 18px;
        border-radius: var(--border-radius-small);
        text-align: center;
        flex-grow: 1; 
        min-width: 200px; 
        border: 1px solid var(--clr-border-faint);
    }
    .delta-shift-info-panel strong {
        color: var(--clr-accent-primary-glacial);
    }

    /* TraceLogViewer (SimulationLog) & similar log displays */
    .trace-log-viewer, .generated-outputs-log {
      background-color: var(--clr-bg-deep-void); /* Darker for logs */
      border: 1px solid var(--clr-border-faint);
      padding: 15px;
      border-radius: var(--border-radius-medium);
      margin-top: 10px;
      min-height: 150px; /* Ensure some height */
      max-height: 400px; 
      overflow-y: auto;
      font-family: 'Roboto Mono', 'Courier New', Courier, monospace;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .trace-log-viewer .log-entry-container {
        margin-bottom: 2px;
    }
    .trace-log-viewer p, .generated-outputs-log p {
        margin: 0 0 4px 0; 
        color: var(--clr-text-secondary-silver);
        white-space: pre-wrap;
        word-break: break-word;
        padding: 3px 5px;
        border-radius: var(--border-radius-small);
    }
    .trace-log-viewer p:hover {
        background-color: rgba(var(--clr-accent-primary-glacial-rgb), 0.05);
    }
    .trace-log-viewer p.editing {
        background-color: rgba(var(--clr-accent-secondary-pulsar-rgb), 0.1);
    }
    .trace-log-viewer .log-type-error { color: var(--clr-status-error-solar); font-weight: 500; }
    .trace-log-viewer .log-type-echo-log { color: var(--clr-accent-secondary-pulsar); }
    .trace-log-viewer .log-type-version-log { color: var(--clr-accent-primary-glacial); font-weight: 500; }
    .trace-log-viewer .log-type-data-ops { color: var(--clr-accent-tertiary-gold); }
    .trace-log-viewer .log-type-curriculum-log { color: var(--clr-status-success-verdant); font-style: italic; }
    .trace-log-viewer .log-type-info { color: var(--clr-text-secondary-silver); }
    .trace-log-viewer .log-annotation-badge {
        font-style: italic;
        color: var(--clr-accent-tertiary-gold);
        font-size: 0.8em;
        margin-left: 5px;
        padding: 1px 3px;
        background-color: rgba(var(--clr-accent-tertiary-gold-rgb), 0.1);
        border-radius: var(--border-radius-small);
    }
    .trace-log-viewer .annotation-editor {
        margin-left: 20px;
        margin-bottom: 10px;
        display: flex;
        gap: 8px;
        align-items: center;
    }
    .trace-log-viewer .annotation-editor input[type="text"] {
        flex-grow: 1;
        padding: 6px 8px; /* Smaller padding for inline editor */
    }
    .trace-log-viewer .annotation-editor button {
        padding: 6px 12px; /* Smaller padding */
        font-size: 0.8rem;
    }


    /* Display sections for strategy, link mode, curriculum progress etc. */
    .echo-link-display, .shift-strategy-display, .curriculum-progress-display {
        font-size: 0.9rem;
        padding: 12px 18px;
        background-color: rgba(var(--clr-accent-primary-glacial-rgb), 0.05); 
        border-left: 3px solid var(--clr-accent-primary-glacial);
        margin-top: 15px;
        border-radius: var(--border-radius-medium);
    }
    .echo-link-display p, .shift-strategy-display p, .curriculum-progress-display p { margin: 6px 0; }
    .echo-link-display strong, .shift-strategy-display strong, .curriculum-progress-display strong { color: var(--clr-accent-secondary-pulsar); }
    .curriculum-progress-display progress {
        width: 100%;
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
    }
    .curriculum-progress-display progress::-webkit-progress-bar {
        background-color: var(--clr-surface-tertiary);
    }
    .curriculum-progress-display progress::-webkit-progress-value {
        background-color: var(--clr-accent-secondary-pulsar);
        transition: width 0.5s ease;
    }
    .curriculum-progress-display progress::-moz-progress-bar { /* Firefox */
        background-color: var(--clr-accent-secondary-pulsar);
    }


    /* Error message styling */
    .error-message-text {
        color: var(--clr-status-error-solar);
        font-size: 0.85rem;
        margin-top: 5px;
        padding: 8px;
        background-color: rgba(255, 77, 77, 0.1);
        border: 1px solid rgba(255, 77, 77, 0.3);
        border-radius: var(--border-radius-small);
    }


    .kernel-footer {
      text-align: center;
      padding: 15px 20px;
      color: var(--clr-text-secondary-silver);
      border-top: 1px solid var(--clr-border-medium);
      background-color: var(--clr-surface-primary);
      font-size: 0.85rem;
      height: var(--footer-height);
      line-height: calc(var(--footer-height) - 30px); /* Vertically center text */
    }
    .kernel-footer p { margin: 0; }

    /* Custom Scrollbars */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: var(--clr-surface-secondary);
      border-radius: var(--border-radius-large);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--clr-accent-primary-glacial);
      border-radius: var(--border-radius-large);
      border: 2px solid var(--clr-surface-secondary); /* Creates padding around thumb */
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--clr-accent-secondary-pulsar);
    }
    
    /* Accessibility */
    .visually-hidden-label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Responsive Adjustments */
    @media (max-width: 992px) { 
        :root {
            --deck-panel-main-width: 280px;
        }
        .kernel-header h1 { font-size: 1.5rem; }
        .kernel-console h2, .pathway-configurator h2, .active-pathway-monitor h2, 
        .echobit-genesis-chamber h2, .echobit-database-viewer h2, .pathway-snapshot-viewer h2 {
            font-size: 1.6rem;
        }
        .active-pathway-monitor h3, .echobit-genesis-chamber h3, .echobit-database-viewer h3, 
        .pathway-snapshot-viewer h3, .pathway-configurator h3, .kernel-console h3 {
            font-size: 1.3rem;
        }
        .echo-glyph-grid, .echobit-grid, .snapshot-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
        .shift-strategy-selectors {
             grid-template-columns: 1fr; /* Stack on smaller screens */
        }
    }

    @media (max-width: 768px) { 
        html { font-size: 15px; }
        .kernel-layout {
            flex-direction: column; /* Stack sidebar and main content */
        }
        .pathway-deck {
            width: 100%;
            height: auto; /* Allow content to define height */
            max-height: 45vh; /* Limit height to avoid pushing content too far */
            border-right: none;
            border-bottom: 1px solid var(--clr-border-medium);
        }
        .main-content-deck {
            height: auto; /* Allow content to define height */
            padding: 20px;
        }
        .delta-shift-info-panel {
            flex-direction: column; /* Stack info items */
            gap: 8px;
        }
        .delta-shift-info-panel span {
            width: 100%; /* Full width items */
            min-width: unset;
        }
        .config-actions-group, .delta-shift-controls-group {
          flex-direction: column; /* Stack buttons */
        }
        .config-actions-group button, .delta-shift-controls-group button {
          width: 100%; /* Full width buttons */
        }
        .kernel-header { padding: 10px 15px; }
        .kernel-header h1 { font-size: 1.3rem; margin-bottom: 8px;}
        .nav-button { font-size: 0.75rem; padding: 6px 10px; }
        .snapshot-grid {
             grid-template-columns: 1fr;
        }
    }
    @media (max-width: 480px) {
        html { font-size: 14px; }
        .main-content-deck { padding: 15px; }
        .pathway-deck { padding: 15px; }
        .kernel-header h1 { font-size: 1.2rem; }
    }

  `}</style>
);