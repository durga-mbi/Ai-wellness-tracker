import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePhone, HiXMark, HiOutlineShieldCheck, HiOutlineExclamationTriangle } from "react-icons/hi2";

const CrisisModal = ({ isOpen, onClose, helplines = [] }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header Section */}
          <div className="bg-red-50 p-8 text-center space-y-4 border-b border-red-100/50">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <HiOutlineExclamationTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-red-600 leading-none">You're Not Alone.</h2>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em]">We've noticed you might be going through a hard time.</p>
            </div>
          </div>

          {/* Helpline List */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] inline-block">Campus Helplines</span>
              <div className="grid gap-3">
                {helplines.length > 0 ? (
                    helplines.map((hp, i) => (
                    <a
                        key={i}
                        href={`tel:${hp.number}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-black transition-all group active:scale-95"
                    >
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black italic uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">{hp.name}</span>
                           <span className="text-sm font-black italic uppercase tracking-tighter">{hp.number}</span>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                           <HiOutlinePhone className="w-5 h-5" />
                        </div>
                    </a>
                    ))
                ) : (
                    <div className="text-center p-4 text-gray-600 italic text-sm">Loading helpline data...</div>
                )}
              </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                   <HiOutlineShieldCheck className="w-5 h-5 text-gray-600 mt-1" />
                   <p className="text-[10px] font-medium text-gray-600 italic leading-relaxed">
                      This is a strictly private and confidential space. These numbers are here for your immediate safety and support. Please reach out.
                   </p>
                </div>

               <button
                onClick={onClose}
                className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
               >
                Dismiss & Stay Safe
               </button>
            </div>
          </div>

          {/* Close Icon Footer */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-600 hover:text-black transition-colors"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CrisisModal;
