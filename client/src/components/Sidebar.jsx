import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  BookOpen, 
  CreditCard,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

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

  const navLinks = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Students", path: "/students", icon: <Users size={20} /> },
    { name: "Add Student", path: "/addStudent", icon: <UserPlus size={20} /> },
    { name: "Attendance", path: "/attendance", icon: <CalendarCheck size={20} /> },
    { name: "Courses", path: "/courses", icon: <BookOpen size={20} /> },
    { name: "Fees", path: "/fees", icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="h-screen w-64 glass-dark text-white flex flex-col transition-all duration-300 shadow-2xl">
      <div className="p-6 flex items-center gap-3 border-b border-gray-700/50">
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <BookOpen size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold tracking-wide">
          Edu<span className="text-indigo-400">Core</span>
        </h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto py-6 px-4 space-y-2"
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.div variants={linkVariants} key={link.name}>
              <Link
                to={link.path}
                onClick={onCloseMobile}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? "bg-indigo-600/20 text-indigo-400 font-medium" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-md"></div>
              )}
              <span className={`${isActive ? "text-indigo-400" : "group-hover:text-white"}`}>
                {link.icon}
              </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="p-4 border-t border-gray-700/50">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );
}

export default Sidebar;