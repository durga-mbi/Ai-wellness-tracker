import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] space-y-10">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-[1px] border-white/5 rounded-full"></div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-[1px] border-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          ></motion.div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic animate-pulse">
          Synchronizing Sanctuary...
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated, preserving the intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
