import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPaperAirplane,
  HiChevronLeft,
  HiSparkles,
  HiOutlineLightBulb,
  HiArrowPath
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";

const JournalEntry = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateLayout } = useLayout();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    updateLayout({
      title: "", 
      subtitle: "",
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
    } catch (error) {
      console.error("Journal submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-full selection:bg-amber-500/10">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.01 }}
            className="flex-1 flex flex-col space-y-8 lg:space-y-12"
          >
            {/* Header Ritual */}
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.04] backdrop-blur-2xl rounded-full border border-white/5 uppercase font-black text-[9px] tracking-[0.4em] text-amber-500/60 italic shadow-2xl"
              >
                <HiSparkles className="w-4 h-4" />
                Sacred Reflection
              </motion.div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                What's on your <br /> mind, {user?.name?.split(' ')[0]}?
              </h1>
            </div>

            {/* Immersive Canvas */}
            <div className="flex-1 bg-white/[0.02] border border-white/5 p-8 md:p-12 lg:p-20 rounded-[3rem] lg:rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group flex flex-col">
               {/* Decorative Atmospheric Glows */}
               <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-amber-500/5 blur-[120px] rounded-full group-hover:bg-amber-500/10 transition-all duration-1000"></div>
               <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col space-y-10">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Let your thoughts flow onto the night canvas..."
                    className="flex-1 w-full p-0 text-xl md:text-3xl lg:text-4xl font-medium text-white/80 bg-transparent border-none outline-none resize-none placeholder:text-white/10 leading-[1.5] italic scrollbar-hide"
                    autoFocus
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
                    <div className="flex flex-col items-center sm:items-start">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-1">Ritual Depth</p>
                      <p className="text-lg font-black text-amber-500/60 italic tracking-tighter">
                        {content.trim().split(/\s+/).filter(Boolean).length} Words Gathered
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !content.trim()}
                      className="w-full sm:w-auto px-16 py-7 lg:py-8 bg-white text-black font-black rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 text-[11px] uppercase tracking-[0.2em] disabled:opacity-30 disabled:scale-100 group"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Seal Reflection
                          <HiPaperAirplane className="w-5 h-5 rotate-45 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-10 md:space-y-12 pb-12"
          >
            {/* Cinematic Hero Card */}
            <div className="bg-gradient-to-br from-amber-500/20 to-[#050505] p-12 md:p-20 lg:p-28 rounded-[4rem] lg:rounded-[5rem] border border-white/10 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-amber-500/10 blur-[150px] pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-9xl md:text-[12rem] drop-shadow-[0_0_60px_rgba(245,158,11,0.5)]"
                >
                  {result.uiFeedback.emoji}
                </motion.div>
                <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-10">
                  <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
                    {result.uiFeedback.title}
                  </h2>
                  <p className="text-xl md:text-3xl text-white/40 font-medium leading-relaxed max-w-3xl italic">
                    {result.insights.insight}
                  </p>
                </div>
              </div>
            </div>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white/[0.02] border border-white/5 p-12 lg:p-16 rounded-[3.5rem] lg:rounded-[4rem] backdrop-blur-3xl shadow-xl space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
                    <HiSparkles className="text-amber-500 text-2xl" />
                  </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-tight">Emotion <br/> Resonance</p>
                </div>
                <h4 className="text-5xl lg:text-7xl font-black text-white capitalize italic tracking-tighter leading-none">{result.insights.emotion}</h4>
                <p className="text-base lg:text-lg text-white/30 font-bold leading-relaxed italic pr-12">
                  Your reflection highlights a deep, systemic alignment with these internal emotional markers.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-amber-500/10 p-12 lg:p-16 rounded-[3.5rem] lg:rounded-[4rem] backdrop-blur-3xl shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-amber-500/5 blur-[100px] pointer-events-none"></div>
                <div className="flex items-center gap-5 relative z-10">
                   <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
                    <HiOutlineLightBulb className="text-amber-400 text-2xl" />
                   </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-tight">Sacred <br/> Action</p>
                </div>
                <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight italic tracking-tight relative z-10 pr-6">
                  {result.insights.suggestion}
                </h4>
                <p className="text-base lg:text-lg text-white/30 font-bold leading-relaxed italic relative z-10">
                  Small, flickering steps are the foundation of universal stillness.
                </p>
              </div>
            </div>

            {/* Ritual Navigation */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 pt-8 lg:pt-12">
              <button
                onClick={() => {
                  setResult(null);
                  setContent("");
                }}
                className="flex-1 py-8 lg:py-10 bg-white text-black font-black rounded-full shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all text-[11px] lg:text-[12px] uppercase tracking-[0.3em]"
              >
                Recall Another Reflection
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-8 lg:py-10 bg-white/[0.02] text-white/40 border border-white/10 font-black rounded-full hover:bg-white/[0.05] transition-all text-[11px] lg:text-[12px] uppercase tracking-[0.3em] italic"
              >
                Return to Sanctuary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalEntry;
