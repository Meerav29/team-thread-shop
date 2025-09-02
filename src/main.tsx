import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { inject } from '@vercel/analytics'

// Inject Vercel Web Analytics in production only
if (import.meta.env.PROD) {
  inject()
}

createRoot(document.getElementById("root")!).render(<App />);
