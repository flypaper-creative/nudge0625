
import React from 'react';
import { KERNEL_GUIDING_PRINCIPLES, KERNEL_ADVANCED_FEATURES, NUDGE_KERNEL_VERSION } from '../constants/kernelAppData';

interface KernelConsoleProps {
  message?: string;
}

export const KernelConsole: React.FC<KernelConsoleProps> = ({ message }) => {
  if (message) {
    return (
      <div className="kernel-console ui-section" role="alertdialog" aria-labelledby="system-notification-title">
        <h2 id="system-notification-title" style={{color: 'var(--clr-accent-secondary-pulsar)'}}>System Notification</h2>
        <p style={{fontSize: '1.1rem', color: 'var(--clr-text-secondary-silver)', border: '1px solid var(--clr-border-medium)', padding: '20px', borderRadius: 'var(--border-radius-medium)', backgroundColor: 'var(--clr-surface-secondary)'}}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="kernel-console" aria-labelledby="kernel-console-title">
      <h2 id="kernel-console-title">NudgeKernel {NUDGE_KERNEL_VERSION} Interface Active</h2>
      <p className="kernel-tagline" style={{textAlign: 'left', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '1.8rem', color: 'var(--clr-text-secondary-silver)'}}>
          Welcome to the NudgeKernel, an advanced AI platform for guided system evolution.
          The Kernel leverages EchoBit architecture, diversified DeltaShift strategies, and robust data integrity protocols.
          Each DeltaShift represents a precise unit of computational effort, guided by selected strategies and Guiding Echos.
          Configure or select a NudgePathway from the left panel to begin.
      </p>

      <section className="ui-section kernel-telemetry-section" aria-labelledby="kernel-telemetry-title-main">
        <h3 id="kernel-telemetry-title-main">Kernel System Telemetry</h3>
        <div className="kernel-telemetry-grid">
          <div><strong>Designation:</strong> NudgeKernel {NUDGE_KERNEL_VERSION}</div>
          <div><strong>Core Architecture:</strong> EchoBit Guided Evolution Matrix</div>
          <div><strong>Integrity Protocol:</strong> ClarityLock vXIII.delta (Data Integrity Verified)</div>
          <div><strong>Operational Mode:</strong> Diversified Autonomous DeltaShifts & AI Meta-Cognition</div>
          <div><strong>EchoBit Status:</strong> Integrity Verified - Zero Authenticity Deviations</div>
          <div><strong>Data Pipeline:</strong> Automated Purification & Anomaly Monitoring - Optimal Flow</div>
          <div><strong>MetaCognition Network:</strong> Active for Adaptive Shift Strategy Optimization</div>
        </div>
      </section>

      <section className="ui-section" aria-labelledby="kernel-principles-title-main">
        <h3 id="kernel-principles-title-main">Kernel Guiding Principles</h3>
        <ul className="kernel-principles-list">
          {KERNEL_GUIDING_PRINCIPLES.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </section>

      <section className="ui-section" aria-labelledby="kernel-features-title-main">
        <h3 id="kernel-features-title-main">Kernel Advanced Features</h3>
        <ul className="kernel-features-list">
          {KERNEL_ADVANCED_FEATURES.slice(0,5).map((item, index) => <li key={index}>{item}</li>)}
        </ul>
        {KERNEL_ADVANCED_FEATURES.length > 5 && <details className="kernel-features-details">
          <summary>Reveal all {KERNEL_ADVANCED_FEATURES.length} Advanced Kernel Features...</summary>
          <ul className="kernel-features-list" style={{marginTop: '10px'}}>
              {KERNEL_ADVANCED_FEATURES.slice(5).map((item, index) => <li key={index + 5}>{item}</li>)}
          </ul>
        </details>}
        <p style={{marginTop: '15px', fontSize: '0.9em', fontStyle: 'italic', color: 'var(--clr-text-secondary-silver)'}}>
          NudgeKernel {NUDGE_KERNEL_VERSION} emphasizes intelligent DeltaShift diversity, verifiable data integrity, and adaptive AI-driven process optimization through its EchoBit architecture.
        </p>
      </section>
    </div>
  );
};