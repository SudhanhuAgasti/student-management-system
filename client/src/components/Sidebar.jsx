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
  const userRole = localStorage.getItem("userRole") || "";


  const navLinks = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin", "teacher", "student"] },
    { name: "My Classes", path: "/teacher-classes", icon: <BookOpen size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["teacher"] },
    { name: "Class Notes", path: "/teacher-notes", icon: <Presentation size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["teacher"] },
    { name: "Study Center", path: "/my-content", icon: <BookOpen size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["student"] },
    { name: "Teacher Insights", path: "/admin-teacher-classes", icon: <Presentation size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Students", path: "/students", icon: <Users size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Add Student", path: "/addStudent", icon: <UserPlus size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Attendance", path: "/attendance", icon: <ScanFace size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Face Enrollment", path: "/face-registration", icon: <UserPlus size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Manage Courses", path: "/courses", icon: <BookOpen size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
    { name: "Manage Fees", path: "/fees", icon: <CreditCard size={20} className="opacity-90 transition-transform group-hover:scale-110" />, roles: ["admin"] },
  ];

  const filteredLinks = navLinks.filter(link => link.roles.includes(userRole));



  return (
    <div className=" h-full h-dvh w-72 bg-[#0f172a] text-slate-100 flex flex-col transition-all duration-300 shadow-2xl relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -top-12.5 -right-12.5 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header - Compact on mobile */}
      <div className="p-5 md:p-8 flex items-center gap-4 relative z-10 border-b border-white/5 shrink-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 transform hover:rotate-12 transition-transform duration-300">
          <BookOpen size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Edu<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Core</span>
          </h2>
          <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">
            {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal` : "Welcome"}
          </span>
        </div>
      </div>

      {/* User Identity Badge - Ultra compact on mobile */}
      <div className="px-5 py-3 md:px-6 md:py-4 mx-4 mb-2 mt-4 rounded-2xl bg-white/5 border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs md:text-sm shadow-lg">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 overflow-hidden">
            <p className="text-xs md:text-sm font-bold text-white truncate">{userName || "User"}</p>
            <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto py-2 md:py-8 px-5 space-y-1 md:space-y-2 relative z-10 scrollbar-hide"
      >
        {filteredLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.div variants={linkVariants} key={link.name}>
              <Link
                to={link.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
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
                <div className="relative z-10 flex items-center gap-3 md:gap-4">
                  <div className={`${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300 flex shrink-0"}`}>
                    {link.icon}
                  </div>
                  <span className="text-sm md:text-base">{link.name}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
}

export default Sidebar;