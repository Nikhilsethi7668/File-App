import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { UserContextProvider } from './Context/UserContext'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </StrictMode>,
  </BrowserRouter>
)
