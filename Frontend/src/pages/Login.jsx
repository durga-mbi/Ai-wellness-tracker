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

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Failed to authenticate. Please check your credentials.");
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
            alt="Wellness Hub Logo" 
            className="w-20 h-20 mx-auto mb-6 transition-transform hover:scale-105 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          <h1 className="text-3xl font-black tracking-tighter mb-1 uppercase italic">Member Login</h1>
          <p className="text-gray-500 text-[9px] uppercase font-bold tracking-[0.2em]">Access your daily hub</p>
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                {fieldErrors.email && <span className="text-[8px] font-black italic uppercase text-red-500 tracking-tighter">{fieldErrors.email}</span>}
              </div>
              <div className={`relative group transition-all ${fieldErrors.email ? 'ring-1 ring-red-500 rounded-xl' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-black transition-colors">
                  <HiEnvelope className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="email@sanctuary.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.toLowerCase());
                    if (fieldErrors.email) setFieldErrors({...fieldErrors, email: null});
                  }}
                  className={`w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-400`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <div className="flex items-center gap-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                    {fieldErrors.password && <span className="text-[8px] font-black italic uppercase text-red-500 tracking-tighter">{fieldErrors.password}</span>}
                </div>
                <button type="button" className="text-[8px] font-bold tracking-widest text-gray-400 hover:text-black transition-colors uppercase italic">Forgotten?</button>
              </div>
              <div className={`relative group transition-all ${fieldErrors.password ? 'ring-1 ring-red-500 rounded-xl' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-black transition-colors">
                  <HiLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({...fieldErrors, password: null});
                  }}
                  className="w-full pl-11 pr-12 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-gray-200 transition-all text-[10px] font-bold tracking-widest placeholder:text-gray-400 uppercase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all shadow-md active:scale-95 duration-200"
              >
                {isSubmitting ? "Syncing..." : "Log In"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  const res = await guestLogin();
                  if (res.success) navigate("/dashboard");
                }}
                className="w-full py-3 text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 rounded-full border border-gray-100 transition-all active:scale-95 duration-200"
              >
                Explore as Guest
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
              New here?{" "}
              <Link to="/register" className="text-black hover:underline underline-offset-4 decoration-gray-300 ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
