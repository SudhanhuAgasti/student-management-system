import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { BookOpen, Mail, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
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
      await API.post("/admin/register", { email, password });
      setStatus({ message: "Registration successful! Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setStatus({ message: err.response?.data?.message || "Registration failed. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Abstract Decorative Side */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        {/* Abstract background shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 text-white p-12 max-w-lg">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Join EduCore today.
          </h1>
          <p className="text-indigo-100 text-lg">
            Create an admin account to start managing your institution securely and efficiently.
          </p>
        </div>
      </div>

      {/* Right Register Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-white">
        <motion.div 
          variants={formVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-md space-y-8 absolute lg:relative z-10 p-8 lg:p-0 bg-white/90 lg:bg-transparent backdrop-blur-xl rounded-3xl shadow-2xl lg:shadow-none lg:backdrop-blur-none border border-gray-100 lg:border-transparent"
        >
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-gray-500">Register a new administrator profile.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={register}>
            <AnimatePresence>
              {status.message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className={`p-3 rounded-lg text-sm font-medium border flex items-center gap-2 overflow-hidden ${
                    status.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  {status.type === "success" && <CheckCircle2 size={16} />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="admin@educore.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || status.type === "success"}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm md:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Create Account"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in instead
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}

export default Register;
