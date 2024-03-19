import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App_old.jsx'
import App from './App.jsx'
import { ToastProvider } from "react-toast-notifications";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ToastProvider>
    <App />
  </ToastProvider>
  // </React.StrictMode>,
)
