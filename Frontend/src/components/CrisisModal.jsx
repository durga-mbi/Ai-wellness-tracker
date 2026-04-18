import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePhone,
  HiXMark,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineHeart
} from "react-icons/hi2";

const CrisisModal = ({ isOpen, onClose, helplines = [], personalContacts = [] }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center 
                      p-3 sm:p-4 md:p-6 
                      bg-[#373a1c]/20 backdrop-blur-xl">

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative w-full 
                     max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl
                     max-h-[90vh] overflow-y-auto
                     bg-white rounded-2xl sm:rounded-[40px] md:rounded-[56px]
                     shadow-2xl border border-white"
        >

          {/* Header */}
          <div className="bg-[#fff1f1] 
                          p-5 sm:p-6 md:p-8 lg:p-10 
                          text-center space-y-4 sm:space-y-6 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/40 blur-3xl rounded-full"></div>

            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                         bg-white rounded-2xl sm:rounded-3xl 
                         flex items-center justify-center mx-auto 
                         text-red-500 shadow-lg"
            >
              <HiOutlineExclamationTriangle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </motion.div>

            <div className="space-y-2 sm:space-y-3 relative z-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                             font-extrabold tracking-tight text-[#c53030]">
                You're Not Alone.
              </h2>

              <p className="text-[9px] sm:text-[10px] md:text-xs 
                            font-bold text-red-600/60 uppercase 
                            tracking-[0.2em] sm:tracking-[0.3em] 
                            max-w-xs mx-auto leading-relaxed">
                A gentle reminder that support is always within reach for you.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">

            {/* Personal Emergency Contacts (If any) */}
             {personalContacts.length > 0 && (
               <div className="space-y-4">
                 <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
                   <HiOutlineShieldCheck className="text-emerald-500 text-sm sm:text-base" />
                   <span className="text-[9px] sm:text-[10px] font-bold text-[#636745] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                     Your Trusted Emergency Contacts
                   </span>
                 </div>
                 <div className="grid gap-3 sm:gap-4">
                   {personalContacts.map((pc, i) => (
                     <motion.a
                       key={`pc-${i}`}
                       href={`tel:${pc.number}`}
                       whileHover={{ x: 4, scale: 1.01 }}
                       className="flex items-center justify-between p-4 sm:p-5 md:p-6 bg-emerald-50/50 rounded-2xl sm:rounded-[28px] border border-emerald-100 shadow-sm transition-all group active:scale-[0.98]"
                     >
                       <div className="flex flex-col">
                         <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600/60 mb-1">
                           {pc.name}
                         </span>
                         <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-[#373a1c]">
                           {pc.number}
                         </span>
                       </div>
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl shadow flex items-center justify-center text-white group-hover:bg-emerald-600 transition-all">
                         <HiOutlinePhone className="w-4 h-4 sm:w-5 sm:h-5" />
                       </div>
                     </motion.a>
                   ))}
                 </div>
               </div>
             )}
 
             {/* Title */}
             <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
               <HiOutlineHeart className="text-red-400 text-sm sm:text-base" />
               <span className="text-[9px] sm:text-[10px] font-bold text-[#636745] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                 Mindmetrics AI Support Lines
               </span>
             </div>

            {/* Helpline List */}
            <div className="grid gap-3 sm:gap-4">
              {helplines.length > 0 ? (
                helplines.map((hp, i) => (
                  <motion.a
                    key={i}
                    href={`tel:${hp.number}`}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between 
                               p-4 sm:p-5 md:p-6 
                               bg-[#f4f6d2]/30 
                               rounded-2xl sm:rounded-[28px] md:rounded-[32px] 
                               border border-white shadow-sm 
                               transition-all group active:scale-[0.98]"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-[#636745]/60 mb-1">
                        {hp.name}
                      </span>

                      <span className="text-base sm:text-lg md:text-xl 
                                       font-extrabold tracking-tight text-[#373a1c]">
                        {hp.number}
                      </span>
                    </div>

                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
                                    bg-white rounded-xl sm:rounded-2xl 
                                    shadow flex items-center justify-center 
                                    text-[#506b4a] 
                                    group-hover:bg-[#506b4a] 
                                    group-hover:text-white transition-all">
                      <HiOutlinePhone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  </motion.a>
                ))
              ) : (
                <div className="text-center p-6 text-[#636745] italic opacity-60 text-sm">
                  Gathering support data...
                </div>
              )}
            </div>

            {/* Info + Button */}
            <div className="space-y-6 sm:space-y-8">

              <div className="flex items-start gap-3 sm:gap-4 
                              p-4 sm:p-5 md:p-6 
                              bg-[#fefee5] 
                              rounded-2xl sm:rounded-[28px] md:rounded-[32px] 
                              border border-dashed border-[#b9bc94]/40">

                <HiOutlineShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#506b4a] mt-1" />

                <p className="text-[10px] sm:text-[11px] md:text-xs 
                              font-medium text-[#373a1c] italic leading-relaxed">
                  This is a strictly private and confidential space. These numbers are here for your immediate safety and professional support. You are cared for.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 sm:py-4 md:py-5 lg:py-6 
                           bg-[#373a1c] text-white 
                           rounded-xl sm:rounded-2xl md:rounded-[32px] 
                           text-[10px] sm:text-[11px] 
                           font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] 
                           shadow-xl"
              >
                Return to Home
              </motion.button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 md:top-8 md:right-8 
                       p-2 sm:p-3 
                       text-[#373a1c]/40 hover:text-red-500 
                       bg-white/30 backdrop-blur-md 
                       rounded-full"
          >
            <HiXMark className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CrisisModal;