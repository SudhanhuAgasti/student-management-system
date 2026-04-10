import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, Sparkles, ClipboardList, PenTool, IndianRupee, Presentation
} from "lucide-react";

function TeacherDashboard({ data }) {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Teacher Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Educator's <span className="text-indigo-600 dark:text-indigo-400">Panel</span> 🎓
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Manage your classes, students, and curriculum efficiently.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
            <ClipboardList size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">My Classes</h3>
          <p className="text-slate-500 font-medium text-sm mb-6 flex-1">Create and view your daily subject batches and schedules.</p>
          <Link to="/teacher-classes" className="w-full text-center py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20">
            Open Classes
          </Link>
        </motion.div>

        <motion.div
           whileHover={{ y: -5 }}
          className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Student Records</h3>
          <p className="text-slate-500 font-medium text-sm mb-6 flex-1">Access enrolled student profiles, performance metrics and academic history.</p>
          <Link to="/teacher-classes" className="w-full text-center py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-purple-500/20">
            View Students
          </Link>
        </motion.div>

        <motion.div
           whileHover={{ y: -5 }}
          className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start"
        >
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
            <PenTool size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Class Notes & PDFs</h3>
          <p className="text-slate-500 font-medium text-sm mb-6 flex-1">Upload study materials, homework, and pdf notes for your specific batches.</p>
          <Link to="/teacher-notes" className="w-full text-center py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-teal-500/20">
            Manage Notes
          </Link>
        </motion.div>

        <motion.div
           whileHover={{ y: -5 }}
          className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-start"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
            <Presentation size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Live Classes</h3>
          <p className="text-slate-500 font-medium text-sm mb-6 flex-1">Schedule Google Meet or Zoom sessions for your batches.</p>
          <Link to="/teacher-classes" className="w-full text-center py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-rose-500/20">
            Schedule Now
          </Link>
        </motion.div>
      </div>

      {/* Salary Overview (Read-Only) */}
      <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 border border-emerald-100 dark:border-emerald-900/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg">
             <IndianRupee size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">My Payment Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
             <p className="text-xs font-bold text-slate-500 uppercase">Total Contract (Target)</p>
             <p className="text-3xl font-black text-slate-800 dark:text-slate-200 mt-1">₹{data?.teacher?.salary || 0}</p>
           </div>
           <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
             <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase">Amount Received</p>
             <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">₹{data?.teacher?.paidAmount || 0}</p>
           </div>
           <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
             <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase">Pending Due</p>
             <p className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">₹{Math.max(0, (data?.teacher?.salary || 0) - (data?.teacher?.paidAmount || 0))}</p>
           </div>
        </div>
        <p className="text-xs font-bold text-slate-400 mt-4 px-2">* Note: This section is read-only. Only the institute admin can update your payment records.</p>
      </div>

    </div>
  );
}

export default TeacherDashboard;
