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

const Onboarding = () => {
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
      title: "Track your emotions with AI",
      subtext: "Understand how you feel and why, every day",
      bgColor: "from-blue-50/50 via-white to-blue-50/50",
      accentColor: "text-blue-600",
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
          <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="w-32 h-32 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-blue-500 transform rotate-12 transition-transform hover:rotate-0 duration-500">
              <span className="text-5xl">😊</span>
            </div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white animate-bounce">
              <HiCpuChip className="w-10 h-10" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Your data is encrypted & anonymous",
      subtext: "We respect your privacy. Your thoughts stay yours",
      bgColor: "from-teal-50/50 via-white to-teal-50/50",
      accentColor: "text-teal-600",
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-teal-100/50 rounded-full blur-3xl"></div>
          <div className="relative w-40 h-40 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-teal-500 border border-teal-50">
            <HiShieldCheck className="w-24 h-24 animate-pulse" />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "How it works",
      subtext: "Write. Analyze. Improve your mental well-being.",
      bgColor: "from-indigo-50/50 via-white to-indigo-50/50",
      accentColor: "text-indigo-600",
      illustration: (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-10">
          <StepIcon icon={<HiPencilSquare />} label="Journal" color="bg-orange-50 text-orange-600" />
          <div className="hidden md:block h-px w-16 bg-slate-200 relative">
            <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
          </div>
          <StepIcon icon={<HiCpuChip />} label="AI Analysis" color="bg-indigo-50 text-indigo-600" />
          <div className="hidden md:block h-px w-16 bg-slate-200 relative">
            <div className="absolute -top-1 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
          </div>
          <StepIcon icon={<HiChartBar />} label="Insights" color="bg-teal-50 text-teal-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Start your journey",
      subtext: "Take the first step toward better mental clarity",
      bgColor: "from-slate-50 via-white to-slate-50",
      accentColor: "text-slate-900",
      illustration: (
        <div className="relative py-10">
          <div className="absolute inset-0 bg-indigo-100/30 rounded-full blur-3xl"></div>
          <h1 className="relative text-8xl font-black text-slate-100 uppercase tracking-tighter opacity-50 text-center select-none">Begin</h1>
        </div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${steps[currentStep].bgColor} transition-colors duration-1000 flex flex-col font-sans overflow-hidden`}>
      {/* Header */}
      <header className="p-8 md:p-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <HiArrowRight className="w-5 h-5 -rotate-45" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">Wellness</span>
        </div>
        <button 
          onClick={skip}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center gap-2 group"
        >
          Skip
          <HiXMark className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="max-w-4xl w-full text-center"
          >
            <div className="mb-12">
              {steps[currentStep].illustration}
            </div>
            
            <h2 className={`text-4xl md:text-6xl font-black ${steps[currentStep].accentColor} tracking-tight mb-6`}>
              {steps[currentStep].title}
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              {steps[currentStep].subtext}
            </p>

            {currentStep === 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 flex flex-col items-center gap-4"
              >
                <button 
                  onClick={() => navigate("/register")}
                  className="w-full max-w-sm py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xl"
                >
                  Get Started
                  <HiArrowRight className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => navigate("/login")}
                  className="text-slate-500 font-bold hover:text-indigo-600 p-4 transition-colors"
                >
                  Continue as Guest
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-12 flex flex-col items-center gap-8 z-10">
        <div className="flex gap-3">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentStep === i ? "w-12 bg-indigo-600" : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
        
        {currentStep < 3 && (
          <button 
            onClick={nextStep}
            className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-indigo-600 hover:scale-110 active:scale-95 transition-all border border-slate-50 group"
          >
            <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </footer>
    </div>
  );
};

const StepIcon = ({ icon, label, color }) => (
  <div className="flex flex-col items-center gap-4">
    <div className={`w-24 h-24 ${color} rounded-[2rem] shadow-lg flex items-center justify-center text-4xl transform hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default Onboarding;
