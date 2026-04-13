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
      width: 288, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.2
      } 
    },
    closed: { 
      width: window.innerWidth > 1024 ? 80 : 0, 
      x: window.innerWidth > 1024 ? 0 : -288,
      transition: { 
        type: "spring", 
        stiffness: 300, 
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
            className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed lg:relative z-50 h-screen bg-white border-r border-gray-100 flex flex-col overflow-hidden shadow-2xl lg:shadow-none"
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-6 border-b border-gray-100 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center gap-3">
            <motion.img
              src={logo}
              alt="Logo"
              animate={{ scale: isOpen ? 1 : 1.1 }}
              className="w-7 h-7 object-contain"
            />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-black text-[11px] uppercase tracking-tighter text-black whitespace-nowrap italic"
                >
                  Wellness Hub
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
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
                  flex items-center group transition-all duration-300 rounded-lg relative
                  ${isOpen ? "px-4 py-2.5" : "px-0 justify-center py-2.5"}
                  ${isActive
                    ? "bg-gray-50 text-black shadow-sm"
                    : "text-gray-300 hover:bg-gray-50 hover:text-black"}
                `}
              >
                <span className={`text-xl flex-shrink-0 transition-colors ${isActive ? "text-black" : "group-hover:text-black"}`}>
                  {item.icon}
                </span>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator Tooltip for collapsed mode */}
                {!isOpen && isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-1 w-1 h-6 bg-black rounded-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-50 flex-shrink-0">
          <button
            onClick={onLogoutClick}
            className={`
               w-full flex items-center transition-all duration-300 rounded-lg group
               ${isOpen ? "px-4 py-2.5" : "px-0 justify-center py-2.5"}
               text-gray-300 hover:bg-red-50 hover:text-red-500
             `}
          >
            <HiOutlineArrowRightOnRectangle className="text-xl flex-shrink-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                >
                  Logout
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
