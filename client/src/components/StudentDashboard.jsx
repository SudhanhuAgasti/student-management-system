import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, BookOpen, CalendarCheck, CreditCard,
  MapPin, Phone, GraduationCap, Award,
  Clock, CheckCircle2, AlertCircle, ArrowRight, Presentation, Camera, Eye, X
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";
import NoticeBoard from "./NoticeBoard";
import BroadcastBanner from "../components/BroadcastBanner";
import { generatePerformanceCard } from "../utils/pdfGenerator";
import { Download } from "lucide-react";

function StudentDashboard({ data }) {
  const { student: initialStudent, attendancePercentage, attendanceLogs, pendingFees, teacherName } = data;
  const [student, setStudent] = useState(initialStudent);
  const [isUploading, setIsUploading] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const res = await API.post("/student/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStudent({ ...student, profilePic: res.data.profilePic });
      alert("Profile picture updated!");
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <BroadcastBanner />
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Student Portal
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Welcome, <span className="text-indigo-600 dark:text-indigo-400">{student.name}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm sm:text-base">
            Track your academic progress and fee status.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {teacherName && (
            <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3 w-fit">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Teacher</p>
                <p className="font-bold text-slate-700 dark:text-white truncate">{teacherName}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{attendancePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl ${pendingFees > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"} dark:bg-opacity-10 flex items-center justify-center`}>
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fee Status</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {pendingFees > 0 ? `₹${pendingFees.toLocaleString()}` : "No Dues"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Course</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white truncate">{student.course}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Roll Number</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{student.rollNumber || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <Link to="/my-content" className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Presentation size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Study Center</p>
              <p className="text-xl font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors">Access My Notes & Live Classes</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:translate-x-2 transition-transform">
            <ArrowRight size={20} className="text-slate-400 group-hover:text-indigo-500" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#111827] rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm relative group"
        >
          <div className="relative pt-10 pb-8 px-6 flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-br from-indigo-500/10 to-purple-600/5"></div>
            <div className="relative mb-6">
              <motion.div
                whileHover={!showProfileOptions ? { scale: 1.15, zIndex: 50 } : {}}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileOptions(!showProfileOptions)}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 p-1 shadow-xl shadow-indigo-500/30 relative z-10 cursor-pointer overflow-hidden"
              >
                  <div className={`w-full h-full relative transition-all duration-300 ${showProfileOptions ? "blur-md scale-95" : ""}`}>
                    {student.profilePic ? (
                      <img
                        src={student.profilePic.startsWith('http') ? student.profilePic : `http://localhost:5000${student.profilePic}`}
                        className="w-full h-full object-cover rounded-[1.4rem] border-2 border-white dark:border-slate-900 cursor-pointer shadow-inner"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-5xl font-black cursor-pointer">
                        {student.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Options Overlay (Appears on top of blur) */}
                  <AnimatePresence>
                    {showProfileOptions && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 p-2 bg-black/20 rounded-[1.4rem]"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowViewModal(true); setShowProfileOptions(false); }}
                          className="w-full bg-white/95 hover:bg-white text-slate-900 py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                        >
                          <Eye size={16} className="text-indigo-600" />
                          <span className="text-xs font-black uppercase tracking-tight">View</span>
                        </button>
                        <label className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer">
                          <Camera size={16} />
                          <span className="text-xs font-black uppercase tracking-tight">Change</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => { handleFileChange(e); setShowProfileOptions(false); }} disabled={isUploading} />
                        </label>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowProfileOptions(false); }}
                          className="text-[10px] font-black text-white uppercase mt-2 hover:underline tracking-widest"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>




                {/* Loading State Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* View Photo Modal */}
            <AnimatePresence>
              {showViewModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
                  onClick={() => setShowViewModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-2xl w-full aspect-square bg-slate-800 rounded-[3rem] overflow-hidden border-4 border-slate-700 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-10"
                    >
                      <X size={24} />
                    </button>
                    {student.profilePic ? (
                      <img
                        src={student.profilePic.startsWith('http') ? student.profilePic : `http://localhost:5000${student.profilePic}`}
                        className="w-full h-full object-contain"
                        alt="Full Profile"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-9xl font-black">
                        {student.name.charAt(0)}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{student.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                  Verified Student
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  ID: {student._id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-50 dark:border-slate-800/50 space-y-1 relative z-10">
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 group/item hover:bg-white dark:hover:bg-slate-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-500 transition-colors">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                <p className="font-bold text-slate-900 dark:text-white truncate">{student.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 group/item hover:bg-white dark:hover:bg-slate-800 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-500 transition-colors">
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Date</p>
                <p className="font-bold text-slate-900 dark:text-white truncate">{new Date(student.admissionDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attendance Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Attendance</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => generatePerformanceCard(student, { attendancePercentage, pendingFees })}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
              >
                <Download size={14} /> Performance Card
              </button>
              <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">Last 10 Days</span>
            </div>
          </div>

          <div className="space-y-3">
            {attendanceLogs.length > 0 ? (
              attendanceLogs.map((log) => (
                <div key={log._id} className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${log.status === "Present" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                      {log.status === "Present" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${log.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {log.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <CalendarCheck size={48} className="mb-3 opacity-20" />
                <p className="font-bold text-sm uppercase tracking-widest">No attendance logs found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <NoticeBoard />
    </div>
  );
}

export default StudentDashboard;
