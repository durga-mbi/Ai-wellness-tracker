import React, { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { HiArrowRight, HiOutlineSparkles, HiAcademicCap, HiUserGroup, HiHeart } from "react-icons/hi2";

// ── Design tokens (Stitch "The Ethereal Sanctuary") ──────────────────────────
const C = {
  bg:      "#fefee5",
  surface: "#f4f6d2",
  card:    "#ffffff",
  primary: "#506b4a",
  priCont: "#ccebc2",
  onPri:   "#ffffff",
  text:    "#373a1c",
  textMut: "#636745",
  outline: "#b9bc94",
};

const OnboardingSurvey = () => {
  const { updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    ageGroup: "",
    university: "",
    location: "",
    goals: []
  });

  const ageGroups = ["18-21", "22-25", "26-30", "30+"];
  const wellnessGoals = [
    "Manage Stress", 
    "Better Sleep", 
    "Academic Focus", 
    "Emotional Balance", 
    "Daily Mindfulness",
    "Self-Reflection"
  ];

  const handleNext = async () => {
    // Validation
    if (step === 1 && !formData.university.trim()) {
      toast.error("Please enter your university name.");
      return;
    }

    if (step === 2 && !formData.location.trim()) {
      toast.error("Please enter your location.");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      await updateAuthProfile({
        ageGroup: formData.ageGroup,
        university: formData.university.trim(),
        location: formData.location.trim(),
        preferences: { goals: formData.goals }
      });
      toast.success(`Welcome to your ${formData.location} Sanctuary!`, {
        icon: '🌿',
        duration: 5000
      });
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
  }));
  };

  const surveySteps = [
    {
      title: "Getting to Know You",
      icon: <HiUserGroup className="w-14 h-14" style={{ color: C.primary }} />,
      content: (
        <div className="space-y-8">
          <p className="font-medium italic border-l-2 pl-6 px-4 py-2 bg-white/40 rounded-r-xl" style={{ color: C.textMut, borderColor: `${C.primary}30` }}>
            Tell us a bit about yourself to help us understand you better.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {ageGroups.map(age => (
              <button
                key={age}
                onClick={() => setFormData({ ...formData, ageGroup: age })}
                className={`p-6 rounded-[32px] font-bold uppercase tracking-widest border-2 transition-all italic text-sm ${
                  formData.ageGroup === age 
                    ? "scale-[1.02] shadow-xl" 
                    : "border-transparent hover:border-white/60 text-emerald-800/40 hover:text-emerald-800 bg-white/40"
                }`}
                style={{ 
                  background: formData.ageGroup === age ? C.primary : undefined,
                  color: formData.ageGroup === age ? C.onPri : undefined,
                  borderColor: formData.ageGroup === age ? C.primary : undefined,
                }}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Your University",
      icon: <HiAcademicCap className="w-14 h-14" style={{ color: C.primary }} />,
      content: (
        <div className="space-y-8">
          <p className="font-medium italic border-l-2 pl-6 px-4 py-2 bg-white/40 rounded-r-xl" style={{ color: C.textMut, borderColor: `${C.primary}30` }}>
            Where do you spend most of your time studying?
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="EX: STANFORD UNIVERSITY"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full p-8 rounded-[40px] bg-white border-2 outline-none transition-all font-bold placeholder:text-emerald-800/30 uppercase tracking-widest italic shadow-inner"
              style={{ color: C.text, borderColor: `${C.outline}20`, focusBorderColor: C.primary }}
            />
          </div>
        </div>
      )
    },
    {
      title: "Your Location",
      icon: <HiOutlineSparkles className="w-14 h-14" style={{ color: C.primary }} />,
      content: (
        <div className="space-y-8">
          <p className="font-medium italic border-l-2 pl-6 px-4 py-2 bg-white/40 rounded-r-xl" style={{ color: C.textMut, borderColor: `${C.primary}30` }}>
            Help us tailor the experience to your local language and culture.
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="EX: MUMBAI, INDIA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-8 rounded-[40px] bg-white border-2 outline-none transition-all font-bold placeholder:text-emerald-800/30 uppercase tracking-widest italic shadow-inner"
              style={{ color: C.text, borderColor: `${C.outline}20`, focusBorderColor: C.primary }}
            />
          </div>
        </div>
      )
    },
    {
      title: "Your Goals",
      icon: <HiOutlineSparkles className="w-14 h-14" style={{ color: C.primary }} />,
      content: (
        <div className="space-y-8">
          <p className="font-medium italic border-l-2 pl-6 px-4 py-2 bg-white/40 rounded-r-xl" style={{ color: C.textMut, borderColor: `${C.primary}30` }}>
            What would you like to focus on for your well-being?
          </p>
          <div className="flex flex-wrap gap-3">
            {wellnessGoals.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest border-2 transition-all italic text-xs ${
                  formData.goals.includes(goal)
                    ? "shadow-lg"
                    : "border-transparent hover:border-white/60 text-emerald-800/40 hover:text-emerald-800 bg-white/40"
                }`}
                style={{ 
                  background: formData.goals.includes(goal) ? C.primary : undefined,
                  color: formData.goals.includes(goal) ? C.onPri : undefined,
                  borderColor: formData.goals.includes(goal) ? C.primary : undefined,
                }}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-14 relative overflow-hidden font-sans"
      style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Visual Identity Atmosphere */}
      <div 
        className="absolute top-0 left-0 w-full h-[600px] blur-[150px] rounded-full -translate-y-1/2 opacity-60"
        style={{ background: C.priCont }}
      ></div>
      <div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-30"
        style={{ background: C.priCont }}
      ></div>

      <div className="max-w-2xl w-full z-10 relative">
        {/* Synthetic Progress Interface */}
        <div className="flex gap-4 mb-16 px-4">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full flex-1 transition-all duration-700`} 
              style={{ background: i <= step ? C.primary : `${C.outline}30` }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="bg-white/60 backdrop-blur-2xl p-12 sm:p-20 rounded-[64px] shadow-3xl border relative group"
            style={{ borderColor: `${C.outline}20` }}
          >
            <div className="mb-14 p-6 bg-white rounded-[32px] group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-emerald-800/5">
              {surveySteps[step].icon}
            </div>
            
            <h1 
              className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 uppercase italic leading-none"
              style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {surveySteps[step].title}
            </h1>
            
            <div className="mt-14">
              {surveySteps[step].content}
            </div>

            <div className="flex gap-4 mt-20">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="px-8 py-6 rounded-[32px] border-2 font-bold uppercase tracking-[0.4em] italic transition-all shadow-lg active:scale-95"
                  style={{ borderColor: `${C.outline}40`, color: C.textMut }}
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={step === 0 ? !formData.ageGroup : step === 1 ? !formData.university : step === 2 ? !formData.location : formData.goals.length === 0}
                className="flex-1 py-6 text-white font-bold rounded-[32px] shadow-2xl hover:opacity-90 disabled:opacity-20 transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.4em] italic group/btn shadow-[#506b4a]/20"
                style={{ background: C.primary }}
              >
                {step === 3 ? "Finish Setup" : "Continue"}
                <HiArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <p className="text-center mt-12 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 italic" style={{ color: C.textMut }}>
          <HiHeart className="inline animate-pulse text-lg mr-2" /> Setting up Mindmetrics AI
        </p>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
