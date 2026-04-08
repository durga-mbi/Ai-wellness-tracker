import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPaperAirplane,
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
      title: "New Journal",
      subtitle: "Pour your thoughts onto the digital canvas.",
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
    <div className="flex-1 flex flex-col items-center justify-center py-12">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-8"
            >
              <div className="bg-white p-10 sm:p-16 rounded-[4rem] shadow-2xl shadow-indigo-100/30 border border-white relative">
                <div className="absolute top-10 right-10 text-6xl text-slate-100 font-black pointer-events-none select-none">
                  01
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">How are you truly feeling, {user?.name?.split(' ')[0]}?</h2>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing your heart out..."
                    className="w-full h-[50vh] p-4 text-2xl font-medium text-slate-700 bg-transparent border-none outline-none resize-none placeholder:text-slate-200 leading-relaxed"
                    autoFocus
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-2xl disabled:opacity-50 disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Save & Analyze
                        <HiPaperAirplane className="w-6 h-6 rotate-45" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="bg-indigo-600 p-12 sm:p-20 rounded-[4rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-20%] w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="text-9xl animate-bounce duration-[3s]">{result.uiFeedback.emoji}</div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-5xl font-black mb-6 tracking-tight">{result.uiFeedback.title}</h2>
                    <p className="text-2xl text-indigo-100 font-medium leading-relaxed max-w-2xl">
                      {result.insights.insight}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[3.5rem] border border-white shadow-xl shadow-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Detected Emotion</p>
                  <h4 className="text-4xl font-black text-slate-900 capitalize mb-4">{result.insights.emotion}</h4>
                  <p className="text-slate-400 font-bold leading-relaxed">
                    We've carefully analyzed the tone and vocabulary of your entry.
                  </p>
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] border border-white shadow-xl shadow-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Your Action Step</p>
                  <h4 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                    {result.insights.suggestion}
                  </h4>
                  <p className="text-slate-400 font-bold leading-relaxed">
                    Small steps lead to great peace of mind.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-12">
                <button
                  onClick={() => {
                    setResult(null);
                    setContent("");
                  }}
                  className="flex-1 py-6 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all text-xl"
                >
                  New Journal Entry
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-6 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-3xl hover:bg-slate-50 transition-all text-xl"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JournalEntry;
