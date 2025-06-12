
import React from 'react';
import ReactDOM from 'react-dom/client';
import ModularShardSystem from './ModularShardSystem';
import { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            zIndex: 9999, // Ensure toasts are on top
          },
          success: {
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <ModularShardSystem />
    </React.StrictMode>
  );
} else {
  console.error("ModularShardSystem Critical Failure: Root element 'root' not found. System cannot boot.");
}