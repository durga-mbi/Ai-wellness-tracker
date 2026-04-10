import React, { useState } from "react";
import { Link } from "react-router";
import { HiBars3, HiXMark, HiChevronRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = [
        { name: "Features", href: "#features" },
        { name: "Feed", href: "#feed" },
        { name: "Chat", href: "#chat" },
        { name: "Help", href: "#help" },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-100">
            {/* Header Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-black rounded-full"></div>
                            <span className="text-sm font-bold tracking-tight uppercase">Wellness App</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <a key={item.name} href={item.href} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                    {item.name}
                                </a>
                            ))}
                            <Link to="/login" className="px-4 py-1.5 border border-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                Login
                            </Link>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-black">
                                {isMenuOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-4">
                                {navigation.map((item) => (
                                    <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        {item.name}
                                    </a>
                                ))}
                                <Link to="/login" className="block w-full py-2 bg-black text-white text-center rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400"
                    >
                        V.1.0 Hub Release
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-[1.1]"
                    >
                        Simple Tools for <br className="hidden sm:block" /> Mental Well-being.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        A clean and simple app for your mental health. No distractions. Just clarity through simple tools and reflection.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
                    >
                        <Link to="/register" className="w-full sm:w-auto px-10 py-3 bg-black text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
                            Get Started
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-10 py-3 bg-white text-black border border-gray-100 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                            Login
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Smart Silence", desc: "No notification fatigue. Only tools designed for focus.", label: "Focus" },
                            { title: "Daily Routine", desc: "Morning checks, meditation, and simple tracking.", label: "Habits" },
                            { title: "Privacy First", desc: "We don't track you. Your data is yours. Period.", label: "Safety" },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 space-y-4"
                            >
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{feature.label}</span>
                                <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                                <div className="pt-2">
                                    <Link to="/register" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:gap-4 transition-all">
                                        Learn More <HiChevronRight strokeWidth={3} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-50">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <blockquote className="text-xl md:text-2xl font-bold tracking-tight italic leading-relaxed text-black/80">
                        "The best app is the one that lets you put the phone down. This is that app."
                    </blockquote>
                    <footer className="text-[10px] font-bold uppercase tracking-widest text-gray-300">— The Team</footer>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 text-center bg-white">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">© 2026 Wellness Hub. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
