import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/Authcontext.jsx'

createRoot(document.getElementById('root')).render(

    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  
)
