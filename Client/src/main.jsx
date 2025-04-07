import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AllContext from './AllContext.jsx'
import { ToastContainer, toast } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AllContext>
      <App />
      <ToastContainer />
    </AllContext>
  </StrictMode>,
)
