import React, { useState, useEffect } from "react";
import {
  HiOutlineMoon,
  HiOutlineBeaker,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiCheckCircle,
  HiOutlineCheckCircle,
  HiOutlineBolt
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import toast from "react-hot-toast";

const C = {
  primary: "#506b4a",
  priCont: "#ccebc2",
  text: "#373a1c",
  textMut: "#636745",
  outline: "#b9bc94",
  surface: "#f4f6d2",
};

const HabitTracker = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [habitData, setHabitData] = useState({
    sleep: 0,
    water: 0,
    exercise: 0,
    mindfulness: 0,
    completedGoals: []
  });

  const targets = user?.wellnessGoals ? JSON.parse(user.wellnessGoals) : {
    sleep: 8,
    water: 2.5,
    exercise: 30,
    mindfulness: 15
  };

  useEffect(() => {
    fetchTodayHabits();
  }, []);

  const fetchTodayHabits = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await api.get(`/habits/${user.id}/${today}`);
      if (data) {
        setHabitData({
          sleep: data.sleep || 0,
          water: data.water || 0,
          exercise: data.exercise || 0,
          mindfulness: data.mindfulness || 0,
          completedGoals: data.completedGoals || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch habits", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleSave = async (newData) => {
  //   setSaving(true);
  //   try {
  //     const today = new Date().toISOString().split("T")[0];
  //     await api.post("/habits", {
  //       userId: user.id,
  //       date: today,
  //       ...newData
  //     });
  //     setHabitData(newData);
  //   } catch (err) {
  //     toast.error("Failed to save progress");
  //   } finally {
  //     setSaving(false);
  //   }
  // };


  const handleSave = async (newData) => {
    if (
      newData.sleep === "" ||
      newData.water === "" ||
      newData.exercise === "" ||
      newData.mindfulness === ""
    ) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await api.post("/habits", {
        userId: user.id,
        date: today,
        ...newData
      });
      setHabitData(newData);
      toast.success("Progress saved ");
    } catch (err) {
      toast.error("Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  const toggleGoal = (goalKey) => {
    const isNowCompleted = !habitData.completedGoals.includes(goalKey);
    const newCompleted = isNowCompleted
      ? [...habitData.completedGoals, goalKey]
      : habitData.completedGoals.filter(g => g !== goalKey);

    // Auto-update the numeric value to target if marked as done and current value is less than target
    const newData = { ...habitData, completedGoals: newCompleted };
    if (isNowCompleted && targets[goalKey]) {
      newData[goalKey] = targets[goalKey];
    }

    handleSave(newData);
  };

  const updateNumeric = (key, val) => {
    const numericVal = val === "" ? "" : parseFloat(val) || 0;
    const target = targets[key];
    
    let newCompletedGoals = [...habitData.completedGoals];
    
    // Auto-update completed state: If value is lowered below target, remove from completed list
    if (numericVal !== "" && numericVal < target) {
      newCompletedGoals = newCompletedGoals.filter(g => g !== key);
    } else if (numericVal !== "" && numericVal >= target && !newCompletedGoals.includes(key)) {
      // Also automatically add it if it reaches the target via manual input
      newCompletedGoals.push(key);
    }

    const newData = { 
      ...habitData, 
      [key]: numericVal,
      completedGoals: newCompletedGoals
    };
    setHabitData(newData);
  };

  if (loading) return <div className="h-64 bg-white/20 animate-pulse rounded-[40px]" />;

  const rituals = [
    { key: "sleep", label: "Restful Sleep", target: targets.sleep, icon: <HiOutlineMoon />, value: habitData.sleep, unit: "h" },
    { key: "water", label: "Deep Hydration", target: targets.water, icon: <HiOutlineBeaker />, value: habitData.water, unit: "L" },
    { key: "exercise", label: "Vital Movement", target: targets.exercise, icon: <HiOutlineHeart />, value: habitData.exercise, unit: "m" },
    { key: "mindfulness", label: "Mindful Peace", target: targets.mindfulness, icon: <HiOutlineSparkles />, value: habitData.mindfulness, unit: "m" },
  ];

  const handleQuickSyncTargets = () => {
    const newData = {
      ...habitData,
      sleep: targets.sleep,
      water: targets.water,
      exercise: targets.exercise,
      mindfulness: targets.mindfulness,
      completedGoals: ["sleep", "water", "exercise", "mindfulness"]
    };
    handleSave(newData);
    toast.success("Synchronized targets as your actual progress! Keep it up. ✨");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Ritual Logging Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-8 bg-white/80 backdrop-blur-xl rounded-[48px] p-8 sm:p-10 border border-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: C.text }}>Your Progress</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50" style={{ color: C.textMut }}>Log your actual wellness data for today</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickSyncTargets}
              className="px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary transition-all hover:bg-white"
              style={{ color: C.primary, borderColor: `${C.primary}40` }}
            >
              Sync Targets
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave(habitData)}
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2"
              style={{ background: C.primary, color: "#fff" }}
            >
              {saving ? "Saving..." : "Save Log"} <HiOutlineBolt className={saving ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rituals.map((r) => (
            <div key={r.key} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110" style={{ background: `${C.primary}10`, color: C.primary }}>
                  {r.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textMut }}>{r.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <input
                  type="number"
                  value={r.value}
                  onChange={(e) => updateNumeric(r.key, e.target.value)}
                  className="w-full bg-transparent text-4xl font-black italic outline-none border-b-2 border-transparent focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ color: C.text, borderColor: `${C.outline}20` }}
                />
                <span className="text-sm font-bold opacity-40 mb-2 uppercase">{r.unit}</span>
              </div>
              <p className="text-[10px] font-bold uppercase mt-3 tracking-widest flex items-center gap-2">
                <span className="opacity-30">Goal:</span>
                <span style={{ color: C.primary }}>{r.target}{r.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Checklist Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-4 flex flex-col gap-6"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-xl flex-1">
          <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6" style={{ color: C.text }}>Today's Intentions</h3>
          <div className="space-y-4">
            {rituals.map((r) => {
              const value = habitData[r.key];

              const isNumericDone =
                value > 0 && (
                  r.key === "sleep" ? value >= targets.sleep :
                    r.key === "water" ? value >= targets.water :
                      r.key === "exercise" ? value >= targets.exercise :
                        value >= targets.mindfulness
                );

              const isChecked =
                (habitData.completedGoals.includes(r.key) && value > 0) ||
                isNumericDone;

              return (
                <div
                  key={r.key}
                  onClick={() => toggleGoal(r.key)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${isChecked ? 'shadow-inner' : 'hover:bg-white'}`}
                  style={{
                    background: isChecked ? `${C.priCont}30` : 'transparent',
                    borderColor: isChecked ? `${C.primary}40` : `${C.outline}20`
                  }}
                >
                  <div className="text-2xl" style={{ color: isChecked ? C.primary : `${C.outline}40` }}>
                    {isChecked ? <HiCheckCircle /> : <HiOutlineCheckCircle />}
                  </div>
                  <div>
                    <p className={`text-[12px] font-bold ${isChecked ? 'line-through opacity-50' : ''}`} style={{ color: C.text }}>
                      Met {r.label}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-40" style={{ color: C.textMut }}>
                      {r.target} Goal
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-[#50664a] to-[#3d4d38] text-white overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Daily Pulse</p>
              <h4 className="text-lg font-black italic uppercase leading-none mb-3">Goal Mastery</h4>
              <div className="flex items-end gap-2 text-2xl font-black italic">
                {habitData.completedGoals.length}
                <span className="text-xs font-bold opacity-50 mb-1">/ {rituals.length} Done</span>
              </div>
            </div>
            <HiOutlineSparkles className="absolute -bottom-4 -right-4 text-7xl opacity-10 group-hover:scale-125 transition-transform duration-1000" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HabitTracker;
