import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  HiBolt, 
  HiFaceSmile, 
  HiFire, 
  HiMoon, 
  HiBeaker, 
  HiArrowsPointingOut,
  HiPlus,
  HiChevronRight,
  HiSparkles
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion } from "framer-motion";
import sanctuaryHero from "../assets/sanctuary-hero.png";

const Dashboard = () => {
  const { user } = useAuth();
  const { updateLayout } = useLayout();
  const [moodSummary, setMoodSummary] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/user/mood-summary");
      setMoodSummary(response.data);
    } catch (error) {
      console.error("Dashboard data fetch failed", error);
    }
  };

  useEffect(() => {
    updateLayout({
      title: "", // Purely visual, no title in Topbar as per screenshot
      subtitle: "",
      onBack: null,
      actions: null // Topbar buttons are constant in this new design
    });
  }, []);

  const stats = [
    { label: "Steps", value: "8,432", trend: "+12%", icon: <HiBolt />, color: "text-slate-400" },
    { label: "Mood", value: "Elevated", trend: "Stable", icon: <HiFaceSmile />, color: "text-indigo-400" },
    { label: "Calories", value: "1,840", trend: "Target: 2,200", icon: <HiFire />, color: "text-orange-400" },
    { label: "Sleep", value: "6h 12m", trend: "Optimizing", icon: <HiMoon />, color: "text-indigo-300" },
    { label: "Water", value: "1.2L", trend: "75%", icon: <HiBeaker />, color: "text-blue-400" },
    { label: "Exercise", value: "45m", trend: "Yoga Session", icon: <HiArrowsPointingOut />, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] sanctuary-hero-gradient p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between min-h-[450px]">
        {/* Background Image Overlay */}
        <div className="absolute top-0 right-0 w-full h-full lg:w-1/2 opacity-80 mix-blend-screen pointer-events-none">
             <img 
              src={sanctuaryHero} 
              alt="Sanctuary Hero" 
              className="w-full h-full object-contain lg:object-right scale-110 lg:scale-100"
             />
        </div>

        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 uppercase font-black text-[10px] tracking-widest text-indigo-200">
            <HiSparkles className="w-3 h-3" />
            Daily Resonance
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter">
            Your nervous system is seeking restorative stillness today.
          </h2>
          <p className="text-xl text-indigo-200/80 font-medium leading-relaxed max-w-xl">
             Based on your elevated cortisol markers and last night's brief REM cycles, we recommend a 15-minute Box Breathing session before your 2 PM meeting.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-10 py-5 bg-white text-indigo-900 font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Explore Plan
            </button>
            <button className="px-10 py-5 bg-white/10 text-white backdrop-blur-md rounded-full font-black border border-white/5 hover:bg-white/20 transition-all">
              Dismiss
            </button>
          </div>
        </div>
      </section>

      {/* Biometric Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="sanctuary-card p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-white/10 transition-colors group">
            <div className={`text-4xl ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-[22px] font-black text-white tracking-tight">{stat.value}</h4>
            </div>
             <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/2 rounded-full shadow-[0_0_8px_#6366f1]"></div>
             </div>
             <p className="text-[9px] font-bold text-slate-400/60 uppercase tracking-widest">{stat.trend}</p>
          </div>
        ))}
      </section>

      {/* Bottom Data Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Habit Tracker */}
        <div className="lg:col-span-4 sanctuary-card p-10 rounded-[3rem] space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-white tracking-tight">Habit Tracker</h3>
            <button className="p-2 bg-white/5 rounded-xl hover:text-indigo-400 transition-colors">
              <HiPlus className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-10">
             <HabitProgress label="Morning Meditation" progress={85} />
             <HabitProgress label="Deep Work Blocks" progress={60} />
             <HabitProgress label="Digital Detox (9PM)" progress={42} />
          </div>

          <div className="pt-6">
             <div className="bg-[#1a1a1c] p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl border-2 border-indigo-500/20 flex flex-col items-center justify-center text-white">
                   <span className="text-2xl font-black leading-none">7d</span>
                </div>
                <div>
                   <p className="text-sm font-black text-white mb-1">Consistency Streak</p>
                   <p className="text-xs font-bold text-slate-400 leading-tight">You're in the top 5% of users this week!</p>
                </div>
             </div>
          </div>
        </div>

        {/* Vitality Convergence (Chart Placeholder with Bars) */}
        <div className="lg:col-span-8 sanctuary-card p-10 rounded-[3rem] space-y-10 flex flex-col">
          <div className="flex justify-between items-center">
             <div>
                <h3 className="text-xl font-black text-white tracking-tight">Vitality Convergence</h3>
                <p className="text-xs font-bold text-slate-500">Weekly biometric correlation</p>
             </div>
             <div className="flex bg-[#1a1a1c] p-1.5 rounded-full border border-white/5">
                <button className="px-6 py-1.5 bg-white text-[#09090b] rounded-full text-[10px] font-black uppercase tracking-widest">Week</button>
                <button className="px-6 py-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">Month</button>
             </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 py-6 px-4">
             {[45, 65, 85, 35, 55, 30, 48].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                   <div className="w-full relative group">
                      <div className="w-full bg-[#1a1a1c] rounded-2xl mb-4 aspect-[1/4] flex flex-col justify-end overflow-hidden">
                         {/* Lighter Stack (Top) */}
                         <div 
                           className="w-full bg-indigo-400/20" 
                           style={{ height: `${h + 15}%` }}
                          ></div>
                         {/* Solid Stack (Bottom) */}
                         <div 
                           className="w-full bg-indigo-500/80 shadow-[0_0_15px_#6366f144]" 
                           style={{ height: `${h}%` }}
                          ></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                   </div>
                </div>
             ))}
          </div>

          <div className="flex gap-8 border-t border-white/5 pt-8">
             <LegendItem color="bg-indigo-400" label="Physical Resilience" />
             <LegendItem color="bg-indigo-800" label="Cognitive Clarity" />
          </div>
        </div>
      </section>
    </div>
  );
};

const HabitProgress = ({ label, progress }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-xs font-black text-slate-300 tracking-tight">{label}</span>
      <span className="text-xs font-black text-white">{progress}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
       <div 
         className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1] transition-all duration-1000" 
         style={{ width: `${progress}%` }}
       ></div>
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default Dashboard;
