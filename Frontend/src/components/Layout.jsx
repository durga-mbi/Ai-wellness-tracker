import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "../context/LayoutContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

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

const Layout = ({ children, ...props }) => {
  const { layoutProps } = useLayout();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleResize = () => {
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

  const headerProps = { ...layoutProps, ...props };

  return (
    <div 
      className="h-screen flex font-sans overflow-hidden selection:bg-[#506b4a20] relative"
      style={{ background: C.bg, color: C.text }}
    >
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full opacity-40 blur-[120px]"
          style={{ background: C.priCont }}
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full opacity-30 blur-[140px]"
          style={{ background: C.surface }}
        />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogoutClick={handleLogoutClick}
      />

      <motion.div 
        animate={{ paddingLeft: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden"
      >
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogoutClick={handleLogoutClick}
          {...headerProps}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                className="h-full"
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                {children || <Outlet />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-md"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative p-10 rounded-[48px] shadow-2xl border max-w-md w-full text-center space-y-8"
              style={{ background: C.card, borderColor: `${C.outline}30` }}
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner"
                style={{ background: `${C.error}10`, color: C.error }}
              >
                <HiOutlineArrowRightOnRectangle />
              </div>
              <div className="space-y-3">
                <h3 
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
                >
                  Ready to Sign Out?
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textMut }}>
                  We hope your time here has been restful. Take a deep breath before you return to the world.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={confirmLogout}
                  className="w-full py-4 rounded-3xl font-bold shadow-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ background: C.primary, color: C.onPri }}
                >
                  Confirm Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 rounded-3xl font-bold transition-all hover:bg-gray-50"
                  style={{ color: C.textMut }}
                >
                  Wait, keep me here
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
