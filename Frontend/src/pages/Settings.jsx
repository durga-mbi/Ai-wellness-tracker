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
      {/* Profile Header */}
      <section className="shrink-0 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm"
        >
          User Profile
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-none italic">
               Your Account.
            </h1>
            <p className="text-sm text-gray-400 font-medium italic">
               Manage your identity and app preferences.
            </p>
          </div>

          <div className="flex items-center gap-8 border-l border-gray-100 pl-8 hidden md:flex">
             <div className="text-right">
               <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">App Usage</p>
               <p className="text-2xl font-bold text-black tracking-tight">14 Days</p>
             </div>
             <div className="text-right">
               <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">User Tier</p>
               <p className="text-2xl font-bold text-black tracking-tight">Gold Member</p>
             </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Profile Card & Safety Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm text-center relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-inner text-black italic">
                {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <h3 className="text-xl font-bold text-black italic tracking-tight uppercase mb-1">{user?.name || "Member"}</h3>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-6">{user?.email || "Guest Account"}</p>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 text-black rounded-lg border border-gray-100">
                <HiCheckBadge className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-widest italic">
                  {user?.isAnonymous ? "Anonymous User" : "Account Verified"}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic px-1">Account Safety</h4>
            <div className="space-y-3">
              {[
                { icon: <HiOutlineShieldCheck />, label: "Security Lock", status: "Active" },
                { icon: <HiCheckBadge />, label: "Cloud Sync", status: "Enabled" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-50 hover:border-gray-100 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 text-gray-300 group-hover:text-black transition-colors">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest italic">{item.label}</span>
                  </div>
                  <span className="text-[8px] font-bold text-gray-200 uppercase tracking-widest">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="xl:col-span-8">
          <form onSubmit={handleSave} className="bg-white border border-gray-100 p-8 lg:p-10 rounded-2xl shadow-sm space-y-8 relative overflow-hidden flex flex-col">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                  <HiOutlineUserCircle className="text-black text-xl" />
                </div>
                <h3 className="text-xl font-bold text-black italic tracking-tight uppercase">Basic Info</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic ml-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-lg font-bold italic text-black placeholder:text-gray-200 outline-none focus:border-black focus:bg-white transition-all"
                    placeholder="Enter your name..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                  <HiAcademicCap className="text-black text-xl" />
                </div>
                <h3 className="text-xl font-bold text-black italic tracking-tight uppercase">Background</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic ml-1">Age Group</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold italic text-black outline-none focus:border-black appearance-none cursor-pointer"
                  >
                    <option value="">Select Age</option>
                    <option value="18-21">18-21</option>
                    <option value="22-25">22-25</option>
                    <option value="26-30">26-30</option>
                    <option value="30+">30+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic ml-1">University</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold italic text-black placeholder:text-gray-200 outline-none focus:border-black focus:bg-white transition-all"
                    placeholder="Enter school name..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <AnimatePresence>
                {message && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-bold text-black uppercase tracking-widest italic"
                  >
                    {message}
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-10 py-3 bg-black text-white font-bold rounded-xl shadow-md hover:bg-gray-800 disabled:opacity-30 transition-all ml-auto text-[10px] uppercase tracking-widest"
              >
                {saving ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Help & Resources Section - White Mode Compact */}
      <section className="pt-12 border-t border-gray-100 space-y-8">
        <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm w-fit"
            >
              <HiOutlineSquare2Stack className="w-3 h-3" />
              App Resources
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-black italic tracking-tight uppercase leading-none">
              Guide & Support.
            </h2>
            <p className="text-sm text-gray-400 font-medium italic max-w-xl">
              Access tools and information to help you navigate your journey.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: "User Guide", 
              desc: "Learn how to use all the tools effectively.",
              icon: <HiAcademicCap className="text-black" />,
              label: "Education"
            },
            { 
              title: "Privacy Hub", 
              desc: "Understand how we protect your data.",
              icon: <HiShieldCheck className="text-gray-300" />,
              label: "Safety"
            },
            { 
              title: "Support", 
              desc: "Get help from our team at any time.",
              icon: <HiCheckBadge className="text-gray-300" />,
              label: "Assistance"
            },
            { 
              title: "Handbook", 
              desc: "Guidelines for a healthy environment.",
              icon: <HiOutlineFingerPrint className="text-black" />,
              label: "Rules"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3 hover:border-black transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">{item.label}</span>
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              </div>
              <h3 className="text-md font-bold italic uppercase tracking-tighter text-black leading-none">{item.title}</h3>
              <p className="text-[11px] font-medium text-gray-400 leading-relaxed italic">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
