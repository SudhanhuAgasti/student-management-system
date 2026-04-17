import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, AlertTriangle } from 'lucide-react';
import API from '../services/api';

const BroadcastBanner = () => {
  const [urgentNotice, setUrgentNotice] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchUrgent = async () => {
      try {
        const res = await API.get('/notices');
        const urgent = res.data.find(n => n.type === 'urgent');
        if (urgent) setUrgentNotice(urgent);
      } catch (err) {
        console.error("Failed to fetch urgent notice");
      }
    };
    fetchUrgent();
  }, []);

  if (!urgentNotice || !isVisible) return null;

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative mb-8 overflow-hidden rounded-[2rem] bg-linear-to-r from-rose-600 via-rose-500 to-pink-500 p-[1px] shadow-lg shadow-rose-500/20"
    >
      <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/20 dark:bg-white/10 rounded-full text-white border border-white/20 whitespace-nowrap">
            <AlertTriangle size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Important</span>
          </div>
          
          <div className="flex-1 overflow-hidden relative h-6">
            <motion.div 
              animate={{ x: ["100%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute whitespace-nowrap flex items-center gap-4"
            >
              <p className="text-sm font-bold text-white tracking-wide">
                <span className="opacity-70 mr-2">/</span>
                {urgentNotice.title}: {urgentNotice.content}
                <span className="opacity-70 ml-4 mr-2">/</span>
                Please stay updated with the latest instructions from the administration.
              </p>
            </motion.div>
          </div>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="p-1.5 hover:bg-white/10 text-white rounded-full transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default BroadcastBanner;
