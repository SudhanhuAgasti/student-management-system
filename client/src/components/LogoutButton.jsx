import React from 'react';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const LogoutButton = ({ variant = "default" }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  if (variant === "minimal") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shadow-sm font-black text-[10px] uppercase tracking-widest"
      >
        <LogOut size={16} />
        <span>Logout Account</span>
      </motion.button>
    );
  }

  return (
    <div className="flex justify-center mt-12 mb-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="flex items-center gap-3 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all"
      >
        <LogOut size={20} />
        Log Out Securely
      </motion.button>
    </div>
  );
};

export default LogoutButton;
