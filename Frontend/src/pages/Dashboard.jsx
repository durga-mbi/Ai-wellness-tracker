import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
   HiBolt,
   HiBeaker,
   HiArrowsPointingOut,
   HiFaceSmile,
   HiOutlineChartBar,
   HiOutlineHeart,
   HiOutlineBookOpen,
   HiOutlineBolt,
   HiFire
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Legend,
   ReferenceLine
} from 'recharts';

const AnimatedHealthScore = ({ score }) => {
   const percentage = Math.min(Math.max(score * 10, 0), 100);
   const strokeDasharray = 2 * Math.PI * 90; // Contextual circumference
   const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

   return (
      <div className="relative w-44 h-44 lg:w-64 lg:h-64 flex flex-col items-center justify-center shrink-0 border-2 border-dashed border-gray-100 rounded-full bg-white shadow-2xl group hover:border-black transition-colors duration-700">
         <svg className="absolute inset-0 w-full h-full -rotate-90 p-2">
            <motion.circle
               cx="50%"
               cy="50%"
               r="44%"
               fill="none"
               stroke="#000"
               strokeWidth="2"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: percentage / 100 }}
               transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
               style={{ pathLength: 0 }}
            />
            <circle
               cx="50%"
               cy="50%"
               r="44%"
               fill="none"
               stroke="#f1f5f9"
               strokeWidth="2"
               strokeDasharray="4 4"
               className="opacity-20"
            />
         </svg>

         <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col items-center justify-center z-10"
         >
            <span className="text-6xl lg:text-8xl font-black text-black tracking-tighter italic group-hover:scale-110 transition-transform">
               <Counter value={score} />
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic mt-2">Health Score</span>
         </motion.div>
         <div className="absolute inset-4 rounded-full border border-gray-50/50 -z-10 animate-pulse"></div>
      </div>
   );
};

const Counter = ({ value }) => {
   const [displayValue, setDisplayValue] = useState(0);

   useEffect(() => {
      let start = 0;
      const end = parseFloat((value || 0).toFixed(1));
      if (isNaN(end)) {
         setDisplayValue(0);
         return;
      }
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
         start += increment;
         if (start >= end) {
            setDisplayValue(end);
            clearInterval(timer);
         } else {
            setDisplayValue(parseFloat(start.toFixed(1)));
         }
      }, 16);

      return () => clearInterval(timer);
   }, [value]);

   return <>{displayValue}</>;
};

