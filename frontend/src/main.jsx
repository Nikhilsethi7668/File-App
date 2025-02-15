import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import UserProvider from './Context/UserContext.jsx'
// import { AuthProvider } from './Context/AuthContext.jsx'
import { SlotsContextProvider } from './Context/SlotsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <UserProvider>
          <SlotsContextProvider>
            <App />
          </SlotsContextProvider>
        </UserProvider>
      </AuthProvider>
    </StrictMode>,
  </BrowserRouter >
)
