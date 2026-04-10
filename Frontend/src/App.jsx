import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { LayoutProvider } from "./context/LayoutContext";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

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
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <Router>
          <Routes>
            {/* Auth Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Setup */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
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
            </Route>
            
            {/* Error Page */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </LayoutProvider>
    </AuthProvider>
  );
}

export default App;
