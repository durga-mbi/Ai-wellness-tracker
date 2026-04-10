import React, { useState } from "react";
import { useNavigate } from "react-router";
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
      bgColor: "bg-white",
      accentColor: "text-black",
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
          <div className="absolute inset-0 bg-gray-50 blur-[120px] rounded-full opacity-60"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="w-40 h-40 bg-white border border-gray-100 rounded-[32px] shadow-2xl flex items-center justify-center text-black transform rotate-6 hover:rotate-0 transition-transform duration-700 relative overflow-hidden group">
              <span className="text-6xl group-hover:scale-110 transition-transform">🧠</span>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from),_transparent_70%)] from-gray-50/20 to-transparent"></div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-black rounded-full shadow-2xl flex items-center justify-center text-white animate-bounce-slow">
              <HiCpuChip className="w-12 h-12" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Absolute Privacy Protocols",
      subtext: "End-to-end encryption for your mental reflections. Your data remains in your sanctuary.",
      bgColor: "bg-white",
      accentColor: "text-black",
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-50 blur-[120px] rounded-full opacity-60"></div>
          <div className="relative w-44 h-44 bg-white border border-gray-100 rounded-[32px] shadow-2xl flex items-center justify-center text-black hover:scale-105 transition-transform duration-700">
            <HiShieldCheck className="w-28 h-28 animate-pulse text-black" />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "The Operational Cycle",
      subtext: "Reflect. Synchronize. Gain insights. Calibrate your well-being.",
      bgColor: "bg-white",
      accentColor: "text-black",
      illustration: (
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-10">
          <StepIcon icon={<HiPencilSquare />} label="Reflect" color="bg-gray-50 text-black border border-gray-100" />
          <div className="hidden md:block h-px w-16 bg-gray-100 relative">
            <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-200 rotate-45"></div>
          </div>
          <StepIcon icon={<HiCpuChip />} label="Analyze" color="bg-black text-white" />
          <div className="hidden md:block h-px w-16 bg-gray-100 relative">
            <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-200 rotate-45"></div>
          </div>
          <StepIcon icon={<HiChartBar />} label="Optimize" color="bg-gray-50 text-black border border-gray-100" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Establish Connection",
      subtext: "Initialize your residency in the Health Intelligence Sanctuary.",
      bgColor: "bg-white",
      accentColor: "text-black",
      illustration: (
        <div className="relative py-12">
          <div className="absolute inset-0 bg-gray-50 blur-[140px] rounded-full opacity-60"></div>
          <h1 className="relative text-9xl font-black text-black uppercase tracking-tighter opacity-10 text-center select-none italic">Reside.</h1>
        </div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen ${steps[currentStep].bgColor} transition-colors duration-1000 flex flex-col selection:bg-black selection:text-white overflow-hidden relative`}>
      {/* Visual Atmosphere */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gray-50 blur-[150px] rounded-full opacity-40 pointer-events-none"></div>

      {/* Header Architecture */}
      <header className="p-10 md:p-14 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-black flex items-center justify-center rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl">
            <HiArrowRight className="w-6 h-6 -rotate-45 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-black tracking-tighter uppercase italic leading-none">Wellness Hub.</span>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 italic">Intelligence Layer</span>
          </div>
        </div>
        <button 
          onClick={skip}
          className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-black transition-colors flex items-center gap-3 group italic"
        >
          Bypass Protocol
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
              <h2 className={`text-5xl md:text-8xl font-black ${steps[currentStep].accentColor} tracking-tighter uppercase italic leading-none`}>
                {steps[currentStep].title}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed italic border-l-2 border-black/5 pl-8 inline-block">
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
                    className="w-full max-w-sm py-6 bg-black text-white font-black rounded-3xl shadow-2xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.3em] italic group"
                  >
                    Initialize Setup
                    <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate("/register")}
                      className="w-full max-w-sm py-6 bg-black text-white font-black rounded-3xl shadow-2xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.3em] italic group"
                    >
                      Authenticate Account
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
                      className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-black p-4 transition-colors italic"
                    >
                      Provisional Guest Access
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
              className={`h-1.5 rounded-full transition-all duration-700 ${
                currentStep === i ? "w-16 bg-black" : "w-4 bg-gray-100 hover:bg-gray-200"
              }`}
            />
          ))}
        </div>
        
        {currentStep < 3 && (
          <button 
            onClick={nextStep}
            className="w-20 h-20 bg-black rounded-[24px] shadow-2xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all group"
          >
            <HiArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </footer>
    </div>
  );
};

const StepIcon = ({ icon, label, color }) => (
  <div className="flex flex-col items-center gap-6 group">
    <div className={`w-28 h-28 ${color} rounded-[32px] shadow-xl flex items-center justify-center text-4xl transform group-hover:scale-105 transition-all duration-500`}>
      {icon}
    </div>
    <span className="text-[10px] font-black text-black uppercase tracking-[0.3em] italic opacity-20 group-hover:opacity-100 transition-opacity">{label}</span>
  </div>
);

export default Onboarding;
