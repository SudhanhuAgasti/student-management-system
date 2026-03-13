import { useEffect, useState } from "react";
import API from "../services/api";
import { Users, Search } from "lucide-react";
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

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/students")
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch students", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
            <Users className="text-indigo-500" />
            Students Roster
          </h1>
          <p className="text-gray-500 mt-1">Manage all enrolled students across your institution.</p>
        </div>
        
        {/* Placeholder for Search - UI Only for now */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-64 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled Course</th>
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
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">Loading student records...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No students found. Add a student to get started.</td>
                </tr>
              ) : (
                students.map((s) => (
                  <motion.tr 
                    variants={rowVariants}
                    key={s._id} 
                    className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {s.course}
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

export default Students;