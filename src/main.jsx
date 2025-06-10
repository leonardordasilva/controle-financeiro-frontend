import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Importações para o react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        {/* O ToastContainer precisa estar em algum lugar do DOM */}
        <ToastContainer position="top-right" autoClose={3000} />
    </React.StrictMode>
);