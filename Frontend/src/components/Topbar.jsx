import React, { useState, useRef, useEffect } from "react";
import { HiOutlineUserCircle, HiBars3BottomLeft, HiOutlineUser, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { FaCaretLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

// ── Design tokens from "The Ethereal Sanctuary" ──────────────────────────────
const C = {
  bg:       "#fefee5",
  surface:  "#f4f6d2",
  card:     "#ffffff",
  primary:  "#506b4a",
  priCont:  "#ccebc2",
  onPri:    "#ffffff",
  text:     "#373a1c",
  textMut:  "#636745",
  outline:  "#b9bc94",
};

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
    <header 
      className="h-16 flex items-center justify-between sticky top-0 z-40 px-3 sm:px-6 transition-all duration-300 border-b"
      style={{ 
        background: `rgba(254, 254, 229, 0.85)`, // C.bg with alpha
        backdropFilter: "blur(20px)",
        borderColor: `${C.outline}20` 
      }}
    >
      <div className="flex items-center gap-6">
        {/* Toggle Sidebar */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl transition-all"
          style={{ color: C.textMut, background: `${C.outline}10` }}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FaCaretLeft className="w-5 h-5" /> : <HiBars3BottomLeft className="w-5 h-5" />}
        </button>

        <div className="">
          <h1 
            className="text-xs sm:text-sm font-bold tracking-tight" 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
          >
            {title || "Mindmetrics AI"}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-[11px] font-medium" style={{ color: C.textMut }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {actions && <div className="flex items-center gap-3">{actions}</div>}

        <div className="flex items-center gap-4 pl-4 border-l relative" style={{ borderColor: `${C.outline}20` }} ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold" style={{ color: C.text }}>{user?.name || "Spirit"}</p>
              <p className="text-[10px]" style={{ color: C.textMut }}>Glimpse profile</p>
            </div>
            <div 
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isDropdownOpen ? 'scale-95' : 'group-hover:scale-105'}`}
              style={{ background: isDropdownOpen ? C.primary : C.card, color: isDropdownOpen ? C.onPri : C.primary, border: `1.5px solid ${C.outline}30` }}
            >
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
                className="absolute right-0 top-full mt-3 w-56 border rounded-[24px] shadow-2xl py-3 z-50 overflow-hidden"
                style={{ background: C.card, borderColor: `${C.outline}30` }}
              >
                <div className="px-5 py-2 mb-2 border-b md:hidden" style={{ borderColor: `${C.outline}10` }}>
                  <p className="text-sm font-bold" style={{ color: C.text }}>{user?.name || "Spirit"}</p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full px-5 py-3 flex items-center gap-3 transition-all group"
                  style={{ color: C.textMut }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <HiOutlineUser className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full px-5 py-3 flex items-center gap-3 transition-all group"
                  style={{ color: C.textMut }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Sign Out</span>
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
