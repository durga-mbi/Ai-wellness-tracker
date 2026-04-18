import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiPaperAirplane,
  HiChevronRight,
  HiOutlineLightBulb,
  HiCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiHeart,
  HiOutlineBolt
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router";
import CrisisModal from "../components/CrisisModal";
import { HiFire } from "react-icons/hi2";

// ── Design tokens from "Mindmetrics AI" ──────────────────────────────
const C = {
  bg: "#fefee5",
  surface: "#f4f6d2",
  card: "#ffffff",
  primary: "#506b4a",
  priCont: "#ccebc2",
  onPri: "#ffffff",
  text: "#373a1c",
  textMut: "#636745",
  outline: "#b9bc94",
};

const FloatingBlob = ({ color, size, duration, delay, position }) => (
  <motion.div
    className="absolute rounded-full blur-[100px] opacity-20 pointer-events-none"
    style={{
      background: color,
      width: size,
      height: size,
      ...position
    }}
    animate={{
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
);

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
      title: "Mindmetrics Reflection",
      subtitle: "A moment for yourself",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await api.post("/journal", { content });
      toast.success("Your reflection has been safely captured.", {
        icon: '🌿',
        style: {
          borderRadius: '16px',
          background: C.primary,
          color: '#fff',
        },
      });
      setResult(response.data);

      if (response.data.crisisAlert) {
        setHelplines(response.data.helplines);
        setIsCrisisOpen(true);
      }

      updateLayout({
        title: "Growth Captured",
        subtitle: "Gentle Insights Found",
        onBack: () => {
          setResult(null);
          setContent("");
          updateLayout({
            title: "Mindmetrics Reflection",
            subtitle: "A moment for yourself",
            onBack: () => navigate("/dashboard"),
            actions: null
          });
        },
        actions: null
      });
    } catch (error) {
      console.error("Failed to save journal", error);
      // The global interceptor handles basic toasts, but we can add more context here if needed.
      // If we want a specialized message for journal failure:
      toast.error("The sanctuary is currently having trouble saving your thoughts. Please check your connection or try again in a moment.", {
        id: "journal-save-error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full gap-6 pb-4 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col h-full gap-6 relative"
          >
            {/* Background Atmosphere */}
            <FloatingBlob color={C.primary} size="400px" duration={20} delay={0} position={{ top: "-10%", right: "-5%" }} />
            <FloatingBlob color={C.outline} size="300px" duration={25} delay={2} position={{ bottom: "10%", left: "-5%" }} />

            <div className="shrink-0 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm border text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ borderColor: `${C.outline}40`, color: C.primary }}
              >
                <HiOutlineSparkles className="animate-pulse text-lg" /> Mindful Moment
              </motion.div>
            </div>

            {/* Premium Writing Canvas */}
            <motion.div
              className="flex-1 bg-white/80 backdrop-blur-xl border p-12 md:p-16 rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col group transition-all duration-1000"
              style={{ borderColor: `${C.outline}30` }}
              animate={{
                boxShadow: content.length > 0 ? "0 25px 50px -12px rgba(80, 107, 74, 0.15)" : "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#f4f6d2] opacity-20 blur-[120px] pointer-events-none rounded-full transition-opacity duration-1000"></div>

              <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Breathe in... What's on your mind today?"
                  className="flex-1 w-full p-0 text-2xl md:text-4xl font-medium bg-transparent border-none outline-none resize-none placeholder:text-gray-300 leading-[1.6] custom-scrollbar selection:bg-[#506b4a]/10"
                  style={{ color: C.text, fontFamily: "'Inter', sans-serif" }}
                  autoFocus
                />

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 mt-10 border-t shrink-0 border-dashed" style={{ borderColor: `${C.outline}40` }}>
                  <div className="flex items-center gap-6">
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1" style={{ color: C.textMut }}>Word count</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {wordCount}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: C.textMut }}>Fragments</span>
                      </div>
                    </div>
                    {wordCount > 10 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-[#506b4a]/20"
                        style={{ background: C.primary }}
                      >
                        <HiOutlineSparkles />
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="relative px-16 py-5 overflow-hidden text-white font-bold rounded-[32px] shadow-2xl transition-all flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.2em] disabled:opacity-20 group"
                    style={{ background: C.primary }}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Save Reflection
                        <HiPaperAirplane className="w-5 h-5 rotate-45 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col h-full gap-8 overflow-y-auto pr-1 custom-scrollbar pb-16"
          >
            {/* Ethereal Insight Hero */}
            <div className="p-8 sm:p-16 lg:p-24 rounded-[40px] sm:rounded-[64px] shadow-2xl relative overflow-hidden shrink-0 border border-white/40"
              style={{ background: `linear-gradient(135deg, ${C.surface} 0%, #ffffff 100%)` }}>

              <div className="absolute top-0 right-0 w-[60%] h-full bg-[#fefee5] blur-[140px] opacity-40 pointer-events-none rounded-full"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12 }}
                  className="text-7xl sm:text-9xl drop-shadow-2xl flex items-center justify-center bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] w-32 h-32 sm:w-48 sm:h-48 shadow-2xl ring-1 ring-[#506b4a]/10"
                >
                  {result.uiFeedback.emoji}
                </motion.div>
                <div className="space-y-6 text-center lg:text-left flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#506b4a]/5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: C.primary }}
                  >
                    <HiHeart className="animate-pulse" /> {result.uiFeedback.name} Echoes
                  </motion.div>
                  <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05] italic"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
                    "{result.uiFeedback.quote}"
                  </h2>
                </div>
              </div>
            </div>

            {/* Advanced Insight Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start lg:items-stretch">

              {/* CARD 1 - Emotion Insight */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-white/70 backdrop-blur-xl border p-6 sm:p-10 lg:p-12 rounded-3xl sm:rounded-[40px] lg:rounded-[56px] shadow-xl space-y-6 flex flex-col justify-between group overflow-hidden relative"
                style={{ borderColor: `${C.outline}20` }}
              >
                {/* glow */}
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#506b4a]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl sm:rounded-[24px] flex items-center justify-center shadow-inner"
                      style={{ background: `${C.primary}15`, color: C.primary }}
                    >
                      <HiFire className="text-2xl sm:text-3xl" />
                    </div>

                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1"
                        style={{ color: C.textMut }}
                      >
                        Your Feelings
                      </p>

                      <h4
                        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tighter capitalize"
                        style={{
                          color: C.text,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {result.insights.emotion}
                      </h4>
                    </div>
                  </div>

                  <p
                    className="text-base sm:text-lg font-medium italic opacity-80 leading-relaxed border-l-[3px] pl-4 sm:pl-6 lg:pl-8 transition-colors group-hover:border-opacity-100"
                    style={{ color: C.text, borderColor: `${C.primary}40` }}
                  >
                    {result.uiFeedback.quote ? (
                      `Your reflection pulses with a strong resonance of ${result.insights.emotion}. This awareness is the first step toward harmony.`
                    ) : (
                      "Your feelings are valid and heard. Taking a moment to reflect is a powerful step toward inner peace."
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600/60 relative z-10">
                  <HiCheckCircle className="text-lg" />
                  Inner Balance Found
                </div>
              </motion.div>

              {/* CARD 2 - Celestial Guidance */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="bg-[#506b4a] border p-6 sm:p-10 lg:p-12 rounded-3xl sm:rounded-[40px] lg:rounded-[56px] shadow-2xl space-y-6 relative overflow-hidden group"
                style={{ borderColor: `${C.outline}20` }}
              >
                {/* glow */}
                <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/5 blur-[80px] sm:blur-[100px] pointer-events-none"></div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl sm:rounded-[24px] flex items-center justify-center bg-white/10 shadow-xl border border-white/10 backdrop-blur-md">
                      <HiOutlineBolt className="text-2xl sm:text-3xl text-yellow-300" />
                    </div>

                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                      Guidance
                    </p>
                  </div>

                  <h4
                    className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-[1.3] text-white tracking-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {result.insights.suggestion}
                  </h4>
                </div>

                <div className="absolute -bottom-10 -right-10 w-32 sm:w-48 h-32 sm:h-48 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                  <HiOutlineSparkles className="w-full h-full text-white" />
                </div>
              </motion.div>

            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                setResult(null);
                setContent("");
                updateLayout({
                  title: "Mindmetrics Reflection",
                  subtitle: "A moment for yourself",
                  onBack: () => navigate("/dashboard"),
                  actions: null
                });
              }}
              className="mt-6 w-full py-6 border rounded-[32px] bg-white font-bold text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 group shadow-xl hover:shadow-2xl"
              style={{ color: C.text, borderColor: `${C.outline}20` }}
            >
              <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
              Back to Home
            </motion.button>
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
