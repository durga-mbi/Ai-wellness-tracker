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
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black selection:bg-gray-100 relative overflow-hidden">
      {/* Subtle Aesthetic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-gray-50 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] bg-gray-50/50 blur-[80px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="text-center mb-8">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={logo} 
            alt="Wellness Hub Logo" 
            className="w-20 h-20 mx-auto mb-6 transition-transform hover:scale-105" 
          />
          <h1 className="text-3xl font-black tracking-tighter mb-1 uppercase italic">Join Hub</h1>
          <p className="text-gray-300 text-[9px] uppercase font-bold tracking-[0.2em]">Start your daily journey</p>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-xl relative">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-[9px] font-bold uppercase tracking-widest mb-6 flex items-center gap-3"
            >
              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[9px]">!</span>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 text-green-600 p-3 rounded-xl text-[9px] font-bold uppercase tracking-widest mb-6 flex items-center gap-3"
            >
              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[9px]">✓</span>
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
                  <HiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="EX: JOHN DOE"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-200 uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
                    <HiEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="EMAIL@HUB.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-200 uppercase"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300 ml-1">Mobile</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
                    <HiPhone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="PHONE"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-200 uppercase"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
                  <HiLockClosed className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="CHOOSE PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-200 uppercase"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-black text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all shadow-md mt-4"
            >
              {isSubmitting ? "Wait..." : "Join Hub"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-black hover:underline underline-offset-4 decoration-gray-100 ml-1">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
