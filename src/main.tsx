
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import dev tools in development mode
if (process.env.NODE_ENV === 'development') {
  import('./utils/devTools.ts').catch(console.error);
}

createRoot(document.getElementById("root")!).render(<App />);
