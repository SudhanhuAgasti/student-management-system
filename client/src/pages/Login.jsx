import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock, Eye, EyeOff, Sparkles, GraduationCap, ShieldCheck, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- INTERACTIVE DOLLS COMPONENT ---
const InteractiveDolls = ({ isPasswordFocused, mousePos, role }) => {
  // Breathing/Idle animation
  const [idleY, setIdleY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdleY((prev) => (prev === 0 ? -10 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate eye and head rotation based on mouse
  const calculateRotation = (dollX, dollY) => {
    if (isPasswordFocused) return { eye: { x: 0, y: 0, scaleY: 0.1 }, head: { rotateX: 0, rotateY: 0, x: 0 } };

    const dx = mousePos.x - dollX;
    const dy = mousePos.y - dollY;
    const angle = Math.atan2(dy, dx);
    const distSq = dx * dx + dy * dy;
    const distance = Math.min(Math.sqrt(distSq) / 60, 6);

    // Head tilt logic
    const headRotateX = (dy / window.innerHeight) * 20;
    const headRotateY = (dx / window.innerWidth) * 20;

    return {
      eye: {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scaleY: 1
      },
      head: {
        rotateX: -headRotateX,
        rotateY: headRotateY,
        x: headRotateY * 0.5 // Subtle horizontal slide
      }
    };
  };

  const roleColors = {
    admin: { primary: "#6366f1", secondary: "#4f46e5", bg: "bg-indigo-500/10" },
    teacher: { primary: "#10b981", secondary: "#059669", bg: "bg-emerald-500/10" },
    student: { primary: "#f43f5e", secondary: "#e11d48", bg: "bg-rose-500/10" }
  };

  const currentTheme = roleColors[role] || roleColors.admin;
  const doll1Rot = calculateRotation(window.innerWidth / 4, window.innerHeight / 2);
  const doll2Rot = calculateRotation(window.innerWidth / 4 + 100, window.innerHeight / 2);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden perspective-1000">
      {/* Background Mesh */}
      <div className={`absolute inset-0 ${currentTheme.bg} blur-3xl rounded-full scale-150 transition-colors duration-700`} />

      <motion.div
        animate={{ y: idleY }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="relative z-10 flex gap-6 items-end"
      >
        {/* DOLL 1: The Big One */}
        <motion.div
          animate={{
            rotateX: doll1Rot.head.rotateX,
            rotateY: doll1Rot.head.rotateY,
            x: doll1Rot.head.x
          }}
          className="relative group preserve-3d"
        >
          <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible">
            {/* Body */}
            <rect x="10" y="40" width="120" height="130" rx="40" fill={currentTheme.primary} className="transition-colors duration-700" />

            {/* Face Area */}
            <rect x="25" y="60" width="90" height="60" rx="30" fill="rgba(255,255,255,0.2)" />

            {/* Left Eye */}
            <g transform="translate(45, 85)">
              <circle cx="0" cy="0" r="12" fill="white" />
              <motion.circle
                animate={doll1Rot.eye}
                cx="0" cy="0" r="6" fill="#1e293b"
              />
            </g>

            {/* Right Eye */}
            <g transform="translate(95, 85)">
              <circle cx="0" cy="0" r="12" fill="white" />
              <motion.circle
                animate={doll1Rot.eye}
                cx="0" cy="0" r="6" fill="#1e293b"
              />
            </g>

            {/* Arms covering eyes animation */}
            <AnimatePresence>
              {isPasswordFocused && (
                <motion.path
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  d="M15 130 Q70 100 125 130"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
              )}
            </AnimatePresence>
          </svg>

          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-2 text-yellow-400"
          >
            <Sparkles size={24} />
          </motion.div>
        </motion.div>

        {/* DOLL 2: The Small Helper */}
        <motion.div
          animate={{
            rotateX: doll2Rot.head.rotateX,
            rotateY: doll2Rot.head.rotateY,
            x: doll2Rot.head.x,
            rotateZ: [0, -5, 5, 0]
          }}
          transition={{ rotateZ: { duration: 4, repeat: Infinity } }}
          className="mb-4 preserve-3d"
        >
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl overflow-visible">
            <rect width="80" height="80" rx="40" fill={currentTheme.secondary} className="transition-colors duration-700" />

            {/* Eye 1 */}
            <g transform="translate(30, 40)">
              <circle cx="0" cy="0" r="8" fill="white" />
              <motion.circle animate={doll2Rot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
            </g>

            {/* Eye 2 */}
            <g transform="translate(50, 40)">
              <circle cx="0" cy="0" r="8" fill="white" />
              <motion.circle animate={doll2Rot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Floating Props based on role */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
        >
          {role === 'admin' && <ShieldCheck className="text-indigo-400" size={32} />}
          {role === 'teacher' && <GraduationCap className="text-emerald-400" size={32} />}
          {role === 'student' && <UserCircle className="text-rose-400" size={32} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- MAIN LOGIN COMPONENT ---
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [instituteCode, setInstituteCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const loginData = { email, password };
      if (role !== "admin") loginData.instituteCode = instituteCode;
      const res = await API.post("/auth/login", loginData);
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("userName", res.data.user.name || "");
        localStorage.setItem("userEmail", res.data.user.email || "");
        localStorage.setItem("userRole", res.data.user.role || "");
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setSuccessMsg(res.data.message);
      setForgotStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await API.post("/auth/verify-reset-otp", { email, otp });
      setSuccessMsg(res.data.message);
      setTimeout(() => {
        setForgotStep(3);
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/reset-password", { email, otp, newPassword });
      setSuccessMsg(res.data.message);
      setTimeout(() => {
        setIsForgotMode(false);
        setForgotStep(1);
        setSuccessMsg("");
        setError("");
        setOtp("");
        setNewPassword("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
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
        className="relative z-10 w-full max-w-[1100px] h-auto lg:h-[700px] flex flex-col lg:flex-row bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
      >

        {/* LEFT PANEL: The Interactive Zone */}
        <div className="w-full lg:w-[45%] h-[300px] lg:h-full border-b lg:border-b-0 lg:border-r border-white/10 relative">
          <InteractiveDolls
            isPasswordFocused={isPasswordFocused || !showPassword && password.length > 0}
            mousePos={mousePos}
            role={role}
          />
          <div className="absolute bottom-8 left-10 hidden lg:block">
            <h3 className="text-2xl font-black text-white leading-tight">
              Empowering Education<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Through Technology.</span>
            </h3>
          </div>
        </div>

        {/* RIGHT PANEL: The Form Zone */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center p-8 lg:p-16 relative">

          <AnimatePresence mode="wait">
            {!isForgotMode ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tight">Welcome Back!</h2>
                  <p className="text-slate-400 mt-2 font-medium">Please sign in to your dashboard.</p>
                </div>

                {/* Role Switcher */}
                <div className="flex p-1.5 bg-white/5 rounded-2xl gap-1.5 border border-white/5">
                  {["admin", "teacher", "student"].map((r) => (
                    <button
                      key={r}
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

                <form onSubmit={login} className="space-y-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-5">
                    {/* Email Input */}
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email ID</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
                          placeholder="name@institute.com"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2 group">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secret Password</label>
                        <button
                          type="button"
                          onClick={() => setIsForgotMode(true)}
                          className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                        >
                          Forgot Key?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Institute Code */}
                    {role !== "admin" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2 group"
                      >
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institute Badge Code</label>
                        <div className="relative">
                          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                          <input
                            type="text"
                            required
                            value={instituteCode}
                            onChange={(e) => setInstituteCode(e.target.value.toUpperCase())}
                            className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-2xl py-4 pl-12 pr-4 text-white font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-indigo-500/10 transition-all placeholder:text-slate-600"
                            placeholder="INST123"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 flex justify-center items-center gap-3 mt-4"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Secure Login"
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-slate-500 text-sm font-medium">
                  New here? <Link to="/register" className="text-white font-bold hover:underline">Create an Identity</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tight">
                    {forgotStep === 1 ? "Recovery Mode" : forgotStep === 2 ? "Verify OTP" : "Reset Key"}
                  </h2>
                  <p className="text-slate-400 mt-2 font-medium">
                    {forgotStep === 1 ? "Enter email to get recovery code." : forgotStep === 2 ? "Check your email for the code." : "Create a new secure password."}
                  </p>
                </div>

                <form
                  onSubmit={
                    forgotStep === 1 ? handleForgotRequest :
                      forgotStep === 2 ? handleVerifyOTP : handleResetPassword
                  }
                  className="space-y-6"
                >
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-bold">
                      {error}
                    </div>
                  )}
                  {successMsg && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm font-bold">
                      {successMsg}
                    </div>
                  )}

                  <div className="space-y-5">
                    {forgotStep === 1 && (
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recovery Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    )}

                    {forgotStep === 2 && (
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block w-full">6-Digit Identity Code</label>
                        <input
                          type="text"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 text-white font-black text-3xl tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                          placeholder="000000"
                          maxLength={6}
                        />
                      </div>
                    )}

                    {forgotStep === 3 && (
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Secret Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 disabled:opacity-50 flex justify-center items-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      forgotStep === 1 ? "Request Code" :
                        forgotStep === 2 ? "Verify Identity" : "Update Password"
                    )}
                  </motion.button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setIsForgotMode(false); setForgotStep(1); setError(""); setSuccessMsg(""); }}
                      className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Back to Mission Control
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Branding */}
          <div className="absolute bottom-6 right-8 opacity-20 pointer-events-none">
            <h4 className="text-lg font-black text-white italic">EduCore OS v2.0</h4>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;