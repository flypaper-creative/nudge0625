
// File: src/styles/GlobalAppStyles.tsx
import React from 'react';

export const GlobalAppStyles: React.FC = () => (
  <style>{`
    :root {
      --ql-bg-primary: #1e1e1e; /* Main background */
      --ql-bg-secondary: #252526; /* Panel backgrounds */
      --ql-bg-tertiary: #2d2d30; /* Slightly lighter elements */
      --ql-surface-interactive: #3e3e42; /* Buttons, inputs */
      --ql-surface-hover: #4a4a4e;

      --ql-text-primary: #d4d4d4; /* Main text */
      --ql-text-secondary: #a0a0a0; /* Muted text */
      --ql-text-disabled: #6c6c6c;

      --ql-accent-cyan: #00bcd4; /* Primary accent */
      --ql-accent-cyan-rgb: 0, 188, 212;
      --ql-accent-amber: #ffc107; /* Secondary accent / Warnings */
      --ql-accent-red: #f44336; /* Errors / DANGER */
      --ql-accent-green: #4caf50; /* Success */

      --ql-border-color: #3f3f46;
      --ql-border-color-strong: #5a5a60;

      --ql-font-main: 'IBM Plex Sans', sans-serif;
      --ql-font-code: 'Source Code Pro', monospace;

      --ql-header-height: 60px;
      --ql-footer-height: 40px;
      --ql-explorer-width: 320px; /* Increased slightly for better readability */
      --ql-border-radius: 4px;
      --ql-spacing-unit: 8px;
      --ql-transition-fast: 0.15s ease-out;
    }

    *, *::before, *::after { box-sizing: border-box; }

    body {
      margin: 0;
      background-color: var(--ql-bg-primary);
      color: var(--ql-text-primary);
      font-family: var(--ql-font-main);
      font-size: 16px;
      line-height: 1.6;
      overflow: hidden; /* Prevent body scroll, manage within layout */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #root, .modular-shard-system-interface {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* Header */
    .ql-header {
      background-color: var(--ql-bg-secondary);
      border-bottom: 1px solid var(--ql-border-color-strong);
      padding: 0 calc(var(--ql-spacing-unit) * 2);
      height: var(--ql-header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .ql-header h1 {
      font-family: var(--ql-font-code);
      font-size: 1.25rem;
      color: var(--ql-accent-cyan);
      margin: 0;
      letter-spacing: 0.5px;
    }
    .ql-header nav button {
      background: none;
      border: 1px solid var(--ql-border-color);
      color: var(--ql-text-secondary);
      padding: calc(var(--ql-spacing-unit) * 0.75) calc(var(--ql-spacing-unit) * 1.5);
      margin-left: var(--ql-spacing-unit);
      border-radius: var(--ql-border-radius);
      cursor: pointer;
      transition: background-color var(--ql-transition-fast), color var(--ql-transition-fast), border-color var(--ql-transition-fast);
    }
    .ql-header nav button:hover:not(:disabled) {
      background-color: var(--ql-surface-interactive);
      color: var(--ql-text-primary);
      border-color: var(--ql-accent-cyan);
    }
    .ql-header nav button:disabled {
      background-color: var(--ql-surface-interactive) !important; /* Ensure override */
      color: var(--ql-accent-cyan) !important;
      border-color: var(--ql-accent-cyan) !important;
      cursor: default;
      opacity: 1;
    }

    /* Main Workspace */
    .ql-main-workspace {
      display: flex;
      flex-grow: 1;
      overflow: hidden; 
    }

    /* Shard Complex Explorer (Left Panel) */
    .ql-shard-explorer {
      width: var(--ql-explorer-width);
      min-width: var(--ql-explorer-width);
      background-color: var(--ql-bg-secondary);
      border-right: 1px solid var(--ql-border-color-strong);
      padding: var(--ql-spacing-unit);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .ql-shard-explorer h3 {
      font-family: var(--ql-font-main);
      font-weight: 500;
      font-size: 1.1rem;
      color: var(--ql-text-primary);
      margin: var(--ql-spacing-unit) 0 calc(var(--ql-spacing-unit) * 1.5) 0;
      padding-bottom: var(--ql-spacing-unit);
      border-bottom: 1px solid var(--ql-border-color);
    }
    .ql-shard-explorer .new-shard-btn { /* Specific class for this button */
      width: 100%;
      margin-bottom: calc(var(--ql-spacing-unit) * 1.5);
    }
    .ql-shard-explorer ul {
      list-style: none;
      padding-left: 0; 
      margin: 0;
    }
    .ql-shard-explorer li > div { /* Wrapper for shard name and delete button */
       display: flex;
       align-items: center;
       justify-content: space-between;
       padding: calc(var(--ql-spacing-unit) * 0.5) var(--ql-spacing-unit);
       border-radius: var(--ql-border-radius);
       margin-bottom: calc(var(--ql-spacing-unit) * 0.25);
       transition: background-color var(--ql-transition-fast);
    }
    .ql-shard-explorer li > div:hover {
      background-color: var(--ql-surface-hover);
    }
    .ql-shard-explorer li.active-shard-node > div {
      background-color: var(--ql-surface-interactive);
    }
    .ql-shard-explorer li > div > span { /* Shard name part */
      cursor: pointer;
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ql-shard-explorer li.active-shard-node > div > span {
      color: var(--ql-accent-cyan);
      font-weight: 500;
    }
    .ql-shard-explorer li ul { 
        padding-left: calc(var(--ql-spacing-unit) * 1.5); /* Indent for nested lists */
        border-left: 1px dashed var(--ql-border-color);
        margin-left: calc(var(--ql-spacing-unit) * 0.75); 
        margin-top: calc(var(--ql-spacing-unit) * 0.25);
    }
    .ql-shard-explorer .delete-shard-btn {
        padding: calc(var(--ql-spacing-unit) * 0.25) calc(var(--ql-spacing-unit) * 0.75);
        font-size: 0.7rem;
        margin-left: var(--ql-spacing-unit);
        line-height: 1; /* Ensure X is centered */
        min-width: auto; /* Allow button to shrink */
    }

    .verification-status-unverified { color: var(--ql-accent-amber); }
    .verification-status-user-verified { color: var(--ql-accent-green); }
    .verification-status-source-verified { color: var(--ql-accent-green); font-weight: bold; }
    .verification-status-verification-failed { color: var(--ql-accent-red); }
    .verification-status-verification-pending { color: var(--ql-accent-amber); font-style: italic; }
    .verification-status-system-verified { color: var(--ql-accent-cyan); }


    /* Main Content Area (Right Panel) */
    .ql-main-content-area {
      flex-grow: 1;
      padding: calc(var(--ql-spacing-unit) * 2);
      overflow-y: auto;
      background-color: var(--ql-bg-primary);
    }
    .ui-panel { /* Generic panel for Console, Creator, Editor */
        background-color: var(--ql-bg-secondary);
        padding: calc(var(--ql-spacing-unit) * 2);
        border-radius: var(--ql-border-radius);
        border: 1px solid var(--ql-border-color);
        margin-bottom: calc(var(--ql-spacing-unit) * 2);
    }
    .ui-panel > h2,
    .ui-panel > h3,
    .ui-panel > h4 { /* Panel titles */
      font-family: var(--ql-font-code);
      color: var(--ql-accent-cyan);
      margin-top: 0;
      margin-bottom: calc(var(--ql-spacing-unit) * 2);
      padding-bottom: var(--ql-spacing-unit);
      border-bottom: 1px solid var(--ql-border-color);
      font-weight: 500;
    }
    .ui-panel > h3 { font-size: 1.3rem; }
    .ui-panel > h4 { font-size: 1.15rem; }


    /* Form Elements */
    .form-group { margin-bottom: calc(var(--ql-spacing-unit) * 2); }
    .form-group label {
      display: block;
      color: var(--ql-text-secondary);
      margin-bottom: var(--ql-spacing-unit);
      font-size: 0.9rem;
      font-weight: 500;
    }
    .form-group input[type="text"],
    .form-group input[type="password"],
    .form-group input[type="email"],
    .form-group input[type="number"],
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: calc(var(--ql-spacing-unit) * 1.25);
      background-color: var(--ql-surface-interactive);
      border: 1px solid var(--ql-border-color);
      border-radius: var(--ql-border-radius);
      color: var(--ql-text-primary);
      font-family: var(--ql-font-main);
      font-size: 1rem;
      transition: border-color var(--ql-transition-fast), box-shadow var(--ql-transition-fast);
    }
    .form-group input[type="text"]:focus,
    .form-group input[type="password"]:focus,
    .form-group input[type="email"]:focus,
    .form-group input[type="number"]:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--ql-accent-cyan);
      box-shadow: 0 0 0 2px rgba(var(--ql-accent-cyan-rgb), 0.3);
    }
    .form-group textarea {
      min-height: 100px;
      resize: vertical;
      font-family: var(--ql-font-code);
    }
    
    /* Buttons */
    button, .button-mimic {
      background-color: var(--ql-accent-cyan);
      color: var(--ql-bg-primary) !important; /* Ensure high contrast */
      border: none;
      padding: calc(var(--ql-spacing-unit) * 1.25) calc(var(--ql-spacing-unit) * 2);
      border-radius: var(--ql-border-radius);
      cursor: pointer;
      font-family: var(--ql-font-main);
      font-weight: 500;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: background-color var(--ql-transition-fast), transform var(--ql-transition-fast), box-shadow var(--ql-transition-fast);
      text-decoration: none; /* For button-mimic links */
      display: inline-block;
      line-height: normal; /* Reset line-height */
    }
    button:hover:not(:disabled), .button-mimic:hover:not(:disabled) {
      background-color: #00acc1; /* Slightly darker cyan */
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    button:disabled, .button-mimic[aria-disabled="true"] {
      background-color: var(--ql-surface-interactive) !important;
      color: var(--ql-text-disabled) !important;
      cursor: not-allowed;
      opacity: 0.7;
      transform: none;
      box-shadow: none;
    }
    button.secondary-action {
      background-color: var(--ql-surface-interactive);
      color: var(--ql-text-secondary) !important;
      border: 1px solid var(--ql-border-color);
    }
    button.secondary-action:hover:not(:disabled) {
      background-color: var(--ql-surface-hover);
      color: var(--ql-text-primary) !important;
      border-color: var(--ql-text-secondary);
    }
    button.danger-action {
      background-color: var(--ql-accent-red);
      color: white !important;
    }
    button.danger-action:hover:not(:disabled) {
      background-color: #d32f2f; /* Darker red */
    }

    /* Editor Specifics */
    .shard-editor-panel .editor-section {
      margin-top: calc(var(--ql-spacing-unit) * 2.5);
      padding-top: calc(var(--ql-spacing-unit) * 2);
      border-top: 1px solid var(--ql-border-color);
    }
    .shard-editor-panel .editor-section h4 { /* Sub-section titles in editor */
      font-size: 1rem;
      color: var(--ql-text-secondary);
      margin-bottom: var(--ql-spacing-unit);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    .shard-editor-panel .info-bar {
        display: flex; flex-wrap: wrap; gap: var(--ql-spacing-unit);
        font-size: 0.85rem; color: var(--ql-text-secondary); margin-bottom: calc(var(--ql-spacing-unit)*2);
        padding-bottom: var(--ql-spacing-unit);
        border-bottom: 1px dashed var(--ql-border-color);
    }
    .shard-editor-panel .info-bar span { 
        padding: calc(var(--ql-spacing-unit)*0.5) var(--ql-spacing-unit); 
        background-color: var(--ql-bg-tertiary); 
        border-radius: var(--ql-border-radius); 
    }
    .shard-editor-panel .source-list-item {
        display:flex; 
        justify-content:space-between; 
        align-items:center; 
        margin-bottom:calc(var(--ql-spacing-unit)/2); 
        font-size:0.9em; padding:calc(var(--ql-spacing-unit)/2); 
        background:var(--ql-bg-tertiary);
        border-radius: var(--ql-border-radius);
    }
    .shard-editor-panel .source-list-item button { /* Small remove button for sources */
        padding: calc(var(--ql-spacing-unit) * 0.25) calc(var(--ql-spacing-unit) * 0.75);
        font-size: 0.7rem;
        line-height: 1;
        min-width: auto;
    }


    /* AI Loading Indicator */
    .ql-ai-loading-indicator {
      position: fixed;
      top: calc(var(--ql-header-height) + var(--ql-spacing-unit));
      right: calc(var(--ql-spacing-unit) * 2);
      background-color: var(--ql-accent-amber);
      color: var(--ql-bg-primary) !important;
      padding: var(--ql-spacing-unit) calc(var(--ql-spacing-unit) * 2);
      border-radius: var(--ql-border-radius);
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      z-index: 2000; /* Above toast default z-index */
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    /* Footer */
    .ql-footer {
      background-color: var(--ql-bg-secondary);
      border-top: 1px solid var(--ql-border-color-strong);
      padding: 0 calc(var(--ql-spacing-unit) * 2);
      height: var(--ql-footer-height);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ql-text-secondary);
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    
    /* Console specific */
    .system-console-list { /* Renamed from .system-console ul for specificity */
      list-style: none;
      padding-left: 0;
      max-height: 200px; /* Example height for scroll */
      overflow-y: auto;
      border: 1px solid var(--ql-border-color);
      padding: var(--ql-spacing-unit);
      border-radius: var(--ql-border-radius);
    }
    .system-console-list li {
      background-color: var(--ql-bg-tertiary);
      padding: var(--ql-spacing-unit);
      border-radius: var(--ql-border-radius);
      margin-bottom: var(--ql-spacing-unit);
      font-family: var(--ql-font-code);
      font-size: 0.9rem;
      border-left: 3px solid var(--ql-accent-cyan);
      word-break: break-word;
    }
    .system-console-list li:last-child {
        margin-bottom: 0;
    }
    .principles-list li {
        border-left-color: var(--ql-accent-amber) !important; /* Differentiate principles list */
    }
    .empty-message { /* General empty state message */
      color: var(--ql-text-secondary);
      font-style: italic;
      text-align: center;
      padding: calc(var(--ql-spacing-unit)*2);
    }

    /* Custom Scrollbars for Webkit */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--ql-bg-tertiary);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--ql-surface-interactive);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--ql-surface-hover);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      :root {
        --ql-explorer-width: 250px;
        --ql-header-height: 50px;
        --ql-footer-height: 35px;
      }
      .ql-header h1 { font-size: 1.1rem; }
      .ql-header nav button { 
        padding: calc(var(--ql-spacing-unit) * 0.5) var(--ql-spacing-unit);
        font-size: 0.8rem;
      }
      .ql-main-workspace {
        flex-direction: column; /* Stack explorer and content */
      }
      .ql-shard-explorer {
        width: 100%;
        height: 35vh; /* Fixed portion for explorer on mobile */
        border-right: none;
        border-bottom: 1px solid var(--ql-border-color-strong);
      }
      .ql-main-content-area {
        height: calc(100% - 35vh); /* Remaining for content */
      }
      .shard-editor-panel .info-bar { font-size: 0.8rem; }
    }

  `}</style>
);
