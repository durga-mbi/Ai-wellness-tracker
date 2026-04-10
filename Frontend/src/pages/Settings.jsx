import React, { useState, useEffect } from "react";
import {
  HiUser,
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

const Settings = () => {
  const { user, updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const { updateLayout } = useLayout();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    ageGroup: user?.ageGroup || "",
    university: user?.university || ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    updateLayout({
      title: "Settings",
      subtitle: "Profile Details",
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
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-12 pb-12 overflow-y-auto custom-scrollbar pr-2 scroll-smooth">
      {/* Profile Header Architecture */}
      <section className="shrink-0 space-y-6">
        <div className="flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm w-fit">
          Identity Calibration Terminal
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 items-start">
        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-4 bg-white border border-gray-100 p-10 rounded-[32px] shadow-sm text-center relative overflow-hidden group hover:border-black/10 transition-all"
          >
            <div className="relative z-10">
              <div className="w-28 h-28 lg:w-36 lg:h-36 bg-gray-50 border border-gray-100 rounded-[28px] flex items-center justify-center text-4xl font-black mx-auto mb-8 shadow-inner text-black italic uppercase group-hover:scale-105 transition-transform duration-700">
                {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <h3 className="text-2xl font-black text-black italic tracking-tighter uppercase mb-2">{user?.name || "Member"}</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] italic">{user?.email || "Guest Account"}</p>
            </div>
          </motion.div>

          {/* Profile Form Architecture */}
          <div className="md:col-span-8">
            <form onSubmit={handleSave} className="bg-white border border-gray-100 p-10 lg:p-14 rounded-[32px] shadow-sm space-y-12 relative overflow-hidden flex flex-col">
              <div className="space-y-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                    <HiOutlineUserCircle className="text-black text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black italic tracking-tighter uppercase leading-none mb-1">Basic Identity</h3>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">Core account resonance parameters</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-black uppercase tracking-[0.4em] italic ml-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent text-xl font-black italic text-black placeholder:text-gray-400 outline-none focus:border-black/10 focus:bg-white transition-all shadow-inner"
                      placeholder="Enter your name..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-10 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                    <HiAcademicCap className="text-black text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black italic tracking-tighter uppercase leading-none mb-1">Human Background</h3>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">Physical and academic credentials</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-black uppercase tracking-[0.4em] italic ml-1">Age Group</label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                      className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent text-sm font-black italic text-black outline-none focus:border-black/10 focus:bg-white appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="">Select Biological Age</option>
                      <option value="18-21">18-21 Reference</option>
                      <option value="22-25">22-25 Reference</option>
                      <option value="26-30">26-30 Reference</option>
                      <option value="30+">30+ Baseline</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-black uppercase tracking-[0.4em] italic ml-1">Academy Name</label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent text-sm font-black italic text-black placeholder:text-gray-400 outline-none focus:border-black/10 focus:bg-white transition-all shadow-inner"
                      placeholder="Enter school name..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100"
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">
                        {message}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-12 py-4 bg-black text-white font-black rounded-2xl shadow-2xl hover:bg-gray-800 disabled:opacity-30 transition-all ml-auto text-[10px] uppercase tracking-[0.2em] italic group"
                >
                  {saving ? "Calibration in progress..." : (
                    <span className="flex items-center gap-2">
                      Update Profile <HiOutlineFingerPrint className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Help & Resources Section */}
      <section className="pt-20 border-t border-gray-100 space-y-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm w-fit uppercase">
            Guide & Protocol Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black italic tracking-tighter uppercase leading-none">
            Support Infrastructure.
          </h2>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] italic max-w-xl">
            Access the technical handbooks and support protocols required to navigate the sanctuary environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "User Guide",
              desc: "Technical documentation for effective tool engagement.",
              icon: <HiAcademicCap />,
              label: "Education"
            },
            {
              title: "Privacy Hub",
              desc: "Bit-level analysis of data protection protocols.",
              icon: <HiShieldCheck />,
              label: "Safety"
            },
            {
              title: "Assistance",
              desc: "Real-time support stream for sync issues.",
              icon: <HiCheckBadge />,
              label: "Support"
            },
            {
              title: "Sanctuary Handbook",
              desc: "Core rules for human-environment resonance.",
              icon: <HiOutlineFingerPrint />,
              label: "Rules"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-gray-100 space-y-4 hover:border-black transition-all group cursor-pointer shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic leading-none group-hover:text-black transition-colors">{item.label}</span>
                <span className="text-2xl text-gray-300 group-hover:text-black group-hover:scale-110 transition-all duration-500">{item.icon}</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-black leading-none mb-2">{item.title}</h3>
                <p className="text-[11px] font-medium text-gray-600 leading-relaxed italic">{item.desc}</p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
