import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { UserContextProvider } from './Context/UserContext'
import { AuthProvider } from './Context/AuthContext'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </AuthProvider>
    </StrictMode>,
  </BrowserRouter>
)
