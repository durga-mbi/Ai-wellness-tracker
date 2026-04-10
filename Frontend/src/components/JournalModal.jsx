import React, { useState } from "react";
import { HiPaperAirplane, HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

const JournalModal = ({ isOpen, onClose, onFinish }) => {
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
    } catch (error) {
      console.error("Failed to save journal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setContent("");
    setResult(null);
    onClose();
    if (result) onFinish();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your thoughts here..."
                    className="w-full h-48 p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-black focus:bg-white text-xl font-medium text-slate-900 placeholder:text-slate-300 outline-none transition-all resize-none shadow-inner"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="w-full py-5 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest disabled:opacity-20"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Save Entry
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
                  <div className="flex items-center gap-8 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="text-7xl">{result.uiFeedback.emoji}</div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Status</p>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight">
                        "{result.uiFeedback.quote}"
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Feeling</p>
                      <p className="text-xl font-black text-slate-900 capitalize italic">{result.insights.emotion}</p>
                    </div>
                    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Advice</p>
                      <p className="text-xs font-bold text-slate-600 leading-relaxed italic">{result.insights.suggestion}</p>
                    </div>
                  </div>

                  <button
                    onClick={resetAndClose}
                    className="w-full py-5 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest"
                  >
                    Close
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
