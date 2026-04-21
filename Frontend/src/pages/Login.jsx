import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from "react-icons/hi2";
import logo from "../assets/logo.png";

// ── Design tokens (Stitch "The Ethereal Sanctuary") ──────────────────────────
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
  error: "#ae4025",
  errCont: "#fde8e3",
};

// Reusable field wrapper
const Field = ({ label, icon: Icon, error, rightLabel, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="block text-xs font-semibold" style={{ color: C.textMut }}>
        {label} <span className="text-red-500">*</span>
      </label>
      {rightLabel}
    </div>
    <div
      className="relative flex items-center rounded-2xl transition-all duration-200"
      style={{
        background: C.surface,
        border: `2px solid ${error ? C.error : "transparent"}`,
      }}
    >
      {Icon && (
        <span className="absolute left-4 text-base pointer-events-none" style={{ color: C.textMut }}>
          <Icon />
        </span>
      )}
      {children}
    </div>
    {error && (
      <p className="text-xs font-medium" style={{ color: C.error }}>
        {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "At least 6 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    if (!validate()) return;
    setIsSubmitting(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success("Welcome back to Mindmetrics AI!");
      navigate("/dashboard");
    } else {
      setError(result.message || "Authentication failed");
    }
    setIsSubmitting(false);
  };

  const inputCls = "w-full py-3.5 pr-4 pl-11 bg-transparent outline-none text-sm font-medium placeholder:font-normal";

  return (
    <div
      className="min-h-screen flex font-sans"
      style={{ background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] xl:w-[45%] min-h-screen p-12 relative overflow-hidden"
        style={{ background: C.primary }}
      >
        {/* Organic blobs */}
        <div
          className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: C.priCont }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 -translate-x-1/2 translate-y-1/2"
          style={{ background: C.priCont }}
        />

        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <img src={logo} alt="Mindmetrics AI" className="w-12 h-12 object-contain brightness-200" />
          <span
            className="font-bold text-sm tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(255,255,255,0.9)" }}
          >
            Mindmetrics AI
          </span>
        </Link>

        {/* Centre content */}
        <div className="relative z-10 space-y-8">
          {/* Illustration */}
          <div className="relative w-72 h-72 mx-auto">
            <div
              className="absolute inset-0 rounded-[60%_40%_40%_60%/60%_60%_40%_40%] opacity-20"
              style={{ background: C.priCont }}
            />
            <img
              src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80"
              alt="Calm journaling space"
              className="absolute inset-4 object-cover rounded-[58%_42%_38%_62%/58%_58%_42%_42%] mix-blend-luminosity opacity-70"
            />
          </div>

          <div className="space-y-3">
            <h2
              className="text-3xl xl:text-4xl font-extrabold leading-snug"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#ffffff" }}
            >
              A breath of fresh air<br />
              <em className="not-italic" style={{ color: C.priCont }}>
                for your academic journey.
              </em>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              Find your center amidst the noise of university life.
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-col gap-2.5">
            {[
              "🔒 Your data stays private, always",
              "🧘 Mindfulness tools, just for you",
              "🎓 Built with care for students",
            ].map((t) => (
              <span key={t} className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex flex-col gap-4">
          {/* <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((l) => (
              <a key={l} href="#" className="text-xs opacity-60 hover:opacity-100 transition-opacity" style={{ color: "#ffffff" }}>
                {l}
              </a>
            ))}
          </div> */}
          <p className="text-[10px] opacity-50" style={{ color: "#ffffff" }}>
            Mindmetrics AI by{" "}
            <a
              href="https://mindbrain.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-100 transition-opacity"
            >
              MindBrain Innovations Private Limited
            </a>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Login form ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 min-h-screen"
        style={{ background: C.bg }}
      >
        {/* Mobile brand */}
        <div className="lg:hidden mb-8 text-center">
          <Link to="/">
            <img src={logo} alt="Mindmetrics AI" className="w-16 h-16 mx-auto mb-2 object-contain" />
          </Link>
          <p className="text-sm font-semibold" style={{ color: C.textMut }}>Mindmetrics AI</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-8 space-y-1">
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}
            >
              Welcome Back
            </h1>
            <p className="text-sm" style={{ color: C.textMut }}>
              We're glad you're here. Your space is ready.
            </p>
            <p className="text-sm">
              <span style={{ color: C.textMut }}>Don't have an account? </span>
              <Link
                to="/register"
                className="font-semibold transition-opacity hover:opacity-70"
                style={{ color: C.primary }}
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 p-4 rounded-2xl text-sm font-medium"
              style={{ background: C.errCont, color: C.error }}
            >
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Field
              label="Email Address"
              icon={HiEnvelope}
              error={fieldErrors.email}
            >
              <input
                type="email"
                placeholder="you@mindmetrics.ai"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                }}
                className={inputCls}
                style={{ color: C.text }}
              />
            </Field>

            {/* Password */}
            <Field
              label="Password"
              icon={HiLockClosed}
              error={fieldErrors.password}
              rightLabel={
                <button
                  type="button"
                  className="text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: C.primary }}
                >
                  Forgot Password?
                </button>
              }
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                }}
                className={`${inputCls} pr-12`}
                style={{ color: C.text }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-base transition-opacity hover:opacity-70"
                style={{ color: C.textMut }}
              >
                {showPassword ? <HiEyeSlash /> : <HiEye />}
              </button>
            </Field>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[.98] shadow-md mt-2"
              style={{
                backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`,
                color: C.onPri,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Signing in…" : "Sign In to Mindmetrics AI"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px" style={{ background: C.outline + "60" }} />
              <span className="text-xs font-medium" style={{ color: C.textMut }}>or</span>
              <div className="flex-1 h-px" style={{ background: C.outline + "60" }} />
            </div>

            {/* Guest login */}
            <button
              type="button"
              onClick={async () => {
                const res = await guestLogin();
                if (res.success) navigate("/dashboard");
              }}
              className="w-full py-3.5 rounded-full font-semibold text-sm border-2 transition-all hover:opacity-80"
              style={{ borderColor: C.outline, color: C.textMut, background: "transparent" }}
            >
              Explore as Guest
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs" style={{ color: C.textMut }}>
            © 2024 Mindmetrics AI {" "}
            {/* <a href="#" className="underline underline-offset-2">Privacy</a>
            {" · "}
            <a href="#" className="underline underline-offset-2">Terms</a> */}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
