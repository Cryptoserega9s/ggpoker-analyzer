import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// --- НОВОЕ: Импортируем провайдер Mantine и базовые стили ---
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* --- НОВОЕ: Оборачиваем все в MantineProvider --- */}
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);