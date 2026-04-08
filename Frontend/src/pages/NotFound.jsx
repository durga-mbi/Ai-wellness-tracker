import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router";
import { HiArrowLeft, HiOutlineCubeTransparent } from "react-icons/hi2";

const NotFound = () => {
  const navigate = useNavigate();
  
  // Parallax effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the parallax
  const springConfig = { stiffness: 100, damping: 30 };
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-50, 50]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-50, 50]), springConfig);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8 overflow-hidden relative selection:bg-amber-500/10">
      {/* 3D Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,#050505_100%)] opacity-60"></div>
        <motion.div 
          style={{ x: translateX, y: translateY, opacity: 0.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/20 blur-[150px] rounded-full"
        ></motion.div>
      </div>

      {/* Main 404 Canvas */}
      <motion.div 
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="relative z-10 flex flex-col items-center text-center space-y-12"
      >
        {/* Floating 3D Cube Icon */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotateZ: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-32 h-32 lg:w-48 lg:h-48 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex items-center justify-center text-6xl lg:text-8xl text-amber-500/40 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
          <HiOutlineCubeTransparent className="relative z-10 animate-spin-slow" />
        </motion.div>

        {/* 404 Text Ritual */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10rem] md:text-[15rem] lg:text-[20rem] font-black italic tracking-tighter leading-none text-white/5 select-none"
          >
            404
          </motion.h1>
          <div className="relative -mt-10 lg:-mt-20">
             <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter uppercase text-white mb-6">
                Lost in <br/> Silence.
             </h2>
             <p className="text-sm md:text-base lg:text-xl text-white/30 font-medium italic max-w-md mx-auto leading-relaxed uppercase tracking-widest px-6">
                The path you seek has dissolved into the infinite. Let us return to your sanctuary.
             </p>
          </div>
        </div>

        {/* Return Ritual CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="group relative flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all"
        >
          <div className="absolute inset-0 bg-amber-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
          Return to Center
        </motion.button>
      </motion.div>

      {/* Floating Debris (Dust particles) */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: Math.random() * 2000 - 1000, y: Math.random() * 2000 - 1000 }}
          animate={{ 
            x: Math.random() * 2000 - 1000, 
            y: Math.random() * 2000 - 1000,
            opacity: [0, 0.4, 0]
          }}
          transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

export default NotFound;
