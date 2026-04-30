import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiKey } from "react-icons/hi2";
import logo from "../assets/logo.png";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from "react-simple-captcha";

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

const Field = ({ label, icon: Icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold" style={{ color: C.textMut }}>
      {label} <span className="text-red-500">*</span>
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

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email+Captcha, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 1) {
      loadCaptchaEnginge(6);
    }
  }, [step]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) return setError("Please enter your email");
    if (!validateCaptcha(captchaInput)) {
      setCaptchaInput("");
      loadCaptchaEnginge(6);
      return setError("Invalid Captcha. Please try again.");
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    if (result.success) {
      toast.success("OTP sent to your email!");
      setStep(2);
    } else {
      setError(result.message || "Failed to send OTP.");
    }
    setIsSubmitting(false);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return setError("Please enter a valid 6-digit OTP");
    setError("");
    setStep(3); // Move to password reset locally
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setIsSubmitting(true);
    const result = await resetPassword(email, otp, newPassword);
    
    if (result.success) {
      toast.success("Password reset successfully!");
      setSuccess("Your password has been updated. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.message || "Failed to reset password.");
    }
    setIsSubmitting(false);
  };

  const inputCls = (hasIcon = true, extra = "") =>
    `w-full py-3.5 pr-4 ${hasIcon ? "pl-11" : "pl-4"} bg-transparent outline-none text-sm font-medium placeholder:font-normal ${extra}`;

  return (
    <div className="min-h-screen flex font-sans" style={{ background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        
        <div className="mb-8 text-center">
          <Link to="/">
            <img src={logo} alt="Mindmetrics AI" className="w-16 h-16 mx-auto mb-2 object-contain" />
          </Link>
          <p className="text-sm font-semibold" style={{ color: C.textMut }}>Mindmetrics AI</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-sm border border-emerald-800/10"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: C.text }}>
              Reset Password
            </h1>
            <p className="text-sm mt-2" style={{ color: C.textMut }}>
              {step === 1 && "Enter your email and solve the puzzle to receive an OTP."}
              {step === 2 && "Enter the 6-digit OTP sent to your email."}
              {step === 3 && "Choose a new secure password."}
            </p>
          </div>

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
              <span>{success ? "✅" : "⚠️"}</span>
              <span>{error || success}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <Field label="Email Address" icon={HiEnvelope}>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    className={inputCls(true)}
                    style={{ color: C.text }}
                  />
                </Field>

                <div className="p-4 rounded-2xl border-2 flex flex-col items-center gap-4 bg-white" style={{ borderColor: C.outline + '40' }}>
                  <LoadCanvasTemplate />
                  <input
                    type="text"
                    placeholder="Enter Captcha Value"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-full text-center py-2 border-b-2 outline-none font-bold tracking-widest text-lg"
                    style={{ borderColor: C.primary, color: C.text }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[.98] shadow-md"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri, opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Sending..." : "Send Reset OTP"}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <Field label="Verification Code" icon={HiKey}>
                  <input
                    type="text"
                    placeholder="6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={inputCls(true)}
                    style={{ color: C.text }}
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[.98] shadow-md"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri }}
                >
                  Verify OTP
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <Field label="New Password" icon={HiLockClosed}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

                <Field label="Confirm New Password" icon={HiLockClosed}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputCls(true, "pr-12")}
                    style={{ color: C.text }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-base transition-opacity hover:opacity-70"
                    style={{ color: C.textMut }}
                  >
                    {showConfirmPassword ? <HiEyeSlash /> : <HiEye />}
                  </button>
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[.98] shadow-md"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.priCont})`, color: C.onPri, opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs font-medium hover:underline" style={{ color: C.textMut }}>
              Back to Login
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
