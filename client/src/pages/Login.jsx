import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { BookOpen, MapPin, Mail, Lock, Sparkles } from "lucide-react";
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
            Manage your institution<br/>seamlessly.
          </h1>
          <p className="text-slate-300 text-xl font-medium leading-relaxed">
            EduCore is a modern and comprehensive management system designed perfectly to streamline your daily academic and administrative tasks.
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
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Welcome back</h2>
            <p className="text-lg text-slate-500 font-medium tracking-wide">Sign in to your <span className="text-indigo-600 capitalize">{role}</span> portal.</p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={login}>
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

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 shadow-sm shadow-red-500/10"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
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

              {role !== "admin" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 group"
                >
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
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-2xl shadow-lg md:text-lg font-bold text-white bg-linear-to-r from-indigo-500 to-purple-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign in to your Institute"}
            </motion.button>
          </form>

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