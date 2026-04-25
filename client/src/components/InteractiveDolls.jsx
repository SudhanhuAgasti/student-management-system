import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";

// Helper to compute eye and head rotation based on mouse position
const useRotations = (mousePos, dollCenter) => {
  const dx = mousePos.x - dollCenter.x;
  const dy = mousePos.y - dollCenter.y;
  const angle = Math.atan2(dy, dx);
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 60, 6);
  const headRotateX = -(dy / window.innerHeight) * 20;
  const headRotateY = (dx / window.innerWidth) * 20;
  return {
    eye: {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scaleY: 1
    },
    head: {
      rotateX: headRotateX,
      rotateY: headRotateY,
      x: headRotateY * 0.5
    }
  };
};

const roleColors = {
  admin: { primary: "#6366F1", secondary: "#E0E7FF", bg: "bg-indigo-500/10" },
  teacher: { primary: "#10B981", secondary: "#D1FAE5", bg: "bg-emerald-500/10" },
  student: { primary: "#F43F5E", secondary: "#FEE2E2", bg: "bg-rose-500/10" }
};

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};
const theme = roleColors[role] || roleColors.admin;

const { width, height } = useWindowSize();

// Define centers for three dolls (responsive based on viewport size)
const centers = {
  big: { x: width / 2 - 100, y: height / 2 },
  small: { x: width / 2 + 150, y: height / 2 + 30 },
  extra: { x: width / 2 - 200, y: height / 2 + 80 }
};

const bigRot = useRotations(mousePos, centers.big);
const smallRot = useRotations(mousePos, centers.small);
const extraRot = useRotations(mousePos, centers.extra);

// Effect to recalculate on resize (centers depend on window size)
const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

return (
  <>
    {/* BIG DOLL */}
    <motion.div
      animate={bigRot.head}
      className="relative preserve-3d"
    >
      <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible">
        <rect x="10" y="40" width="120" height="130" rx="40" fill={theme.primary} className="transition-colors duration-700" />
        <rect x="25" y="60" width="90" height="60" rx="30" fill="rgba(255,255,255,0.2)" />
        <g transform="translate(45,85)">
          <circle cx="0" cy="0" r="12" fill="white" />
          <motion.circle animate={bigRot.eye} cx="0" cy="0" r="6" fill="#1e293b" />
        </g>
        <g transform="translate(95,85)">
          <circle cx="0" cy="0" r="12" fill="white" />
          <motion.circle animate={bigRot.eye} cx="0" cy="0" r="6" fill="#1e293b" />
        </g>
        <AnimatePresence>{isPasswordFocused && (
          <motion.path
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            d="M15 130 Q70 100 125 130"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="20"
            strokeLinecap="round"
          />
        )}</AnimatePresence>
      </svg>
      <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-4 -right-2 text-yellow-400">
        <Sparkles size={24} />
      </motion.div>
    </motion.div>

    {/* SMALL DOLL */}
    <motion.div
      animate={{
        rotateX: smallRot.head.rotateX,
        rotateY: smallRot.head.rotateY,
        x: smallRot.head.x,
        rotateZ: [0, -5, 5, 0]
      }}
      transition={{ rotateZ: { duration: 4, repeat: Infinity } }}
      className="mb-4 preserve-3d"
    >
      <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl overflow-visible">
        <rect width="80" height="80" rx="40" fill={theme.secondary} className="transition-colors duration-700" />
        <g transform="translate(30,40)">
          <circle cx="0" cy="0" r="8" fill="white" />
          <motion.circle animate={smallRot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
        </g>
        <g transform="translate(50,40)">
          <circle cx="0" cy="0" r="8" fill="white" />
          <motion.circle animate={smallRot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
        </g>
      </svg>
    </motion.div>

    {/* EXTRA DOLL – hidden on small screens */}
    <motion.div
      animate={{
        rotateX: extraRot.head.rotateX,
        rotateY: extraRot.head.rotateY,
        x: extraRot.head.x,
        rotateZ: [0, -7, 7, 0]
      }}
      transition={{ rotateZ: { duration: 5, repeat: Infinity } }}
      className="hidden lg:block absolute" style={{ left: `${centers.extra.x}px`, top: `${centers.extra.y}px` }}
    >
      <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md overflow-visible">
        <rect width="60" height="60" rx="30" fill={theme.primary} className="transition-colors duration-700" />
        <g transform="translate(20,45)">
          <circle cx="0" cy="0" r="6" fill="white" />
          <motion.circle animate={extraRot.eye} cx="0" cy="0" r="3" fill="#1e293b" />
        </g>
        <g transform="translate(40,45)">
          <circle cx="0" cy="0" r="6" fill="white" />
          <motion.circle animate={extraRot.eye} cx="0" cy="0" r="3" fill="#1e293b" />
        </g>
      </svg>
    </motion.div>
  </>
);
