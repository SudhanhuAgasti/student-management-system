import { useEffect, useState } from "react";
import API from "../services/api";
import StudentChart from "../components/StudentChart";
import { Users, ClipboardCheck, IndianRupee, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
      className="max-w-7xl mx-auto space-y-8"
    >
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, manage your institute efficiently.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Students Card */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Users size={24} />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={14} /> +12%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Enrolled Students</h3>
            <h1 className="text-3xl font-bold text-gray-900">
              {data.totalStudents || 0}
            </h1>
          </div>
        </motion.div>

        {/* Total Attendance Card */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ClipboardCheck size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Attendance Records</h3>
            <h1 className="text-3xl font-bold text-gray-900">
              {data.totalAttendance || 0}
            </h1>
          </div>
        </motion.div>

        {/* Total Fees Card */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-110 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <IndianRupee size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Fee Transactions</h3>
            <h1 className="text-3xl font-bold text-gray-900">
              {data.totalFees || 0}
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-indigo-500" size={20} />
          Growth Analytics
        </h2>
        <div className="w-full h-80 flex justify-center">
          {Object.keys(data).length > 0 ? (
            <StudentChart
              students={data.totalStudents}
              attendance={data.totalAttendance}
              fees={data.totalFees}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-400">
              Loading analytics...
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;