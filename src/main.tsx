import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import test data for development
if (import.meta.env.DEV) {
  import('./data/testStaticData');
}

createRoot(document.getElementById("root")!).render(<App />);
