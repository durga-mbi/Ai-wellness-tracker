import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { LayoutProvider } from "./context/LayoutContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import AuthRoute from "./components/AuthRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JournalEntry from "./pages/JournalEntry";
import Chat from "./pages/Chat";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import OnboardingSurvey from "./pages/OnboardingSurvey";
import MoodCalendar from "./pages/MoodCalendar";
import Mindfulness from "./pages/Mindfulness";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <SocketProvider>
        <LayoutProvider>
          <Router>
            <Routes>
            {/* Public & Auth Entry - Accessible to unauthenticated users */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Auth Pages - Guarded against logged-in users */}
            <Route 
              path="/login" 
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              } 
            />
            
            {/* Survey Ritual - Needs authentication */}
            <Route 
              path="/survey" 
              element={
                <ProtectedRoute>
                  <OnboardingSurvey />
                </ProtectedRoute>
              } 
            />
            
            {/* Main App Layout (Global Sidebar/Topbar) */}
            <Route 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<JournalEntry />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/community" element={<Community />} />
              <Route path="/calendar" element={<MoodCalendar />} />
              <Route path="/mindfulness" element={<Mindfulness />} />
            </Route>
            
            {/* Error Page */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </LayoutProvider>
    </SocketProvider>
  </AuthProvider>
  );
}

export default App;
