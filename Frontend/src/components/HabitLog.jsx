import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { HiOutlineMoon, HiOutlineBeaker, HiOutlineAcademicCap, HiCheckCircle } from "react-icons/hi2";

const HabitLog = ({ userId }) => {
  const [habits, setHabits] = useState({
    sleep: 0,
    water: 0,
    exercise: 0
  });
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTodayHabits = async () => {
      try {
        const { data } = await api.get(`/user-habits/${userId}/${today}`);
        if (data) setHabits(data);
      } catch (err) {
        // Not found is fine, it means they haven't logged today
      }
    };
    if (userId) fetchTodayHabits();
  }, [userId, today]);

  const handleSave = async (updatedHabits) => {
    setSaving(true);
    try {
      await api.post("/user-habits", {
        userId,
        date: today,
        ...updatedHabits
      });
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to save habits", err);
    } finally {
      setSaving(false);
    }
  };

  const updateHabit = (key, val) => {
    const newHabits = { ...habits, [key]: val };
    setHabits(newHabits);
    // Debounce or just save on change for better UX
    handleSave(newHabits);
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Daily Habit Tracker</h3>
        {lastSaved && (
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
            <HiCheckCircle className="w-3 h-3" /> Saved {lastSaved}
          </span>
        )}
      </div>

      <div className="space-y-8 flex-1">
        <HabitSlider 
          icon={<HiOutlineMoon className="w-6 h-6" />}
          label="Sleep"
          unit="hrs"
          value={habits.sleep || 0}
          max={12}
          color="bg-indigo-50 text-indigo-600"
          onChange={(v) => updateHabit('sleep', v)}
        />
        <HabitSlider 
          icon={<HiOutlineBeaker className="w-6 h-6" />}
          label="Water"
          unit="L"
          value={habits.water || 0}
          max={5}
          step={0.25}
          color="bg-blue-50 text-blue-600"
          onChange={(v) => updateHabit('water', v)}
        />
        <HabitSlider 
          icon={<HiOutlineAcademicCap className="w-6 h-6" />}
          label="Exercise"
          unit="min"
          value={habits.exercise || 0}
          max={120}
          step={5}
          color="bg-teal-50 text-teal-600"
          onChange={(v) => updateHabit('exercise', v)}
        />
      </div>
    </div>
  );
};

const HabitSlider = ({ icon, label, unit, value, max, step = 1, color, onChange }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${color} shadow-sm`}>{icon}</div>
        <span className="font-bold text-slate-700">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-900">{value}{unit} / {max}{unit}</span>
    </div>
    <input 
      type="range"
      min="0"
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

export default HabitLog;
