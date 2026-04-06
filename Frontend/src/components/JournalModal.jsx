import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiSparkles, HiPaperAirplane } from "react-icons/hi2";
import api from "../utils/api";

const JournalModal = ({ isOpen, onClose, onEntryCreated }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post("/journal", { content });
      setResult(response.data);
      if (onEntryCreated) onEntryCreated(response.data);
    } catch (error) {
      console.error("Journal submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setResult(null);
    setContent("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <HiSparkles className="text-indigo-600" />
                  How are you feeling?
                </h2>
                <button 
                  onClick={resetAndClose}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              {!result ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 font-medium text-lg resize-none placeholder:text-slate-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Analyze Entry
                        <HiPaperAirplane className="w-5 h-5 rotate-45" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-6 p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50">
                    <span className="text-6xl">{result.uiFeedback.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-black text-indigo-900 mb-1">{result.uiFeedback.title}</h3>
                      <p className="text-indigo-700/70 font-bold tracking-tight">{result.insights.insight}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Emotion</p>
                      <p className="text-lg font-black text-slate-900 capitalize">{result.insights.emotion}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Suggestion</p>
                      <p className="text-sm font-bold text-slate-700 leading-tight">{result.insights.suggestion}</p>
                    </div>
                  </div>

                  {result.crisisAlert && (
                    <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4 text-red-600 animate-pulse">
                      <span className="text-2xl">⚠️</span>
                      <p className="font-black text-sm">We've detected high stress. Please consider talking to someone you trust.</p>
                    </div>
                  )}

                  <button
                    onClick={resetAndClose}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-lg"
                  >
                    Got it, thanks!
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JournalModal;
