import React, { useState, useEffect, useRef } from "react";
import {
  HiHeart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineFaceSmile,
  HiOutlinePaperClip,
  HiOutlineEllipsisVertical,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronLeft,
  HiOutlineTag,
} from "react-icons/hi2";
import { IoSend } from "react-icons/io5";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

// Ethereal Sanctuary Chat System Constants
const ZEN = {
  bg: "#fefee5", // Soft Vanilla
  header: "bg-white/80 backdrop-blur-md",
  myBubble: "bg-gradient-to-br from-[#8aa179] to-[#b3c4a1] text-white", // Sage Green
  otherBubble: "bg-white text-[#506b4a]", // Soft White
  accent: "#506b4a",
  border: "border-[#506b4a]/10",
  shadow: "shadow-[0_8px_30px_rgb(80,107,74,0.04)]",
};

const Community = () => {
  const { updateLayout } = useLayout();
  const { socket, typingUsers, startTyping, stopTyping } = useSocket();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    updateLayout({
      title: "Community",
      subtitle: "Shared Resonance",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
    fetchPosts();
  }, []);

  // Auto-scroll to bottom like WhatsApp
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [posts]);

  useEffect(() => {
    if (!socket) return;

    socket.on("post:new", (newPost) => {
      setPosts(prev => [...prev, newPost]);
    });

    socket.on("post:like", ({ postId, likes }) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: likes } : p));
    });

    return () => {
      socket.off("post:new");
      socket.off("post:like");
    };
  }, [socket]);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/forum");
      // Community chat shows newest messages at the bottom
      setPosts(response.data.reverse());
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    startTyping(isAnonymous);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    stopTyping();
    try {
      await api.post("/forum", {
        content: content.trim(),
        isAnonymous
      });
      setContent("");
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isCurrentlyLiked = post.isLiked;
    // Optimistic
    setPosts(prev => prev.map(p =>
      p.id === postId ? {
        ...p,
        isLiked: !isCurrentlyLiked,
        likesCount: isCurrentlyLiked ? Math.max(0, (p.likesCount || 1) - 1) : (p.likesCount || 0) + 1
      } : p
    ));

    try {
      await api.post(`/forum/${postId}/like`);
    } catch (error) {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, isLiked: isCurrentlyLiked, likesCount: post.likesCount } : p
      ));
    }
  };

  const getStatusText = () => {
    if (typingUsers.length === 0) return "Active Sanctuary";
    if (typingUsers.length === 1) {
      const u = typingUsers[0];
      return u.isAnonymous ? "Someone is typing..." : `${u.name} is typing...`;
    }
    return `${typingUsers.length} souls are blooming...`;
  };

  return (
    <div className="flex flex-col h-full bg-[#fefee5] overflow-hidden -m-4 relative">
      {/* Zen Chat Header */}
      {/* <div className={`h-16 ${ZEN.header} px-6 flex items-center justify-between border-b ${ZEN.border} shrink-0 z-20`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 -ml-2 hover:bg-[#506b4a]/5 rounded-full transition-colors lg:hidden">
            <HiOutlineChevronLeft className="text-xl text-[#506b4a]" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8aa179] to-[#b3c4a1] flex items-center justify-center text-white shadow-sm">
            <HiOutlineFaceSmile className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#506b4a] italic leading-none tracking-tight">Ethereal Sanctuary</h3>
          </div>
        </div>
      </div> */}

      {/* Message Feed - WhatsApp Style Bubbles */}
      <div
        className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 custom-scrollbar relative z-10"
        ref={chatContainerRef}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="w-8 h-8 border-3 border-[#506b4a]/10 border-t-[#506b4a] rounded-full animate-spin"></div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {posts.map((post) => {
            const isMe = !post.isAnonymous && post.userId === currentUser?.id;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col gap-1 max-w-[85%] lg:max-w-[70%]">
                  {!isMe && (
                    <span className="text-[9px] font-black text-[#506b4a]/40 uppercase tracking-widest ml-4 mb-0.5 italic">
                      {post.isAnonymous ? "Anonymous soul" : (post.user?.name || "Member")}
                    </span>
                  )}

                  <div className={`relative px-5 py-3 rounded-[24px] ${ZEN.shadow} ${isMe ? ZEN.myBubble + ' rounded-tr-none' : ZEN.otherBubble + ' rounded-tl-none border ' + ZEN.border}`}>
                    <p className="text-sm font-medium leading-relaxed italic pr-8">
                      {post.content}
                    </p>

                    <div className={`flex items-center gap-1.5 justify-end mt-1 opacity-40`}>
                      <span className="text-[8px] font-bold">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <span className="text-[10px]">✓✓</span>}
                    </div>

                    {/* Resonance (Like) Button as Reaction */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`absolute -bottom-3 ${isMe ? '-left-3' : '-right-3'} w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#fefee5] transition-all transform hover:scale-110 shadow-md ${post.isLiked ? 'bg-red-500 text-white' : 'bg-white text-[#506b4a]/20 hover:text-[#506b4a] hover:bg-white/100'}`}
                    >
                      <HiHeart className={`text-[12px] ${post.isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {post.likesCount > 0 && (
                      <div className={`absolute -bottom-3 ${isMe ? 'left-6' : 'right-6'} bg-white px-2 py-0.5 rounded-full border ${ZEN.border} text-[9px] font-black text-[#506b4a] flex items-center gap-1 shadow-sm`}>
                        <span className="text-[10px]">✨</span> {post.likesCount}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Floating Typing Indicator Pop (Subtle) */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-start pt-4"
            >
              <div className="bg-white/60 backdrop-blur-sm border border-[#506b4a]/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-[#506b4a]/40 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-[#506b4a]/40 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1 h-1 bg-[#506b4a]/40 rounded-full animate-bounce delay-300"></span>
                </div>
                <span className="text-[9px] font-bold text-[#506b4a]/40 uppercase tracking-widest italic">{getStatusText()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Input Bed (Glassmorphic) */}
      <div className={`px-6 py-4 bg-white/40 backdrop-blur-lg border-t ${ZEN.border} shrink-0 z-20`}>
        <div className="max-w-5xl mx-auto flex items-end gap-4">

          <div className={`flex-1 min-h-[50px] bg-white ${ZEN.shadow} rounded-[28px] border ${ZEN.border} px-6 py-3 flex flex-col gap-1 transition-all group-focus-within:border-[#506b4a]/20`}>
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[9px] font-black uppercase tracking-widest italic transition-colors ${isAnonymous ? 'text-[#8aa179]' : 'text-[#506b4a]/40'}`}>
                Portal: {isAnonymous ? 'Anonymous Resonance' : 'Soul Identity'}
              </span>
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className="text-[9px] font-black uppercase tracking-widest text-[#506b4a]/60 hover:text-[#506b4a] underline decoration-dotted underline-offset-4"
              >
                Shift Realm
              </button>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Whisper to the sanctuary..."
              className="w-full bg-transparent outline-none text-[#506b4a] text-sm font-medium italic resize-none custom-scrollbar py-1 placeholder:text-[#506b4a]/20"
              style={{ height: `${Math.min(content.split('\n').length * 20 + 24, 120)}px` }}
            />
          </div>

          <button
            onClick={handlePost}
            disabled={!content.trim() || isSubmitting}
            className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all shadow-lg transform active:scale-95 mb-0.5 ${content.trim() ? 'bg-gradient-to-br from-[#8aa179] to-[#b3c4a1] text-white hover:shadow-xl' : 'bg-white text-[#506b4a]/20'}`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <IoSend className={`text-xl ${content.trim() ? '' : 'opacity-50'}`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
