import React, { useState, useEffect } from "react";
import {
  HiAcademicCap,
  HiCheckBadge,
  HiShieldCheck,
  HiOutlineFingerPrint,
  HiOutlineSquare2Stack,
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlineMoon,
  HiOutlineBeaker,
  HiOutlineHeart,
  HiOutlineTrophy,
  HiArrowTrendingUp,
  HiOutlinePhone
} from "react-icons/hi2";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
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

const Settings = () => {
  const { user, updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const { updateLayout } = useLayout();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    ageGroup: user?.ageGroup || "",
    university: user?.university || "",
    apiKey: user?.apiKey || "",
    wellnessGoals: user?.wellnessGoals ? JSON.parse(user.wellnessGoals) : {
      sleep: 8,
      water: 2.5,
      exercise: 30,
      mindfulness: 15
    },
    emergencyContacts: user?.emergencyContacts ? JSON.parse(user.emergencyContacts) : []
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [correlationData, setCorrelationData] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        ageGroup: user.ageGroup || "",
        university: user.university || "",
        apiKey: user.apiKey || "",
        wellnessGoals: user.wellnessGoals ? JSON.parse(user.wellnessGoals) : {
          sleep: 8,
          water: 2.5,
          exercise: 30,
          mindfulness: 15
        },
        emergencyContacts: user.emergencyContacts ? JSON.parse(user.emergencyContacts) : []
      });
    }
  }, [user]);

  useEffect(() => {
    updateLayout({
      title: "Profile & Wellness",
      subtitle: "Your Mindmetrics AI Journey",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
    fetchCorrelationData();
  }, []);

  const fetchCorrelationData = async () => {
    try {
      const { data } = await api.get("/analytics/correlations");
      setCorrelationData(data);
    } catch (err) {
      console.error("Failed to fetch correlation data", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // User requested that they can submit less than 10 digits, so we just check for non-numeric or too long (handled by input)
    // We just ensure it's not empty if a name is provided
    const missingNumber = formData.emergencyContacts.some(c => c.name && !c.number);
    if (missingNumber) {
      setMessage("Please provide a phone number for each contact");
      setTimeout(() => setMessage(""), 3000);
      setSaving(false);
      return;
    }

    try {
      await updateAuthProfile(formData);
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to save your changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-12 pb-16 overflow-y-auto custom-scrollbar pr-2 scroll-smooth">
      {/* Profile Header Architecture */}
      <section className="shrink-0 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full border shadow-sm uppercase font-bold text-[9px] tracking-[0.2em] w-fit"
          style={{ borderColor: `${C.outline}30`, color: C.primary }}
        >
          Your Profile & Neural Insights
        </motion.div>
      </section>

      <div className="grid grid-cols-1 gap-12 items-start">
        {/* Profile Card and Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 self-start h-fit bg-white/70 backdrop-blur-xl border border-white/40 p-12 rounded-[56px] shadow-2xl text-center relative overflow-hidden group transition-all duration-1000 flex flex-col justify-center"
          >
            <div className="relative z-10">
              <div
                className="w-40 h-40 bg-white border rounded-[48px] flex items-center justify-center text-6xl font-black mx-auto mb-10 shadow-xl italic uppercase group-hover:scale-105 group-hover:rotate-3 transition-all duration-1000 ring-1 ring-[#50664a]/10"
                style={{ background: `linear-gradient(135deg, #ffffff 0%, ${C.surface} 100%)`, color: C.text }}
              >
                {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user?.name || "Seeker"}</h3>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] italic opacity-60" style={{ color: C.textMut }}>{user?.email || "Ephemeral Account"}</p>

              {/* <div className="mt-8 pt-8 border-t border-dashed flex flex-col gap-4" style={{ borderColor: `${C.outline}40` }}>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textMut }}>
                  <span>Wellness Streak</span>
                  <span className="flex items-center gap-1" style={{ color: C.primary }}><HiOutlineBolt /> 12 Days</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '65%', background: C.primary }}></div>
                </div>
              </div> */}
            </div>
            {/* Soft decorative blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 blur-[100px] rounded-full opacity-20 pointer-events-none" style={{ background: C.primary }}></div>
          </motion.div>

          {/* Profile Form Architecture */}
          <div className="lg:col-span-8">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSave}
              className="bg-white/80 backdrop-blur-xl border border-white/40 p-12 lg:p-16 rounded-[64px] shadow-2xl space-y-16 relative overflow-hidden flex flex-col"
            >
              {/* Basic Identity Section */}
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner border border-white" style={{ background: `${C.primary}10`, color: C.primary }}>
                    <HiOutlineUserCircle className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Identity</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>Basic details about you</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-bold uppercase tracking-[0.4em] italic ml-1" style={{ color: C.textMut }}>How we should call you</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-10 py-7 rounded-[32px] border border-white bg-white/50 text-2xl font-bold italic placeholder:text-gray-300 outline-none focus:bg-white transition-all shadow-inner"
                    style={{ color: C.text, fontFamily: "'Inter', sans-serif" }}
                    placeholder="Enter your name..."
                  />
                </div>
              </div>

              {/* Neural Correlation Insights (New) */}
              <div className="space-y-12 pt-16 border-t border-dashed" style={{ borderColor: `${C.outline}40` }}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner border border-white" style={{ background: `${C.primary}10`, color: C.primary }}>
                    <HiArrowTrendingUp className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Habit & Mood Neural Sync</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>AI-driven correlation analytics</p>
                  </div>
                </div>

                {loadingInsights ? (
                  <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : correlationData?.summary?.length > 0 ? (
                  <div className="space-y-8">
                    {/* Insight Card */}
                    <div className="p-8 rounded-[40px] border shadow-sm relative overflow-hidden group" style={{ background: `${C.surface}40`, borderColor: `${C.outline}30` }}>
                      <HiOutlineSparkles className="absolute top-6 right-8 text-4xl opacity-10 group-hover:scale-110 transition-transform" style={{ color: C.primary }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block" style={{ color: C.primary }}>Neural Insight</span>
                      <p className="text-xl font-bold italic" style={{ color: C.text }}>
                        "{correlationData.insight}"
                      </p>
                    </div>

                    {/* Chart Visualization */}
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={correlationData.summary}>
                          <defs>
                            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={C.primary} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${C.outline}40`} />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9, fill: C.textMut }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          />
                          <YAxis hide domain={[-1, 1]} />
                          <Tooltip
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="avgMood"
                            stroke={C.primary}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorMood)"
                            name="Mood Score"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {correlationData.impacts?.map((imp, idx) => (
                        <div key={idx} className="p-4 rounded-3xl border text-center" style={{ background: 'white', borderColor: `${C.outline}20` }}>
                          <span className="text-[9px] font-bold uppercase opacity-50 block mb-1" style={{ color: C.textMut }}>{imp.label}</span>
                          <span className="text-sm font-black" style={{ color: imp.value > 0 ? '#10b981' : C.text }}>+{imp.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-[40px] border border-dashed" style={{ borderColor: `${C.outline}60` }}>
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.textMut }}>
                      More neural patterns needed. Keep tracking habits to unlock insights.
                    </p>
                  </div>
                )}
              </div>

              {/* Wellness Protocol Architecture (Goals) */}
              <div className="space-y-12 pt-16 border-t border-dashed" style={{ borderColor: `${C.outline}40` }}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner border border-white" style={{ background: `${C.primary}10`, color: C.primary }}>
                    <HiOutlineTrophy className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Wellness Goals</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>Define your optimal daily targets</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Sleep Goal */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: C.textMut }}>
                        <HiOutlineMoon className="text-lg" /> Sleep Target
                      </label>
                      <span className="text-sm font-black" style={{ color: C.text }}>{formData.wellnessGoals.sleep} hrs</span>
                    </div>
                    <input
                      type="range" min="4" max="12" step="0.5"
                      value={formData.wellnessGoals.sleep}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellnessGoals: { ...formData.wellnessGoals, sleep: parseFloat(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#50664a]"
                    />
                  </div>

                  {/* Water Goal */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: C.textMut }}>
                        <HiOutlineBeaker className="text-lg" /> Hydration
                      </label>
                      <span className="text-sm font-black" style={{ color: C.text }}>{formData.wellnessGoals.water} L</span>
                    </div>
                    <input
                      type="range" min="1" max="5" step="0.1"
                      value={formData.wellnessGoals.water}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellnessGoals: { ...formData.wellnessGoals, water: parseFloat(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#50664a]"
                    />
                  </div>

                  {/* Exercise Goal */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: C.textMut }}>
                        <HiOutlineHeart className="text-lg" /> Exercise
                      </label>
                      <span className="text-sm font-black" style={{ color: C.text }}>{formData.wellnessGoals.exercise} min</span>
                    </div>
                    <input
                      type="range" min="0" max="120" step="5"
                      value={formData.wellnessGoals.exercise}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellnessGoals: { ...formData.wellnessGoals, exercise: parseFloat(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#50664a]"
                    />
                  </div>

                  {/* Mindfulness Goal */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: C.textMut }}>
                        <HiOutlineSparkles className="text-lg" /> Mindfulness
                      </label>
                      <span className="text-sm font-black" style={{ color: C.text }}>{formData.wellnessGoals.mindfulness} min</span>
                    </div>
                    <input
                      type="range" min="0" max="60" step="5"
                      value={formData.wellnessGoals.mindfulness}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellnessGoals: { ...formData.wellnessGoals, mindfulness: parseFloat(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#50664a]"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Protocols Section */}
              <div className="space-y-12 pt-16 border-t border-dashed" style={{ borderColor: `${C.outline}40` }}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner border border-white" style={{ background: `${C.primary}10`, color: C.primary }}>
                    <HiOutlineShieldCheck className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Emergency Protocol</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>Add your personal emergency contacts</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {formData.emergencyContacts.map((contact, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-6 p-8 rounded-[40px] border border-white bg-white/40 shadow-xl transition-all hover:bg-white/60 group"
                      style={{ borderColor: `${C.outline}20` }}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] ml-4" style={{ color: C.textMut }}>Contact Name</label>
                          <div className="relative group/input">
                            <HiOutlineUserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl transition-colors group-focus-within/input:text-[#50664a]" style={{ color: `${C.textMut}60` }} />
                            <input
                              type="text"
                              placeholder="Ex: Father, Sister..."
                              value={contact.name}
                              onChange={(e) => {
                                const newContacts = [...formData.emergencyContacts];
                                newContacts[idx].name = e.target.value;
                                setFormData({ ...formData, emergencyContacts: newContacts });
                              }}
                              className="w-full pl-16 pr-8 py-5 rounded-[24px] border border-white bg-white/50 text-base font-bold outline-none focus:bg-white transition-all shadow-inner"
                              style={{ color: C.text }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] ml-4" style={{ color: C.textMut }}>Mobile Number</label>
                          <div className="relative group/input">
                            <HiOutlinePhone className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl transition-colors group-focus-within/input:text-[#50664a]" style={{ color: `${C.textMut}60` }} />
                            <input
                              type="tel"
                              placeholder="10 Digits Max"
                              maxLength={10}
                              value={contact.number}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                const newContacts = [...formData.emergencyContacts];
                                newContacts[idx].number = val;
                                setFormData({ ...formData, emergencyContacts: newContacts });
                              }}
                              className="w-full pl-16 pr-8 py-5 rounded-[24px] border border-white bg-white/50 text-base font-bold outline-none focus:bg-white transition-all shadow-inner"
                              style={{ color: C.text }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newContacts = formData.emergencyContacts.filter((_, i) => i !== idx);
                          setFormData({ ...formData, emergencyContacts: newContacts });
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-red-50 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500 shadow-sm self-end"
                      >
                        Delete Contact
                      </button>
                    </motion.div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      emergencyContacts: [...formData.emergencyContacts, { name: "", number: "" }]
                    })}
                    className="w-full py-6 rounded-[32px] border border-dashed text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-white/50"
                    style={{ borderColor: `${C.outline}60`, color: C.textMut }}
                  >
                    + Add Emergency Contact
                  </button>
                </div>
              </div>

              {/* Technical Protocols Section */}
              <div className="space-y-12 pt-16 border-t border-dashed" style={{ borderColor: `${C.outline}40` }}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner border border-white" style={{ background: `${C.primary}10`, color: C.primary }}>
                    <HiOutlineSquare2Stack className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Connection</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>Connect your personal Gemini support</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.4em] italic" style={{ color: C.textMut }}>Your API Key</label>
                    {user?.apiKey && <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest italic animate-pulse">Connected</span>}
                  </div>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-10 py-7 rounded-[32px] border border-white bg-white/50 text-lg font-bold italic placeholder:text-gray-300 outline-none focus:bg-white transition-all shadow-inner"
                    style={{ color: C.text }}
                    placeholder="Enter your personal API key..."
                  />
                  <p className="px-2 text-[11px] font-medium leading-relaxed italic" style={{ color: C.textMut }}>
                    Using your own API key ensures you can always get insights even when our shared limits are reached.
                  </p>
                </div>
              </div>

              {/* Action Architecture */}
              <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-white/20">
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-4 px-8 py-4 bg-[#50664a]/10 rounded-full border shadow-sm"
                      style={{ borderColor: `${C.outline}20` }}
                    >
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.primary }}></div>
                      <span className="text-[11px] font-bold uppercase tracking-widest italic" style={{ color: C.primary }}>
                        {message}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-16 py-6 text-white font-bold rounded-[32px] shadow-2xl disabled:opacity-30 transition-all ml-auto text-[12px] uppercase tracking-[0.3em] italic group overflow-hidden relative"
                  style={{ background: C.primary }}
                >
                  <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  {saving ? (
                    <span className="flex items-center gap-4">
                      Saving... <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </span>
                  ) : (
                    <span className="flex items-center gap-4 relative z-10">
                      Save Profile & Goals <HiOutlineFingerPrint className="text-2xl group-hover:scale-125 transition-transform duration-700" />
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Guide Hub Section */}

      {/* <section className="pt-24 border-t border-dashed space-y-16" style={{ borderColor: `${C.outline}40` }}>
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <Badge>Help Center</Badge>
          <h2 className="text-4xl md:text-6xl font-extrabold italic tracking-tighter uppercase leading-none" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            How it Works.
          </h2>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] italic max-w-xl" style={{ color: C.textMut }}>
            Find help and learn how to get the most out of Mindmetrics AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "User Guide",
              desc: "Learn how to use all the features of Mindmetrics AI.",
              icon: <HiAcademicCap />,
              label: "Education"
            },
            {
              title: "Privacy Hub",
              desc: "Learn how we keep your thoughts and data safe.",
              icon: <HiShieldCheck />,
              label: "Safety"
            },
            {
              title: "Support",
              desc: "Get help if something isn't working right.",
              icon: <HiCheckBadge />,
              label: "Assistance"
            },
            {
              title: "Terms",
              desc: "Basic rules for using our platform.",
              icon: <HiOutlineFingerPrint />,
              label: "Rules"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => toast.success(`${item.title} is being prepared for the sanctuary. Coming soon!`, { icon: '📖' })}
              className="bg-white/70 backdrop-blur-xl p-10 rounded-[48px] border border-white/40 shadow-xl hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start relative z-10 mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: C.textMut }}>{item.label}</span>
                <span className="text-3xl opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" style={{ color: C.primary }}>{item.icon}</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold italic uppercase tracking-tighter leading-none mb-3" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</h3>
                <p className="text-[12px] font-medium leading-relaxed italic" style={{ color: C.textMut }}>{item.desc}</p>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: C.primary }}></div>
            </motion.div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

// Reusable pill badge
const Badge = ({ children }) => (
  <span
    style={{ background: C.priCont, color: C.primary }}
    className="inline-block px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm w-fit"
  >
    {children}
  </span>
);

export default Settings;
