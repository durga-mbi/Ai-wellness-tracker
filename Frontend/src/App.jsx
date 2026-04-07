import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import OnboardingSurvey from "./pages/OnboardingSurvey";
import Settings from "./pages/Settings";
import JournalEntry from "./pages/JournalEntry";
import Chat from "./pages/Chat";

import { LayoutProvider } from "./context/LayoutContext";
import Layout from "./components/Layout";

const RootRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (user) {
    if (!user.ageGroup) return <Navigate to="/survey" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Flow (No Sidebar) */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/survey" element={<OnboardingSurvey />} />
            
            {/* Main Sanctuary Layout (Global Sidebar/Topbar) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<JournalEntry />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LayoutProvider>
    </AuthProvider>
  );
}

export default App;
