import React from "react";
import { HiOutlineUserCircle, HiBars3BottomLeft } from "react-icons/hi2";
import { FaCaretLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Topbar = ({ title, subtitle, actions, onToggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Unified Toggle Ritual - Visible on Desktop and Mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FaCaretLeft className="w-5 h-5" /> : <HiBars3BottomLeft className="w-5 h-5" />}
        </button>

        <div className="hidden sm:block">
          <h1 className="text-[11px] font-bold text-black uppercase tracking-widest">
            {title || "Sanctuary"}
          </h1>
          {subtitle && (
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 italic">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {actions && <div className="flex items-center gap-3">{actions}</div>}

        <div className="flex items-center gap-4 pl-4 border-l border-gray-50">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-black uppercase tracking-widest">{user?.name || "Spirit"}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Ritual Tier I</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-black transition-all shadow-sm">
              <HiOutlineUserCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
