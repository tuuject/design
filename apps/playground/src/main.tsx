import '@koi/tokens/theme-init.js'; // sets <html data-theme> from the OS (in an app, inline it in <head> to avoid a flash)
import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
