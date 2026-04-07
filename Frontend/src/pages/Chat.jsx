import React, { useState, useEffect, useRef } from "react";
import { HiPaperAirplane, HiChatBubbleLeftRight, HiSparkles } from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";

const Chat = () => {
  const { updateLayout } = useLayout();
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi there! I'm your wellness companion. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    updateLayout({
      title: "AI Wellness Guide",
      subtitle: "Always here to listen and support your journey.",
      onBack: () => window.history.back(),
      actions: null
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      setMessages(prev => [...prev, { role: "ai", text: "I'm sorry, I'm having trouble connecting right now. Let's try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 sanctuary-card rounded-[3rem] mb-8 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex flex-col max-w-[80%] space-y-2">
               <div className={`
                p-6 rounded-[2rem] text-sm font-bold leading-relaxed shadow-xl
                ${msg.role === "user" 
                  ? "sanctuary-gradient text-white rounded-tr-none shadow-indigo-500/20" 
                  : "bg-white/5 text-slate-100 rounded-tl-none border border-white/5 sanctuary-glass"}
              `}>
                {msg.text}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">
                {msg.role === "user" ? "You" : "AI Guide"}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white/5 p-6 rounded-[2rem] rounded-tl-none border border-white/5 flex gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative group">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts with the sanctuary..."
            className="w-full pl-8 pr-20 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] outline-none focus:bg-[#121214] focus:border-indigo-500 transition-all font-bold text-white sanctuary-glass"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-white text-indigo-900 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl"
          >
            <HiPaperAirplane className="w-6 h-6 rotate-45" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
