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

const Dashboard = () => {
  const { user } = useAuth();
  const { updateLayout } = useLayout();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("Week"); // Day, Week, Month

  useEffect(() => {
    fetchDashboardData();
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
  const normalizedScore = (data?.weeklyAnalysis?.avgScore + 1) * 5;
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
      <section className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 p-8 flex flex-col lg:flex-row items-center justify-between min-h-[250px] shrink-0 shadow-sm">
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-white blur-[80px] rounded-full opacity-60 pointer-events-none"></div>

        <div className="relative z-10 max-w-xl space-y-4 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-0.5 bg-white rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm"
          >
            Weekly Wellness Protocol
          </motion.div>

          <div className="space-y-1">
            <h2 className="text-3xl lg:text-5xl font-black text-black leading-none tracking-tighter italic uppercase">
              {data?.weeklyAnalysis?.result || "Baseline Analysis"}.
            </h2>
            <p className="text-sm lg:text-md text-gray-400 font-medium italic">
              Aggregate Score: <span className="text-black font-bold">{normalizedScore.toFixed(1)} / 10</span> Intensity
            </p>
          </div>

          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md italic border-l-2 border-black pl-4">
            "Resulting in <span className="text-black font-bold uppercase">{data?.weeklyAnalysis?.result}</span> based on this week's 7-stage reflection cycle. Maintain current hydration metrics to stabilize resonance."
          </p>

          <div className="flex gap-4 pt-2 justify-center lg:justify-start">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${getScoreColor(data?.weeklyAnalysis?.avgScore)} animate-pulse`}></div>
              <span className="text-[10px] font-bold text-black uppercase tracking-widest italic">Live Status: {data?.weeklyAnalysis?.result?.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        <div className="relative mt-8 lg:mt-0 w-40 h-40 lg:w-56 lg:h-56 flex flex-col items-center justify-center shrink-0 border-2 border-dashed border-gray-100 rounded-full bg-white shadow-inner">
          <span className="text-5xl lg:text-7xl font-black text-black tracking-tighter italic">
            {normalizedScore.toFixed(1)}
          </span>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic mt-2">Health Score</span>
        </div>
      </section>

      {/* Global Metrics Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center gap-4 hover:border-black transition-all shadow-sm group"
          >
            <div className={`text-2xl ${stat.color} shrink-0 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic leading-none">{stat.label}</p>
              <h4 className="text-xl font-bold text-black tracking-tight mt-1 leading-none italic">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Advanced Habit Performance Map */}
      <section className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8 shadow-sm flex flex-col flex-1 min-h-[500px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-black italic uppercase">Habit Performance Map.</h3>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] italic">Multi-Entity Biometric Visualization</p>
          </div>

          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 shadow-inner">
            {["Day", "Week", "Month"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${range === r ? "bg-black text-white shadow-md" : "text-gray-300 hover:text-black"}`}
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
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">{det.label}</p>
                <span className={`text-[8px] font-black uppercase ${det.color}`}>{det.status}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h5 className="text-xl font-black text-black tracking-tighter italic">{det.value}</h5>
                <p className="text-[10px] font-bold text-gray-200">/ {det.target}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
