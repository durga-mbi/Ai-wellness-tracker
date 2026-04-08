import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBars3BottomRight, HiXMark } from 'react-icons/hi2';

const Header = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <motion.header 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="fixed top-0 inset-x-0 z-[80] px-6 lg:px-12 py-8 flex justify-between items-center pointer-events-auto"
            >
                <div className="flex items-center gap-16">
                    <Link to="/" className="text-sm font-black tracking-[0.5em] italic hover:text-white/70 transition-colors uppercase">
                        Serenity
                    </Link>
                    <nav className="hidden lg:flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
                        <a href="#method" className="hover:text-white transition-colors">The Method</a>
                        <a href="#collective" className="hover:text-white transition-colors">The Collective</a>
                        <a href="#foundation" className="hover:text-white transition-colors">Foundation</a>
                    </nav>
                </div>
                
                <div className="flex items-center gap-4 lg:gap-10">
                    <div className="hidden lg:flex items-center gap-10">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link 
                                    to="/signup"
                                    className="px-8 py-4 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Begin Healing
                                </Link>
                            </>
                        ) : (
                            <Link 
                                to="/dashboard"
                                className="px-8 py-4 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-transform"
                            >
                                Enter Sanctuary
                            </Link>
                        )}
                    </div>

                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 text-white"
                    >
                        <HiOutlineBars3BottomRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#050505]/90 backdrop-blur-2xl flex flex-col p-12 lg:hidden"
                    >
                        <div className="flex justify-between items-center mb-24">
                            <span className="text-[10px] font-black tracking-[0.5em] italic text-white/30 uppercase">Serenity AI</span>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full border border-white/10 text-white"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <nav className="flex flex-col gap-10">
                            {[
                                { name: "The Method", href: "#method" },
                                { name: "The Collective", href: "#collective" },
                                { name: "Foundation", href: "#foundation" }
                            ].map((item, i) => (
                                <motion.a
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-4xl font-black italic tracking-tighter uppercase text-white/60 hover:text-white transition-colors"
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                        </nav>

                        <div className="mt-auto flex flex-col gap-6">
                            {!user ? (
                                <>
                                    <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">Login Account</Link>
                                    <Link 
                                        to="/signup"
                                        className="w-full py-7 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center"
                                    >
                                        Begin Healing
                                    </Link>
                                </>
                            ) : (
                                <Link 
                                    to="/dashboard"
                                    className="w-full py-7 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center"
                                >
                                    Enter Sanctuary
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

const Footer = () => (
    <footer className="relative z-10 bg-[#050505] pt-40 pb-20 px-8 border-t border-white/5 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 lg:col-span-1">
                <h3 className="text-xl font-black italic tracking-tighter mb-8 leading-none italic uppercase">SERENITY AI.</h3>
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 leading-relaxed max-w-[240px]">
                    A high-fidelity wellness ecosystem for the modern spirit.
                </p>
            </div>
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-10">Sanctuary</h4>
                <ul className="flex flex-col gap-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <li className="hover:text-white transition-colors cursor-pointer">Daily Ritual</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Emotional Insight</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Healing Journeys</li>
                </ul>
            </div>
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-10">Collective</h4>
                <ul className="flex flex-col gap-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <li className="hover:text-white transition-colors cursor-pointer">Sanctuary Wall</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Safety Protocol</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Anonymity</li>
                </ul>
            </div>
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-10">Newsletter</h4>
                <div className="flex flex-col gap-8">
                    <div className="relative border-b border-white/10 pb-4 flex justify-between group">
                        <input type="text" placeholder="YOUR EMAIL" className="bg-transparent text-[10px] font-black tracking-[0.2em] outline-none w-full placeholder:text-white/5 focus:placeholder:text-white/20 transition-all uppercase" />
                        <button className="text-[9px] font-black uppercase tracking-[0.3em] text-white cursor-pointer ml-4 hover:scale-110 transition-transform">Join</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 border-t border-white/5 pt-16">
            <div className="flex items-center gap-4 italic opacity-50 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Sanctuary Operational
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
                <span>© 2026 SERENITY AI ARCHITECTURE</span>
            </div>
        </div>
    </footer>
);

const LandingPage = () => {
    const { user } = useAuth();
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    const FRAME_COUNT = 240;
    const currentFrame = (index) => `/assets/organic/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    useEffect(() => {
        let loadedCount = 0;
        const loadedImages = [];
        const preloadImages = () => {
            const indices = Array.from({ length: FRAME_COUNT }, (_, i) => i + 1);
            indices.forEach(i => {
                const img = new Image();
                img.src = currentFrame(i);
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
                    if (loadedCount === FRAME_COUNT) {
                        setImages(loadedImages);
                        setIsLoading(false);
                    }
                };
                loadedImages[i] = img;
            });
        };
        preloadImages();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 40,
        restDelta: 0.0001
    });

    const frameIndex = useTransform(smoothProgress, [0, 1], [1, FRAME_COUNT]);
    
    // Fade out canvas background much later to keep it visible behind the grid
    const canvasOpacity = useTransform(scrollYProgress, [0, 0.92, 0.98], [1, 1, 0]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || isLoading || images.length === 0) return;

        const context = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const MAX_DIMENSION = 2048;

        let animationFrameId;

        const render = () => {
            const index = Math.max(1, Math.min(FRAME_COUNT, Math.floor(frameIndex.get())));
            const img = images[index];
            
            if (img) {
                const winWidth = window.innerWidth;
                const winHeight = window.innerHeight;
                
                let scaledWidth = winWidth * dpr;
                let scaledHeight = winHeight * dpr;
                
                if (scaledWidth > MAX_DIMENSION || scaledHeight > MAX_DIMENSION) {
                    const scaleFactor = Math.min(MAX_DIMENSION / scaledWidth, MAX_DIMENSION / scaledHeight);
                    scaledWidth *= scaleFactor;
                    scaledHeight *= scaleFactor;
                }

                if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
                    canvas.width = scaledWidth;
                    canvas.height = scaledHeight;
                    canvas.style.width = `${winWidth}px`;
                    canvas.style.height = `${winHeight}px`;
                }

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();
                context.scale(scaledWidth / winWidth, scaledHeight / winHeight);

                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';

                const imgRatio = img.width / img.height;
                const winRatio = winWidth / winHeight;
                let drawWidth, drawHeight, offsetX, offsetY;
                const SCALE_BLEED = 1.05; // Zoom in 5% to crop watermarks

                if (winRatio > imgRatio) {
                    drawWidth = winWidth * SCALE_BLEED;
                    drawHeight = (winWidth / imgRatio) * SCALE_BLEED;
                } else {
                    drawHeight = winHeight * SCALE_BLEED;
                    drawWidth = (winHeight * imgRatio) * SCALE_BLEED;
                }

                offsetX = (winWidth - drawWidth) / 2;
                offsetY = (winHeight - drawHeight) / 2;

                context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                context.restore();
            }
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isLoading, images, frameIndex]);

    const opacityHero = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
    const scaleHero = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
    const opacityFeature1 = useTransform(scrollYProgress, [0.15, 0.3, 0.45], [0, 1, 0]);
    const yFeature1 = useTransform(scrollYProgress, [0.15, 0.3], [100, 0]);
    const opacityFeature2 = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0, 1, 0]);
    const yFeature2 = useTransform(scrollYProgress, [0.5, 0.65], [100, 0]);

    const opacityCTA = useTransform(scrollYProgress, [0.9, 0.98], [0, 1]);
    const scaleCTA = useTransform(scrollYProgress, [0.9, 0.98], [0.95, 1]);

    return (
        <div ref={containerRef} className="relative bg-[#050505] text-white selection:bg-white/10 overflow-x-hidden min-h-[500vh]">
            <Header user={user} />

            {/* FIXED Background Canvas Layer */}
            <motion.div 
                style={{ opacity: canvasOpacity }}
                className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
            >
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-70"></div>
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grain-y.com/images/grain-dark.png')]"></div>
            </motion.div>

            {/* Fixed Overlay Layer (Cinematic Depth) */}
            <div className="fixed inset-0 z-50 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.7)_100%)]"></div>
            </div>


            {/* Loading */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center px-10">
                        <div className="w-16 h-16 mb-12 relative">
                            <div className="absolute inset-0 border-[1px] border-white/5 rounded-full"></div>
                            <div className="absolute inset-0 border-t-[1px] border-white/60 rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-2xl font-black tracking-[0.6em] mb-10 italic text-white/80 uppercase">Healing</h2>
                        <div className="w-60 h-[1px] bg-white/5 relative overflow-hidden">
                            <motion.div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${loadProgress}%` }}></motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTENT LAYER: All text flows ABOVE the background */}
            <div className="relative z-10 pointer-events-auto">
                {/* Hero */}
                <section className="h-screen flex flex-col items-center justify-center px-6 lg:px-20 text-center">
                    <motion.div style={{ opacity: opacityHero, scale: scaleHero }}>
                        <span className="inline-block px-5 py-2 lg:px-8 lg:py-3 rounded-full border border-white/5 text-[9px] lg:text-[10px] uppercase font-black tracking-[0.4em] lg:tracking-[0.6em] text-white/30 mb-8 backdrop-blur-3xl">
                            Phase I / Inner Tranquility
                        </span>
                        <h1 className="text-[clamp(2.5rem,14vw,10rem)] font-black tracking-tighter leading-[0.8] mb-12 italic">
                            HEALING <br /> THE SPIRIT.
                        </h1>
                        <p className="text-base lg:text-xl font-medium text-white/40 max-w-3xl mx-auto leading-relaxed">
                            A high-fidelity wellness companion for emotional balance and lasting peace.
                        </p>
                    </motion.div>
                </section>

                {/* Story Point 01 */}
                <section id="method" className="h-[150vh] flex items-center justify-center lg:justify-start px-8 lg:px-40">
                    <motion.div style={{ opacity: opacityFeature1, y: yFeature1 }} className="max-w-2xl text-center lg:text-left sticky top-1/2 -translate-y-1/2">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">01 / Perception</span>
                        <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-10 italic leading-tight uppercase">GENTLE <br /> AWARENESS.</h2>
                        <p className="text-white/40 text-lg lg:text-xl font-medium leading-relaxed italic">
                            Identifying subtle rhythms in your well-being.
                        </p>
                    </motion.div>
                </section>

                {/* Story Point 02 */}
                <section id="collective" className="h-[150vh] flex items-center justify-center lg:justify-end px-8 lg:px-40 text-center lg:text-right">
                    <motion.div style={{ opacity: opacityFeature2, y: yFeature2 }} className="max-w-2xl sticky top-1/2 -translate-y-1/2">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">02 / Presence</span>
                        <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-10 italic leading-tight uppercase">EMOTIONAL <br /> HARMONY.</h2>
                        <p className="text-white/40 text-lg lg:text-xl font-medium leading-relaxed italic">
                            Transforming every thought into a path for growth.
                        </p>
                    </motion.div>
                </section>

                {/* Foundation Grid */}
                <section id="foundation" className="min-h-screen pt-40 pb-20 px-8 lg:px-20 relative">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl lg:text-8xl font-black tracking-tighter italic uppercase mb-32 drop-shadow-2xl">Built for <br /> Your Healing.</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[
                                { title: "Journaling", desc: "A sacred space for your private reflections." },
                                { title: "Collective", desc: "An anonymous wall for shared healing." },
                                { title: "Mood Path", desc: "A visual archive of your journey." }
                            ].map((item, i) => (
                                <motion.div key={i} className="p-12 lg:p-16 min-h-[400px] border border-white/10 rounded-[40px] bg-white/[0.04] backdrop-blur-3xl flex flex-col justify-end group transition-all shadow-2xl">
                                    <h3 className="text-3xl lg:text-4xl font-black italic mb-8 uppercase drop-shadow-md">{item.title}</h3>
                                    <p className="text-[11px] lg:text-[13px] font-black uppercase tracking-[0.3em] text-white/40">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="h-screen flex items-center justify-center px-8 relative">
                    <motion.div style={{ opacity: opacityCTA, scale: scaleCTA }} className="text-center relative z-10 w-full text-white">
                        <h2 className="text-[clamp(2.5rem,12vw,9rem)] font-black tracking-tighter leading-[0.8] mb-20 italic uppercase drop-shadow-2xl">RECLAIM YOUR <br /> SANCTUARY.</h2>
                        <Link to="/signup" className="px-12 lg:px-20 py-8 lg:py-10 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.6em] hover:scale-110 active:scale-95 shadow-2xl transition-transform">
                            Begin Healing
                        </Link>
                    </motion.div>
                </section>

                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
