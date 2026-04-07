import React from "react";
import { HiBars3, HiBell, HiUserCircle } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const Topbar = ({ onOpenSidebar, actions }) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 lg:px-12 py-8 bg-transparent sticky top-0 z-30">
      <div className="flex items-center gap-6">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"
        >
          <HiBars3 className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        {/* Dynamic Page Actions (Pill Buttons) */}
        {actions || (
          <div className="hidden md:flex items-center gap-4">
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-full font-black text-[13px] hover:scale-105 transition-all shadow-xl shadow-indigo-500/10">
              Talk to AI
            </button>
            <button className="px-8 py-3 bg-[#121214] text-white border border-white/10 rounded-full font-black text-[13px] hover:bg-[#1a1a1c] transition-all">
              New Journal
            </button>
          </div>
        )}

        {/* Notifications & Profile */}
        <div className="flex items-center gap-4 lg:gap-6 ml-4 pl-4 lg:ml-8 lg:pl-8 border-l border-white/10">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <HiBell className="w-6 h-6" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#09090b]"></div>
          </button>
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-1">User</span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Premium</span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-all p-0.5 overflow-hidden">
               <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-inner">
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
