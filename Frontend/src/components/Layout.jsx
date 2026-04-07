import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLayout } from "../context/LayoutContext";

const Layout = ({ children, ...props }) => {
  const { layoutProps } = useLayout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Allow manual prop overrides, but default to context
  const headerProps = { ...layoutProps, ...props };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          {...headerProps}
        />
        
        <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
