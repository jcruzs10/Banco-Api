import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css'; // Mantenemos el estilo de Tailwind

ReactDOM.createRoot(document.getElementById('root') || document.body).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
