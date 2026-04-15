import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineUserGroup,
  HiOutlineSquare2Stack,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineSparkles
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

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

const Sidebar = ({ isOpen, onToggle, onLogoutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", icon: <HiOutlineHome />, path: "/dashboard" },
    { name: "Journal", icon: <HiOutlineBookOpen />, path: "/journal" },
    { name: "Chat", icon: <HiOutlineChatBubbleBottomCenterText />, path: "/chat" },
    { name: "Community", icon: <HiOutlineUserGroup />, path: "/community" },
    { name: "History", icon: <HiOutlineSquare2Stack />, path: "/calendar" },
    { name: "Mindfulness", icon: <HiOutlineSparkles />, path: "/mindfulness" },
    { name: "Settings", icon: <HiOutlineCog6Tooth />, path: "/settings" }
  ];

  const sidebarVariants = {
    open: { 
      width: 260, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      } 
    },
    closed: { 
      width: window.innerWidth > 1024 ? 88 : 0, 
      x: window.innerWidth > 1024 ? 0 : -260,
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed lg:relative z-50 h-screen flex flex-col overflow-hidden shadow-xl lg:shadow-none transition-colors border-r"
        style={{ 
          background: `rgba(254, 254, 229, 0.9)`, // C.bg with alpha
          backdropFilter: "blur(12px)",
          borderColor: `${C.outline}25`,
        }}
      >
        {/* Sidebar Header - Brand */}
        <div 
          className="h-20 flex items-center px-6 flex-shrink-0 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isOpen ? 0 : 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: C.priCont }}
            >
              <img
                src={logo}
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
            </motion.div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span
                    className="font-bold text-sm tracking-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
                  >
                    Mindmetrics AI
                  </span>
                  <span className="text-[10px] font-medium opacity-60" style={{ color: C.textMut }}>
                    Find your calm
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth <= 1024) {
                    onToggle();
                  }
                }}
                className={`
                  flex items-center group transition-all duration-300 rounded-2xl relative
                  ${isOpen ? "px-4 py-3" : "px-0 justify-center py-3.5"}
                `}
                style={{
                  background: isActive ? `${C.primary}10` : "transparent",
                  color: isActive ? C.primary : C.textMut
                }}
              >
                <span className={`text-xl flex-shrink-0 transition-all ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-primary"}`}
                      style={{ color: isActive ? C.primary : "inherit" }}>
                  {item.icon}
                </span>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-4 text-sm font-semibold whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-l-full"
                    style={{ background: C.primary }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t" style={{ borderColor: `${C.outline}20` }}>
          <button
            onClick={onLogoutClick}
            className={`
               w-full flex items-center transition-all duration-300 rounded-2xl group
               ${isOpen ? "px-4 py-3" : "px-0 justify-center py-3.5"}
               hover:bg-red-50 hover:text-red-600
             `}
             style={{ color: C.textMut }}
          >
            <HiOutlineArrowRightOnRectangle className="text-xl flex-shrink-0 group-hover:rotate-12 transition-transform" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-4 text-sm font-semibold whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
