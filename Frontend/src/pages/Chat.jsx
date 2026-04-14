import React, { useState, useEffect, useRef } from "react";
import { 
  HiPaperAirplane, 
  HiOutlineSparkles, 
  HiOutlineCubeTransparent, 
  HiOutlineChatBubbleBottomCenterText,
  HiHeart,
  HiOutlineLightBulb,
  HiOutlineArrowLeft
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import CrisisModal from "../components/CrisisModal";

// ── Design tokens from "The Ethereal Sanctuary" ──────────────────────────────
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

const Chat = () => {
  const { updateLayout } = useLayout();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "ai", text: "I am listening. What whispers in your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [helplines, setHelplines] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    updateLayout({
      title: "Soul Mirror",
      subtitle: "A gentle conversation",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.post("/chat", { message: userMessage });
      setMessages(prev => [...prev, { role: "ai", text: response.data.response }]);
      
      if (response.data.crisisAlert) {
        setHelplines(response.data.helplines);
        setIsCrisisOpen(true);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "The connection to the sanctuary has flickered. Let us breathe and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-4 overflow-hidden relative">
      {/* Background Atmosphere */}
      <FloatingBlob color={C.primary} size="450px" duration={22} delay={0} position={{ top: "-15%", right: "-10%" }} />
      <FloatingBlob color={C.outline} size="350px" duration={28} delay={3} position={{ bottom: "5%", left: "-10%" }} />

      {/* Header Indicator */}
      <div className="shrink-0 relative z-10 flex justify-center py-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-white/40 backdrop-blur-md rounded-full shadow-sm border text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ borderColor: `${C.outline}30`, color: C.primary }}
        >
          <HiOutlineSparkles className="animate-pulse" /> Sanctuary Presence Active
        </motion.div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 pt-6 sm:pt-10 pb-16 space-y-6 sm:space-y-10 rounded-[32px] sm:rounded-[64px] bg-white/30 backdrop-blur-2xl border relative custom-scrollbar shadow-2xl mx-auto w-full max-w-6xl"
           style={{ borderColor: `${C.outline}15` }}>
        
        <div className="max-w-3xl mx-auto space-y-12 w-full flex flex-col">
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-6 max-w-[95%] md:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "ai" && (
                    <div className="w-12 h-12 rounded-[20px] bg-white border flex items-center justify-center shrink-0 mt-1 shadow-lg"
                         style={{ borderColor: `${C.outline}30` }}>
                      <HiOutlineCubeTransparent className="text-[#37493a] text-2xl animate-spin-slow" />
                    </div>
                  )}

                  <div className={`space-y-3 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`
                      px-5 sm:px-8 py-3 sm:py-5 rounded-[24px] sm:rounded-[36px] text-base sm:text-lg font-medium tracking-tight leading-relaxed shadow-xl border transition-all
                      ${msg.role === "user"
                        ? "bg-[#506b4a] text-white rounded-tr-none border-[#506b4a]"
                        : "bg-white/95 text-[#373a1c] rounded-tl-none border-white/80 backdrop-blur-md"}
                    `} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 px-5">
                       {msg.role === "ai" ? <HiHeart className="text-[10px] text-red-400" /> : <HiOutlineSparkles className="text-[10px] text-emerald-600" />}
                       <p className="text-[9px] font-bold text-[#636745] uppercase tracking-[0.3em] opacity-60">
                        {msg.role === "user" ? "The Seeker" : "Sanctuary Echo"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-center gap-6"
            >
              <div className="w-12 h-12 rounded-[20px] bg-white flex items-center justify-center border animate-pulse shadow-sm"
                   style={{ borderColor: `${C.outline}10` }}>
                <HiOutlineCubeTransparent className="text-gray-200 text-2xl animate-spin" />
              </div>
              <div className="flex gap-2 px-6 py-4 bg-white/40 backdrop-blur-sm rounded-[24px] border border-white/20">
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 bg-emerald-900/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-900/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-900/40 rounded-full" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4 shrink-0" />
        </div>
      </div>

      {/* Input Terminal */}
      <section className="shrink-0 relative z-10 mx-auto w-full max-w-4xl px-4 md:px-0">
        <form onSubmit={handleSend} className="relative">
          <motion.div 
            className="relative flex items-center group bg-white/90 backdrop-blur-3xl rounded-[40px] border-2 shadow-2xl transition-all duration-700 overflow-hidden pr-4"
            style={{ borderColor: `${C.outline}15` }}
            whileFocusWithin={{ borderColor: `${C.primary}30`, boxShadow: "0 30px 60px -15px rgba(80, 107, 74, 0.2)" }}
          >
            <div className="pl-4 sm:pl-10 text-emerald-900/30">
              <HiOutlineChatBubbleBottomCenterText className="text-2xl sm:text-3xl" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What whispers in your heart?"
              className="w-full pl-4 sm:pl-6 pr-2 sm:pr-4 py-5 sm:py-8 bg-transparent outline-none font-semibold text-base sm:text-lg text-[#373a1c] placeholder:text-[#636745]/30 selection:bg-[#506b4a]/15"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 sm:px-10 py-3 sm:py-5 bg-[#506b4a] text-white rounded-[20px] sm:rounded-[24px] flex items-center justify-center transition-all shadow-xl disabled:opacity-30 group disabled:scale-100"
            >
              <HiPaperAirplane className="w-5 h-5 sm:w-6 h-6 rotate-45 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </motion.div>
        </form>
      </section>

      <CrisisModal 
        isOpen={isCrisisOpen} 
        onClose={() => setIsCrisisOpen(false)} 
        helplines={helplines} 
      />
    </div>
  );
};

export default Chat;
