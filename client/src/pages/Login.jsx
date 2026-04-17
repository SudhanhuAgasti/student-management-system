import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { BookOpen, MapPin, Mail, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [instituteCode, setInstituteCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const loginData = { email, password };
      if (role !== "admin") {
        loginData.instituteCode = instituteCode;
      }
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
    <div className="min-h-screen w-full flex bg-[#0f172a]">
      {/* Desktop Left Side */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-100 h-100 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-10 right-10 w-100 h-100 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-100 h-100 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 text-white p-12 max-w-2xl glass-dark rounded-[3rem] shadow-2xl border border-white/10">
          <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-500/30">
            <BookOpen size={40} className="text-white relative z-10" />
          </div>
          <h1 className="text-6xl font-black mb-8 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-linear-to-br from-white via-white to-slate-400">
            Manage your institution<br/>seamlessly.
          </h1>
          <p className="text-slate-300 text-xl font-medium leading-relaxed">
            EduCore is a modern and comprehensive management system designed perfectly to streamline your daily academic and administrative tasks.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-24 relative bg-slate-50 lg:bg-white lg:rounded-l-[3rem] lg:shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-20 overflow-hidden">
        
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
        </div>

        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-md space-y-8 bg-white/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-8 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-2xl shadow-indigo-500/5 lg:shadow-none border border-white/50 lg:border-none z-10"
        >

          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">
              {isForgotMode ? "Reset Password" : "Welcome back"}
            </h2>
            <p className="text-lg text-slate-500 font-medium tracking-wide">
              {isForgotMode
                ? "Follow the steps to recover your access."
                : `Sign in to your ${role} portal.`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isForgotMode ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mt-10 space-y-6"
                onSubmit={login}
              >
                <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                  {["admin", "teacher", "student"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === r
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 shadow-sm shadow-red-500/10">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
                        placeholder="admin@educore.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-500 tracking-widest uppercase">Password</label>
                      <button
                        type="button"
                        onClick={() => setIsForgotMode(true)}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-500"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {role !== "admin" && (
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Institute Code</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Sparkles className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={instituteCode}
                          onChange={(e) => setInstituteCode(e.target.value)}
                          className="block w-full pl-12 pr-4 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-slate-900 font-black tracking-widest placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
                          placeholder="EDU1234"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-2xl shadow-lg md:text-lg font-bold text-white bg-linear-to-r from-indigo-500 to-purple-600 disabled:opacity-70 mt-8"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign in to Institute"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mt-10 space-y-6"
                onSubmit={
                  forgotStep === 1 ? handleForgotRequest :
                    forgotStep === 2 ? handleVerifyOTP : handleResetPassword
                }
              >
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-bold border border-emerald-100">
                    {successMsg}
                  </div>
                )}
                <div className="space-y-5">
                  {forgotStep === 1 && (
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Recovery Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="Your registered email"
                        />
                      </div>
                    </div>
                  )}

                  {forgotStep === 2 && (
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Enter 6-Digit OTP</label>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black tracking-[0.5em] text-center text-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <p className="text-[10px] text-slate-400 font-bold uppercase text-center mt-2">Sent to {email}</p>
                    </div>
                  )}

                  {forgotStep === 3 && (
                    <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Set New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-2xl shadow-lg font-bold text-white bg-linear-to-r from-indigo-500 to-purple-600 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      forgotStep === 1 ? "Get Recovery OTP" :
                        forgotStep === 2 ? "Verify OTP" : "Update Password"
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(false); setForgotStep(1); setError(""); setSuccessMsg(""); }}
                    className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors mt-2"
                  >
                    Back to Sign In
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors link-underline">
              Register here
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}

export default Login;