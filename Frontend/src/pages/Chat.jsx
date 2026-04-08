import React, { useState, useEffect, useRef } from "react";
import { HiPaperAirplane, HiSparkles, HiOutlineCubeTransparent, HiArrowPath } from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const Chat = () => {
  const { updateLayout } = useLayout();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "ai", text: "I am listening. What whispers in your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    updateLayout({
      title: "",
      subtitle: "",
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
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "The connection to the sanctuary has flickered. Let us try once more." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-160px)] lg:h-[calc(100vh-200px)] selection:bg-amber-500/10 relative">
      {/* Cinematic Header Ritual */}
      <section className="mb-8 lg:mb-12">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.04] backdrop-blur-2xl rounded-full border border-white/5 uppercase font-black text-[9px] tracking-[0.4em] text-amber-500/60 italic shadow-2xl mb-6"
        >
          <HiSparkles className="w-4 h-4" />
          The Presence
        </motion.div>
        {/* <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
          Whisper <br /> to AI.
        </h1> */}
      </section>

      {/* Messages Sanctuary */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 lg:space-y-14 custom-scrollbar-hide rounded-[3rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl min-h-0 relative group">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-amber-500/5 blur-[120px] pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"></div>

        <div className="max-w-4xl mx-auto space-y-10 lg:space-y-14 relative z-10 w-full">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-4 lg:gap-8 max-w-[90%] md:max-w-[75%] ${msg.role === "user" ? "flex-reverse" : ""}`}>
                  {msg.role === "ai" && (
                    <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative overflow-hidden shrink-0 mt-1">
                      <div className="absolute inset-0 bg-amber-400 animate-pulse opacity-20 blur-md"></div>
                      <HiOutlineCubeTransparent className="text-amber-500 text-xl lg:text-3xl relative z-10 animate-spin-slow" />
                    </div>
                  )}

                  <div className={`space-y-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`
                      p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] text-lg lg:text-2xl font-black italic tracking-tight leading-relaxed shadow-3xl transition-all
                      ${msg.role === "user"
                        ? "bg-amber-500/90 text-[#050505] rounded-tr-none shadow-[0_0_50px_rgba(245,158,11,0.2)]"
                        : "bg-white/[0.03] text-white/70 rounded-tl-none border border-white/5 backdrop-blur-3xl"}
                    `}>
                      {msg.text}
                    </div>
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] px-6 italic">
                      {msg.role === "user" ? "The Soul" : "The Whisper"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-center gap-6 pl-2"
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 animate-pulse">
                <HiOutlineCubeTransparent className="text-amber-500/40 text-2xl animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: [-128, 128] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-20 bg-amber-500/40"
                  />
                </div>
                <p className="text-[8px] font-black text-amber-500/20 uppercase tracking-[0.4em] italic">Attuning...</p>
              </div>
            </motion.div>
          )}
        </div>
        <div ref={messagesEndRef} className="h-10" />
      </div>

      {/* Ritual Input Pylon */}
      <section className="mt-8 lg:mt-10 relative group">
        <form onSubmit={handleSend} className="relative z-10">
          <div className="absolute inset-[-2px] bg-amber-500/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Release a whisper into the sanctuary..."
              className="w-full pl-10 pr-24 lg:pr-32 py-8 lg:py-10 bg-white/[0.04] border border-white/10 rounded-full outline-none focus:bg-[#121214] focus:border-amber-500/40 transition-all font-black text-lg lg:text-2xl text-white placeholder:text-white/5 italic shadow-2xl backdrop-blur-3xl"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-4 lg:right-6 top-4 bottom-4 aspect-square bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-20 group/btn overflow-hidden"
            >
              <HiPaperAirplane className="w-5 h-5 lg:w-7 lg:h-7 rotate-45 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              <div className="absolute inset-0 bg-amber-400 opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Chat;
