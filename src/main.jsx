import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/reset.css'
import './styles/layout.css'
import './styles/auth.css'
import './styles/components.css'
import { AppProvider } from './context/AppContext'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)
