import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  HiBolt,
  HiBeaker,
  HiArrowsPointingOut,
  HiChevronRight,
  HiFaceSmile
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion } from "framer-motion";

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
      title: "Health Center",
      subtitle: "Daily Summary",
      onBack: null,
      actions: null
    });
  }, []);

  const stats = [
    { label: "Steps", value: "8,432", trend: "+12%", icon: <HiBolt />, color: "text-black" },
    { label: "Mood", value: "Elevated", trend: "Balanced", icon: <HiFaceSmile />, color: "text-black" },
    { label: "Water", value: "1.2L", trend: "75%", icon: <HiBeaker />, color: "text-black" },
    { label: "Exercise", value: "45m", trend: "Yoga", icon: <HiArrowsPointingOut />, color: "text-black" },
  ];

  return (
    <div className="flex flex-col h-full gap-4 pb-4">
      {/* Hero Section - No-Scroll Proportions */}
      <section className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between min-h-[220px] shrink-0 shadow-sm transition-all">
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-white blur-[60px] rounded-full opacity-40 pointer-events-none"></div>

        <div className="relative z-10 max-w-lg space-y-3 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-0.5 bg-white rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm"
          >
            Daily Summary
          </motion.div>

          <h2 className="text-2xl lg:text-3xl font-bold text-black leading-[1.1] tracking-tight">
            Your nervous system <br /> seeks Stillness.
          </h2>

          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md hidden md:block">
            Recommend a 15-minute Box Breathing session before your next deep-focus block.
          </p>

          <div className="flex gap-3 pt-1 justify-center lg:justify-start">
            <button className="px-6 py-2 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md text-[10px] uppercase tracking-wider">
              Explore Plan
            </button>
            <button className="px-6 py-2 bg-white text-gray-300 border border-gray-100 rounded-xl font-bold hover:text-black hover:bg-gray-50 transition-all text-[10px] uppercase tracking-wider">
              Dismiss
            </button>
          </div>
        </div>

        <div className="relative mt-4 lg:mt-0 w-24 h-24 lg:w-32 lg:h-32 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-200 shrink-0">
          <div className="text-xl italic font-serif opacity-30">Aura</div>
        </div>
      </section>

      {/* Biometric Grid - Compact Single Viewport */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-4 hover:border-gray-200 transition-all shadow-sm"
          >
            <div className={`text-2xl ${stat.color} shrink-0`}>
              {stat.icon}
            </div>
            <div className="text-left">
              <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">{stat.label}</p>
              <h4 className="text-lg font-bold text-black tracking-tight leading-none">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Narrative Section - Compact Layout */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center shrink-0">
            <h3 className="text-sm font-bold tracking-tight text-black uppercase">Reflections</h3>
            <button className="text-[9px] font-bold uppercase tracking-widest text-gray-300 hover:text-black flex items-center gap-1">
              All <HiChevronRight strokeWidth={2} />
            </button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {[1, 2, 3].map(j => (
              <div key={j} className="p-3 rounded-lg bg-gray-50/50 border border-gray-100 hover:border-gray-200 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-sm bg-white border border-gray-100 flex items-center justify-center text-black font-bold text-[9px] italic">0{j}</div>
                  <h5 className="font-bold text-black tracking-tight uppercase text-[10px]">Stillness</h5>
                </div>
                <HiChevronRight className="text-gray-200 group-hover:text-black w-3 h-3" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold tracking-tight text-black uppercase shrink-0">Energy</h3>
          <div className="flex-1 flex items-end justify-between gap-1 relative z-10 min-h-0">
            {[40, 60, 45, 80, 55, 90, 70, 85, 50, 65, 95, 75].map((h, i) => (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.1, duration: 0.5 }}
                key={i}
                className="flex-1 bg-black rounded-full min-w-[3px]"
              />
            ))}
          </div>
          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-gray-300 italic pt-2 shrink-0">
            <span>M</span><span>W</span><span>F</span><span>S</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
