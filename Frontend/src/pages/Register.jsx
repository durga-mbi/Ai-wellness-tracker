import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { HiUser, HiEnvelope, HiPhone, HiLockClosed } from "react-icons/hi2";
import logo from "../assets/logo.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const result = await register({ name, email, mobile, password });
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate("/onboarding"), 2000);
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] text-white selection:bg-white/10 overflow-hidden relative">
      {/* Cinematic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[50vw] h-[50vw] bg-amber-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[40vw] h-[40vw] bg-orange-500/5 blur-[100px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grain-y.com/images/grain-dark.png')]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="text-center mb-12">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.2 }}
            src={logo} 
            alt="Serenity Logo" 
            className="w-24 h-24 mx-auto mb-10 drop-shadow-2xl" 
          />
          <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter mb-4 uppercase">Begin Healing</h1>
          <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.4em] italic mb-2">Join the global sanctuary</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-10 rounded-[40px] shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[40px] pointer-events-none"></div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-3 italic relative z-10"
            >
              <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] not-italic">!</span>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-3 italic relative z-10"
            >
              <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] not-italic">✓</span>
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Presence Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-white transition-colors">
                  <HiUser className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="FULL NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-3xl outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all duration-500 text-[10px] font-black tracking-[0.2em] placeholder:text-white/10 uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Digital Signature</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-white transition-colors">
                    <HiEnvelope className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-3xl outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all duration-500 text-[10px] font-black tracking-[0.2em] placeholder:text-white/10 uppercase"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Ritual Device</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-white transition-colors">
                    <HiPhone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    placeholder="MOBILE"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-3xl outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all duration-500 text-[10px] font-black tracking-[0.2em] placeholder:text-white/10 uppercase"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Secret Phrase</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-white transition-colors">
                  <HiLockClosed className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="CHOOSE PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-3xl outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all duration-500 text-[10px] font-black tracking-[0.2em] placeholder:text-white/10 uppercase"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full py-7 bg-white text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 mt-4"
            >
              <span className="relative z-10">
                {isSubmitting ? "Initiating..." : "Begin Your Journey"}
              </span>
              <div className="absolute inset-0 bg-teal-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
              Established presence?{" "}
              <Link to="/login" className="text-white hover:underline underline-offset-8 decoration-white/20 ml-2 not-italic">
                Recall Presence
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
