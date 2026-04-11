import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './assets/css/variables.css';
import './assets/css/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import AppProvider from './auth/authProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
