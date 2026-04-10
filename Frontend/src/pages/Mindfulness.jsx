import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineShieldCheck, HiOutlineMoon, HiOutlineSun, HiOutlineSparkles, HiOutlineInformationCircle, HiOutlinePlay } from "react-icons/hi2";

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
                // Determine if it was the first or second hold
                // Actually in 4-4-4-4 box breathing, it's simpler:
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
        <div className="space-y-12 pb-20">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        <HiOutlineSparkles className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] italic">Mindfulness Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-black">
                        Sanctuary <span className="text-gray-300">Space</span>
                    </h1>
                </div>
                <div className="bg-gray-50 px-6 py-4 rounded-[24px] border border-gray-100 hidden lg:block">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
                        Sync your neural rhythm with interactive breathing rituals.
                    </p>
                </div>
            </div>

            {/* Interactive Breathing Ritual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
                    {/* Background Ambient Circle */}
                    <div className="absolute inset-0 z-0 opacity-5">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-black rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative z-10 text-center space-y-12 w-full">
                        <div className="relative flex items-center justify-center">
                            {/* The Breathing Circle */}
                            <motion.div
                                animate={{
                                    scale: isActive ? (breathState === "Inhale" ? 1.5 : (breathState === "Exhale" ? 1 : (breathState.includes("Hold") ? (breathState === "Hold" ? 1.5 : 1) : 1))) : 1,
                                    opacity: isActive ? (breathState === "Inhale" ? 1 : 0.6) : 0.4
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-black flex items-center justify-center border-[8px] border-gray-100 shadow-[0_0_80px_rgba(0,0,0,0.05)]"
                            >
                                <div className="text-center">
                                    <motion.h2
                                        key={breathState}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-white text-3xl font-black italic uppercase tracking-tighter"
                                    >
                                        {isActive ? breathState.trim() : "Ready?"}
                                    </motion.h2>
                                    <AnimatePresence mode="wait">
                                        {isActive && (
                                            <motion.p
                                                key={timer}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="text-white/50 text-6xl font-black mt-2"
                                            >
                                                {timer}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] max-w-xs mx-auto">
                                {isActive ? "Follow the rhythm to regulate your nervous system." : "Box Breathing: Inhale 4, Hold 4, Exhale 4, Hold 4."}
                            </p>

                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`
                                    px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all
                                    ${isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-black text-white hover:bg-gray-800 shadow-xl scale-105'}
                                `}
                            >
                                {isActive ? "Stop Ritual" : "Begin Breathing"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 flex flex-col">
                    <div className="bg-gray-50 rounded-[40px] p-8 space-y-6 flex-1 border border-gray-100">
                        <div className="flex items-center gap-3 ml-2">
                            <HiOutlineInformationCircle className="text-gray-400 text-xl" />
                            <h3 className="font-black italic uppercase tracking-tighter text-xl">Technique Guide</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 group">
                                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black flex-shrink-0 group-hover:scale-110 transition-transform">01</div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-[12px] uppercase tracking-widest">Identify Context</h4>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Box breathing is a powerful technique used by special forces to achieve rapid focus and calm under pressure.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center font-black flex-shrink-0 group-hover:scale-110 transition-transform">02</div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-[12px] uppercase tracking-widest text-gray-400">Preparation</h4>
                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Lower your gaze or close your eyes. Ensure your spine is neutral and your airway is clear.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="bg-white p-6 rounded-[24px] border border-gray-200 select-none">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500 w-fit">Mood-Sync Ritual</span>
                                        {video && <span className="text-[9px] font-bold text-black uppercase mt-1 italic tracking-tighter line-clamp-1">{video.title}</span>}
                                    </div>
                                    <button
                                        onClick={syncMoodVideo}
                                        disabled={isLoadingVideo}
                                        className={`text-gray-300 hover:text-black transition-colors ${isLoadingVideo ? 'animate-spin' : ''}`}
                                    >
                                        <HiOutlineSparkles className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="aspect-video bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                                    {isLoadingVideo ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Syncing Neural Net...</span>
                                        </div>
                                    ) : video ? (
                                        <iframe
                                            src={video.url}
                                            className="w-full h-full rounded-xl"
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <>
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Awaiting Neural Signature</span>
                                            {syncError && <span className="absolute bottom-4 text-[7px] font-black text-red-400 uppercase">{syncError}</span>}
                                        </>
                                    )}
                                </div>
                                {!video && !isLoadingVideo && (
                                    <button
                                        onClick={syncMoodVideo}
                                        className="w-full mt-4 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <HiOutlinePlay className="w-3 h-3" />
                                        Analyze & Find Ritual
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resource Library Card Grid */}
            <div className="space-y-8 pt-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Curated <span className="text-gray-300">Resources</span></h2>
                    <div className="h-px bg-gray-100 flex-1 mx-10 hidden md:block"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((res, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-lg hover:shadow-2xl transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-black flex items-center justify-center text-2xl group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    {res.icon}
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{res.duration}</span>
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{res.title}</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-6 h-12 overflow-hidden">
                                {res.desc}
                            </p>
                            <button className="w-full py-4 text-[9px] font-black uppercase tracking-[0.3em] border border-gray-100 rounded-full group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                                Open Practice
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mindfulness;
