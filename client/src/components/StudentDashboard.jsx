import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, BookOpen, CalendarCheck, CreditCard, 
  MapPin, Phone, GraduationCap, Award,
  Clock, CheckCircle2, AlertCircle, ArrowRight, Presentation, Camera
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";
import NoticeBoard from "./NoticeBoard";
import BroadcastBanner from "./BroadcastBanner";
import { generatePerformanceCard } from "../utils/pdfGenerator";
import { Download } from "lucide-react";

function StudentDashboard({ data }) {
  const { student: initialStudent, attendancePercentage, attendanceLogs, pendingFees, teacherName } = data;
  const [student, setStudent] = useState(initialStudent);
  const [isUploading, setIsUploading] = useState(false);

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Student Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none text-slate-900">
            Welcome, <span className="text-indigo-600 dark:text-indigo-400">{student.name}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Track your academic progress and fee status.
          </p>
        </div>
        {teacherName && (
           <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Teacher</p>
                <p className="font-bold text-slate-700 dark:text-white">{teacherName}</p>
              </div>
           </div>
        )}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              {/* Profile Image Container */}
              <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black mb-4 shadow-2xl shadow-indigo-500/30 overflow-hidden border-4 border-white dark:border-slate-800 relative group">
                {student.profilePic ? (
                  <img 
                    src={`http://localhost:5000${student.profilePic}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <span className="animate-pulse">{student.name.charAt(0)}</span>
                )}
                
                {/* Upload Overlay (Always visible on hover, subtle hint otherwise) */}
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Change Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                </label>

                {/* Loading State Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{student.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                  Verified Student
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  ID: {student._id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                <p className="font-bold text-slate-900 dark:text-white">{student.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Date</p>
                <p className="font-bold text-slate-900 dark:text-white">{new Date(student.admissionDate).toLocaleDateString()}</p>
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
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Attendance</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => generatePerformanceCard(student, { attendancePercentage, pendingFees })}
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
              >
                <Download size={14} /> Performance Card
              </button>
              <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">Last 10 Days</span>
            </div>
          </div>

          <div className="space-y-3">
            {attendanceLogs.length > 0 ? (
              attendanceLogs.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.status === "Present" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                      {log.status === "Present" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-slate-500 font-medium">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${log.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
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
