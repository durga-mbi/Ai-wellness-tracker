import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { HiUser, HiEnvelope, HiPhone, HiLockClosed, HiEye, HiEyeSlash } from "react-icons/hi2";
import logo from "../assets/logo.png";

// ── Design tokens (Stitch "The Ethereal Sanctuary") ──────────────────────────
const C = {
  bg:      "#fefee5",
  surface: "#f4f6d2",
  card:    "#ffffff",
  primary: "#506b4a",
  priCont: "#ccebc2",
  onPri:   "#ffffff",
  text:    "#373a1c",
  textMut: "#636745",
  outline: "#b9bc94",
  error:   "#ae4025",
  errCont: "#fde8e3",
};

// Reusable input field matching the Stitch form style
const Field = ({ label, icon: Icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold" style={{ color: C.textMut }}>
      {label}
    </label>
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Full name is required";
    else if (name.length < 3) errors.name = "Name must be at least 3 characters";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";
    if (!mobile) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(mobile)) errors.mobile = "Must be exactly 10 digits";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Must be at least 6 chars";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});
    if (!validate()) return;
    setIsSubmitting(true);
    const result = await register({ name, email, mobile, password });
    if (result.success) {
      setSuccess(result.message || "Account created successfully!");
      setTimeout(() => navigate("/survey"), 2000);
    } else {
      setError(result.message || "Failed to create account. Please try again.");
    }
    setIsSubmitting(false);
  };

  // Input class helper
  const inputCls = (hasIcon = true, extra = "") =>
    `w-full py-3.5 pr-4 ${hasIcon ? "pl-11" : "pl-4"} bg-transparent outline-none text-sm font-medium placeholder:font-normal ${extra}`;

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

      {/* ── LEFT PANEL (visible on lg+) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] xl:w-[45%] min-h-screen p-12 relative overflow-hidden"
        style={{ background: C.primary }}
      >
        {/* Organic blob decoration */}
        <div
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: C.priCont }}
        />
        <div
          className="absolute top-1/3 -right-32 w-[350px] h-[350px] rounded-full opacity-10"
          style={{ background: C.priCont }}
        />

        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <img src={logo} alt="The Sanctuary" className="w-9 h-9 object-contain brightness-200" />
          <span
            className="font-bold text-sm tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(255,255,255,0.9)" }}
          >
            The Sanctuary
          </span>
        </Link>

        {/* Centre copy */}
        <div className="relative z-10 space-y-8">
          {/* Illustration placeholder — organic garden feel */}
          <div className="relative w-72 h-72 mx-auto">
            <div
              className="w-full h-full rounded-[40%_60%_60%_40%/40%_40%_60%_60%] opacity-20"
              style={{ background: C.priCont }}
            />
            <img
              src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&q=80"
              alt="Student journaling"
              className="absolute inset-4 object-cover rounded-[38%_62%_58%_42%/40%_38%_62%_60%] mix-blend-luminosity opacity-70"
            />
          </div>

          <div className="space-y-3">
            <h2
              className="text-3xl xl:text-4xl font-extrabold leading-snug"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#ffffff" }}
            >
              Your digital garden<br />
              <em className="not-italic" style={{ color: C.priCont }}>for growth.</em>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              Take a breath. Every word you write is a step toward clarity and peace.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2.5">
            {[
              "🔒 Your journal is private and encrypted",
              "🕵️ Anonymous features available",
              "🎓 Built for students, with care",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="relative z-10 flex gap-6">
          {["Privacy Policy", "Terms of Service"].map((l) => (
            <a key={l} href="#" className="text-xs transition-opacity hover:opacity-100 opacity-60" style={{ color: "#ffffff" }}>
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Registration form ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 min-h-screen"
        style={{ background: C.bg }}
      >
        {/* Mobile brand (hidden on lg) */}
        <div className="lg:hidden mb-8 text-center">
          <Link to="/">
            <img src={logo} alt="The Sanctuary" className="w-12 h-12 mx-auto mb-2 object-contain" />
          </Link>
          <p className="text-sm font-semibold" style={{ color: C.textMut }}>The Sanctuary</p>
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
              Create Your Calm Space
            </h1>
            <p className="text-sm" style={{ color: C.textMut }}>
              A safe place for your thoughts, feelings, and growth
            </p>
            <p className="text-sm">
              <span style={{ color: C.textMut }}>Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold transition-opacity hover:opacity-70"
                style={{ color: C.primary }}
              >
                Login
              </Link>
            </p>
          </div>

          {/* Alert */}
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 p-4 rounded-2xl text-sm font-medium"
              style={{
                background: success ? "#e6f4e6" : C.errCont,
                color: success ? "#2e6b35" : C.error,
              }}
            >
              <span className="text-base">{success ? "✅" : "⚠️"}</span>
              <span>{error || success}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <Field label="Full Name" icon={HiUser} error={fieldErrors.name}>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
                }}
                className={inputCls(true)}
                style={{ color: C.text }}
              />
            </Field>

            {/* Email + Mobile side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Address" icon={HiEnvelope} error={fieldErrors.email}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.toLowerCase());
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                  }}
                  className={inputCls(true)}
                  style={{ color: C.text }}
                />
              </Field>

              <Field label="Mobile Number" icon={HiPhone} error={fieldErrors.mobile}>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setMobile(val);
                    if (fieldErrors.mobile) setFieldErrors({ ...fieldErrors, mobile: null });
                  }}
                  className={inputCls(true)}
                  style={{ color: C.text }}
                />
              </Field>
            </div>

            {/* Password */}
            <Field label="Password" icon={HiLockClosed} error={fieldErrors.password}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                }}
                className={inputCls(true, "pr-12")}
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

            {/* Submit */}
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
              {isSubmitting ? "Creating your space…" : "Create My Calm Space"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs" style={{ color: C.textMut }}>
            © 2024 The Ethereal Sanctuary ·{" "}
            <a href="#" className="underline underline-offset-2">Privacy</a>
            {" · "}
            <a href="#" className="underline underline-offset-2">Terms</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
