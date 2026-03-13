import { useState } from "react";
import API from "../services/api";
import { UserPlus, User, Phone, BookOpen, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function AddStudent() {
  const [student, setStudent] = useState({
    name: "",
    phone: "",
    course: "",
    totalFees: ""
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const addStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", type: "" });
    try {
      await API.post("/addStudent", student);
      setStatus({ message: "Student added successfully!", type: "success" });
      setStudent({ name: "", phone: "", course: "", totalFees: "" }); // Reset form
    } catch (err) {
      console.error(err);
      setStatus({ message: "Failed to add student. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
          <UserPlus className="text-indigo-500" />
          Enroll New Student
        </h1>
        <p className="text-gray-500 mt-1">Register a new student into the system and assign them to a course.</p>
      </div>

      <motion.div 
        variants={formVariants}
        initial="hidden"
        animate="show"
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
      >
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full z-0 opacity-50"></div>
        
        <form onSubmit={addStudent} className="space-y-6 relative z-10">
          
          <AnimatePresence>
            {status.message && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                  status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {status.type === "success" && <CheckCircle2 size={18} />}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="name"
                  value={student.name}
                  required
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="phone"
                  value={student.phone}
                  required
                  placeholder="+1 (555) 000-0000"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Assign Course</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="course"
                  value={student.course}
                  required
                  placeholder="e.g. Full Stack Web Development"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-sm shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading ? "Enrollling..." : "Enroll Student"}
            </motion.button>
          </div>

        </form>
      </motion.div>

    </div>
  );
}

export default AddStudent;