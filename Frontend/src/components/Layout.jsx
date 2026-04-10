import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "../context/LayoutContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

const Layout = ({ children, ...props }) => {
  const { layoutProps } = useLayout();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Start sidebar closed on mobile, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/login");
  };

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
        onLogoutClick={handleLogoutClick}
      />

      <motion.div 
        animate={{ 
          paddingLeft: 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden"
      >
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogoutClick={handleLogoutClick}
          {...headerProps}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14">
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
      </motion.div>

      {/* Logout Confirmation Modal - Elevated Ritual */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/10 backdrop-blur-md"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 max-w-sm w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                <HiOutlineArrowRightOnRectangle />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black">Terminate Session?</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                  Are you sure you want to exit the current intelligence portal? Your neural state will be synchronized.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmLogout}
                  className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl"
                >
                  Confirm Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-white text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
