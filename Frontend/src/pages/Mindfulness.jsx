import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
    HiOutlineSparkles,
    HiOutlineArrowPath,
    HiOutlineClock,
    HiPlay,
    HiPause,
    HiChevronRight,
    HiXMark,
    HiOutlineShieldCheck,
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineInformationCircle,
    HiOutlinePlay
} from "react-icons/hi2";

// ── Design tokens from "The Ethereal Sanctuary" ──────────────────────────────
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
};

const Mindfulness = () => {
    const { user } = useAuth();
    const [breathState, setBreathState] = useState("Inhale"); // Inhale, Hold, Exhale, Hold
    const [timer, setTimer] = useState(4);
    const [isActive, setIsActive] = useState(false);

    // AI Video States
    const [video, setVideo] = useState(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);
    const [syncError, setSyncError] = useState("");

    const syncMoodVideo = async () => {
        setIsLoadingVideo(true);
        setSyncError("");
        try {
            // 1. Fetch current mood from dashboard intelligence
            const moodRes = await api.get(`/dashboard/${user.id}`);
            const currentMood = moodRes.data?.latestMood || "Balanced";

            // 2. Synchronize with AI for a custom ritual video
            const res = await api.post("/mindfulness/video-search", { mood: currentMood });
            if (res.data.success) {
                setVideo(res.data);
            }
        } catch (error) {
            console.error("Neural Sync Failed:", error);
            setSyncError("Failed to synchronize with YouTube neural net.");
        } finally {
            setIsLoadingVideo(false);
        }
    };

    useEffect(() => {
        let interval = null;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timer === 0) {
            // Cycle breathing states
            if (breathState === "Inhale") {
                setBreathState("Hold");
                setTimer(4);
            } else if (breathState === "Hold") {
                setBreathState("Exhale");
                setTimer(4);
            } else if (breathState === "Exhale") {
                setBreathState("Hold "); // Subtly different to trigger effect
                setTimer(4);
            } else {
                setBreathState("Inhale");
                setTimer(4);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timer, breathState]);

    const resources = [
        {
            title: "Progressive Muscle Relaxation",
            desc: "Systematically tense and release muscle groups to achieve deep physical calm.",
            type: "Technique",
            duration: "10 Min",
            icon: <HiOutlineShieldCheck />
        },
        {
            title: "Deep Sleep Visualization",
            desc: "A guided mental journey designed to transition you into a restful state.",
            type: "Guidance",
            duration: "15 Min",
            icon: <HiOutlineMoon />
        },
        {
            title: "Morning Clarity Ritual",
            desc: "Align your focus and energy for the day ahead with light breathing.",
            type: "Ritual",
            duration: "5 Min",
            icon: <HiOutlineSun />
        }
    ];

    return (
        <div className="flex-1 flex flex-col gap-6 sm:gap-8 h-full overflow-y-auto custom-scrollbar px-2 sm:px-4 pb-10">
            {/* Header Identity */}
            <section className="relative p-6 sm:p-10 lg:p-14 bg-white rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] border border-white/40 shadow-sm overflow-hidden shrink-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3 sm:space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm border text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
                            style={{ borderColor: `${C.outline}40`, color: C.primary }}
                        >
                            <HiOutlineSparkles className="animate-pulse" /> Mindful Moment
                        </motion.div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
                            Mindmetrics <span style={{ color: C.primary }}>AI</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* Interactive Breathing Ritual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[40px] sm:rounded-[48px] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] sm:min-h-[550px]"
                >
                    {/* Background Ambient Circle */}
                    <div className="absolute inset-0 z-0 opacity-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px]" style={{ background: C.primary }}></div>
                    </div>

                    <div className="relative z-10 text-center space-y-8 sm:space-y-12 w-full">
                        <div className="relative flex items-center justify-center">
                            {/* The Breathing Circle */}
                            <motion.div
                                animate={{
                                    scale: isActive ? (breathState === "Inhale" ? 1.2 : (breathState === "Exhale" ? 0.9 : (breathState.includes("Hold") ? (breathState === "Hold" ? 1.2 : 0.9) : 1))) : 1,
                                    borderColor: isActive ? C.primary : `${C.outline}40`
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-white flex items-center justify-center border-[8px] sm:border-[12px] shadow-[0_0_80px_rgba(0,0,0,0.05)] relative"
                                style={{ borderColor: `${C.outline}20` }}
                            >
                                <div className="text-center">
                                    <motion.h2
                                        key={breathState}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xl sm:text-2xl font-black uppercase tracking-tighter"
                                        style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {isActive ? breathState.trim() : "Ready?"}
                                    </motion.h2>
                                    <AnimatePresence mode="wait">
                                        {isActive && (
                                            <motion.p
                                                key={timer}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.2 }}
                                                className="text-4xl sm:text-6xl font-extrabold mt-2"
                                                style={{ color: C.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            >
                                                {timer}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Progress Pulse */}
                                {isActive && (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full"
                                        style={{ background: C.primary }}
                                    />
                                )}
                            </motion.div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <p className="text-[9px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                                {isActive ? "Focus on your breathing pattern." : "Box Breathing: A simple 4-step path to calm."}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsActive(!isActive)}
                                className={`
                                    px-10 sm:px-16 py-3 sm:py-5 rounded-full font-bold text-[9px] sm:text-xs uppercase tracking-[0.2em] transition-all shadow-xl
                                    ${isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'text-white'}
                                `}
                                style={{ background: isActive ? '' : C.primary }}
                            >
                                {isActive ? "Halt Ritual" : "Begin Resonance"}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col gap-8 lg:gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/50 backdrop-blur-md rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 space-y-8 border border-white/40 h-fit"
                    >
                        {/* Neural Sync Ritual - Promoted for mobile visibility */}
                        <div className="select-none">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest w-fit shadow-sm"
                                        style={{ background: `${C.primary}10`, color: C.primary }}>
                                        Neural Sync Ritual
                                    </span>
                                    {video && <span className="text-[11px] sm:text-xs font-bold uppercase tracking-tight italic line-clamp-1" style={{ color: C.text }}>{video.title}</span>}
                                </div>
                                <motion.button
                                    whileHover={{ rotate: 180 }}
                                    onClick={syncMoodVideo}
                                    disabled={isLoadingVideo}
                                    className={`p-2 rounded-xl transition-colors ${isLoadingVideo ? 'animate-spin' : ''}`}
                                    style={{ background: `${C.outline}10`, color: C.primary }}
                                >
                                    <HiOutlineSparkles className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <div className="aspect-video bg-gray-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group shadow-inner">
                                {isLoadingVideo ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" style={{ borderTopColor: C.primary }}></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Syncing...</span>
                                    </div>
                                ) : video ? (
                                    <iframe
                                        src={video.url}
                                        className="w-full h-full rounded-2xl"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="text-center px-6">
                                        <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Awaiting Neural Signature</span>
                                        {syncError && <span className="text-[9px] font-bold text-red-400 uppercase">{syncError}</span>}
                                    </div>
                                )}
                            </div>

                            {!video && !isLoadingVideo && (
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={syncMoodVideo}
                                    className="w-full mt-6 py-4 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg flex items-center justify-center gap-3"
                                    style={{ background: C.primary }}
                                >
                                    <HiOutlinePlay className="w-4 h-4" />
                                    Analyze Current State
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Handbook - Moved down on mobile */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/40 backdrop-blur-sm rounded-[32px] p-6 space-y-6 border border-white/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.primary}20`, color: C.primary }}>
                                <HiOutlineInformationCircle className="text-xl" />
                            </div>
                            <h3 className="font-bold uppercase tracking-tight text-lg" style={{ color: C.text }}>Handbook</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm"
                                    style={{ background: C.primary, color: C.onPri }}>01</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-[11px] uppercase tracking-widest" style={{ color: C.text }}>The Origin</h4>
                                    <p className="text-[10px] text-gray-600 font-medium italic opacity-70">Box breathing is a simple method used to help find peace during busy moments.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm"
                                    style={{ background: C.priCont, color: C.primary }}>02</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-[11px] uppercase tracking-widest" style={{ color: C.text }}>Preparation</h4>
                                    <p className="text-[10px] text-gray-600 font-medium italic opacity-70">Focus your visual anchor on the center pulse to reduce cognitive load.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Premium Resource Library */}
            <div className="space-y-10 pt-10">
                <div className="flex items-center gap-8">
                    <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Curated <span style={{ color: C.primary }} className="italic">Fragments</span>
                    </h2>
                    <div className="h-px bg-gray-200/50 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((res, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-white/60 shadow-xl hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#50664a]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[24px] flex items-center justify-center text-2xl sm:text-3xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                                    style={{ background: `${C.primary}10`, color: C.primary }}>
                                    {res.icon}
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 sm:px-3 py-1 rounded-full">{res.duration}</span>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl font-bold tracking-tight" style={{ color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{res.title}</h3>
                                <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wide leading-relaxed h-12 overflow-hidden italic">
                                    {res.desc}
                                </p>

                                <div className="pt-6">
                                    <button 
                                        onClick={() => toast.success("Mindful Fragment is preparing to bloom. Coming soon!", { icon: '🌱' })}
                                        className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all border group-hover:bg-primary group-hover:text-white border-transparent"
                                        style={{ background: `${C.primary}10`, color: C.primary }}>
                                        Engage Fragment
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mindfulness;
