import React from "react";
import { HiBars3, HiBell, HiSparkles, HiPencilSquare } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const Topbar = ({ isSidebarOpen, onOpenSidebar, actions }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-8 lg:px-12 py-10 bg-[#050505]/60 backdrop-blur-3xl sticky top-0 z-40 border-b border-white/5">
      <div className="flex items-center gap-6">
        {/* Sidebar Expansion Ritual */}
        <AnimatePresence>
          {!isSidebarOpen && (
            <motion.button 
              key="sidebar-open-btn"
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              onClick={onOpenSidebar}
              className="p-4 bg-white text-black rounded-[20px] shadow-2xl hover:scale-105 active:scale-95 transition-all group hover:bg-amber-400 z-50 flex items-center justify-center"
            >
              <HiBars3 className="w-6 h-6 transition-transform group-hover:rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Branding placeholder when sidebar is closed */}
        <AnimatePresence>
           {!isSidebarOpen && (
              <motion.div
                key="sidebar-closed-brand"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="hidden sm:block"
              >
                <h2 className="text-sm font-black italic tracking-[0.3em] uppercase opacity-40">Serenity</h2>
              </motion.div>
           )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 lg:gap-10">
        {/* Dynamic Page Actions (Pill Buttons) */}
        {actions || (
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => navigate("/chat")}
              className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
            >
              <HiSparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
              Talk to AI
            </button>
            <button 
              onClick={() => navigate("/journal")}
              className="flex items-center gap-3 px-8 py-4 bg-white/[0.04] text-white border border-white/10 backdrop-blur-3xl rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/[0.08] transition-all group"
            >
              <HiPencilSquare className="w-4 h-4 text-white/40 group-hover:scale-110 transition-transform" />
              New Journal
            </button>
          </div>
        )}

        {/* Notifications & Profile */}
        <div className="flex items-center gap-5 lg:gap-10 ml-4 pl-4 lg:ml-8 lg:pl-10 border-l border-white/5">
          <button className="relative p-1 text-white/30 hover:text-white transition-all transform hover:rotate-12">
            <HiBell className="w-6 h-6" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#050505] shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
          </button>
          
          <div 
            onClick={() => navigate("/settings")}
            className="flex items-center gap-5 group cursor-pointer"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none mb-1.5 italic">
                {user?.name || "Serenity Presence"}
              </span>
              <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-[0.3em] leading-none italic">Sanctuary Tier</span>
            </div>
            <div className="w-14 h-14 rounded-full border border-white/10 group-hover:border-amber-400/50 transition-all p-1.5 overflow-hidden shadow-2xl bg-white/[0.02] backdrop-blur-3xl">
               <div className="w-full h-full rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white font-black text-base italic shadow-inner border border-white/5">
                {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
