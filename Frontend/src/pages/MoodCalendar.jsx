import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChatBubbleOvalLeft, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineGlobeEuropeAfrica, HiOutlineInformationCircle } from "react-icons/hi2";

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
  // Get first day and adjust for Monday start if needed, but let's stick to screenshot's MON-SUN
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust firstDayOfMonth for Monday start (0=Sun, 1=Mon... -> 0=Mon, 1=Tue... 6=Sun)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const getDayData = (day) => {
    return moodData.find(d => d.day === day);
  };

  const isFuture = (day) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate > today;
  };

  const getMoodColor = (score, isFutureDay) => {
    if (isFutureDay) return "bg-[#fafae2] text-[#2d3e26]/10 cursor-not-allowed";
    if (score === null || score === undefined) return "bg-[#fdfdf0] text-[#2d3e26]/30 hover:bg-[#f9f9e2]";

    // Organic Sentiment Scale (Sage & Rose)
    if (score > 0.6) return "bg-[#4b6d47] text-white"; // High Positive (Deep Sage)
    if (score > 0.2) return "bg-[#b3c4a1] text-[#2d3e26]"; // Positive (Minty)
    if (score > -0.2) return "bg-[#d8e2cf] text-[#2d3e26]"; // Neutral/Slightly Pos (Pale Sage)
    if (score > -0.6) return "bg-[#e2ebe0] text-[#2d3e26]"; // Very light positive / neutral
    return "bg-[#e6c8cd] text-[#6d4b4b]"; // Negative (Soft Rose/Pink)
  };

  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    if (next <= new Date(today.getFullYear(), today.getMonth() + 1)) {
      setCurrentDate(next);
    }
  };
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const ZEN = {
    bg: "bg-[#fefee5]",
    card: "bg-[#fdfdf0]/80",
    text: "text-[#2d3e26]",
    subtext: "text-[#6b7e5f]",
    info: "text-[#8aa179]",
    border: "border-[#506b4a]/10",
    shadow: "shadow-[0_8px_30px_rgb(80,107,74,0.04)]",
  };

  // Helper for Monday-Sunday display
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className={`w-full min-h-full ${ZEN.bg} -m-4 p-4 md:p-8 relative overflow-hidden`}>
      {/* Decorative Orbs (Very subtle) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#b3c4a1]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#e6c8cd]/10 rounded-full blur-[100px] -z-10"></div>

      {/* Main Header */}
      <div className="mb-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl md:text-5xl font-black ${ZEN.text} tracking-tighter mb-2`}
        >
          Mood Calendar
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-sm md:text-md font-medium ${ZEN.subtext} italic mb-2`}
        >
          See the gentle patterns in your emotional journey
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center gap-2 ${ZEN.info} font-bold text-[9px] uppercase tracking-widest`}
        >
          <HiOutlineInformationCircle className="text-sm" />
          <span>Each day is colored by your journal sentiment analysis</span>
        </motion.div>
      </div>

      {/* Calendar Card Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`max-w-5xl mx-auto bg-white/40 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border ${ZEN.border} ${ZEN.shadow} relative`}
      >
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className={`text-xl md:text-2xl font-black ${ZEN.text} tracking-tight`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className={`p-2 rounded-full hover:bg-white transition-all border border-transparent hover:border-[#506b4a]/10 ${ZEN.text}`}
              title="Previous Month"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              disabled={currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()}
              className={`p-2 rounded-full hover:bg-white transition-all border border-transparent hover:border-[#506b4a]/10 ${ZEN.text} disabled:opacity-20 disabled:cursor-not-allowed`}
              title="Next Month"
            >
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-4 md:gap-6 mb-6 border-b border-[#506b4a]/5 pb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${ZEN.subtext}/40`}>{day}</span>
            </div>
          ))}
        </div>

        {/* Days Grid - Circles Based */}
        <div className="grid grid-cols-7 gap-4 md:gap-6">
          {/* Empty placeholders for offset start */}
          {[...Array(adjustedFirstDay)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}

          {/* Actual Month Days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const data = getDayData(day);
            const future = isFuture(day);
            const isToday = day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear();

            return (
              <motion.div
                key={day}
                whileHover={!future ? { scale: 1.1, zIndex: 10 } : {}}
                className={`
                  aspect-square rounded-full flex items-center justify-center relative
                  ${getMoodColor(data?.avgScore, future)}
                  transition-all duration-500 font-bold text-sm select-none
                  ${!future && "cursor-pointer"}
                  ${isToday && "ring-2 ring-offset-2 ring-[#506b4a]/20"}
                `}
                onMouseEnter={() => !future && setSelectedDay(data || { day, empty: true })}
                onMouseLeave={() => setSelectedDay(null)}
              >
                {day}

                {/* Flower/Leaf indicator if entries exist */}
                {!future && data && (
                  <div className="absolute top-1.5 right-1.5">
                    <HiOutlineChatBubbleOvalLeft className={`text-[10px] ${data.avgScore > 0.6 ? 'text-white/60' : 'text-[#506b4a]/30'}`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Day Info Bubble (Zen Style) */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-[90%] max-w-[300px]"
          >
            <div className="bg-[#2d3e26] text-[#fefee5] p-6 rounded-[32px] shadow-2xl border border-white/5 backdrop-blur-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <HiOutlineGlobeEuropeAfrica className="text-4xl rotate-45" />
              </div>
              <div className="flex flex-col gap-2 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8aa179]">Ref: Day {selectedDay.day}</span>
                {selectedDay.empty ? (
                  <p className="text-[11px] font-bold uppercase italic text-[#8aa179]/40 tracking-widest mt-1">Ethereal Stillness</p>
                ) : (
                  <>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-black uppercase italic tracking-wider text-white">{selectedDay.dominantEmotion || "Vibe Detected"}</span>
                      <span className="text-[11px] font-black bg-white/10 px-2.5 py-1 rounded-full">{Math.abs(selectedDay.avgScore * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[10px] font-medium leading-relaxed italic text-[#b3c4a1]">
                      Baseline: {selectedDay.avgScore > 0 ? "Growth Flow" : "Inner Reflection"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodCalendar;
