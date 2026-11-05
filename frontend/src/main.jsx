import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#14213D',
            color: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 10px 25px -5px rgba(20, 33, 61, 0.2)'
          },
          success: {
            iconTheme: {
              primary: '#16A6A1',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF8066',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
