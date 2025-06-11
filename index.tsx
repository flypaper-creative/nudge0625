
import React from 'react';
import ReactDOM from 'react-dom/client';
import ModularShardSystem from './src/ModularShardSystem'; // Ensure this path is correct if root index.tsx is used

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ModularShardSystem />
    </React.StrictMode>
  );
} else {
  console.error("ModularShardSystem Critical Failure: Root element 'root' not found. System cannot boot.");
}