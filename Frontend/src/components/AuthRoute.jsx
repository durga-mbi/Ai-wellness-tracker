import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-10">
        <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20 italic animate-pulse">
          Finding your space...
        </p>
      </div>
    );
  }

  if (user) {
    // If logged in, don't allow access to Login/Register
    // If they haven't onboarded yet, send them to survey, otherwise dashboard
    const isOnboarded = user.ageGroup;
    return <Navigate to={isOnboarded ? "/dashboard" : "/survey"} replace />;
  }

  return children;
};

export default AuthRoute;
