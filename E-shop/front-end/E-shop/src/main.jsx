import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './components/hook/LanguageContext.jsx'
import { AuthProvider } from './components/hook/Auth/AuthContext.jsx'

/* import('eruda')
  .then((mod) => {
    const eruda = mod.default ?? mod
    if (typeof eruda?.init === 'function') eruda.init()
    else console.error('[eruda] loaded but no init() on export', Object.keys(mod))
  })
  .catch((err) => console.error('[eruda] failed to load', err)) */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
