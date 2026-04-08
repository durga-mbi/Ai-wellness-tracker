import React, { useState, useEffect } from "react";
import { 
  HiChatBubbleBottomCenterText, 
  HiHeart, 
  HiFlag, 
  HiPaperAirplane,
  HiUserCircle,
  HiSparkles,
  HiOutlineUserGroup,
  HiFingerPrint
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
      title: "", 
      subtitle: "",
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
      // Standard notification ritual could go here
    } catch (error) {
      console.error("Failed to report post", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-12 lg:space-y-20 pb-20 selection:bg-amber-500/10">
      {/* Social Header Ritual */}
      <section className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.04] backdrop-blur-2xl rounded-full border border-white/5 uppercase font-black text-[9px] tracking-[0.4em] text-amber-500/60 italic shadow-2xl"
        >
          <HiOutlineUserGroup className="w-4 h-4" />
          Collective Pulse
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
           <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                Co-existing <br /> in Stillness.
              </h1>
              <p className="text-lg md:text-xl text-white/30 font-medium italic max-w-xl">
                A shared sanctuary for raw reflections and quiet support. 
                Speak into the infinite.
              </p>
           </div>
           
           <div className="flex items-center gap-10 border-l border-white/5 pl-10 hidden xl:flex">
              <div className="text-right">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-1">Active Souls</p>
                <p className="text-4xl font-black text-amber-500/60 italic tracking-tighter">1,248</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-1">Resonances</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">8.4k</p>
              </div>
           </div>
        </div>
      </section>

      {/* Composition Ritual */}
      <section className="bg-white/[0.02] border border-white/5 p-8 lg:p-14 rounded-[3rem] lg:rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-amber-500/5 blur-[100px] pointer-events-none"></div>
         
         <form onSubmit={handlePost} className="relative z-10 space-y-8 lg:space-y-10">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Release your thought into the collective..."
              className="w-full h-32 lg:h-40 p-0 bg-transparent outline-none transition-all font-medium text-xl lg:text-3xl text-white/80 placeholder:text-white/10 resize-none italic scrollbar-hide"
            />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                   <button 
                     type="button"
                     onClick={() => setIsAnonymous(!isAnonymous)}
                     className={`flex items-center gap-4 px-8 py-4 rounded-full transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 shadow-xl ${isAnonymous ? 'bg-white text-black' : 'bg-white/[0.04] text-white/30 hover:text-white hover:bg-white/[0.08]'}`}
                   >
                      <HiFingerPrint className={`w-5 h-5 ${isAnonymous ? 'text-amber-500' : ''}`} />
                      Identity: {isAnonymous ? 'Veiled' : 'Revealed'}
                   </button>
                   <p className="hidden md:block text-[9px] font-black text-white/10 uppercase tracking-[0.3em] italic">Press Enter to release</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="w-full sm:w-auto px-12 py-5 lg:py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] disabled:opacity-30 flex items-center justify-center gap-4"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>Release Reflection <HiPaperAirplane className="w-5 h-5 rotate-45 transform group-hover:translate-x-1" /></>
                  )}
                </button>
            </div>
         </form>
      </section>

      {/* Timeline Feed */}
      <section className="space-y-10 lg:space-y-14">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-5">
              <HiChatBubbleBottomCenterText className="text-amber-500/60" /> The Collective Wall
           </h3>
           <motion.div 
             animate={{ opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="text-[9px] font-black text-amber-500/40 uppercase tracking-[0.4em] italic"
           >
             Streaming Consciousness
           </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          <AnimatePresence mode="popLayout">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/[0.02] border border-white/5 p-10 lg:p-12 rounded-[3.5rem] lg:rounded-[4rem] group hover:bg-white/[0.04] hover:border-white/10 transition-all backdrop-blur-3xl shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-8 lg:space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-[24px] lg:rounded-[28px] flex items-center justify-center text-3xl sanctuary-glass border border-white/5 relative overflow-hidden group-hover:border-amber-500/30 transition-all ${post.isAnonymous ? 'text-amber-500/60' : 'text-white/40'}`}>
                           <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md"></div>
                           <div className="relative z-10">
                            {post.isAnonymous ? <HiSparkles /> : <HiUserCircle />}
                           </div>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic mb-1">{post.isAnonymous ? 'Veiled Presence' : (post.user?.name || 'Sanctuary Member')}</p>
                           <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic leading-none">
                             {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                    </div>
                    <button 
                      onClick={() => handleReport(post.id)}
                      className="p-3 text-white/10 hover:text-rose-500/60 transition-colors"
                    >
                       <HiFlag className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xl lg:text-3xl font-black text-white/70 leading-[1.3] lg:leading-[1.2] italic tracking-tight select-all">
                    "{post.content}"
                  </p>
                </div>

                 <div className="flex items-center gap-6 pt-10 mt-10 border-t border-white/5">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-4 px-8 py-4 rounded-full bg-white/[0.04] text-white/30 hover:text-white hover:bg-white/[0.08] transition-all font-black text-[11px] uppercase tracking-widest border border-white/5 group/btn"
                    >
                       <HiHeart className={`w-5 h-5 transition-transform group-hover/btn:scale-125 ${post.likes > 0 ? 'fill-amber-500 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]' : ''}`} />
                       <span className="text-white/60">{post.likes || 0}</span>
                       <span className="opacity-40 italic">Resonances</span>
                    </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="py-20 lg:py-32 flex flex-col items-center gap-6 col-span-full">
               <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin shadow-[0_0_30px_rgba(245,158,11,0.2)]"></div>
               <p className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.4em] italic">Attuning to the collective...</p>
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="py-32 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[4rem] col-span-full">
               <p className="text-2xl font-black text-white/20 uppercase tracking-tighter italic">The wall is silent. <br/> Be the first to speak into the infinite.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;
