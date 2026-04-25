import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, BookOpen, GraduationCap } from "lucide-react";

const InteractiveDolls = ({ isPasswordFocused, role, isError }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;
    
    // Throttled mouse movement tracking for performance
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Calculate eye and head rotation based on mouse
  const calculateRotation = (dollX, dollY, maxDistance = 6) => {
    if (isError) {
      return {
        eye: { x: 0, y: 0, scaleY: 1 },
        head: {
          rotateX: 0,
          rotateY: [0, -25, 25, -25, 25, -20, 20, -15, 15, 0],
          x: [0, -10, 10, -10, 10, -8, 8, -5, 5, 0]
        }
      };
    }

    if (isPasswordFocused) return { eye: { x: 0, y: 0, scaleY: 0.1 }, head: { rotateX: 0, rotateY: 0, x: 0 } };

    const dx = mousePos.x - dollX;
    const dy = mousePos.y - dollY;
    const angle = Math.atan2(dy, dx);
    const distSq = dx * dx + dy * dy;
    const distance = Math.min(Math.sqrt(distSq) / 60, maxDistance);

    // Head tilt logic
    const headRotateX = (dy / window.innerHeight) * 20;
    const headRotateY = (dx / window.innerWidth) * 20;

    return {
      eye: {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scaleY: 1
      },
      head: {
        rotateX: -headRotateX,
        rotateY: headRotateY,
        x: headRotateY * 0.5 // Subtle horizontal slide
      }
    };
  };

  const roleColors = {
    admin: { primary: "#6366f1", secondary: "#4f46e5", tertiary: "#3730a3", bg: "bg-indigo-500/10" },
    teacher: { primary: "#10b981", secondary: "#059669", tertiary: "#065f46", bg: "bg-emerald-500/10" },
    student: { primary: "#f43f5e", secondary: "#e11d48", tertiary: "#9f1239", bg: "bg-rose-500/10" }
  };

  const currentTheme = roleColors[role] || roleColors.admin;
  const doll1Rot = calculateRotation(window.innerWidth / 4, window.innerHeight / 2, 6);
  const doll2Rot = calculateRotation(window.innerWidth / 4 + 100, window.innerHeight / 2, 4);
  const doll3Rot = calculateRotation(window.innerWidth / 4 + 200, window.innerHeight / 2, 2);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden perspective-1000">
      {/* Background Mesh */}
      <div className={`absolute inset-0 ${currentTheme.bg} blur-3xl rounded-full scale-150 transition-colors duration-700`} />

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex gap-0 sm:gap-2 items-end scale-[0.60] sm:scale-100 origin-bottom mb-8 sm:mb-0"
      >
        {/* DOLL 1: The Big One */}
        <motion.div
          animate={{
            rotateX: doll1Rot.head.rotateX,
            rotateY: doll1Rot.head.rotateY,
            x: doll1Rot.head.x,
            y: [0, -10, 0],
            rotateZ: [0, 3, -3, 0]
          }}
          transition={{
            rotateY: isError ? { duration: 1.2, ease: "easeInOut" } : { type: "spring", stiffness: 100 },
            x: isError ? { duration: 1.2, ease: "easeInOut" } : { type: "spring", stiffness: 100 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotateZ: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative group preserve-3d"
        >
          <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible">
            {/* Body */}
            <rect x="10" y="40" width="120" height="130" rx="40" fill={currentTheme.primary} className="transition-colors duration-700" />

            {/* Face Area */}
            <rect x="25" y="60" width="90" height="60" rx="30" fill="rgba(255,255,255,0.2)" />

            {/* Left Eye */}
            <g transform="translate(45, 85)">
              <circle cx="0" cy="0" r="12" fill="white" />
              <motion.circle animate={doll1Rot.eye} cx="0" cy="0" r="6" fill="#1e293b" />
            </g>

            {/* Right Eye */}
            <g transform="translate(95, 85)">
              <circle cx="0" cy="0" r="12" fill="white" />
              <motion.circle animate={doll1Rot.eye} cx="0" cy="0" r="6" fill="#1e293b" />
            </g>

            {/* Arms covering eyes animation */}
            <AnimatePresence>
              {isPasswordFocused && (
                <motion.path
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  d="M15 130 Q70 100 125 130"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
              )}
            </AnimatePresence>
          </svg>
        </motion.div>

        {/* DOLL 2: The Small Helper */}
        <motion.div
          animate={{
            rotateX: doll2Rot.head.rotateX,
            rotateY: doll2Rot.head.rotateY,
            x: doll2Rot.head.x,
            y: [0, -15, 0],
            rotateZ: [0, -5, 5, 0]
          }}
          transition={{
            rotateY: isError ? { duration: 1.1, ease: "easeInOut" } : { type: "spring", stiffness: 100 },
            x: isError ? { duration: 1.1, ease: "easeInOut" } : { type: "spring", stiffness: 100 },
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mb-4 preserve-3d -ml-2 sm:-ml-4"
        >
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl overflow-visible">
            <rect width="80" height="80" rx="40" fill={currentTheme.secondary} className="transition-colors duration-700" />

            {/* Eye 1 */}
            <g transform="translate(30, 40)">
              <circle cx="0" cy="0" r="8" fill="white" />
              <motion.circle animate={doll2Rot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
            </g>

            {/* Eye 2 */}
            <g transform="translate(50, 40)">
              <circle cx="0" cy="0" r="8" fill="white" />
              <motion.circle animate={doll2Rot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
            </g>
          </svg>
        </motion.div>

        {/* DOLL 3: The Extra Helper */}
        <motion.div
          animate={{
            rotateX: doll3Rot.head.rotateX,
            rotateY: doll3Rot.head.rotateY,
            x: doll3Rot.head.x,
            y: [0, -12, 0],
            rotateZ: [0, 5, -5, 0]
          }}
          transition={{
            rotateY: isError ? { duration: 1.0, ease: "easeInOut" } : { type: "spring", stiffness: 100 },
            x: isError ? { duration: 1.0, ease: "easeInOut" } : { type: "spring", stiffness: 100 },
            y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
            rotateZ: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute left-[130px] sm:left-[135px] bottom-[-15px] -translate-x-1/2 z-30 preserve-3d scale-75 origin-bottom"
        >
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm overflow-visible">
            <rect width="80" height="80" rx="40" fill={currentTheme.tertiary} className="transition-colors duration-700" />

            {/* Eye 1 */}
            <g transform="translate(30, 40)">
              <circle cx="0" cy="0" r="8" fill="white" />
              <motion.circle animate={doll3Rot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
            </g>

            {/* Eye 2 */}
            <g transform="translate(50, 40)">
              <circle cx="0" cy="0" r="8" fill="white" />
              <motion.circle animate={doll3Rot.eye} cx="0" cy="0" r="4" fill="#1e293b" />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Role-based Dynamic Message */}
      <div className="absolute bottom-2 sm:bottom-10 w-[90%] sm:w-[80%] text-center z-40">
        <AnimatePresence mode="wait">
          <motion.p
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[11px] sm:text-base font-bold sm:font-medium text-white/90 drop-shadow-md leading-relaxed"
          >
            {role === 'admin' && "Manage your institution efficiently with top-tier administrative tools."}
            {role === 'teacher' && "Empower your students and streamline your daily academic workflow."}
            {role === 'student' && "Access your courses, track your progress, and excel in your studies."}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Floating Props based on role */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute top-6 right-6 lg:top-10 lg:right-10 p-2 lg:p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 z-20"
        >
          {role === 'admin' && <ShieldCheck className="text-indigo-400" size={32} />}
          {role === 'teacher' && <BookOpen className="text-emerald-400" size={32} />}
          {role === 'student' && <GraduationCap className="text-rose-400" size={32} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InteractiveDolls;
