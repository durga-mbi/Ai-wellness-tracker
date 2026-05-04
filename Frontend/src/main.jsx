import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from "./context/AuthContext";
import { LayoutProvider } from "./context/LayoutContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <SocketProvider>
        <LayoutProvider>
          <App />
        </LayoutProvider>
      </SocketProvider>
    </AuthProvider>
)
