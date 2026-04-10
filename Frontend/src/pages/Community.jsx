import React, { useState, useEffect, useRef } from "react";
import {
  HiChatBubbleBottomCenterText,
  HiHeart,
  HiFlag,
  HiPaperAirplane,
  HiUserCircle,
  HiOutlineUserGroup,
  HiFingerPrint,
  HiChevronRight,
} from "react-icons/hi2";
import { HiOutlineAnnotation } from "react-icons/hi";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const Community = () => {
  const { updateLayout } = useLayout();
  const { socket, typingUsers, startTyping, stopTyping } = useSocket();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    updateLayout({
      title: "Community",
      subtitle: "Shared Feed",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("post:new", (newPost) => {
      setPosts(prev => [newPost, ...prev]);
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
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);

    // Typing indicator logic
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

    // Optimistic Update
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
      // Rollback on error
      setPosts(prev => prev.map(p =>
        p.id === postId ? { 
          ...p, 
          isLiked: isCurrentlyLiked,
          likesCount: post.likesCount 
        } : p
      ));
      console.error("Failed to toggle like", error);
    }
  };

  const handleReport = async (postId) => {
    try {
      await api.post(`/forum/${postId}/report`);
    } catch (error) {
      console.error("Failed to report post", error);
    }
  };

  // Derived indicator text
  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
        const u = typingUsers[0];
        return u.isAnonymous ? "A Student is typing..." : `${u.name || 'A Student'} is typing...`;
    }
    const publicCount = typingUsers.filter(u => !u.isAnonymous).length;
    const anonymousCount = typingUsers.length - publicCount;
    
    if (publicCount > 0 && anonymousCount > 0) return `${publicCount} Students & ${anonymousCount} Anonymous are typing...`;
    return `${typingUsers.length} Students are typing...`;
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-4 overflow-hidden relative">
      {/* Feed Header Section */}
      <section className="shrink-0 flex items-center justify-between">
        <div className="space-y-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-0.5 bg-gray-50 rounded-full border border-gray-100 uppercase font-bold text-[8px] tracking-[0.2em] text-black shadow-sm"
          >
            Community Feed
          </motion.div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          {/* Typing Indicator Bar */}
          <div className="flex -space-x-2 overflow-hidden items-center mr-4">
            <AnimatePresence>
              {typingUsers.map((u, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="relative group"
                >
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                    {u.isAnonymous ? (
                      <div className="w-full h-full bg-black flex items-center justify-center text-white">
                        <HiFingerPrint className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <HiUserCircle className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest z-50">
                    {u.isAnonymous ? 'Anonymous' : (u.name || 'Member')}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-4 text-[8px] font-bold text-gray-400 uppercase tracking-widest animate-pulse italic"
                >
                  {getTypingText()}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="text-right border-l border-gray-100 pl-6">
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest italic leading-none">Total Activity</p>
            <p className="text-sm font-bold text-black tracking-tight mt-1">{posts.length} Posts</p>
          </div>
        </div>
      </section>

      {/* Composition Area - Standardized Card */}
      <section className="shrink-0 bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm relative overflow-hidden group hover:border-black/10 transition-all">
        <form onSubmit={handlePost} className="relative z-10 space-y-6">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Share your resonance with the community..."
            className="w-full h-24 p-0 bg-transparent outline-none transition-all font-medium text-lg text-black placeholder:text-gray-400 resize-none italic scrollbar-hide"
          />

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[9px] uppercase tracking-[0.2em] border shadow-sm italic ${isAnonymous ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:text-black hover:border-black'}`}
              >
                <HiFingerPrint className="w-4 h-4" />
                {isAnonymous ? 'Protocol: Anonymous' : 'Protocol: Public'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-10 py-3 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3 group/btn italic"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Deploy Post <HiPaperAirplane className="w-4 h-4 rotate-45 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" /></>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Timeline Feed - No-Scroll Internal */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar min-h-0 pb-10">
        <AnimatePresence mode="popLayout">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-100 p-8 rounded-[32px] group hover:border-black/10 transition-all shadow-sm flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                    {post.isAnonymous ? (
                      <div className="w-full h-full bg-black flex items-center justify-center text-white">
                        <HiFingerPrint className="w-5 h-5" />
                      </div>
                    ) : (
                      <HiUserCircle className="w-8 h-8 text-black" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-none">{post.isAnonymous ? 'Anonymous Member' : (post.user?.name || 'Member')}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleReport(post.id)}
                  className="p-1.5 text-gray-200 hover:text-red-500 transition-colors"
                >
                  <HiFlag className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm font-medium text-black leading-relaxed italic">
                "{post.content}"
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 group/like"
                >
                  <div className={`p-2 rounded-lg transition-all ${post.isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500 group-hover/like:text-black group-hover/like:bg-gray-100'}`}>
                    <HiHeart className={`w-4 h-4 transition-transform group-hover/like:scale-125 ${post.isLiked ? 'fill-current' : ''}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${post.isLiked ? 'text-red-500' : 'text-gray-500 group-hover/like:text-black'}`}>{post.likesCount || 0}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-gray-100 border-t-black rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Synchronizing Feed...</p>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="py-20 text-center border border-dashed border-gray-100 rounded-2xl">
            <p className="text-sm font-bold text-gray-600 uppercase tracking-tighter italic whitespace-pre-line">
              The feed is currently silent. {"\n"} Be the first to share.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
