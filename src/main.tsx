import { ActorProvider, AgentProvider } from '@ic-reactor/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { canisterId, idlFactory } from './declarations/user';
import './index.scss';
import './styles/color-pallete.css';
import './styles/welcome-sections.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withProcessEnv>
        <App />
    </AgentProvider>
  </React.StrictMode>,
);
