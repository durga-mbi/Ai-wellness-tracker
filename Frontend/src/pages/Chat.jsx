import React, { useState, useEffect, useRef } from "react";
import { HiPaperAirplane, HiSparkles, HiOutlineCubeTransparent } from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import CrisisModal from "../components/CrisisModal";

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
      title: "AI Chat",
      subtitle: "Support",
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
      setMessages(prev => [...prev, { role: "ai", text: "The connection to the sanctuary has flickered. Let us try once more." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-4 overflow-hidden relative">
      {/* Header Badge Ritual */}
      <section className="shrink-0">
      </section>

      {/* Messages Canvas - No-Scroll Internal */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 rounded-2xl bg-white border border-gray-100 shadow-sm relative custom-scrollbar min-h-0">
        <div className="max-w-4xl mx-auto space-y-4 w-full h-full flex flex-col">
          <AnimatePresence mode="popLayout text-xs">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <HiOutlineCubeTransparent className="text-black text-lg animate-spin-slow" />
                    </div>
                  )}

                  <div className={`space-y-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`
                      px-5 py-3 rounded-xl text-sm font-medium tracking-tight leading-relaxed shadow-sm transition-all
                      ${msg.role === "user"
                        ? "bg-black text-white rounded-tr-none"
                        : "bg-gray-50 text-black rounded-tl-none border border-gray-100"}
                    `}>
                      {msg.text}
                    </div>
                    <p className="text-[7px] font-bold text-gray-300 uppercase tracking-[0.3em] px-2 italic">
                      {msg.role === "user" ? "Me" : "AI"}
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
              className="flex justify-start items-center gap-3 pl-1 pb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 animate-pulse">
                <HiOutlineCubeTransparent className="text-gray-200 text-sm animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="h-1 w-24 bg-gray-50 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: [-96, 96] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-10 bg-gray-200"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4 shrink-0" />
        </div>
      </div>

      {/* Input Ritual Pylon - Compact */}
      <section className="shrink-0 relative group">
        <form onSubmit={handleSend} className="relative z-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full pl-6 pr-14 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-black transition-all font-bold text-sm text-black placeholder:text-gray-200 italic shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-all shadow-md disabled:opacity-20 group/btn"
            >
              <HiPaperAirplane className="w-4 h-4 rotate-45 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>
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
