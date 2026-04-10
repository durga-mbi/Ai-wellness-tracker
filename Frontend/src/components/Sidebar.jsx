import React from "react";
import { Link, useLocation } from "react-router";
import { 
  HiOutlineHome, 
  HiOutlineBookOpen, 
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineUserGroup,
  HiOutlineSquare2Stack,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", icon: <HiOutlineHome />, path: "/dashboard" },
    { name: "Journal", icon: <HiOutlineBookOpen />, path: "/journal" },
    { name: "Chat", icon: <HiOutlineChatBubbleBottomCenterText />, path: "/chat" },
    { name: "Community", icon: <HiOutlineUserGroup />, path: "/community" },
    { name: "Settings", icon: <HiOutlineCog6Tooth />, path: "/settings" }
  ];

  return (
    <>
      {/* Mobile Overlay - Only show if sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside 
        className={`
          fixed lg:relative z-50 h-screen transition-all duration-500 ease-[0.22, 1, 0.36, 1]
          ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20"}
          bg-white border-r border-gray-100 flex flex-col overflow-hidden
        `}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 bg-black rounded-full flex-shrink-0 transition-transform ${!isOpen && "scale-75"}`}></div>
            {isOpen && (
              <span className="font-bold text-xs uppercase tracking-widest text-black whitespace-nowrap">
                Wellness App
              </span>
            )}
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
                className={`
                  flex items-center group transition-all duration-300 rounded-lg
                  ${isOpen ? "px-4 py-2.5" : "px-0 justify-center py-2.5"}
                  ${isActive 
                    ? "bg-gray-50 text-black shadow-sm" 
                    : "text-gray-300 hover:bg-gray-50 hover:text-black"}
                `}
              >
                <span className={`text-xl flex-shrink-0 transition-colors ${isActive ? "text-black" : "group-hover:text-black"}`}>
                  {item.icon}
                </span>
                {isOpen && (
                  <span className="ml-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                {/* Active Indicator Tooltip for collapsed mode */}
                {!isOpen && isActive && (
                  <div className="absolute left-1 w-1 h-6 bg-black rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-50 flex-shrink-0">
          <button 
             onClick={logout}
             className={`
               w-full flex items-center transition-all duration-300 rounded-lg group
               ${isOpen ? "px-4 py-2.5" : "px-0 justify-center py-2.5"}
               text-gray-300 hover:bg-red-50 hover:text-red-500
             `}
          >
            <HiOutlineArrowRightOnRectangle className="text-xl flex-shrink-0" />
            {isOpen && (
              <span className="ml-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
