import React, { useState, useEffect } from "react";
import { 
  HiChatBubbleBottomCenterText, 
  HiHeart, 
  HiFlag, 
  HiPaperAirplane,
  HiUserCircle,
  HiSparkles
} from "react-icons/hi2";
import api from "../utils/api";
import { useLayout } from "../context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";

const Community = () => {
  const { updateLayout } = useLayout();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateLayout({
      title: "Community Wall",
      subtitle: "Share your thoughts anonymously in our safe sanctuary.",
      onBack: () => window.history.back(),
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
      alert("Thank you for helping keep our community safe.");
    } catch (error) {
      console.error("Failed to report post", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* New Post Card */}
      <section className="sanctuary-card p-10 rounded-[3rem] border border-white/5 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-focus-within:bg-indigo-500/20 transition-all duration-700"></div>
         
         <form onSubmit={handlePost} className="relative z-10 space-y-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share anonymously..."
              className="w-full h-32 p-6 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-bold text-white placeholder:text-slate-500 resize-none"
            />
            
            <div className="flex items-center justify-between gap-4">
               <button 
                 type="button"
                 onClick={() => setIsAnonymous(!isAnonymous)}
                 className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${isAnonymous ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 border border-white/5'}`}
               >
                  <div className={`w-3 h-3 rounded-full border-2 ${isAnonymous ? 'bg-white border-white' : 'border-slate-600'}`}></div>
                  Anonymity: {isAnonymous ? 'ON' : 'OFF'}
               </button>

               <button
                 type="submit"
                 disabled={isSubmitting || !content.trim()}
                 className="px-10 py-4 sanctuary-gradient text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-3"
               >
                 {isSubmitting ? "Posting..." : (
                   <>Post to Wall <HiPaperAirplane className="w-5 h-5 rotate-45" /></>
                 )}
               </button>
            </div>
         </form>
      </section>

      {/* Wall Feed */}
      <section className="space-y-8 pb-12">
        <div className="flex items-center justify-between px-4">
           <h3 className="text-xl font-black text-white flex items-center gap-3">
              <HiChatBubbleBottomCenterText className="text-indigo-500" /> Sanctuary Feed
           </h3>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{posts.length} Thoughts Shared</span>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="sanctuary-card p-10 rounded-[3rem] border border-white/5 group hover:border-indigo-500/30 transition-all shadow-lg"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl sanctuary-glass border border-white/10 ${post.isAnonymous ? 'text-indigo-400' : 'text-teal-400'}`}>
                         {post.isAnonymous ? <HiSparkles /> : <HiUserCircle />}
                      </div>
                      <div>
                         <p className="text-xs font-black text-white uppercase tracking-widest">{post.isAnonymous ? 'Anonymous Member' : (post.user?.name || 'Community Member')}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleReport(post.id)}
                     className="p-3 text-slate-600 hover:text-rose-500 transition-colors"
                     title="Report inappropriate content"
                   >
                      <HiFlag className="w-5 h-5" />
                   </button>
                </div>

                <p className="text-xl font-bold text-slate-200 leading-relaxed mb-8 select-all">
                  "{post.content}"
                </p>

                 <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest"
                    >
                       <HiHeart className={`w-5 h-5 ${post.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                       {post.likes || 0} Vibes
                    </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="py-20 flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-white rounded-full animate-spin"></div>
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Loading the wall...</p>
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="py-20 text-center sanctuary-card rounded-[3rem] border-dashed">
               <p className="text-xl font-black text-slate-500">The wall is empty. Be the first to share a thought.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;
