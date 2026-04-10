import React, { useState, useEffect } from "react";
import { 
  HiPaperAirplane,
  HiChevronRight,
  HiOutlineLightBulb,
  HiCheckCircle,
  HiOutlineArrowLeft
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import CrisisModal from "../components/CrisisModal";

const JournalEntry = () => {
  const { updateLayout } = useLayout();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [helplines, setHelplines] = useState([]);

  useEffect(() => {
    updateLayout({
      title: "Daily Journal", 
      subtitle: "Personal Reflection",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post("/journal", { content });
      setResult(response.data);
      
      if (response.data.crisisAlert) {
        setHelplines(response.data.helplines);
        setIsCrisisOpen(true);
      }

      updateLayout({
        title: "Reflection Complete",
        subtitle: "Personal Insights",
        onBack: () => setResult(null),
        actions: null
      });
    } catch (error) {
      console.error("Failed to save journal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-4 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="writing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full gap-4"
          >
            {/* Header Proportions */}
            <div className="shrink-0 space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-black tracking-tight leading-none">
                What's on your mind?
              </h1>
            </div>

            {/* Writing Canvas - Compact No-Scroll */}
            <div className="flex-1 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden flex flex-col group">
              <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your thoughts here..."
                  className="flex-1 w-full p-0 text-base md:text-xl font-medium text-black bg-transparent border-none outline-none resize-none placeholder:text-gray-200 leading-relaxed italic custom-scrollbar"
                  autoFocus
                />

                <div className="flex items-center justify-between gap-4 pt-6 mt-4 border-t border-gray-50 shrink-0">
                  <div className="text-left">
                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic leading-none">Words typed</p>
                    <p className="text-sm font-bold text-black tracking-tight mt-1">
                      {content.trim().split(/\s+/).filter(Boolean).length}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="px-8 py-2.5 bg-black text-white font-bold rounded-xl shadow-md hover:bg-gray-800 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-wider disabled:opacity-30 disabled:scale-100 group"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Save Entry
                        <HiPaperAirplane className="w-3.5 h-3.5 rotate-45 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full gap-4 overflow-y-auto pr-1 custom-scrollbar"
          >
            {/* Compact Insight Hero */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden shrink-0">
              <div className="relative z-10 flex items-center gap-6">
                <div className="text-6xl drop-shadow-sm">
                  {result.uiFeedback.emoji}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em] opacity-30">{result.uiFeedback.name}</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight leading-none italic">
                    "{result.uiFeedback.quote}"
                  </h2>
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                    <HiCheckCircle className="text-black text-sm" />
                  </div>
                  <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic leading-tight">Mood <br /> Analysis</p>
                </div>
                <h4 className="text-xl font-bold text-black capitalize tracking-tight leading-none">{result.insights.emotion}</h4>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed italic">
                  Detected from your written thoughts.
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                    <HiOutlineLightBulb className="text-black text-sm" />
                  </div>
                  <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic leading-tight">Next <br /> Action</p>
                </div>
                <h4 className="text-sm font-bold text-black leading-tight tracking-tight relative z-10">
                  {result.insights.suggestion}
                </h4>
              </div>
            </div>

            <button 
              onClick={() => navigate("/dashboard")}
              className="mt-2 w-full py-4 border border-gray-100 rounded-2xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:border-black transition-all flex items-center justify-center gap-2 group shadow-sm"
            >
              <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CrisisModal 
        isOpen={isCrisisOpen} 
        onClose={() => setIsCrisisOpen(false)} 
        helplines={helplines} 
      />
    </div>
  );
};

export default JournalEntry;
