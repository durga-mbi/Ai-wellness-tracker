import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  HiFaceSmile,
  HiOutlineChartBar,
  HiOutlineHeart,
  HiOutlineBookOpen,
  HiOutlineBolt,
  HiFire,
  HiSparkles,
  HiOutlineSparkles
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

// ── Design tokens from "The Ethereal Sanctuary" ──────────────────────────────
const C = {
  bg: "#fefee5",
  surface: "#f4f6d2",
  card: "#ffffff",
  primary: "#506b4a",
  priCont: "#ccebc2",
  onPri: "#ffffff",
  text: "#373a1c",
  textMut: "#636745",
  outline: "#b9bc94",
};

const AnimatedHealthScore = ({ score }) => {
  const percentage = Math.min(Math.max(score * 10, 0), 100);

  return (
    <div className="relative w-48 h-48 lg:w-64 lg:h-64 flex flex-col items-center justify-center shrink-0 rounded-full bg-white shadow-xl group transition-all duration-700 hover:shadow-2xl" style={{ border: `1.5px solid ${C.outline}40` }}>
      <svg className="absolute inset-0 w-full h-full -rotate-90 p-4">
        <motion.circle
          cx="50%"
          cy="50%"
          r="42%"
          fill="none"
          stroke={C.priCont}
          strokeWidth="8"
          strokeLinecap="round"
          className="opacity-20"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="42%"
          fill="none"
          stroke={C.primary}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center justify-center z-10"
      >
        <span className="text-5xl lg:text-7xl font-extrabold tracking-tighter" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
          <Counter value={score} />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60" style={{ color: C.textMut }}>Wellness Score</span>
      </motion.div>

      {/* Decorative pulse */}
      <div className="absolute inset-2 rounded-full border opacity-20 animate-ping" style={{ borderColor: C.primary, animationDuration: '4s' }}></div>
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
  const [range, setRange] = useState("Week");

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
      title: "Your Sanctuary",
      subtitle: "Personal Overview",
      onBack: null,
      actions: null
    });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-100/50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest animate-pulse" style={{ color: C.textMut }}>Gathering Insights...</p>
      </div>
    );
  }

  const avgScore = data?.weeklyAnalysis?.avgScore ?? 0;
  const normalizedScore = (avgScore + 1) * 5;
  const scorePercentage = (normalizedScore * 10).toFixed(0);

  const stats = [
    { label: "Reflections", value: data?.summary?.totalPosts || 0, icon: <HiOutlineChartBar />, color: C.primary },
    { label: "Steady Mood", value: data?.latestMood || "Balanced", icon: <HiFaceSmile />, color: C.primary },
    { label: "Community", value: "Active", icon: <HiSparkles />, color: C.primary },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 sm:gap-8 h-full overflow-y-auto custom-scrollbar px-3 sm:px-4 pr-2 pb-10">

      {/* Wellness Overview Hero */}
      <section
        className="
      relative overflow-hidden 
      rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] 
      p-5 sm:p-8 lg:p-14 
      flex flex-col lg:flex-row 
      items-center lg:items-center 
      justify-between 
      gap-8 lg:gap-10
      min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] 
      shadow-sm border transition-all
    "
        style={{ background: C.surface, borderColor: `${C.outline}20` }}
      >

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[60%] sm:w-[40%] h-full bg-white opacity-40 blur-[80px] sm:blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[40%] sm:w-[30%] h-[30%] bg-white opacity-30 blur-[60px] sm:blur-[80px] rounded-full"></div>

        {/* LEFT CONTENT */}
        <div className="relative z-10 w-full max-w-xl space-y-5 sm:space-y-7 text-center lg:text-left">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
          inline-flex items-center gap-2 
          px-3 sm:px-4 py-1.5 
          bg-white rounded-full 
          shadow-sm border 
          text-[9px] sm:text-[10px] 
          font-bold uppercase tracking-widest
        "
            style={{ borderColor: `${C.outline}40`, color: C.primary }}
          >
            <HiOutlineSparkles className="animate-pulse text-xs sm:text-sm" />
            Wellness Journey Overview
          </motion.div>

          {/* Title */}
          <div className="space-y-3">
            <h2
              className="
            text-2xl sm:text-3xl md:text-4xl lg:text-6xl 
            font-extrabold leading-tight tracking-tight
          "
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
            >
              {data?.weeklyAnalysis?.result || "Finding Balance."}
            </h2>

            <div className="flex items-center gap-3 justify-center lg:justify-start flex-wrap">
              <p
                className="text-[11px] sm:text-xs font-semibold px-3 py-1 bg-white/50 rounded-lg"
                style={{ color: C.textMut }}
              >
                Intensity:{" "}
                <span style={{ color: C.primary }} className="font-bold">
                  {normalizedScore.toFixed(1)} / 10
                </span>
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className="
          text-xs sm:text-sm 
          leading-relaxed 
          max-w-md mx-auto lg:mx-0 
          italic opacity-80
        "
            style={{ color: C.text }}
          >
            "
            {data?.weeklyAnalysis?.result
              ? `You've shown a ${data.weeklyAnalysis.result.toLowerCase()} pattern this week.`
              : "Continuing to observe your patterns."}{" "}
            Remember to take small breaks for your mind today."
          </p>

          {/* Insight Card */}
          <AnimatePresence>
            {!insightLoading && correlationData?.insight && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
              relative mt-4 sm:mt-6 
              p-4 sm:p-6 
              rounded-2xl sm:rounded-3xl 
              shadow-xl overflow-hidden 
              group border
            "
                style={{ background: C.primary, borderColor: `${C.outline}20` }}
              >
                <HiFire
                  className="
                absolute 
                top-3 right-3 sm:top-4 sm:right-4 
                text-2xl sm:text-3xl 
                opacity-20 text-white animate-pulse
              "
                />

                <div className="flex flex-col relative z-10 gap-2">
                  <span
                    className="
                  text-[9px] sm:text-[10px] 
                  font-bold text-white/70 
                  uppercase tracking-widest 
                  flex items-center gap-1
                "
                  >
                    AI Sanctuary Insight
                    <HiOutlineBolt className="text-yellow-300 text-xs sm:text-sm" />
                  </span>

                  <p
                    className="
                  text-sm sm:text-base md:text-lg 
                  font-semibold text-white 
                  leading-relaxed sm:leading-snug
                "
                  >
                    "{correlationData.insight}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDE (Score) */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <AnimatedHealthScore score={normalizedScore} />
        </div>
      </section>

      {/* Secondary Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="
          bg-white border 
          p-5 sm:p-6 lg:p-8 
          rounded-2xl sm:rounded-[32px] lg:rounded-[40px] 
          flex flex-col gap-4 sm:gap-6 
          hover:shadow-lg transition-all group
        "
            style={{ borderColor: `${C.outline}20` }}
          >
            <div
              className="
            w-12 h-12 sm:w-14 sm:h-14 
            rounded-xl sm:rounded-2xl 
            flex items-center justify-center 
            text-xl sm:text-2xl 
            transition-transform group-hover:scale-110 shadow-sm
          "
              style={{ background: `${stat.color}10`, color: stat.color }}
            >
              {stat.icon}
            </div>

            <div>
              <p
                className="
              text-[10px] sm:text-[11px] 
              font-bold uppercase tracking-widest 
              mb-1 opacity-60
            "
                style={{ color: C.textMut }}
              >
                {stat.label}
              </p>

              <h4
                className="
              text-xl sm:text-2xl 
              font-extrabold tracking-tight
            "
                style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {stat.value}
              </h4>
            </div>
          </motion.div>
        ))}
      </section>

    </div>
  );
};

export default Dashboard;
