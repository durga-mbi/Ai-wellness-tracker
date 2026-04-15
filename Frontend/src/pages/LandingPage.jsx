import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  HiOutlinePencilSquare, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineCalendarDays, 
  HiOutlineChartBar, 
  HiOutlineShieldCheck, 
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineUserGroup,
  HiOutlineArrowTrendingUp,
  HiOutlineCheckBadge,
  HiOutlineSparkles as HiSparklesIcon,
  HiOutlineArrowRight,
  HiOutlineBars3,
  HiXMark
} from "react-icons/hi2";
import logo from "../assets/logo.png";

// ── Design tokens from Stitch project "The Ethereal Sanctuary" ──────────────
const C = {
  bg:       "#fefee5",
  surface:  "#f4f6d2",
  card:     "#ffffff",
  primary:  "#506b4a",
  priCont:  "#ccebc2",
  onPri:    "#ffffff",
  text:     "#373a1c",
  textMut:  "#636745",
  outline:  "#b9bc94",
};

// Reusable pill badge
const Badge = ({ children }) => (
  <span
    style={{ background: C.priCont, color: C.primary }}
    className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
  >
    {children}
  </span>
);

// Feature card - Clean, icon-focused, premium
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="relative overflow-hidden rounded-[32px] group cursor-default min-h-[220px] sm:min-h-[260px] flex flex-col justify-start p-8 sm:p-10 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px] border"
       style={{ background: C.card, borderColor: `${C.outline}20` }}>
    {/* Subtle Background Icon Blob */}
    <div className="absolute -right-6 -top-6 text-[120px] opacity-[0.03] rotate-12 transition-transform duration-700 group-hover:rotate-0"
         style={{ color: C.primary }}>
      <Icon />
    </div>
    
    <div className="relative z-10 space-y-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border transition-all duration-500 group-hover:scale-110"
           style={{ background: `${C.primary}10`, color: C.primary, borderColor: `${C.primary}20` }}>
        <Icon />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-xl tracking-tight" style={{ color: C.text }}>{title}</h3>
        <p className="text-sm font-medium leading-relaxed" style={{ color: C.textMut }}>{description}</p>
      </div>
    </div>
  </div>
);

// Step card ("Your Path to Clarity")
const StepCard = ({ icon, title, description, accent }) => (
  <div className="flex flex-col items-center text-center gap-4">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-md"
      style={{ background: C.priCont }}
    >
      {icon}
    </div>
    <h4 className="font-bold text-base" style={{ color: C.text }}>{title}</h4>
    <p className="text-sm leading-relaxed" style={{ color: C.textMut }}>{description}</p>
  </div>
);

