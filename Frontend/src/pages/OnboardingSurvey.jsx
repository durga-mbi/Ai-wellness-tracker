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
      title: "Tell us about yourself",
      icon: <HiUserGroup className="w-12 h-12 text-indigo-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-500 font-medium">What is your age group?</p>
          <div className="grid grid-cols-2 gap-4">
            {ageGroups.map(age => (
              <button
                key={age}
                onClick={() => setFormData({ ...formData, ageGroup: age })}
                className={`p-4 rounded-2xl font-bold border-2 transition-all ${
                  formData.ageGroup === age 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                    : "border-slate-100 hover:border-slate-200 text-slate-500"
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
      title: "Where do you study?",
      icon: <HiAcademicCap className="w-12 h-12 text-teal-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-500 font-medium">Your University / College</p>
          <input
            type="text"
            placeholder="e.g., Stanford University"
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            className="w-full p-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
          />
        </div>
      )
    },
    {
      title: "What are your goals?",
      icon: <HiSparkles className="w-12 h-12 text-orange-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-500 font-medium">Select all that apply to you</p>
          <div className="flex flex-wrap gap-3">
            {wellnessGoals.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-6 py-3 rounded-full font-bold border-2 transition-all ${
                  formData.goals.includes(goal)
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-slate-100 hover:border-slate-200 text-slate-500"
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 sm:p-12 font-sans">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= step ? "bg-indigo-600" : "bg-slate-200"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-10 sm:p-16 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-white"
          >
            <div className="mb-10">{surveySteps[step].icon}</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">{surveySteps[step].title}</h1>
            
            <div className="mt-12">
              {surveySteps[step].content}
            </div>

            <button
              onClick={handleNext}
              disabled={step === 0 ? !formData.ageGroup : step === 1 ? !formData.university : formData.goals.length === 0}
              className="w-full mt-16 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3 text-lg"
            >
              {step === 2 ? "Complete Setup" : "Continue"}
              <HiArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
