import React, { useState } from "react";
import { Link } from "react-router";
import { HiBars3, HiXMark, HiChevronRight, HiOutlineArrowSmallRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

    const navigation = [
        { name: "Stats", href: "#stats" },
        { name: "Journal", href: "#journal" },
        { name: "Community", href: "#community" },
        { name: "Features", href: "#features" },
    ];

    const allFeatures = [
        "Daily Journaling", "Mood Tracking", "AI Insights", "Sleep Logs", 
        "Water Tracking", "Exercise Logs", "Community Feed", "AI Chatbot", 
        "Health Charts", "Weekly Score", "Privacy First", "Simple Design",
        "Meditation", "Mental Peace", "University Life", "Social Sync"
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
            {/* Typographic Header */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 h-24 flex items-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-4 group">
                            <img
                              src={logo}
                              alt="Wellness Hub Logo"
                              className="w-12 h-12 object-contain hover:rotate-3 transition-transform"
                            />
                            <div className="flex flex-col">
                               <span className="text-xl font-black tracking-tighter uppercase italic leading-none">Wellness Hub</span>
                               <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Your Daily Peace</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center space-x-10">
                            {navigation.map((item) => (
                                <a key={item.name} href={item.href} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-black transition-all">
                                    {item.name}
                                </a>
                            ))}
                            {user ? (
                              <Link to="/dashboard" className="px-10 py-3.5 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl flex items-center gap-2">
                                  Dashboard <HiOutlineArrowSmallRight className="w-4 h-4" />
                              </Link>
                            ) : (
                              <Link to="/login" className="px-10 py-3.5 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl">
                                  Site Login
                              </Link>
                            )}
                        </div>

                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-black">
                                {isMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-24 left-0 w-full bg-white border-b border-gray-100 md:hidden overflow-hidden"
                        >
                            <div className="px-6 py-10 space-y-6">
                                {navigation.map((item) => (
                                    <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold italic uppercase text-gray-500 hover:text-black">
                                        {item.name}
                                    </a>
                                ))}
                                {user ? (
                                  <Link to="/dashboard" className="block w-full py-4 bg-black text-white text-center rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em]">
                                      Go to Dashboard
                                  </Link>
                                ) : (
                                  <Link to="/login" className="block w-full py-4 bg-black text-white text-center rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em]">
                                      Log In
                                  </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

        <header className="relative pt-60 pb-32 px-6 lg:px-12">
            <div className="max-w-5xl mx-auto text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600"
                >
                    Proactive Mental Health for Students
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="text-7xl md:text-9xl lg:text-[140px] font-black text-black tracking-tighter leading-[0.75] uppercase italic"
                >
                    Track. <br /> Talk. <br /> Thrive.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-[1.4] italic"
                >
                    Managed wellness for the modern student. Track habits, record reflections with AI insights, and find your calm in a busy world—all through a distraction-free interface.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    {user ? (
                      <Link to="/dashboard" className="w-full sm:w-auto px-16 py-6 bg-black text-white rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-3xl shadow-black/10 flex items-center gap-4">
                          Welcome Back, {user.name.split(' ')[0]} <HiOutlineArrowSmallRight className="w-6 h-6" />
                      </Link>
                    ) : (
                      <>
                        <Link to="/register" className="w-full sm:w-auto px-16 py-6 bg-black text-white rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-3xl shadow-black/10">
                            Join Today
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-16 py-6 bg-white text-black border-2 border-black rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all">
                            Log In
                        </Link>
                      </>
                    )}
                </motion.div>
            </div>
        </header>

            {/* Infinite Feature Marquee */}
            <section className="py-12 bg-black overflow-hidden border-y border-black">
                <div className="relative flex overflow-x-hidden">
                    <motion.div
                        className="flex whitespace-nowrap gap-12 items-center py-4"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            duration: 25,
                            ease: "linear"
                        }}
                    >
                        {allFeatures.concat(allFeatures).map((f, i) => (
                            <span key={i} className="text-white text-4xl md:text-6xl font-black italic uppercase tracking-tighter opacity-80 hover:opacity-100 transition-opacity flex items-center gap-12">
                                {f} <span className="w-3 h-3 bg-white rounded-full"></span>
                            </span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Detailed Feature Sections */}
            <section id="stats" className="py-32 px-6 lg:px-12 bg-gray-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em] italic">Step 01</span>
                        <h2 className="text-5xl md:text-7xl font-black text-black italic uppercase tracking-tighter leading-none">Daily <br /> Stats.</h2>
                    </div>
                    <p className="text-lg text-gray-600 font-medium max-w-md italic text-right leading-relaxed">
                       Check your sleep, water, and exercise in seconds. Our daily charts help you see exactly how you're feeling and doing every single day.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { t: "Sleep Tracking", d: "Record your rest cycles to ensure peak recovery each night." },
                        { t: "Water Intake", d: "Stay hydrated with simple daily goal tracking. Never miss a liter." },
                        { t: "Exercise Logs", d: "Track your activity level and see its direct impact on your mood." }
                    ].map((f, i) => (
                        <div key={i} className="bg-white p-12 rounded-[48px] border border-gray-100 space-y-4 hover:border-black transition-all">
                            <h3 className="text-2xl font-black italic uppercase tracking-tight">{f.t}</h3>
                            <p className="text-sm text-gray-600 font-medium italic leading-relaxed">{f.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="journal" className="py-32 px-6 lg:px-12 bg-white">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                   <div className="space-y-8">
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em] italic">Step 02</span>
                       <h2 className="text-6xl lg:text-8xl font-black text-black italic uppercase tracking-tighter leading-[0.85]">AI <br /> Journaling.</h2>
                       <p className="text-xl text-gray-600 font-medium italic leading-relaxed">
                          Write your heart out. Our smart AI gives you honest, helpful insights into your mood and sentiment, helping you find quiet and peace in a busy day.
                       </p>
                       <Link to="/register" className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em] group">
                          Try for Free <HiOutlineArrowSmallRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </Link>
                   </div>
                   <div className="bg-gray-50 rounded-[60px] p-2 aspect-video overflow-hidden border border-gray-100 shadow-inner">
                       <div className="w-full h-full bg-white rounded-[58px] flex flex-col items-center justify-center p-12 text-center">
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 italic">Recent Mood Insight</p>
                           <h4 className="text-3xl font-black italic uppercase italic underline decoration-black decoration-4 underline-offset-8">Perfectly Balanced</h4>
                           <p className="text-sm text-gray-600 mt-8 italic px-12">"Your reflection suggests a high level of mental clarity today. Keep up the consistent habits."</p>
                       </div>
                   </div>
                </div>
            </section>

            <section id="community" className="py-32 px-6 lg:px-12 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto text-center space-y-12">
                   <div className="space-y-4">
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em] italic">Step 03</span>
                       <h2 className="text-7xl lg:text-[120px] font-black text-black italic uppercase tracking-tighter leading-[0.8]">Peer <br /> Support.</h2>
                   </div>
                   <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium italic">
                       Grow with others. Share your wins, ask for help, and join a community that cares about mental health just as much as you do.
                   </p>
                   <div className="flex justify-center pt-8">
                      <Link to="/register" className="px-16 py-6 bg-black text-white rounded-3xl text-sm font-black uppercase tracking-[0.4em] shadow-3xl hover:-translate-y-1 transition-all">
                         Join the Community
                      </Link>
                   </div>
                </div>
            </section>

            {/* Simple Performance Footer */}
            <footer className="py-20 px-6 lg:px-12 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <Link to="/" className="flex items-center gap-6 group">
                        <img
                          src={logo}
                          alt="Wellness Hub Logo"
                          className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all"
                        />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] italic">Wellness Hub © 2026</span>
                    </Link>

                    <div className="flex gap-12">
                        {["Privacy", "Terms", "Help"].map(l => (
                            <a key={l} href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
