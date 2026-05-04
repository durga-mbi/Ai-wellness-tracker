import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { HiShieldCheck, HiArrowRight, HiEnvelope } from "react-icons/hi2";
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

const VerifyOtp = () => {
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Please start the registration journey first.");
            navigate("/register");
        }
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otpDigits];
        newOtp[index] = element.value;
        setOtpDigits(newOtp);

        // Focus next input
        if (element.value !== "" && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otpDigits[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = otpDigits.join("");
        if (otpCode.length !== 6) {
            return toast.error("Please enter the full 6-digit code.");
        }

        setLoading(true);
        const result = await verifyOtp(email, otpCode);

        if (result.success) {
            toast.success("Welcome to the Sanctuary!");
            navigate("/survey");
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full p-10 rounded-[3rem] shadow-xl border"
                style={{ background: C.card, borderColor: C.outline }}
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-2xl mb-6 shadow-sm" style={{ background: C.surface }}>
                        <HiShieldCheck className="w-10 h-10" style={{ color: C.primary }} />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-3 tracking-tight" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Check Your Spirit
                    </h1>
                    <p style={{ color: C.textMut }} className="text-sm">
                        A verification code has been sent to <br />
                        <span className="font-semibold" style={{ color: C.primary }}>{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-8">
                    <div className="flex justify-between gap-2">
                        {otpDigits.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={(e) => e.target.select()}
                                className="w-12 h-16 text-center text-2xl font-bold rounded-2xl transition-all outline-none border-2"
                                style={{ 
                                    background: C.surface, 
                                    color: C.text,
                                    borderColor: data ? C.primary : 'transparent'
                                }}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                        style={{ background: C.primary, color: C.onPri }}
                    >
                        {loading ? "Verifying..." : (
                            <>
                                Verify Code <HiArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => toast.success("A new code is on its way!")}
                            className="text-sm font-medium transition-opacity hover:opacity-70"
                            style={{ color: C.primary }}
                        >
                            Didn't receive the code? Resend
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;
