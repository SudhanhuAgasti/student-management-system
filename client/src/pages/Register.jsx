import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { BookOpen, Mail, Lock, CheckCircle2, ShieldCheck, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen w-full flex bg-[#0f172a]">
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-100 h-100 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-10 right-10 w-100 h-100 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-100 h-100 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 text-white p-12 max-w-2xl glass-dark rounded-[3rem] shadow-2xl border border-white/10">
          <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-500/30">
            <BookOpen size={40} className="text-white relative z-10" />
          </div>
          <h1 className="text-6xl font-black mb-8 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-linear-to-br from-white via-white to-slate-400">
            Join EduCore today.
          </h1>
          <p className="text-slate-300 text-xl font-medium leading-relaxed">
            EduCore is a modern and comprehensive management system designed to streamline academic and administrative tasks for everyone.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-white lg:rounded-l-[3rem] lg:shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-20">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-md space-y-10"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Create an account</h2>
            <p className="text-lg text-slate-500 font-medium tracking-wide">Register a new administrator profile.</p>
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
              <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                {["admin", "teacher", "student"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      role === r 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
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
                  <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">
                    {role === "admin" ? "Institute / Admin Name" : "Full Name"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
                      placeholder={`e.g. ${role === "admin" ? "Bright Future Academy" : "John Doe"}`}
                    />
                  </div>
                </div>

                {role !== "admin" && (
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Institute Code</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        value={instituteCode}
                        onChange={(e) => setInstituteCode(e.target.value.toUpperCase())}
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white uppercase"
                        placeholder="e.g. EDU1234"
                      />
                    </div>
                    <p className="text-xs text-slate-400 ml-1 mt-1">Ask your administrator for the Institute Code to join their portal.</p>
                  </div>
                )}

                {role === "student" && (
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Admission Key</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Sparkles className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        value={admissionKey}
                        onChange={(e) => setAdmissionKey(e.target.value.toUpperCase())}
                        className="block w-full pl-12 pr-4 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-slate-900 font-black tracking-widest placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white uppercase"
                        placeholder="e.g. STU1234"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1 mt-1 font-bold">This key was generated by your Admin when they added you to the system.</p>
                  </div>
                )}

                {/* Email */}
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

                {/* Password */}
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-500 tracking-widest uppercase ml-1">Enter OTP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm focus:bg-white"
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
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in instead
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}

export default Register;
