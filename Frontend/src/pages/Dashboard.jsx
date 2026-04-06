import React, { useState, useEffect } from 'react';
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
  HiXMark,
  HiChatBubbleLeftRight,
  HiSparkles
} from "react-icons/hi2";
import api from '../utils/api';
import JournalModal from '../components/JournalModal';
import ChatbotModal from '../components/ChatbotModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [moodSummary, setMoodSummary] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);

  const fetchData = async () => {
    try {
      const [summaryRes, entriesRes] = await Promise.all([
        api.get("/journal/summary"),
        api.get("/journal")
      ]);
      setMoodSummary(summaryRes.data);
      setRecentEntries(entriesRes.data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const stats = [
    { label: 'Daily Steps', value: '8,432', icon: <HiArrowRightOnRectangle className="rotate-90 w-6 h-6" />, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { label: 'Current Mood', value: moodSummary?.lastEntry?.emotion || 'Stable', icon: <HiSparkles className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600', trend: 'Live' },
    { label: 'Calories', value: '1,240', icon: <HiFire className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600', trend: '+5%' },
    { label: 'Insights', value: moodSummary?.recentEmotions?.length || '0', icon: <HiChartBar className="w-6 h-6" />, color: 'bg-teal-50 text-teal-600', trend: 'New' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-x-hidden">
      {/* Modals */}
      <JournalModal 
        isOpen={isJournalOpen} 
        onClose={() => setIsJournalOpen(false)} 
        onEntryCreated={fetchData} 
      />
      <ChatbotModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

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
          <button onClick={() => setIsJournalOpen(true)} className="w-full">
            <NavItem icon={<HiSparkles />} label="Journal Entry" />
          </button>
          <button onClick={() => setIsChatOpen(true)} className="w-full">
            <NavItem icon={<HiChatBubbleLeftRight />} label="AI Chat" />
          </button>
          <NavItem icon={<HiChartBar />} label="History" />
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
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Hello, {user?.name || user?.email?.split('@')[0]}</h1>
              <p className="text-slate-400 font-semibold flex items-center gap-2">
                <HiOutlineClock className="w-5 h-5" />
                {moodSummary?.lastEntry ? `Last journal: ${new Date(moodSummary.lastEntry.createdAt).toLocaleTimeString()}` : 'Start your first journal today!'}
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-all border border-slate-100 shadow-sm"
              >
                <HiChatBubbleLeftRight className="w-5 h-5 text-indigo-600" />
                Talk to AI
              </button>
              <button 
                onClick={() => setIsJournalOpen(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100"
              >
                <HiPlus className="w-5 h-5" />
                New Journal
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-white shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-500 group">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* AI Insights Card */}
            <div className="xl:col-span-2 bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 rounded-full bg-white/10 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="text-6xl md:text-8xl">
                  {moodSummary?.lastEntry ? JSON.parse(moodSummary.lastEntry.sentiment).uiFeedback?.emoji || '✨' : '✨'}
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight">AI Insights</h3>
                  <p className="text-indigo-100 text-lg font-medium mb-8 leading-relaxed max-w-lg">
                    {moodSummary?.lastEntry 
                      ? JSON.parse(moodSummary.lastEntry.sentiment).insight 
                      : "You haven't logged any thoughts today. Tell me how you're feeling to get personalized insights!"}
                  </p>
                  <button 
                    onClick={() => setIsJournalOpen(true)}
                    className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    Start Journaling
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Recent Journals</h3>
              <div className="space-y-8">
                {recentEntries.length > 0 ? recentEntries.map((entry, i) => (
                  <ActivityItem 
                    key={i}
                    icon={entry.emotion === 'happy' ? '😊' : '📝'} 
                    title={entry.emotion || 'Journal'} 
                    desc={entry.content} 
                    time={new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  />
                )) : (
                  <p className="text-slate-400 font-bold text-center py-10">No entries yet.</p>
                )}
              </div>
              <button className="w-full mt-10 py-4 text-xs font-black text-indigo-600 bg-indigo-50/50 rounded-2xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 group">
                View Full History
                <HiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chat Button (Mobile) */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"
      >
        <HiChatBubbleLeftRight className="w-8 h-8" />
      </button>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 group ${
      active 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}>
    <span className={`text-xl transition-transform group-hover:scale-110 ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
  </div>
);

const ActivityItem = ({ icon, title, desc, time }) => (
  <div className="flex items-center gap-5 group cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-sm font-black text-slate-900 truncate capitalize">{title}</p>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{time}</span>
      </div>
      <p className="text-xs font-medium text-slate-400 truncate">{desc}</p>
    </div>
  </div>
);

export default Dashboard;
