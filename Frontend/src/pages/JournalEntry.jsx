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
            <div className="shrink-0">
              <div className="flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm w-fit">
                Cognitive Reflection Protocol
              </div>
            </div>

            {/* Writing Canvas - Standardized Card */}
            <div className="flex-1 bg-white border border-gray-100 p-8 md:p-12 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col group transition-all hover:border-black/10">
              <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your thoughts here..."
                  className="flex-1 w-full p-0 text-lg md:text-2xl font-medium text-black bg-transparent border-none outline-none resize-none placeholder:text-gray-400 leading-relaxed italic custom-scrollbar"
                  autoFocus
                />

                <div className="flex items-center justify-between gap-4 pt-8 mt-6 border-t border-gray-50 shrink-0">
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic leading-none">Intelligence data stream</p>
                    <p className="text-sm font-black text-black tracking-tight mt-1 italic uppercase">
                      {content.trim().split(/\s+/).filter(Boolean).length} Words Synced
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="px-10 py-3.5 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] disabled:opacity-30 disabled:scale-100 group"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Synchronize Entry
                        <HiPaperAirplane className="w-4 h-4 rotate-45 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
            className="flex flex-col h-full gap-8 overflow-y-auto pr-1 custom-scrollbar"
          >
            {/* Impact Hero Section */}
            <div className="bg-gray-50 p-10 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-[400px] h-full bg-white blur-[80px] rounded-full opacity-60"></div>
              <div className="relative z-10 flex items-center gap-8">
                <div className="text-7xl drop-shadow-2xl grayscale hover:grayscale-0 transition-all cursor-default">
                  {result.uiFeedback.emoji}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-black uppercase tracking-[0.3em] opacity-40 italic">{result.uiFeedback.name} Identification</p>
                  <h2 className="text-3xl md:text-5xl font-black text-black tracking-tighter leading-none italic uppercase">
                    "{result.uiFeedback.quote}"
                  </h2>
                </div>
              </div>
            </div>

            {/* Metrics Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
              <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm space-y-4 hover:border-black/10 transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                      <HiCheckCircle className="text-black text-lg" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic leading-none mb-1">Sentiment</p>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic leading-none">Node</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Validated</span>
                </div>
                <h4 className="text-3xl font-black text-black capitalize tracking-tighter italic uppercase">{result.insights.emotion}</h4>
                <p className="text-[11px] text-gray-600 font-medium leading-relaxed italic border-l-2 border-black pl-3">
                  Detected from your biometric reflection stream.
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm space-y-4 relative overflow-hidden hover:border-black/10 transition-all">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                    <HiOutlineLightBulb className="text-black text-lg" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic leading-none mb-1">Protocol</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic leading-none">Guidance</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-black leading-tight tracking-tight relative z-10 italic uppercase">
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
