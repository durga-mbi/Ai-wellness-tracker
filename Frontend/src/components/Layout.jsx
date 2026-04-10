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
    <div className="h-screen bg-white text-black flex font-sans overflow-hidden selection:bg-gray-100 relative">
      {/* Light Aesthetic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[60vw] h-[60vw] bg-gray-50 blur-[140px] rounded-full opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[50vw] h-[50vw] bg-gray-50/50 blur-[120px] rounded-full opacity-40"></div>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className={`
        flex-1 flex flex-col h-screen relative z-10 transition-all duration-500 ease-[0.22, 1, 0.36, 1]
        pl-0 overflow-hidden
      `}>
        <Topbar 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          {...headerProps}
        />
        
        <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8">
           <div className="max-w-[1700px] mx-auto w-full h-full flex flex-col">
             <AnimatePresence mode="wait">
                <motion.div
                   className="h-full"
                   key={window.location.pathname}
                   initial={{ opacity: 0, scale: 0.99 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.01 }}
                   transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
