import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  HiHome, 
  HiChartBar, 
  HiCalendar, 
  HiCog6Tooth, 
  HiArrowRightOnRectangle,
  HiPlus,
  HiChevronRight,
  HiFire,
  HiOutlineMoon,
  HiOutlineClock,
  HiOutlineBeaker,
  HiBars3,
  HiXMark
} from "react-icons/hi2";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const stats = [
    { label: 'Daily Steps', value: '8,432', icon: <HiArrowRightOnRectangle className="rotate-90 w-6 h-6" />, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { label: 'Sleep', value: '7h 20m', icon: <HiOutlineMoon className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600', trend: '-2%' },
    { label: 'Calories', value: '1,240', icon: <HiFire className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600', trend: '+5%' },
    { label: 'Water', value: '1.8L', icon: <HiOutlineBeaker className="w-6 h-6" />, color: 'bg-cyan-50 text-cyan-600', trend: '+18%' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-x-hidden">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-8 flex flex-col shrink-0
        transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close Button (Mobile Only) */}
        <button 
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 lg:hidden"
          onClick={toggleSidebar}
        >
          <HiXMark className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 transform -rotate-6">
            <HiArrowRightOnRectangle className="w-6 h-6 -rotate-45" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">Wellness</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<HiHome />} label="Dashboard" active />
          <NavItem icon={<HiChartBar />} label="Analytics" />
          <NavItem icon={<HiCalendar />} label="Schedule" />
          <NavItem icon={<HiCog6Tooth />} label="Settings" />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 font-black text-xl border border-slate-100">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{user?.email?.split('@')[0]}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all duration-300 group"
          >
            <HiArrowRightOnRectangle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 bg-white border-b border-slate-100 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 transform -rotate-6">
              <HiArrowRightOnRectangle className="w-4 h-4 -rotate-45" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Wellness</span>
          </div>
          <button 
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            onClick={toggleSidebar}
          >
            <HiBars3 className="w-7 h-7" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Overview</h1>
              <p className="text-slate-400 font-semibold flex items-center gap-2">
                <HiOutlineClock className="w-5 h-5" />
                Last updated: Just now
              </p>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 w-full md:w-auto">
              <HiPlus className="w-5 h-5" />
              New Entry
            </button>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-white shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-500 group">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Main Chart Card */}
            <div className="xl:col-span-2 bg-white p-6 md:p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-x-auto">
              <div className="flex items-center justify-between mb-10 min-w-[400px]">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Activity Trends</h3>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  <button className="px-4 py-2 text-xs font-bold text-indigo-600 bg-white rounded-lg shadow-sm">Week</button>
                  <button className="px-4 py-2 text-xs font-bold text-slate-400">Month</button>
                </div>
              </div>
              <div className="h-[300px] flex items-end justify-between gap-4 p-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 min-w-[500px]">
                {[40, 75, 45, 95, 65, 85, 55].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                    <div className="relative w-full">
                      <div 
                        className="w-full bg-indigo-100 group-hover:bg-indigo-600 rounded-2xl transition-all duration-500" 
                        style={{ height: `${h}%`, minHeight: '20px' }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-10">
              <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-20%] w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">Weekly Goal</h3>
                <p className="text-indigo-100 font-medium mb-8 leading-relaxed">Impressive! You're almost at your weekly fitness milestone.</p>
                <div className="space-y-3">
                  <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden p-1">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span>Progress</span>
                    <span>85%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Timeline</h3>
                <div className="space-y-8">
                  <ActivityItem icon="🏃‍♂️" title="Morning Run" desc="5.2 km in 28m" time="08:30 AM" />
                  <ActivityItem icon="🥗" title="Healthy Meal" desc="Salad & Grilled Chicken" time="01:15 PM" />
                  <ActivityItem icon="💧" title="Hydration" desc="Consumed 500ml water" time="03:45 PM" />
                </div>
                <button className="w-full mt-10 py-4 text-xs font-black text-indigo-600 bg-indigo-50/50 rounded-2xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 group">
                  View Full Log
                  <HiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <a 
    href="#" 
    className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 group ${
      active 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    <span className={`text-xl transition-transform group-hover:scale-110 ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
  </a>
);

const ActivityItem = ({ icon, title, desc, time }) => (
  <div className="flex items-center gap-5 group cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-sm font-black text-slate-900 truncate">{title}</p>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{time}</span>
      </div>
      <p className="text-xs font-medium text-slate-400 truncate">{desc}</p>
    </div>
  </div>
);

export default Dashboard;
