import React from "react";
import { Link, useLocation } from "react-router";
import { 
  HiHome, 
  HiPencilSquare, 
  HiChatBubbleLeftRight,
  HiCog6Tooth,
  HiQuestionMarkCircle,
  HiSparkles
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <HiHome />, to: '/dashboard' },
    { label: 'Journal Entry', icon: <HiPencilSquare />, to: '/journal' },
    { label: 'Community Wall', icon: <HiSparkles />, to: '/community' },
    { label: 'AI Chat', icon: <HiChatBubbleLeftRight />, to: '/chat' },
    { label: 'Settings', icon: <HiCog6Tooth />, to: '/settings' },
  ];

  const bottomItems = [
    { label: 'Support', icon: <HiQuestionMarkCircle />, to: '/support' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-white/5 flex flex-col shrink-0
        transition-all duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header/Logo */}
        <div className="p-8 pb-12">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight text-glow">Wellness AI</h1>
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">The Sanctuary</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={`
                group w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300
                ${location.pathname === item.to 
                  ? "bg-white/5 text-white sanctuary-glass shadow-inner overflow-hidden" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }
              `}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${location.pathname === item.to ? 'text-indigo-400' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[13px] tracking-tight">{item.label}</span>
              {location.pathname === item.to && (
                <div className="ml-auto w-1 h-4 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* "Breathe Now" Floating Button */}
        <div className="px-6 py-8">
          <button className="w-full sanctuary-gradient py-5 rounded-[2rem] text-white font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            Breathe Now
          </button>
        </div>

        {/* Bottom Menu */}
        <div className="px-4 py-8 border-t border-white/5 space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-4 px-6 py-3 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
