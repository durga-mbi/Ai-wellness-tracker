import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePhone, HiXMark, HiOutlineShieldCheck, HiOutlineExclamationTriangle, HiOutlineHeart } from "react-icons/hi2";

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
  rose: "#fff5f5",
  roseDeep: "#f87171"
};

const CrisisModal = ({ isOpen, onClose, helplines = [] }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#373a1c]/20 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="bg-white w-full max-w-lg rounded-[56px] shadow-2xl overflow-hidden border border-white relative"
        >
          {/* Header Section - Supportive Tone */}
          <div className="bg-[#fff1f1] p-10 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl rounded-full"></div>
            
            <motion.div 
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 3 }}
               className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-red-500 shadow-xl shadow-red-200/50"
            >
              <HiOutlineExclamationTriangle className="w-10 h-10" />
            </motion.div>
            
            <div className="space-y-3 relative z-10">
              <h2 className="text-4xl font-extrabold tracking-tight text-[#c53030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                You're Not Alone.
              </h2>
              <p className="text-[11px] font-bold text-red-600/60 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                A gentle reminder that support is always within reach for you.
              </p>
            </div>
          </div>

          {/* Helpline List - High Fidelity */}
          <div className="p-10 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <HiOutlineHeart className="text-red-400" />
                <span className="text-[10px] font-bold text-[#636745] uppercase tracking-[0.3em]">Sanctuary Support Lines</span>
              </div>
              
              <div className="grid gap-4">
                {helplines.length > 0 ? (
                    helplines.map((hp, i) => (
                    <motion.a
                        key={i}
                        href={`tel:${hp.number}`}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-6 bg-[#f4f6d2]/30 rounded-[32px] border border-white shadow-sm transition-all group hover:bg-[#f4f6d2]/50 active:scale-[0.98]"
                    >
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#636745]/60 mb-1">{hp.name}</span>
                           <span className="text-xl font-extrabold tracking-tight text-[#373a1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                             {hp.number}
                           </span>
                        </div>
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#506b4a] group-hover:bg-[#506b4a] group-hover:text-white transition-all duration-500">
                           <HiOutlinePhone className="w-6 h-6" />
                        </div>
                    </motion.a>
                    ))
                ) : (
                    <div className="text-center p-8 text-[#636745] italic opacity-60">Gathering support data...</div>
                )}
              </div>
            </div>

            <div className="space-y-8 mt-10">
                <div className="flex items-start gap-4 p-6 bg-[#fefee5] rounded-[32px] border border-dashed border-[#b9bc94]/40">
                   <HiOutlineShieldCheck className="w-6 h-6 text-[#506b4a] mt-0.5" />
                   <p className="text-[11px] font-medium text-[#373a1c] italic leading-[1.7]">
                      This is a strictly private and confidential space. These numbers are here for your immediate safety and professional support. You are cared for.
                   </p>
                </div>

               <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-6 bg-[#373a1c] text-white rounded-[32px] text-[11px] font-bold uppercase tracking-[0.4em] transition-all shadow-2xl shadow-[#373a1c]/20"
               >
                Return to Sanctuary
               </motion.button>
            </div>
          </div>

          {/* Close Icon */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 text-[#373a1c]/40 hover:text-red-500 transition-colors bg-white/20 backdrop-blur-md rounded-full"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CrisisModal;
