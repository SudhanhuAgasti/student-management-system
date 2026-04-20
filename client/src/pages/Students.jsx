import { useEffect, useState } from "react";
import API from "../services/api";
import { Users, Search, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = () => {
    setLoading(true);
    API.get("/students")
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch students", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await API.delete(`/student/${id}`);
        setStudents(students.filter(s => s._id !== id));
      } catch (err) {
        console.error("Failed to delete student", err);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
            <Users className="text-indigo-600 dark:text-indigo-400 shrink-0" size={36} />
            Students Roster
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-base md:text-lg font-medium tracking-wide">Manage all enrolled students across your institution with ease.</p>
        </div>
        
        <div className="relative group w-full md:w-auto">
          <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white font-black w-full md:w-80 shadow-2xl transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="glass border-0 bg-white/60 rounded-4xlshadow-xl shadow-slate-200/50 overflow-hidden backdrop-blur-xl p-2">
        <div className="overflow-x-auto rounded-3xl bg-white/40 custom-scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="border-b border-slate-200/60 bg-white/50">
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Phone Number</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Admission Key</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Enrolled Course</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-100/50"
            >
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-slate-500 font-medium text-lg">
                    <div className="flex items-center justify-center gap-3">
                      <Sparkles className="animate-spin text-indigo-400" /> Loading student records...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-slate-500 font-medium text-lg">
                    {searchTerm ? "No students match your search." : "No students found. Add a student to get started."}
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredStudents.map((s) => (
                    <motion.tr 
                      variants={rowVariants}
                      exit={{ opacity: 0, x: 20 }}
                      key={s._id} 
                      className="hover:bg-white/80 transition-all duration-300 group"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-800 text-lg tracking-tight">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap font-medium text-slate-500">{s.phone}</td>
                      <td className="px-8 py-5 whitespace-nowrap font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-widest">
                        {s.admissionKey || "N/A"}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-linear-to-r from-purple-100 to-pink-100 text-purple-800 shadow-sm border border-purple-200/50">
                          {s.course}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <button 
                          onClick={() => deleteStudent(s._id)}
                          className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 shadow-sm hover:shadow-red-500/30"
                          title="Delete Student"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Students;