import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineInformationCircle, HiOutlineChartBar, HiOutlineHeart, HiOutlineBookOpen, HiFire } from "react-icons/hi2";

const MoodCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await api.get(`/journal/calendar?month=${month}&year=${year}`);
      setMoodData(res.data.data);
    } catch (err) {
      console.error("Error fetching mood data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodData();
  }, [currentDate]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getDayData = (day) => {
    return moodData.find(d => d.day === day);
  };

  const isFuture = (day) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate > today;
  };

  const getMoodColor = (score, isFutureDay) => {
    if (isFutureDay) return "bg-gray-50/50 cursor-not-allowed border-dashed";
    if (score === null || score === undefined) return "bg-white hover:bg-gray-50 transition-colors";

    // Intensity Scale
    if (score > 0.6) return "bg-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.4)]"; // Peak Optimal
    if (score > 0.2) return "bg-[#AAFFCC]"; // Calm/Positive
    if (score > -0.2) return "bg-[#FFFFA0]"; // Neutral/Balanced
    if (score > -0.6) return "bg-[#FF9966] shadow-[0_0_20px_rgba(255,153,102,0.3)]"; // High Stress
    return "bg-[#FF4444] shadow-[0_0_20px_rgba(255,68,68,0.4)]"; // Crisis/Heavy
  };

  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    if (next <= new Date(today.getFullYear(), today.getMonth() + 1)) {
      setCurrentDate(next);
    }
  };
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="w-full space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm w-fit">
          Bio-Rhythm Audit Protocol
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
          <div className="flex items-center justify-between md:justify-end gap-4 bg-black p-2 rounded-2xl shadow-2xl border border-white/10 w-full md:w-auto">
            <button
              onClick={prevMonth}
              className="p-3 text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <HiOutlineChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-[12px] font-black uppercase tracking-[0.2em] italic px-6 text-white min-w-[150px] md:min-w-[180px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className={`p-3 text-white rounded-xl transition-all ${currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() ? "opacity-20 cursor-not-allowed" : "hover:bg-white/10"}`}
            >
              <HiOutlineChevronRight className="w-6 h-6" />
            </button>
          </div>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest md:mr-4 italic">Historical Resonance Audit Layer</p>
        </div>
      </div>

      {/* Dynamic Summary Cards - Standardized to Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Month", value: (moodData.length > 0 ? "Active" : "Silent"), color: "black", icon: <HiOutlineChartBar /> },
          { label: "Stability Index", value: "88%", color: "emerald-500", icon: <HiOutlineHeart /> },
          { label: "Reflection Logs", value: `${moodData.length} Total`, color: "gray-100", icon: <HiOutlineBookOpen /> },
          { label: "Audit Streak", value: "12 Days", color: "black", icon: <HiFire /> }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-100 p-8 rounded-[32px] flex flex-col gap-4 hover:border-black transition-all shadow-sm group relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 italic leading-none">{stat.label}</p>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black leading-none">{stat.value}</h3>
            </div>
            <div className={`absolute top-6 right-6 text-2xl group-hover:scale-110 transition-transform ${stat.color.includes('-') ? `text-${stat.color}` : 'text-gray-100'}`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Heatmap Architecture - High Fidelity Layout */}
      <div className="bg-white p-10 md:p-14 lg:p-20 rounded-[40px] md:rounded-[60px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-50/50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl -z-10 animate-float"></div>

        {/* Days Header - Standardized Alignment */}
        <div className="grid grid-cols-7 gap-6 mb-12">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">{day}</span>
            </div>
          ))}
        </div>

        {/* The Grid Component */}
        <div className="grid grid-cols-7 gap-4 md:gap-6">
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${currentDate.getTime()}-${i}`} className="aspect-square opacity-0"></div>
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const data = getDayData(day);
            const future = isFuture(day);

            return (
              <motion.div
                key={day}
                whileHover={!future ? { scale: 1.05, zIndex: 10 } : {}}
                className={`
                  aspect-square rounded-[24px] md:rounded-[36px] relative group border border-gray-50/50
                  ${getMoodColor(data?.avgScore, future)}
                  transition-all duration-700 ${!future && "cursor-pointer"}
                  ${!future && "hover:shadow-xl"}
                `}
                onMouseEnter={() => !future && setSelectedDay(data || { day, empty: true })}
                onMouseLeave={() => setSelectedDay(null)}
              >
                <span className={`absolute top-4 left-5 text-[10px] font-black italic transition-opacity ${future ? "text-gray-400" : "text-black/20 group-hover:text-black"}`}>
                  {day < 10 ? `0${day}` : day}
                </span>

                {!future && data && (
                  <div className="absolute top-4 right-5 w-2 h-2 bg-black/10 rounded-full group-hover:bg-black transition-colors"></div>
                )}

                {/* Today Identification Protocol */}
                {day === today.getDate() &&
                  currentDate.getMonth() === today.getMonth() &&
                  currentDate.getFullYear() === today.getFullYear() && (
                    <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                      <div className="w-10 h-1.5 bg-black rounded-full shadow-lg"></div>
                    </div>
                  )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend Map */}
        <div className="mt-20 border-t border-gray-50 pt-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] italic text-black">Sentiment Intensity Scale</h4>
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Aggregated from AI Journaling Logs</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 bg-gray-50/50 p-6 rounded-[30px] border border-gray-100">
            {[
              { label: "Optimal", color: "#00FF88", shadow: "0 0 10px rgba(0,255,136,0.5)" },
              { label: "Positive", color: "#AAFFCC" },
              { label: "Balanced", color: "#FFFFA0" },
              { label: "Stress", color: "#FF9966" },
              { label: "Distress", color: "#FF4444", shadow: "0 0 10px rgba(255,68,68,0.5)" }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: item.shadow || 'none' }}
                ></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-black/60 italic">{item.label}</span>
              </div>
            ))}
            <div className="w-[1px] h-4 bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-gray-100 border-dashed border border-gray-300"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 italic">Future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Intelligence Overlay */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none"
          >
            <div className="bg-black text-white p-6 rounded-[32px] shadow-2xl flex flex-col gap-4 border border-white/10 backdrop-blur-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-1 block">Date Ref.</span>
                  <p className="text-2xl font-black italic uppercase italic tracking-tighter">
                    Day {selectedDay.day < 10 ? `0\${selectedDay.day}` : selectedDay.day}
                  </p>
                </div>
                <HiOutlineInformationCircle className="w-6 h-6 text-gray-600" />
              </div>

              <div className="h-[1px] bg-white/10 w-full"></div>

              {selectedDay.empty ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] italic text-gray-500 py-2">
                  No Intelligence Data for this period
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Dominant Emotion</span>
                    <span className="text-[11px] font-black italic uppercase text-[#00FF88]">
                      {selectedDay.dominantEmotion}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Confidence Score</span>
                    <span className="text-[11px] font-black italic uppercase">
                      {Math.abs(selectedDay.avgScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[9px] leading-relaxed text-gray-400 italic">
                      Aggregated from {selectedDay.count} journal entry reflections. Emotional baseline was {selectedDay.avgScore > 0 ? "Positive" : "Negative"}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodCalendar;
