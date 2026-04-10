import React, { useState, useRef, useEffect } from "react";
import { HiOutlineUserCircle, HiBars3BottomLeft, HiOutlineUser, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { FaCaretLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const Topbar = ({ title, subtitle, actions, onToggleSidebar, isSidebarOpen, onLogoutClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Unified Toggle Ritual */}
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

        <div className="flex items-center gap-4 pl-4 border-l border-gray-50 relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-black uppercase tracking-widest">{user?.name || "Spirit"}</p>
            </div>
            <div className={`w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center transition-all shadow-sm ${isDropdownOpen ? 'text-black border-black/10 bg-white' : 'text-gray-400 group-hover:text-black'}`}>
              <HiOutlineUserCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 mb-1 border-b border-gray-50 md:hidden">
                  <p className="text-[10px] font-black text-black uppercase tracking-tighter italic">{user?.name || "Spirit"}</p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-all group"
                >
                  <HiOutlineUser className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Profile / Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all group"
                >
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Terminate Ritual</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
