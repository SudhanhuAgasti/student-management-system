import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  ScanFace,
  BookOpen,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  Presentation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Sidebar({ onCloseMobile }) {
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userRole = localStorage.getItem("userRole") || "admin";
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const navLinks = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin", "teacher", "student"] },
    { name: "My Classes", path: "/teacher-classes", icon: <BookOpen size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["teacher"] },
    { name: "Class Notes", path: "/teacher-notes", icon: <Presentation size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["teacher"] },
    { name: "Study Center", path: "/my-content", icon: <BookOpen size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["student"] },
    { name: "Teacher Insights", path: "/admin-teacher-classes", icon: <Presentation size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Students", path: "/students", icon: <Users size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Add Student", path: "/addStudent", icon: <UserPlus size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Attendance Admin", path: "/attendance", icon: <ScanFace size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Face Enrollment", path: "/face-registration", icon: <UserPlus size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Manage Courses", path: "/courses", icon: <BookOpen size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Manage Fees", path: "/fees", icon: <CreditCard size={22} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
  ];

  const filteredLinks = navLinks.filter(link => link.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <div className="h-full min-h-screen w-72 bg-[#0f172a] text-slate-100 flex flex-col transition-all duration-300 shadow-2xl relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -top-12.5 -right-12.5w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="p-8 flex items-center gap-4 relative z-10 border-b border-white/5">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 transform hover:rotate-12 transition-transform duration-300">
          <BookOpen size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Edu<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Core</span>
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal</span>
        </div>
      </div>

      {/* User Identity Badge */}
      <div className="px-6 py-4 mx-4 mb-2 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{userName || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto py-8 px-5 space-y-2 relative z-10 scrollbar-hide"
      >
        {filteredLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.div variants={linkVariants} key={link.name}>
              <Link
                to={link.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                    ? "bg-linear-to-r from-indigo-600/30 to-purple-600/10 text-white font-bold tracking-wide shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 font-medium tracking-wide"
                  }`}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 border border-indigo-500/30 rounded-2xl bg-indigo-500/10 z-0" 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {link.icon}
                  </div>
                  <span>{link.name}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="p-6 relative z-10">
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-6"></div>
        
        <div className="flex flex-col gap-2">
          {/* Theme Toggle */}
          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 px-5 py-3.5 w-full text-left rounded-2xl text-slate-400 hover:text-white font-bold transition-all duration-300 group bg-white/5 hover:bg-white/10"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-500'}`}>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
          </motion.button>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 px-5 py-4 w-full text-left rounded-2xl text-slate-400 hover:text-red-400 font-bold transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
              <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            </div>
            <span>Secure Logout</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;