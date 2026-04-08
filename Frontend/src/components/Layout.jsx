import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children, ...props }) => {
  const { layoutProps } = useLayout();
  
  // Start sidebar closed on mobile, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      // Auto-close sidebar on mobile if screen resized
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync with layoutProps or manual overrides
  const headerProps = { ...layoutProps, ...props };

  return (
    <div className="h-screen bg-[#050505] text-white flex font-sans overflow-hidden selection:bg-amber-500/10 relative">
      {/* Persistent Cinematic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[60vw] h-[60vw] bg-amber-500/10 blur-[140px] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[50vw] h-[50vw] bg-orange-500/5 blur-[120px] rounded-full animate-pulse delay-1000 opacity-40"></div>
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grain-y.com/images/grain-dark.png')]"></div>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className={`
        flex-1 flex flex-col h-screen relative z-10 transition-all duration-700 ease-[0.76, 0, 0.24, 1]
        pl-0
      `}>
        <Topbar 
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          {...headerProps}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 custom-scrollbar">
           <div className="max-w-[1700px] mx-auto w-full">
             <AnimatePresence mode="wait">
                <motion.div
                  key={window.location.pathname}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                >
                  {children || <Outlet />}
                </motion.div>
             </AnimatePresence>
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
