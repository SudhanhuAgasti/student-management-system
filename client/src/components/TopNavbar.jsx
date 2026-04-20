import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, Building2 } from "lucide-react";

function TopNavbar() {
  const userRole = localStorage.getItem("userRole") || "";
  const userName = localStorage.getItem("userName") || "User";
  const instituteCode = localStorage.getItem("instituteCode") || "";

  // ── Theme Toggle ──────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("instituteCode");
    window.location.href = "/login";
  };

  // ── Role label ─────────────────────────────────────────────────────────────
  const roleLabel =
    userRole === "admin"
      ? "Admin Panel"
      : userRole === "teacher"
      ? "Teacher Panel"
      : "Student Panel";

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="sticky top-0 z-30 w-full flex flex-col bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/50 shadow-sm transition-colors duration-300"
    >
      {/* ── Mobile Institute Code Banner (Admin Only) ── */}
      {userRole === "admin" && instituteCode && (
        <div className="flex sm:hidden relative items-center justify-center gap-2 py-2 px-3 bg-linear-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20 overflow-hidden">
          {/* Subtle overlay effect */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] pointer-events-none"></div>
          <Building2 size={14} className="text-white relative z-10 animate-pulse" />
          <span className="text-[11px] font-black text-white tracking-widest uppercase relative z-10 drop-shadow-sm flex items-center gap-1.5">
            HQ Code
            <span className="bg-white/20 px-1.5 py-0.5 rounded-md border border-white/30 backdrop-blur-sm text-white shadow-inner">
              {instituteCode}
            </span>
          </span>
        </div>
      )}

      <div className="flex items-center justify-between px-3 sm:px-6 md:px-8 h-12 sm:h-14 gap-2">

        {/* ── Left: Portal label ── */}
        <div className="flex items-center min-w-0">
          {/* sm+ : full label badge */}
          <span className="hidden sm:inline-flex px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest whitespace-nowrap">
            {roleLabel}
          </span>
          {/* mobile : compact greeting */}
          <span className="sm:hidden text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
            Hi, {userName.split(" ")[0]}
          </span>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Institute Code — Admin only ── sm+ full badge */}
          {userRole === "admin" && instituteCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              title="Institute Code"
              className="hidden sm:flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/30 rounded-xl px-3 py-1.5"
            >
              <Building2 size={13} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Code
              </span>
              <span className="text-sm font-black text-indigo-700 dark:text-indigo-300 tracking-widest uppercase">
                {instituteCode}
              </span>
            </motion.div>
          )}

          {/* Theme Toggle — always visible, all breakpoints */}
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsDark(!isDark)}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
            id="topnav-theme-toggle"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors shadow-sm"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </motion.button>

          {/* Logout — icon only on mobile, icon + text on sm+ */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            id="topnav-logout-btn"
            aria-label="Logout"
            className="flex items-center gap-1.5 px-2 sm:px-3 h-8 sm:h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all shadow-sm font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
          >
            <LogOut size={13} className="shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
}

export default TopNavbar;
