import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './router.js';
import 'app/styles/global.css';
import { HeroUIProvider } from '@heroui/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <Router />
    </HeroUIProvider>
  </React.StrictMode>
);
