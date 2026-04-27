import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { BookOpen, Mail, Lock, CheckCircle2, ShieldCheck, User, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveDolls from "../components/InteractiveDolls";

const formVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [instituteCode, setInstituteCode] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [admissionKey, setAdmissionKey] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", type: "" });

    if (password !== confirmPassword) {
      setStatus({ message: "Passwords do not match.", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await API.post("/admin/register", { name, email, password, role, instituteCode, admissionKey });
      setStatus({ message: res.data.message || "OTP sent to your email.", type: "success" });
      setIsOtpSent(true);
    } catch (err) {
      setStatus({ message: err.response?.data?.message || "Registration failed. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", type: "" });

    try {
      await API.post("/admin/verify-email", { email, otp });
      setStatus({ message: "Email verified successfully! Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setStatus({ message: err.response?.data?.message || "Invalid or expired OTP.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-4 lg:p-0 overflow-hidden font-sans">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-275 h-[90vh] lg:h-187.5 flex flex-col lg:flex-row bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* LEFT PANEL: The Interactive Zone */}
        <div className="w-full lg:w-[45%] h-62.5 lg:h-full border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0">
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-10 lg:left-10 z-20">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen size={20} className="text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black tracking-widest text-white">EDUCORE</h2>
            </div>
            <h3 className="text-sm sm:text-base lg:text-xl font-bold text-slate-300 leading-tight drop-shadow-md">
              Empowering Education<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Through Technology.</span>
            </h3>
          </div>
          <InteractiveDolls
            isPasswordFocused={isPasswordFocused || (!showPassword && password.length > 0) || (!showConfirmPassword && confirmPassword.length > 0)}
            role={role}
            isError={!!status.message && status.type === "error"}
          />
        </div>

        {/* RIGHT PANEL: The Form Zone */}
        <div className="w-full lg:w-[55%] flex flex-col p-6 lg:p-12 relative overflow-y-auto custom-scrollbar">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="show"
            className="w-full max-w-md mx-auto space-y-6 lg:space-y-8"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-black text-white tracking-tight mb-3">Create an account</h2>
              <p className="text-lg text-slate-400 font-medium tracking-wide">
                Sign up as a <span className="text-indigo-400 capitalize">{role}</span> for your institute.
              </p>
            </div>

            <form className="mt-10 space-y-6" onSubmit={isOtpSent ? verifyOtp : register}>
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className={`p-4 rounded-2xl text-sm font-bold border flex items-center gap-3 shadow-sm overflow-hidden ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/10" : "bg-red-50 text-red-600 border-red-100 shadow-red-500/10"
                      }`}
                  >
                    {status.type === "success" && <CheckCircle2 size={20} className="text-emerald-500" />}
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isOtpSent && (
                <div className="flex p-1.5 bg-white/5 rounded-2xl gap-1.5 border border-white/5">
                  {["admin", "teacher", "student"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${role === r
                        ? "bg-white text-slate-900 shadow-xl shadow-white/10"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {!isOtpSent ? (
                <div className="space-y-5">
                  {/* Institute / Admin Name */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      {role === "admin" ? "Institute / Admin Name" : "Full Name"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
                        placeholder={`e.g. ${role === "admin" ? "Bright Future Academy" : "John Doe"}`}
                      />
                    </div>
                  </div>

                  {role !== "admin" && (
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institute Code</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={instituteCode}
                          onChange={(e) => setInstituteCode(e.target.value.toUpperCase())}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600 uppercase"
                          placeholder="e.g. EDU1234"
                        />
                      </div>
                      <p className="text-xs text-slate-400 ml-1 mt-1">Ask your administrator for the Institute Code to join their portal.</p>
                    </div>
                  )}

                  {role === "student" && (
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admission Key</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Sparkles className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={admissionKey}
                          onChange={(e) => setAdmissionKey(e.target.value.toUpperCase())}
                          className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-2xl py-4 pl-12 pr-4 text-white font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-indigo-500/10 transition-all placeholder:text-slate-600 uppercase"
                          placeholder="e.g. STU1234"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-1 mt-1 font-bold">This key was generated by your Admin when they added you to the system.</p>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
                        placeholder="admin@educore.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enter OTP</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || (status.type === "success" && status.message.includes("verified successfully"))}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-2xl shadow-lg md:text-lg font-bold text-white bg-linear-to-r from-indigo-500 to-purple-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isOtpSent ? "Verifying..." : "Registering..."}
                  </>
                ) : isOtpSent ? "Verify OTP" : "Create Account"}
              </motion.button>
            </form>

            <p className="mt-10 text-center text-slate-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-white hover:underline transition-colors">
                Sign in instead
              </Link>
            </p>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
