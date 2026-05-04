import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { HiShieldCheck, HiEnvelope, HiArrowRight, HiOutlineCog6Tooth } from "react-icons/hi2";
import { motion } from "framer-motion";

// ── Design tokens (Matching Sanctuary Theme) ──────────────────────────
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
  error: "#ae4025",
  errCont: "#fde8e3",
};

const SystemSetup = () => {
    const [loading, setLoading] = useState(false);
    const [authMode, setAuthMode] = useState("standard");
    const { completeSystemSetup } = useAuth();
    const navigate = useNavigate();

    const handleSetup = async () => {
        setLoading(true);
        const result = await completeSystemSetup(authMode);
        
        if (result.success) {
            toast.success("Sanctuary configuration complete!");
            navigate("/");
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-2xl w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex p-5 rounded-[2rem] mb-6 shadow-sm" style={{ background: C.surface, border: `2px solid ${C.outline}` }}>
                        <HiOutlineCog6Tooth className="w-10 h-10" style={{ color: C.primary }} />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Initialize Your Sanctuary
                    </h1>
                    <p style={{ color: C.textMut }} className="text-lg">
                        Choose the authentication path that best fits your community's needs.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Standard Auth */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAuthMode("standard")}
                        className={`relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer shadow-sm ${
                            authMode === "standard" 
                            ? "ring-4" 
                            : ""
                        }`}
                        style={{ 
                            background: C.card,
                            borderColor: authMode === "standard" ? C.primary : "transparent",
                            boxShadow: authMode === "standard" ? `0 20px 25px -5px ${C.priCont}` : 'none',
                            ringColor: `${C.priCont}66`
                        }}
                    >
                        <div className={`p-4 rounded-2xl mb-6 inline-block`} style={{ background: authMode === "standard" ? C.primary : C.surface }}>
                            <HiShieldCheck className="w-8 h-8" style={{ color: authMode === "standard" ? C.onPri : C.textMut }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: C.text }}>Standard Access</h3>
                        <p className="text-sm leading-relaxed" style={{ color: C.textMut }}>
                            Direct entry for all seekers. No email verification hurdles during their first steps.
                        </p>
                    </motion.div>

                    {/* OTP Auth */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAuthMode("otp")}
                        className={`relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer shadow-sm ${
                            authMode === "otp" 
                            ? "ring-4" 
                            : ""
                        }`}
                        style={{ 
                            background: C.card,
                            borderColor: authMode === "otp" ? C.primary : "transparent",
                            boxShadow: authMode === "otp" ? `0 20px 25px -5px ${C.priCont}` : 'none',
                            ringColor: `${C.priCont}66`
                        }}
                    >
                        <div className={`p-4 rounded-2xl mb-6 inline-block`} style={{ background: authMode === "otp" ? C.primary : C.surface }}>
                            <HiEnvelope className="w-8 h-8" style={{ color: authMode === "otp" ? C.onPri : C.textMut }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: C.text }}>Verified Entry</h3>
                        <p className="text-sm leading-relaxed" style={{ color: C.textMut }}>
                            Secure the sanctuary with OTP verification. Ensure every email is valid and reachable.
                        </p>
                    </motion.div>
                </div>

                <motion.button
                    whileHover={{ opacity: 0.9 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSetup}
                    disabled={loading}
                    className="w-full py-5 rounded-[2rem] font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                    style={{ 
                        background: C.primary, 
                        color: C.onPri,
                        boxShadow: `0 10px 15px -3px ${C.primary}44`
                    }}
                >
                    {loading ? "Preparing your space..." : (
                        <>
                            Open the Sanctuary <HiArrowRight className="w-6 h-6" />
                        </>
                    )}
                </motion.button>

                <p className="mt-8 text-center text-xs" style={{ color: C.textMut }}>
                    This choice can be adjusted later in the administrative settings.
                </p>
            </div>
        </div>
    );
};

export default SystemSetup;
