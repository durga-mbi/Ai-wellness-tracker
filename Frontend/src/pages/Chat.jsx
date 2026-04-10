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

      {/* Messages Canvas - Standardized Container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 rounded-[32px] bg-white border border-gray-100 shadow-sm relative custom-scrollbar min-h-0 group hover:border-black/5 transition-all">
        <div className="max-w-4xl mx-auto space-y-8 w-full h-full flex flex-col">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-4 max-w-[90%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "ai" && (
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-1 shadow-sm group-hover:bg-white transition-colors">
                      <HiOutlineCubeTransparent className="text-black text-xl animate-spin-slow" />
                    </div>
                  )}

                  <div className={`space-y-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`
                      px-6 py-4 rounded-[24px] text-sm font-medium tracking-tight leading-relaxed shadow-sm transition-all italic
                      ${msg.role === "user"
                        ? "bg-black text-white rounded-tr-none"
                        : "bg-gray-50 text-black rounded-tl-none border border-gray-100 hover:bg-white"}
                    `}>
                      {msg.text}
                    </div>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em] px-4 italic">
                      {msg.role === "user" ? "Subject Identity" : "Intelligence Layer"}
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
              className="flex justify-start items-center gap-4 pl-1 pb-6"
            >
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 animate-pulse">
                <HiOutlineCubeTransparent className="text-gray-400 text-lg animate-spin" />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-32 bg-gray-50 rounded-full overflow-hidden">
                   <motion.div
                    animate={{ x: [-128, 128] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-12 bg-gray-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-6 shrink-0" />
        </div>
      </div>

      {/* Input Ritual Terminal - Standardized */}
      <section className="shrink-0 relative group mt-2">
        <form onSubmit={handleSend} className="relative z-10">
          <div className="relative flex items-center group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-8 pr-16 py-5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-black transition-all font-black text-md text-black placeholder:text-gray-600 italic shadow-xl"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-2.5 bottom-2.5 aspect-square bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all shadow-2xl disabled:opacity-20 group/btn"
            >
              <HiPaperAirplane className="w-5 h-5 rotate-45 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
