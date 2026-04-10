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
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-8 overflow-hidden relative selection:bg-gray-100">
      {/* 3D Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,#ffffff_100%)] opacity-60"></div>
        <motion.div 
          style={{ x: translateX, y: translateY, opacity: 0.1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-100 blur-[150px] rounded-full"
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
          className="w-32 h-32 lg:w-48 lg:h-48 rounded-[3rem] bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center text-6xl lg:text-8xl text-black relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent"></div>
          <HiOutlineCubeTransparent className="relative z-10 animate-spin-slow" />
        </motion.div>

        {/* 404 Text */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10rem] md:text-[15rem] lg:text-[20rem] font-black italic tracking-tighter leading-none text-gray-50 select-none"
          >
            404
          </motion.h1>
          <div className="relative -mt-10 lg:-mt-20">
             <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter uppercase text-black mb-6">
                Page Not <br/> Found.
             </h2>
             <p className="text-sm md:text-base lg:text-xl text-gray-400 font-medium italic max-w-md mx-auto leading-relaxed uppercase tracking-widest px-6">
                The page you seek does not exist. Let's go back home.
             </p>
          </div>
        </div>

        {/* Return Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="group relative flex items-center gap-4 px-12 py-6 bg-black text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden shadow-xl transition-all"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
          Back to Home
        </motion.button>
      </motion.div>

      {/* Floating Particles */}
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
          className="absolute w-1 h-1 bg-gray-200 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

export default NotFound;
