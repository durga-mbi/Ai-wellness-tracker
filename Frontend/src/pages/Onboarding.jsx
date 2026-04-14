import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiShieldCheck,
  HiPencilSquare,
  HiCpuChip,
  HiChartBar,
  HiArrowRight,
  HiXMark
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

// ── Design tokens (Stitch "The Ethereal Sanctuary") ──────────────────────────
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

const Onboarding = () => {
  const { guestLogin, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/register");
    }
  };

  const skip = () => navigate("/login");

  const steps = [
    {
      id: 0,
      title: "Resonate with AI Intelligence",
      subtext: "Analyze your biometric emotional state with high-fidelity AI models, daily.",
      bgColor: C.bg,
      accentColor: C.primary,
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
          <div className="absolute inset-0 bg-white blur-[120px] rounded-full opacity-60"></div>
          <div className="relative flex items-center justify-center h-full">
            <div
              className="w-40 h-40 bg-white border border-white rounded-[32px] shadow-2xl flex items-center justify-center text-black transform rotate-6 hover:rotate-0 transition-transform duration-700 relative overflow-hidden group"
              style={{ borderColor: `${C.outline}30` }}
            >
              <span className="text-6xl group-hover:scale-110 transition-transform">🧠</span>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from),_transparent_70%)] from-gray-50/20 to-transparent"></div>
            </div>
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full shadow-2xl flex items-center justify-center text-white animate-bounce-slow"
              style={{ background: C.primary }}
            >
              <HiCpuChip className="w-12 h-12" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Absolute Privacy",
      subtext: "Your thoughts are private and safe. Your data stays only with you in your sanctuary.",
      bgColor: C.bg,
      accentColor: C.primary,
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-white blur-[120px] rounded-full opacity-60"></div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-44 h-44 bg-white border rounded-[32px] shadow-2xl flex items-center justify-center transition-transform duration-700"
            style={{ borderColor: `${C.outline}30` }}
          >
            <HiShieldCheck className="w-28 h-28 text-emerald-600/80" />
          </motion.div>
        </div>
      ),
    },
    {
      id: 2,
      title: "The Daily Cycle",
      subtext: "Reflect. Connect. Gain insights. Find your inner balance.",
      bgColor: C.bg,
      accentColor: C.primary,
      illustration: (
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-10">
          <StepIcon icon={<HiPencilSquare />} label="Reflect" color="bg-white text-emerald-800 border" borderColor={`${C.outline}30`} />
          <div className="hidden md:block h-px w-16 relative" style={{ background: C.outline }}>
            <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 rotate-45" style={{ borderColor: C.outline }}></div>
          </div>
          <StepIcon icon={<HiCpuChip />} label="Analyze" color="text-white" style={{ background: C.primary }} />
          <div className="hidden md:block h-px w-16 relative" style={{ background: C.outline }}>
            <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 rotate-45" style={{ borderColor: C.outline }}></div>
          </div>
          <StepIcon icon={<HiChartBar />} label="Optimize" color="bg-white text-emerald-800 border" borderColor={`${C.outline}30`} />
        </div>
      ),
    },
    {
      id: 3,
      title: "Establish Connection",
      subtext: "Start your journey in the Health Sanctuary.",
      bgColor: C.bg,
      accentColor: C.primary,
      illustration: (
        <div className="relative py-12">
          <div className="absolute inset-0 bg-white blur-[140px] rounded-full opacity-60"></div>
          <h1
            className="relative text-9xl font-black uppercase tracking-tighter opacity-10 text-center select-none italic"
            style={{ color: C.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Stay.
          </h1>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 flex flex-col selection:bg-[#506b4a]/20 overflow-hidden relative font-sans`}
      style={{ background: steps[currentStep].bgColor, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Visual Atmosphere */}
      <div
        className="absolute top-0 right-0 w-1/2 h-1/2 blur-[150px] rounded-full opacity-40 pointer-events-none"
        style={{ background: C.priCont }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-20 pointer-events-none"
        style={{ background: C.priCont }}
      ></div>

      {/* Header Architecture */}
      <header className="p-10 md:p-14 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-4 group">
          <div
            className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-lg border"
            style={{ borderColor: `${C.outline}30` }}
          >
            <img src={logo} alt="The Sanctuary" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-xl font-bold tracking-tighter uppercase italic leading-none"
              style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Sanctuary.
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-widest mt-1 italic opacity-60"
              style={{ color: C.textMut }}
            >
              Helper
            </span>
          </div>
        </div>
        <button
          onClick={skip}
          className="text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-70 flex items-center gap-3 group italic"
          style={{ color: C.textMut }}
        >
          Skip Entry
          <HiXMark className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>
      </header>

      {/* Main Content Architecture */}
      <main className="flex-1 relative flex items-center justify-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl w-full text-center space-y-12"
          >
            <div className="mb-4">
              {steps[currentStep].illustration}
            </div>

            <div className="space-y-6">
              <h2
                className={`text-5xl md:text-8xl font-extrabold tracking-tighter uppercase italic leading-none`}
                style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {steps[currentStep].title}
              </h2>
              <p
                className="text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic border-l-2 pl-8 inline-block"
                style={{ color: C.textMut, borderColor: `${C.primary}30` }}
              >
                "{steps[currentStep].subtext}"
              </p>
            </div>

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 flex flex-col items-center gap-6"
              >
                {user ? (
                  <button
                    onClick={() => navigate("/survey")}
                    className="w-full max-w-sm py-6 text-white font-bold rounded-3xl shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.3em] italic group shadow-[#506b4a]/20"
                    style={{ background: C.primary }}
                  >
                    Start My Journey
                    <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full max-w-sm py-6 text-white font-bold rounded-3xl shadow-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.3em] italic group shadow-[#506b4a]/20"
                      style={{ background: C.primary }}
                    >
                      Create My Account
                      <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={async () => {
                        const res = await guestLogin();
                        if (res.success) {
                          localStorage.setItem("showIntro", "true");
                          navigate("/");
                        }
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-70 p-4 italic"
                      style={{ color: C.textMut }}
                    >
                      Continue as Guest
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="p-14 flex flex-col items-center gap-10 z-10 relative">
        <div className="flex gap-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full transition-all duration-700 ${currentStep === i ? "w-16" : "w-4 bg-white hover:bg-white/80"
                }`}
              style={{ background: currentStep === i ? C.primary : undefined }}
            />
          ))}
        </div>

        {currentStep < 3 && (
          <button
            onClick={nextStep}
            className="w-20 h-20 rounded-[24px] shadow-2xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all group shadow-[#506b4a]/20"
            style={{ background: C.primary }}
          >
            <HiArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </footer>
    </div>
  );
};

const StepIcon = ({ icon, label, color, borderColor, style }) => (
  <div className="flex flex-col items-center gap-6 group">
    <div
      className={`w-28 h-28 ${color} rounded-[32px] shadow-xl flex items-center justify-center text-4xl transform group-hover:scale-105 transition-all duration-500`}
      style={{ borderColor, ...style }}
    >
      {icon}
    </div>
    <span
      className="text-[10px] font-bold uppercase tracking-[0.3em] italic opacity-40 group-hover:opacity-100 transition-opacity"
      style={{ color: C.textMut }}
    >
      {label}
    </span>
  </div>
);

export default Onboarding;
