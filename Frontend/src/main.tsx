import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.tsx';
import App from './App.tsx'
import './index.css'
import { App as AntdApp } from "antd";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AntdApp>
      <App />
      </AntdApp>
    </AuthProvider>
  </StrictMode>,
)