const Dashboard = () => {
   const { user } = useAuth();
   const { updateLayout } = useLayout();
   const navigate = useNavigate();
   const [correlationData, setCorrelationData] = useState(null);
   const [insightLoading, setInsightLoading] = useState(true);
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [range, setRange] = useState("Week"); // Day, Week, Month

   useEffect(() => {
      fetchDashboardData();
      fetchCorrelationInsights();
   }, []);

   const fetchDashboardData = async () => {
      try {
         const response = await api.get(`/dashboard/${user.id}`);
         setData(response.data);
      } catch (error) {
         console.error("Dashboard data fetch failed", error);
      } finally {
         setLoading(false);
      }
   };

   const fetchCorrelationInsights = async () => {
      try {
         const response = await api.get("/analytics/correlations");
         setCorrelationData(response.data);
      } catch (error) {
         console.error("Correlation insights fetch failed", error);
      } finally {
         setInsightLoading(false);
      }
   };

   useEffect(() => {
      updateLayout({
         title: "Health Intelligence",
         subtitle: "Performance Hub",
         onBack: null,
         actions: null
      });
   }, []);

   if (loading) {
      return (
         <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-3 border-gray-100 border-t-black rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Analyzing Biometrics...</p>
         </div>
      );
   }

   // Filtering habit data based on range
   const getFilteredHabitData = () => {
      if (!data?.habitHistory) return [];
      const count = range === "Day" ? 1 : range === "Week" ? 7 : 30;
      const history = [...data.habitHistory].slice(-count);
      return history.map(h => ({
         name: range === "Day" ? "Today" : new Date(h.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
         Sleep: h.sleep || 0,
         Water: h.water || 0,
         Exercise: h.exercise || 0,
      }));
   };

   const habitChartData = getFilteredHabitData();

   // Normalize score from -1..1 to 0..10
   const avgScore = data?.weeklyAnalysis?.avgScore ?? 0;
   const normalizedScore = (avgScore + 1) * 5;
   const scorePercentage = (normalizedScore * 10).toFixed(0);

   const stats = [
      { label: "Weekly Score", value: `${scorePercentage}%`, icon: <HiOutlineBolt />, color: "text-black" },
      { label: "Social Presence", value: data?.summary?.totalPosts || 0, icon: <HiOutlineChartBar />, color: "text-black" },
      { label: "Current State", value: data?.latestMood || "Balanced", icon: <HiFaceSmile />, color: "text-black" },
   ];

   const getScoreColor = (score) => {
      if (score > 0.6) return "bg-green-500";
      if (score > 0.2) return "bg-blue-500";
      if (score > -0.2) return "bg-gray-400";
      return "bg-red-500";
   };

   return (
      <div className="flex-1 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-2 scroll-smooth">
         {/* Strategic Intelligence Header */}
         <section className="relative overflow-hidden rounded-[32px] bg-gray-50 border border-gray-100 p-10 flex flex-col lg:flex-row items-center justify-between min-h-[300px] shrink-0 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-white blur-[100px] rounded-full opacity-60 pointer-events-none"></div>

            <div className="relative z-10 max-w-xl space-y-6 text-center lg:text-left">
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-0.5 bg-white rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm"
               >
                  Wellness Intelligence Stream
               </motion.div>

               <div className="space-y-2">
                  <h2 className="text-4xl lg:text-6xl font-black text-black leading-none tracking-tighter italic uppercase">
                     {data?.weeklyAnalysis?.result || "Baseline Analysis"}.
                  </h2>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] italic">
                     Aggregate Score: <span className="text-black font-black">{normalizedScore.toFixed(1)} / 10</span> Intensity
                  </p>
               </div>

               <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-md italic border-l-2 border-black pl-4">
                  "Resulting in <span className="text-black font-black uppercase text-xs">{data?.weeklyAnalysis?.result}</span> based on this week's 7-stage reflection cycle. Maintain current hydration metrics to stabilize resonance."
               </p>

               <AnimatePresence>
                  {!insightLoading && correlationData?.insight && (
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative mt-4 p-4 bg-black rounded-2xl border border-gray-800 shadow-2xl group overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-2 opacity-20 text-white">
                           <HiFire className="text-2xl animate-pulse" />
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-1 flex items-center gap-1">
                                 Neural Correlation Insight <HiOutlineBolt className="text-yellow-400" />
                              </span>
                              <p className="text-[13px] font-black text-white italic leading-tight tracking-tight">
                                 "{correlationData.insight}"
                              </p>
                           </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors"></div>
                     </motion.div>
                  )}
               </AnimatePresence>

               <div className="flex gap-4 pt-2 justify-center lg:justify-start">
                  {/* <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${getScoreColor(data?.weeklyAnalysis?.avgScore)} animate-pulse`}></div>
              <span className="text-[9px] font-black text-black uppercase tracking-widest italic leading-none">Live Status: {data?.weeklyAnalysis?.result?.split(' ')[0]} Verified</span>
            </div> */}
               </div>
            </div>

            <AnimatedHealthScore score={normalizedScore} />
         </section>

         {/* Global Metrics Bar */}
         <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            {stats.map((stat, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-white border border-gray-100 p-8 rounded-[32px] flex flex-col gap-4 hover:border-black transition-all shadow-sm group"
               >
                  <div className={`text-2xl ${stat.color} shrink-0 group-hover:scale-110 transition-transform`}>
                     {stat.icon}
                  </div>
                  <div className="text-left">
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic leading-none mb-1">{stat.label}</p>
                     <h4 className="text-2xl font-black text-black tracking-tighter leading-none italic uppercase">{stat.value}</h4>
                  </div>
               </motion.div>
            ))}
         </section>

         {/* Advanced Habit Performance Map */}
         {/* <section className="bg-white border border-gray-100 rounded-[32px] p-10 space-y-10 shadow-sm flex flex-col flex-1 min-h-[550px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shrink-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm w-fit">
              Biometric Visualization Hub
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-black italic uppercase leading-none">Habit Performance Map.</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] italic leading-none">Multi-Entity Biometric Visualization Layer</p>
          </div>

          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 shadow-inner">
            {["Day", "Week", "Month"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${range === r ? "bg-black text-white shadow-md" : "text-gray-500 hover:text-black"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={habitChartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontBold: true, fill: '#cbd5e1' }}
                dy={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontBold: true, fill: '#cbd5e1' }}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', fontSize: '10px', fontBold: true, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px' }}
              />
              <Bar dataKey="Sleep" fill="#000000" radius={[4, 4, 0, 0]} barSize={range === 'Month' ? 8 : 16} />
              <Bar dataKey="Water" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={range === 'Month' ? 8 : 16} />
              <Bar dataKey="Exercise" fill="#10b981" radius={[4, 4, 0, 0]} barSize={range === 'Month' ? 8 : 16} />
              <ReferenceLine y={0} stroke="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
          {[
            { label: "Rest Cycle", value: "Optimal", target: "8.0h", status: "Steady", color: "text-black" },
            { label: "Hydration", value: "Baseline", target: "2.5L", status: "Neutral", color: "text-blue-600" },
            { label: "Activity", value: "Peak", target: "45m", status: "High", color: "text-emerald-500" }
          ].map((det, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic">{det.label}</p>
                <span className={`text-[8px] font-black uppercase ${det.color}`}>{det.status}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h5 className="text-xl font-black text-black tracking-tighter italic">{det.value}</h5>
                <p className="text-[10px] font-bold text-gray-400">/ {det.target}</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}
      </div>
   );
};

export default Dashboard;
