import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { HiUser, HiAcademicCap, HiCheckBadge, HiSparkles, HiShieldCheck, HiOutlineFingerPrint } from "react-icons/hi2";
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
      title: "", 
      subtitle: "",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateAuthProfile(formData);
    if (res.success) {
      setMessage("Identity synchronized.");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="flex-1 flex flex-col space-y-12 lg:space-y-20 pb-20 selection:bg-amber-500/10">
      {/* Profile Header Ritual */}
      <section className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.04] backdrop-blur-2xl rounded-full border border-white/5 uppercase font-black text-[9px] tracking-[0.4em] text-amber-500/60 italic shadow-2xl mb-6"
        >
          <HiOutlineFingerPrint className="w-4 h-4" />
          The Presence
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
           <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                Your <br /> Identity.
              </h1>
              <p className="text-lg md:text-xl text-white/30 font-medium italic max-w-xl">
                The visual and systemic representation of your presence within the Sanctuary.
              </p>
           </div>
           
           <div className="flex items-center gap-6 lg:gap-14 border-l border-white/5 pl-10 hidden md:flex">
              <div className="text-right">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-1">Ritual Streak</p>
                <p className="text-4xl lg:text-5xl font-black text-amber-500/60 italic tracking-tighter">14 Days</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-1">Aura Level</p>
                <p className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter">Gold</p>
              </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-14">
        {/* Aura Overview Card */}
        <div className="xl:col-span-4 space-y-8">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.02] border border-white/5 p-10 lg:p-14 rounded-[3.5rem] lg:rounded-[4rem] text-center backdrop-blur-3xl shadow-3xl relative overflow-hidden group"
           >
             <div className="absolute top-0 right-0 w-full h-full bg-amber-500/5 blur-[80px] group-hover:bg-amber-500/10 transition-all duration-700"></div>
             
             <div className="relative z-10">
               <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/[0.02] border border-white/10 rounded-[2.5rem] lg:rounded-[3rem] flex items-center justify-center text-5xl lg:text-6xl font-black mx-auto mb-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent animate-pulse"></div>
                  <span className="relative z-10 text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
                  </span>
               </div>
               <h3 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter uppercase mb-2">{user?.name || "Member"}</h3>
               <p className="text-sm font-black text-white/20 uppercase tracking-widest mb-10 italic">{user?.email || "Guest Account"}</p>
               
               <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <HiCheckBadge className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">
                    {user?.isAnonymous ? "Veiled Presence" : "Sanctuary Tier"}
                  </span>
               </div>
             </div>
           </motion.div>

           {/* Security Quick Access */}
           <div className="bg-white/[0.02] border border-white/5 p-8 lg:p-10 rounded-[3rem] lg:rounded-[3.5rem] space-y-6">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic px-2">Sanctuary Guard</h4>
              <div className="space-y-4">
                 {[
                   { icon: <HiShieldCheck />, label: "Privacy Veil", status: "Active" },
                   { icon: <HiSparkles />, label: "Aura Sync", status: "Enabled" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4 text-white/40 group-hover:text-amber-500 transition-colors">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[11px] font-black uppercase tracking-widest italic">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-black text-amber-500/40 uppercase tracking-widest">{item.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Identity Ritual Form */}
        <div className="xl:col-span-8">
          <form onSubmit={handleSave} className="bg-white/[0.02] border border-white/5 p-10 lg:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl space-y-12 lg:space-y-16 relative overflow-hidden">
             <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-amber-500/5 blur-[120px] pointer-events-none"></div>

             <div className="space-y-10">
               <div className="flex items-center gap-5 mb-10">
                 <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <HiUser className="text-amber-500 text-2xl" />
                 </div>
                 <h3 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter uppercase relative z-10">Personal Markers</h3>
               </div>

               <div className="grid grid-cols-1 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic ml-1">The Name you carry</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-xl lg:text-2xl font-black italic text-white placeholder:text-white/5 outline-none focus:border-amber-500/40 focus:bg-white/[0.04] transition-all shadow-xl"
                      placeholder="Identify your presence..."
                    />
                  </div>
               </div>
             </div>

             <div className="space-y-10 pt-10 border-t border-white/5">
                <div className="flex items-center gap-5 mb-10">
                 <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <HiAcademicCap className="text-orange-500 text-2xl" />
                 </div>
                 <h3 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter uppercase relative z-10">Systemic Roots</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic ml-1">Temporal Tier (Age)</label>
                   <div className="relative">
                      <select 
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                        className="w-full p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-xl font-black italic text-white outline-none focus:border-amber-500/40 appearance-none shadow-xl cursor-pointer"
                      >
                        <option value="" className="bg-[#050505]">Select Cycle</option>
                        <option value="18-21" className="bg-[#050505]">18-21 Cycles</option>
                        <option value="22-25" className="bg-[#050505]">22-25 Cycles</option>
                        <option value="26-30" className="bg-[#050505]">26-30 Cycles</option>
                        <option value="30+" className="bg-[#050505]">30+ Cycles</option>
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                        <HiSparkles className="text-xl" />
                      </div>
                   </div>
                 </div>
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic ml-1">Foundational Anchor (Univ)</label>
                   <input 
                     type="text" 
                     value={formData.university}
                     onChange={(e) => setFormData({...formData, university: e.target.value})}
                     className="w-full p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-xl font-black italic text-white placeholder:text-white/5 outline-none focus:border-amber-500/40 focus:bg-white/[0.04] transition-all shadow-xl"
                     placeholder="State your root..."
                   />
                 </div>
               </div>
             </div>

             <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
               <AnimatePresence>
                 {message && (
                   <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic"
                   >
                    {message}
                   </motion.span>
                 )}
               </AnimatePresence>
               <button 
                 type="submit"
                 disabled={saving}
                 className="w-full sm:w-auto px-16 py-7 lg:py-8 bg-white text-black font-black rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 disabled:opacity-30 transition-all ml-auto text-[11px] uppercase tracking-[0.2em]"
               >
                 {saving ? "Synchronizing..." : "Synchronize Identity"}
               </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
