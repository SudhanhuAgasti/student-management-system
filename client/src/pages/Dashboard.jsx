import { useEffect, useState } from "react";
import API from "../services/api";
import StudentChart from "../components/StudentChart";
import { Users, ClipboardCheck, IndianRupee, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching dashboard data", err));
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto space-y-10"
    >
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight flex items-center gap-3">
            Overview Dashboard <Sparkles className="text-pink-500" size={28} />
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Welcome back! Here's what's happening in your institute today.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Total Students Card */}
        <motion.div variants={itemVariants} className="relative overflow-hidden glass-card p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 group">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Users size={28} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-100/80 px-3 py-1.5 rounded-full shadow-sm">
                <TrendingUp size={16} /> +12%
              </span>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Enrolled</h3>
              <h1 className="text-5xl font-black text-slate-800 tracking-tight">
                {data.totalStudents || 0}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Total Attendance Card */}
        <motion.div variants={itemVariants} className="relative overflow-hidden glass-card p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 group">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <ClipboardCheck size={28} />
              </div>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Attendance Records</h3>
              <h1 className="text-5xl font-black text-slate-800 tracking-tight">
                {data.totalAttendance || 0}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Total Fees Card */}
        <motion.div variants={itemVariants} className="relative overflow-hidden glass-card p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 group">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                <IndianRupee size={28} />
              </div>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Fee Transactions</h3>
              <h1 className="text-5xl font-black text-slate-800 tracking-tight">
                {data.totalFees || 0}
              </h1>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div variants={itemVariants} className="glass border-0 bg-white/70 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <TrendingUp size={24} />
            </div>
            Growth Analytics
          </h2>
        </div>
        <div className="w-full h-96 flex justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white">
          {Object.keys(data).length > 0 ? (
            <StudentChart
              students={data.totalStudents}
              attendance={data.totalAttendance}
              fees={data.totalFees}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-slate-400 font-medium">
              Loading analytics...
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;