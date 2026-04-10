import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { HiArrowRight, HiSparkles, HiAcademicCap, HiUserGroup } from "react-icons/hi2";

const OnboardingSurvey = () => {
  const { updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    ageGroup: "",
    university: "",
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
    if (step < 2) {
      setStep(step + 1);
    } else {
      await updateAuthProfile({
        ageGroup: formData.ageGroup,
        university: formData.university,
        preferences: { goals: formData.goals }
      });
      navigate("/dashboard");
    }
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
      title: "Bio-Sync Initialization",
      icon: <HiUserGroup className="w-14 h-14 text-black" />,
      content: (
        <div className="space-y-8">
          <p className="text-gray-600 font-medium italic border-l-2 border-black/5 pl-6 px-4 py-2 bg-gray-50/50 rounded-r-xl">Define your demographic identity for model calibration.</p>
          <div className="grid grid-cols-2 gap-6">
            {ageGroups.map(age => (
              <button
                key={age}
                onClick={() => setFormData({ ...formData, ageGroup: age })}
                className={`p-6 rounded-[24px] font-black uppercase tracking-widest border-2 transition-all italic ${
                  formData.ageGroup === age 
                    ? "border-black bg-black text-white shadow-xl scale-[1.02]" 
                    : "border-gray-50 hover:border-gray-100 text-gray-500 hover:text-black bg-white"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Academic Sanctuary",
      icon: <HiAcademicCap className="w-14 h-14 text-black" />,
      content: (
        <div className="space-y-8">
          <p className="text-gray-600 font-medium italic border-l-2 border-black/5 pl-6 px-4 py-2 bg-gray-50/50 rounded-r-xl">Locate your primary operational intelligence center.</p>
          <input
            type="text"
            placeholder="EX: STANFORD UNIVERSITY"
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            className="w-full p-8 rounded-[32px] bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all font-black text-black placeholder:text-gray-400 uppercase tracking-widest italic shadow-inner"
          />
        </div>
      )
    },
    {
      title: "Strategic Objectives",
      icon: <HiSparkles className="w-14 h-14 text-black" />,
      content: (
        <div className="space-y-8">
          <p className="text-gray-600 font-medium italic border-l-2 border-black/5 pl-6 px-4 py-2 bg-gray-50/50 rounded-r-xl">Select targets for well-being optimization protocols.</p>
          <div className="flex flex-wrap gap-4">
            {wellnessGoals.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-8 py-4 rounded-full font-black uppercase tracking-widest border-2 transition-all italic text-sm ${
                  formData.goals.includes(goal)
                    ? "border-black bg-black text-white shadow-xl"
                    : "border-gray-50 hover:border-gray-100 text-gray-500 hover:text-black bg-white"
                }`}
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 sm:p-14 relative overflow-hidden">
      {/* Visual Identity Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-50/50 blur-[150px] rounded-full -translate-y-1/2 opacity-60"></div>

      <div className="max-w-2xl w-full z-10 relative">
        {/* Synthetic Progress Interface */}
        <div className="flex gap-4 mb-16 px-4">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-700 ${i <= step ? "bg-black" : "bg-gray-100"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-12 sm:p-20 rounded-[48px] shadow-3xl border border-gray-50 relative group"
          >
            <div className="mb-14 p-6 bg-gray-50 inline-block rounded-[32px] group-hover:rotate-3 transition-transform duration-500">{surveySteps[step].icon}</div>
            <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter mb-6 uppercase italic leading-none">{surveySteps[step].title}</h1>
            
            <div className="mt-14">
              {surveySteps[step].content}
            </div>

            <button
              onClick={handleNext}
              disabled={step === 0 ? !formData.ageGroup : step === 1 ? !formData.university : formData.goals.length === 0}
              className="w-full mt-20 py-6 bg-black text-white font-black rounded-3xl shadow-2xl hover:bg-gray-800 disabled:opacity-40 disabled:grayscale transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.4em] italic group/btn"
            >
              {step === 2 ? "Finalize Protocols" : "Execute Next"}
              <HiArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
