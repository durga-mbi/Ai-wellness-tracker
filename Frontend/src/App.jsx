import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import AuthRoute from "./components/AuthRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
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
import SystemSetup from "./pages/SystemSetup";
import VerifyOtp from "./pages/VerifyOtp";
import { useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";

function App() {
  const { checkSystemConfig, isSystemSetupCompleted } = useAuth();
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      await checkSystemConfig();
      setCheckingSetup(false);
    };
    checkSetup();
  }, [checkSystemConfig]);

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fefee5" }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#b9bc94", borderTopColor: "transparent" }}></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
            {/* If setup not done, show setup page for all routes */}
            {!isSystemSetupCompleted ? (
              <Route path="*" element={<SystemSetup />} />
            ) : (
              <>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/system-setup" element={<SystemSetup />} />

                {/* Auth Pages - Guarded against logged-in users */}
                <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
                <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

                {/* Survey Ritual - Needs authentication */}
                <Route path="/survey" element={<ProtectedRoute><OnboardingSurvey /></ProtectedRoute>} />

                {/* Main App Layout (Global Sidebar/Topbar) */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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
              </>
            )}
      </Routes>
    </Router>
  );
}

export default App;
