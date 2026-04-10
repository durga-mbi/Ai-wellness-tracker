import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from "react-icons/hi2";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black selection:bg-gray-100 relative overflow-hidden">
      {/* Subtle Aesthetic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-gray-50 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-gray-50/50 blur-[80px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-8">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={logo} 
            alt="Serenity Logo" 
            className="w-14 h-14 mx-auto mb-6 grayscale brightness-0 opacity-80" 
          />
          <h1 className="text-2xl font-bold tracking-tight mb-1">Return to Center</h1>
          <p className="text-gray-300 text-[9px] uppercase font-bold tracking-[0.2em]">Recall your presence</p>
        </div>

        <div className="bg-white border border-gray-100 p-8 lg:p-10 rounded-[32px] shadow-xl relative">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
                  <HiEnvelope className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="EX: SPIRIT@SANCTUARY.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-200 uppercase"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Password</label>
                <button type="button" className="text-[8px] font-bold tracking-widest text-gray-200 hover:text-black transition-colors uppercase italic">Forgotten?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-black transition-colors">
                  <HiLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-200 uppercase"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-200 hover:text-black transition-colors"
                >
                  {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all shadow-md"
              >
                {isSubmitting ? "Synchronizing..." : "Recall Presence"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  const res = await guestLogin();
                  if (res.success) navigate("/dashboard");
                }}
                className="w-full py-3 text-[9px] font-bold uppercase tracking-widest text-gray-300 hover:text-black hover:bg-gray-50 rounded-full border border-gray-100 transition-all"
              >
                Journey as Guest
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">
              New to the Sanctuary?{" "}
              <Link to="/register" className="text-black hover:underline underline-offset-4 decoration-gray-100 ml-1">
                Begin Healing
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
