import React from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCcw, AlertTriangle } from "lucide-react";

const NetworkErrorPage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50 dark:bg-[#020617] overflow-hidden p-6">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full flex flex-col items-center text-center"
      >
        {/* Animated 404 / Offline Visual */}
        <div className="relative mb-12 sm:mb-16">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 1, 0, -1, 0]
            }} 
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-[8rem] sm:text-[12rem] font-black leading-none text-indigo-500/10 dark:text-indigo-500/5 select-none tracking-tighter"
          >
            404
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative z-10 border border-white/10">
                <WifiOff size={40} className="text-white sm:hidden" />
                <WifiOff size={56} className="text-white hidden sm:block" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 px-4"
        >
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-white">
            Connection <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Lost</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium max-w-sm mx-auto leading-relaxed">
            Oops! It seems like your internet connection has taken a break. Please check your network and try again.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 w-full flex justify-center px-4"
        >
          <button 
            onClick={handleRetry}
            className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 overflow-hidden shadow-xl hover:shadow-indigo-500/20"
          >
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <RefreshCcw size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative z-10">Retry Connection</span>
          </button>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
        >
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
          System Offline
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NetworkErrorPage;
