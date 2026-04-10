import React, { useState, useEffect } from "react";
import { 
  HiChatBubbleBottomCenterText, 
  HiHeart, 
  HiFlag, 
  HiPaperAirplane,
  HiUserCircle,
  HiOutlineUserGroup,
  HiFingerPrint,
  HiChevronRight
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const Community = () => {
  const { updateLayout } = useLayout();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateLayout({
      title: "Community", 
      subtitle: "Shared Feed",
      onBack: () => navigate("/dashboard"),
      actions: null
    });
    fetchPosts();
  }, []);

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

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post("/forum", {
        content: content.trim(),
        isAnonymous
      });
      setPosts([response.data, ...posts]);
      setContent("");
    } catch (error) {
       console.error("Failed to create post", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/forum/${postId}/like`);
      setPosts(posts.map(p => p.id === postId ? response.data : p));
    } catch (error) {
       console.error("Failed to like post", error);
    }
  };

  const handleReport = async (postId) => {
    try {
      await api.post(`/forum/${postId}/report`);
    } catch (error) {
      console.error("Failed to report post", error);
    }
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
           <div className="text-right">
             <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic leading-none">Total Posts</p>
             <p className="text-sm font-bold text-black tracking-tight mt-1">{posts.length}</p>
           </div>
        </div>
      </section>

      {/* Composition Area - Compact Legacy */}
      <section className="shrink-0 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
         <form onSubmit={handlePost} className="relative z-10 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts with the community..."
              className="w-full h-20 p-0 bg-transparent outline-none transition-all font-medium text-lg text-black placeholder:text-gray-200 resize-none italic scrollbar-hide"
            />
            
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3">
                   <button 
                     type="button"
                     onClick={() => setIsAnonymous(!isAnonymous)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-[9px] uppercase tracking-widest border shadow-sm ${isAnonymous ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:text-black hover:border-black'}`}
                   >
                      <HiFingerPrint className="w-3.5 h-3.5" />
                      {isAnonymous ? 'Posting as Anonymous' : 'Posting as Me'}
                   </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="px-8 py-2.5 bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md disabled:opacity-30 flex items-center justify-center gap-3 group/btn"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Post <HiPaperAirplane className="w-3.5 h-3.5 rotate-45 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" /></>
                  )}
                </button>
            </div>
         </form>
      </section>

      {/* Timeline Feed - No-Scroll Internal */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar min-h-0">
        <AnimatePresence mode="popLayout">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-100 p-6 rounded-2xl group hover:border-gray-200 transition-all shadow-sm flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
                       {post.isAnonymous ? <HiOutlineUserGroup className="w-5 h-5 text-black" /> : <HiUserCircle className="w-6 h-6 text-black" />}
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-none">{post.isAnonymous ? 'Anonymous Member' : (post.user?.name || 'Member')}</p>
                       <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-1">
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
                   <div className={`p-2 rounded-lg transition-all ${post.likes > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-300 group-hover/like:text-black group-hover/like:bg-gray-100'}`}>
                      <HiHeart className={`w-4 h-4 transition-transform group-hover/like:scale-110 ${post.likes > 0 ? 'fill-current' : ''}`} />
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${post.likes > 0 ? 'text-red-500' : 'text-gray-300 group-hover/like:text-black'}`}>{post.likes || 0}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="py-20 flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-3 border-gray-100 border-t-black rounded-full animate-spin"></div>
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Loading feed...</p>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="py-20 text-center border border-dashed border-gray-100 rounded-2xl">
             <p className="text-sm font-bold text-gray-200 uppercase tracking-tighter italic whitespace-pre-line">
               The feed is currently silent. {"\n"} Be the first to share.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
