import React, { useState, useEffect } from "react";
import {
  HiAcademicCap,
  HiCheckBadge,
  HiShieldCheck,
  HiOutlineFingerPrint,
  HiOutlineSquare2Stack,
  HiOutlineUserCircle,
  HiOutlineShieldCheck
} from "react-icons/hi2";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";

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
    apiKey: user?.apiKey || ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    updateLayout({
      title: "Settings",
      subtitle: "Sanctuary Configuration",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateAuthProfile(formData);
      setMessage("Protocols updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update protocols");
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
          Identity Calibration Terminal
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
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Core Identity</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>Primary account resonance parameters</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-bold uppercase tracking-[0.4em] italic ml-1" style={{ color: C.textMut }}>Full Recognition Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-10 py-7 rounded-[32px] border border-white bg-white/50 text-2xl font-bold italic placeholder:text-gray-300 outline-none focus:bg-white transition-all shadow-inner"
                    style={{ color: C.text, fontFamily: "'Inter', sans-serif" }}
                    placeholder="Enter name..."
                  />
                </div>
              </div>

              {/* Technical Protocols Section */}
              <div className="space-y-12 pt-16 border-t border-dashed" style={{ borderColor: `${C.outline}40` }}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner border border-white" style={{ background: `${C.primary}10`, color: C.primary }}>
                    <HiOutlineSquare2Stack className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Neural Bridge</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>Custom AI integration protocols</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.4em] italic" style={{ color: C.textMut }}>Gemini Neural Key</label>
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest italic animate-pulse">Neural Active</span>
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
                    Provisioning a personal neural bridge ensures uninterrupted high-fidelity insights when collective system quotas reach threshold.
                  </p>
                </div>
              </div>

              {/* Human Background Section */}
              <div className="space-y-12 pt-16 border-t border-dashed" style={{ borderColor: `${C.outline}40` }}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner border border-white" style={{ background: `${C.primary}10`, color: C.primary }}>
                    <HiAcademicCap className="text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold italic tracking-tighter uppercase leading-none mb-2" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Physical Origin</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-50" style={{ color: C.textMut }}>Academic and baseline credentials</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold uppercase tracking-[0.4em] italic ml-1" style={{ color: C.textMut }}>Age Group Reference</label>
                    <div className="relative">
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                        className="w-full px-10 py-7 rounded-[32px] border border-white bg-white/50 text-sm font-bold italic outline-none focus:bg-white appearance-none cursor-pointer shadow-inner pr-16"
                        style={{ color: C.text }}
                      >
                        <option value="">Select Baseline</option>
                        <option value="18-21">18-21 Era</option>
                        <option value="22-25">22-25 Era</option>
                        <option value="26-30">26-30 Era</option>
                        <option value="30+">30+ Baseline</option>
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <HiOutlineUserCircle className="text-2xl" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-bold uppercase tracking-[0.4em] italic ml-1" style={{ color: C.textMut }}>Academy Identity</label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-10 py-7 rounded-[32px] border border-white bg-white/50 text-sm font-bold italic placeholder:text-gray-300 outline-none focus:bg-white transition-all shadow-inner"
                      style={{ color: C.text }}
                      placeholder="Identify institution..."
                    />
                  </div>
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
                      Synchronizing <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </span>
                  ) : (
                    <span className="flex items-center gap-4 relative z-10">
                      Update Protocols <HiOutlineFingerPrint className="text-2xl group-hover:scale-125 transition-transform duration-700" />
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Guide Hub Section */}
      <section className="pt-24 border-t border-dashed space-y-16" style={{ borderColor: `${C.outline}40` }}>
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <Badge>Guide Hub</Badge>
          <h2 className="text-4xl md:text-6xl font-extrabold italic tracking-tighter uppercase leading-none" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Protocol Handbooks.
          </h2>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] italic max-w-xl" style={{ color: C.textMut }}>
            Access the technical insights and support protocols required to navigate the sanctuary landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "User Guide",
              desc: "Technical documentation for effective sanctuary navigation.",
              icon: <HiAcademicCap />,
              label: "Education"
            },
            {
              title: "Privacy Hub",
              desc: "Bit-level analysis of resonance data protection.",
              icon: <HiShieldCheck />,
              label: "Safety"
            },
            {
              title: "Assistance",
              desc: "Real-time support streams for sync resolution.",
              icon: <HiCheckBadge />,
              label: "Support"
            },
            {
              title: "Handbook",
              desc: "Core rules for human-environment alchemy.",
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
      </section>
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
