import React from "react";
import { Link, useLocation } from "react-router";
import { 
  HiHome, 
  HiPencilSquare, 
  HiChatBubbleLeftRight,
  HiCog6Tooth,
  HiQuestionMarkCircle,
  HiSparkles,
  HiArrowLeftOnRectangle,
  HiChevronLeft,
  HiUser,
  HiXMark
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <HiHome />, to: '/dashboard' },
    { label: 'Journal', icon: <HiPencilSquare />, to: '/journal' },
    { label: 'Social', icon: <HiSparkles />, to: '/community' },
    { label: 'Talk to AI', icon: <HiChatBubbleLeftRight />, to: '/chat' },
    { label: 'Profile', icon: <HiUser />, to: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-40 lg:hidden"
            onClick={onToggle}
          ></motion.div>
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white/[0.02] border-r border-white/5 flex flex-col shrink-0
        transition-all duration-700 ease-[0.76, 0, 0.24, 1] lg:relative backdrop-blur-3xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-[280px]'}
      `}>
        {/* Desktop Collapse Ritual Button - Hidden on Mobile */}
        <button 
          onClick={onToggle}
          className={`
            absolute -right-4 top-12 w-8 h-8 bg-white text-black rounded-full items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group hover:bg-amber-400
            hidden lg:flex
            ${!isOpen ? 'translate-x-full opacity-0 pointer-events-none' : ''}
          `}
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>

        {/* Mobile Close Button - Visible only in Sidebar on Mobile */}
        <button 
          onClick={onToggle}
          className="lg:hidden absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
        >
          <HiXMark className="w-6 h-6" />
        </button>

        {/* Internal Scrollable Sanctuary */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
          {/* Branding Beacon - Compressed for Mobile */}
          <div className="p-8 lg:p-10 pt-12 lg:pt-16 pb-10 lg:pb-14 text-center">
            <Link to="/" className="inline-block group">
              <motion.img 
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                src={logo} 
                alt="Serenity" 
                className="w-16 lg:w-20 h-16 lg:h-20 mx-auto drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-4 lg:mb-6" 
              />
              <h1 className="text-lg lg:text-xl font-black italic tracking-tighter uppercase text-white tracking-[0.2em]">Serenity</h1>
              <p className="text-[8px] lg:text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-1 lg:mt-2 italic">The Sanctuary</p>
            </Link>
          </div>

          {/* Navigation Ritual - Tighter for Mobile */}
          <nav className="flex-1 px-4 lg:px-5 space-y-1 lg:space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => { if(window.innerWidth <= 1024) onToggle(); }}
                className={`
                  group relative flex items-center gap-4 lg:gap-5 px-6 lg:px-8 py-4 lg:py-5 rounded-[20px] lg:rounded-[24px] transition-all duration-500
                  ${location.pathname === item.to 
                    ? "bg-white/[0.04] text-white shadow-2xl border border-white/10" 
                    : "text-white/30 hover:text-white hover:bg-white/[0.02]"
                  }
                `}
              >
                <span className={`text-lg lg:text-xl transition-all duration-500 ${location.pathname === item.to ? 'text-amber-400 scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[11px] lg:text-[12px] font-black tracking-widest uppercase italic">{item.label}</span>
                
                {location.pathname === item.to && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute right-6 w-1 h-5 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Support & Logout Ritual - Compressed for Mobile */}
          <div className="p-4 lg:p-6 pt-6 lg:pt-10 border-t border-white/5 space-y-1 lg:space-y-2">
              <Link
                to="/support"
                onClick={() => { if(window.innerWidth <= 1024) onToggle(); }}
                className="flex items-center gap-4 lg:gap-5 px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all italic hover:bg-white/[0.02]"
              >
                <HiQuestionMarkCircle className="text-xl" />
                <span>Guidance</span>
              </Link>
              
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-4 lg:gap-5 px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-all italic hover:bg-red-500/5 group"
              >
                <HiArrowLeftOnRectangle className="text-xl transition-transform group-hover:-translate-x-1" />
                <span>Logout</span>
              </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