// Testimonial card
const TestimonialCard = ({ quote, name, role }) => (
  <div
    className="rounded-3xl p-8 flex flex-col gap-5 shadow-sm"
    style={{ background: C.card }}
  >
    {/* Stars */}
    <div className="flex gap-1 text-yellow-400 text-sm">★★★★★</div>
    <p className="text-sm leading-relaxed italic" style={{ color: C.textMut }}>"{quote}"</p>
    <div>
      <p className="font-bold text-sm" style={{ color: C.text }}>{name}</p>
      <p className="text-xs" style={{ color: C.textMut }}>{role}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how" },
    { label: "Community", href: "#community" },
    { label: "Resources", href: "#resources" },
  ];

  const features = [
    {
      icon: HiOutlinePencilSquare,
      title: "Smart Journaling",
      description: "Write freely. Our AI gently analyzes your tone to help you identify underlying patterns in your thoughts.",
    },
    {
      icon: HiOutlineChatBubbleLeftRight,
      title: "Anonymous Peer Support",
      description: "Connect with fellow students who understand your journey, all while keeping your identity private and safe.",
    },
    {
      icon: HiOutlineCalendarDays,
      title: "Mood Heatmap Calendar",
      description: "Visualize your emotional landscape over time. Spot trends and celebrate the bright days in your history.",
    },
    {
      icon: HiOutlineChartBar,
      title: "Habit & Mood Insights",
      description: "See how your sleep, study, and social habits correlate with your mental state with clear, easy insights.",
    },
    {
      icon: HiOutlineShieldCheck,
      title: "Crisis Detection",
      description: "Real-time support that recognizes when you're overwhelmed and offers immediate, gentle resources to help.",
    },
    {
      icon: HiOutlineSparkles,
      title: "Personalized Mindfulness",
      description: "Daily exercises, meditations, and breathing techniques tailored to your current emotional state.",
    },
  ];

  const steps = [
    { icon: <HiOutlineHeart />, title: "Open Your Heart", description: "Write your thoughts or select your current mood blob." },
    { icon: <HiSparklesIcon />, title: "Smart Review", description: "Our AI helps you see patterns and shifts in your emotions." },
    { icon: <HiOutlineUserGroup />, title: "Get Support", description: "Receive simple exercises or connect with peer groups." },
    { icon: <HiOutlineArrowTrendingUp />, title: "Grow Over Time", description: "Track your progress and build emotional resilience." },
  ];

  const testimonials = [
    {
      quote: "Finals week used to break me. Now, I have a place to dump my anxiety and get actionable advice that actually works.",
      name: "Alex M.",
      role: "Sophomore, Arts",
    },
    {
      quote: "The anonymity in the peer support groups made it so much easier for me to open up about my struggle with burnout.",
      name: "Sarah K.",
      role: "Junior, Biology",
    },
    {
      quote: "Seeing my mood history as a heatmap really helped me realize that my bad days are just temporary phases.",
      name: "Jamie L.",
      role: "Freshman, Engineering",
    },
  ];

  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden"
      style={{ background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Google Fonts ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ══════════════════════════ NAVBAR ══════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(254,254,229,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.outline}30` }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Mindmetrics AI" className="w-8 h-8 object-contain" />
            <span
              className="font-bold text-xl tracking-tighter"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
            >
              Mindmetrics AI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: C.textMut }}
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri }}
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri }}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: C.surface }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiXMark className="text-xl" /> : <HiOutlineBars3 className="text-xl" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
              style={{ background: C.bg, borderTop: `1px solid ${C.outline}40` }}
            >
              <div className="px-6 py-6 space-y-4">
                {navLinks.map((l) => (
                  <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="block text-base font-medium" style={{ color: C.textMut }}>
                    {l.label}
                  </a>
                ))}
                {user ? (
                  <Link to="/dashboard" className="block text-center py-3 rounded-full font-semibold text-sm" style={{ background: C.primary, color: C.onPri }}>
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/login" className="block text-center py-3 rounded-full font-semibold text-sm" style={{ background: C.primary, color: C.onPri }}>
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <header className="pt-32 pb-20 px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
          >
            <Badge>AI-Driven Mental Wellness</Badge>

            <h1
              className="text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
            >
              Your Gentle Space for{" "}
              <em className="not-italic" style={{ color: C.primary }}>
                Mental Wellness
              </em>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 font-medium" style={{ color: C.textMut }}>
              Navigate university life with an AI-driven sanctuary. Private journaling, sentiment insights,
              and peer support designed specifically for students.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 shadow-md text-center"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri }}
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 shadow-md text-center"
                    style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri }}
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3.5 rounded-full font-semibold text-sm border text-center transition-colors hover:opacity-70"
                    style={{ borderColor: C.outline, color: C.text }}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Social proof chips */}
            <div className="flex flex-wrap gap-6 pt-2">
              {["🔒 100% Private", "🤖 AI-Powered", "🌱 Free to Start"].map((chip) => (
                <span key={chip} className="text-sm font-medium" style={{ color: C.textMut }}>
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex justify-center"
          >
            <div
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-xl"
              style={{ background: "#a8c6a0" }}
            >
              <img
                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&q=80"
                alt="Student journaling for mental wellness"
                className="w-full h-80 lg:h-96 object-cover mix-blend-multiply opacity-90"
              />
            </div>
            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-6 left-0 rounded-2xl px-5 py-4 shadow-lg"
              style={{ background: C.card }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.primary }}>This week</p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-2xl font-bold" style={{ color: C.text }}>87%</p>
                  <p className="text-[11px]" style={{ color: C.textMut }}>Mood Score</p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div>
                  <p className="text-2xl font-bold" style={{ color: C.text }}>12</p>
                  <p className="text-[11px]" style={{ color: C.textMut }}>Entries</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trusted by strip */}
        <div className="mt-16 flex flex-wrap items-center gap-8 justify-center md:justify-start">
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: C.outline }}>
            Trusted by students from
          </span>
          {["MIT", "Stanford", "Oxford", "NUS", "IIT"].map((uni) => (
            <span key={uni} className="text-sm font-bold" style={{ color: C.textMut }}>
              {uni}
            </span>
          ))}
        </div>
      </header>

      {/* ══════════════════════════ FEATURES ══════════════════════════ */}
      <section id="features" className="py-24 px-6 lg:px-10" style={{ background: C.surface }}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Badge>Features</Badge>
            <h2
              className="text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
            >
              A calmer way to understand yourself
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: C.textMut }}>
              Intelligent tools designed to provide clarity and comfort without the noise.
            </p>
          </div>

          {/* Grid: 3 cols desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ HOW IT WORKS ══════════════════════════ */}
      <section id="how" className="py-24 px-6 lg:px-10" style={{ background: C.bg }}>
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <Badge>How it Works</Badge>
            <h2
              className="text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
            >
              Your Path to Clarity
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((s, i) => (
              <div key={s.title}>
                <StepCard {...s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TESTIMONIALS ══════════════════════════ */}
      <section id="community" className="py-24 px-6 lg:px-10" style={{ background: C.surface }}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Badge>Community</Badge>
            <h2
              className="text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
            >
              Voices of Mindmetrics AI
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: C.textMut }}>
              Hear from students who found their space for reflection and found their way back to calm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name}>
                <TestimonialCard {...t} />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-block px-10 py-4 rounded-full font-semibold text-sm shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri }}
              >
                Go to My Dashboard →
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block px-10 py-4 rounded-full font-semibold text-sm shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri }}
              >
                Join the Community Free →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ══════════════════════════ */}
      <footer
        className="py-14 px-6 lg:px-10"
        style={{ background: C.bg, borderTop: `1px solid ${C.outline}40` }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Mindmetrics AI" className="w-8 h-8 object-contain" />
              <span
                className="font-bold text-xl tracking-tighter"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
              >
                Mindmetrics AI
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed mb-6" style={{ color: C.textMut }}>
              Your weightless archive for mental clarity. © 2024 Mindmetrics AI.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            {[
              { 
                heading: "Product", 
                links: [
                  { name: "Features", href: "#features" },
                  { name: "How it Works", href: "#how" }, 
                  { name: "Community", href: "#community" },
                  { name: "Resources", href: "#features" }
                ] 
              },
              { 
                heading: "Legal", 
                links: [
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" },
                  { name: "Crisis Resources", href: "#" }
                ] 
              },
              { 
                heading: "Contact", 
                links: [
                  { name: "Contact Us", href: "#" },
                  { name: "Support", href: "#" },
                  { name: "Feedback", href: "#" }
                ] 
              },
            ].map((col) => (
              <div key={col.heading} className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.text }}>
                  {col.heading}
                </p>
                {col.links.map((l) => (
                  <a
                    key={l.name}
                    href={l.href}
                    className="block text-xs transition-opacity hover:opacity-70"
                    style={{ color: C.textMut }}
                  >
                    {l.name}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
