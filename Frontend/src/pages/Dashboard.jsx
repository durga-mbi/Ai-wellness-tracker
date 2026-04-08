import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  HiBolt, 
  HiFaceSmile, 
  HiFire, 
  HiMoon, 
  HiBeaker, 
  HiArrowsPointingOut,
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
      title: "", 
      subtitle: "",
      onBack: null,
      actions: null 
    });
  }, []);

  const stats = [
    { label: "Steps", value: "8,432", trend: "+12%", icon: <HiBolt />, color: "text-amber-400" },
    { label: "Mood", value: "Elevated", trend: "Stable", icon: <HiFaceSmile />, color: "text-amber-500" },
    { label: "Calories", value: "1,840", trend: "Target: 2,200", icon: <HiFire />, color: "text-orange-400" },
    { label: "Sleep", value: "6h 12m", trend: "Optimizing", icon: <HiMoon />, color: "text-amber-200" },
    { label: "Water", value: "1.2L", trend: "75%", icon: <HiBeaker />, color: "text-amber-300" },
    { label: "Exercise", value: "45m", trend: "Yoga Session", icon: <HiArrowsPointingOut />, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8 lg:space-y-12 pb-20 selection:bg-amber-500/10">
      {/* Hero Section - Highly Responsive */}
      <section className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] bg-gradient-to-br from-[#121214] to-[#050505] border border-white/5 p-8 md:p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between min-h-[400px] lg:min-h-[500px] shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-amber-500/10 blur-[80px] lg:blur-[120px] rounded-full opacity-40 lg:opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-amber-600/5 blur-[80px] lg:blur-[100px] rounded-full pointer-events-none"></div>

        {/* Cinematic Backdrop Image */}
        <div className="absolute top-0 right-0 w-full h-full lg:w-1/2 opacity-30 lg:opacity-40 mix-blend-screen pointer-events-none overflow-hidden">
             <motion.img 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 2 }}
              src={sanctuaryHero} 
              alt="Sanctuary Hero" 
              className="w-full h-full object-contain object-bottom lg:object-right scale-125 lg:scale-100"
             />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl space-y-6 lg:space-y-10 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 lg:px-5 py-2 bg-white/[0.04] backdrop-blur-2xl rounded-full border border-white/5 uppercase font-black text-[8px] lg:text-[9px] tracking-[0.4em] text-amber-400/80 italic shadow-2xl"
          >
            <HiSparkles className="w-3 h-3 lg:w-4 lg:h-4" />
            Daily Resonance
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-[1] lg:leading-[0.9] tracking-tighter italic uppercase"
          >
            Your nervous <br className="hidden lg:block" /> system seeks <br className="hidden lg:block" /> Stillness.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-white/40 font-medium leading-relaxed max-w-lg italic mx-auto lg:mx-0"
          >
             Based on your elevated cortisol markers, we recommend a 15-minute Box Breathing session before your next deep-focus block.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4 items-center justify-center lg:justify-start">
            <button className="w-full sm:w-auto px-10 lg:px-12 py-5 lg:py-6 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] text-[10px] uppercase tracking-widest whitespace-nowrap">
              Explore Plan
            </button>
            <button className="w-full sm:w-auto px-10 lg:px-12 py-5 lg:py-6 bg-white/[0.02] text-white/40 backdrop-blur-md rounded-full font-black border border-white/5 hover:bg-white/[0.05] transition-all text-[10px] uppercase tracking-widest italic whitespace-nowrap">
              Dismiss
            </button>
          </div>
        </div>
      </section>

      {/* Biometric Grid - Smart Column Scaling */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white/[0.02] border border-white/5 p-6 md:p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 hover:bg-white/[0.04] hover:border-white/10 transition-all group backdrop-blur-3xl shadow-xl"
          >
            <div className={`text-4xl lg:text-5xl ${stat.color} group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[8px] lg:text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 lg:mb-3 italic">{stat.label}</p>
              <h4 className="text-xl lg:text-3xl font-black text-white tracking-tighter italic">{stat.value}</h4>
              <p className="text-[8px] lg:text-[10px] font-black text-amber-500/40 uppercase tracking-widest mt-1 lg:mt-2">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Narrative Section - Visual Balance */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
         {/* Reflections Card */}
         <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] lg:rounded-[3rem] p-8 md:p-12 lg:p-16 space-y-8 lg:space-y-10 backdrop-blur-3xl">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl lg:text-3xl font-black italic tracking-tighter uppercase relative">Recent Reflections</h3>
               <button className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all flex items-center gap-2">
                 View All <HiChevronRight strokeWidth={2} />
               </button>
            </div>
            <div className="space-y-4 lg:space-y-6">
              {[1, 2, 3].map(j => (
                <div key={j} className="p-6 md:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/[0.04] flex items-center justify-center text-amber-500/60 font-black text-xs lg:text-sm italic border border-white/5">0{j}</div>
                      <div>
                        <h5 className="font-black text-white italic tracking-tight mb-0.5 uppercase text-xs lg:text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] md:max-w-none">Sacred Stillness</h5>
                        <p className="text-[9px] lg:text-[10px] font-black text-white/20 uppercase tracking-widest">April 0{j + 4}, 2026</p>
                      </div>
                   </div>
                   <HiChevronRight className="text-white/10 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
         </div>

         {/* Energy Chart Card */}
         <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] lg:rounded-[3rem] p-8 md:p-12 lg:p-16 space-y-8 lg:space-y-10 backdrop-blur-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-full bg-orange-500/10 blur-[80px] lg:blur-[100px] pointer-events-none"></div>
            <h3 className="text-2xl lg:text-3xl font-black italic tracking-tighter uppercase relative z-10">Energy Continuum</h3>
            <div className="h-[200px] lg:h-[250px] flex items-end justify-between gap-1 lg:gap-2 relative z-10">
               {[40, 60, 45, 80, 55, 90, 70, 85, 50, 65, 95, 75].map((h, i) => (
                 <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-amber-500/10 to-amber-400/50 rounded-full border border-white/5 min-w-[4px]" 
                 />
               ))}
            </div>
            <div className="flex justify-between text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-white/10 px-2 italic relative z-10">
               <span>Mon</span>
               <span>Wed</span>
               <span>Fri</span>
               <span>Sun</span>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Dashboard;
