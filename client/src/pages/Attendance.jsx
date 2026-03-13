import { useEffect, useState } from "react";
import API from "../services/api";
import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/attendance")
      .then((res) => {
        setAttendance(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch attendance", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
          <CalendarCheck className="text-emerald-500" />
          Attendance Log
        </h1>
        <p className="text-gray-500 mt-1">Monitor the daily attendance records of all students.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Logged</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-100"
            >
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">Loading attendance records...</td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No attendance records found.</td>
                </tr>
              ) : (
                attendance.map((a) => (
                  <motion.tr 
                    variants={rowVariants}
                    key={a._id} 
                    className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{a.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(a.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        a.status.toLowerCase() === 'present' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : a.status.toLowerCase() === 'absent'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Attendance;