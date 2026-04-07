import { useEffect, useState } from "react";
import API from "../services/api";
import { BookOpen, Clock, IndianRupee, Sparkles } from "lucide-react";
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/courses")
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-pink-500 flex items-center gap-3 tracking-tight">
          <BookOpen className="text-orange-500" size={36} />
          Offered Courses
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Manage and view all the academic courses currently available.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 font-medium text-lg gap-3">
          <Sparkles className="animate-spin text-orange-400" /> Loading course details...
        </div>
      ) : courses.length === 0 ? (
        <div className="glass p-12 rounded-4xl text-center text-slate-500 text-lg font-medium shadow-sm">
          No courses found. Create one to get started.
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {courses.map((c) => (
            <motion.div 
              key={c._id} 
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="glass border-0 bg-white/70 rounded-4xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-orange-500/20 transition-all duration-300 group overflow-hidden relative cursor-pointer"
            >
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-linear-to-br from-orange-400/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 z-0"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <BookOpen size={28} />
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 mb-6 group-hover:text-orange-600 transition-colors tracking-tight">
                  {c.name}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-600 bg-white/50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                      <span className="font-bold text-slate-700">{c.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-600 bg-white/50 p-3 rounded-xl border border-white">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-colors">
                      <IndianRupee size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Base Fee Unit</span>
                      <span className="font-black text-slate-800 text-lg">₹{c.fees}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-center">
                      <span className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Students</span>
                      <span className="font-black text-indigo-700 text-2xl">{c.activeStudents || 0}</span>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 text-center">
                      <span className="block text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Revenue</span>
                      <span className="font-black text-emerald-700 text-lg sm:text-2xl">₹{c.revenueCollected ? c.revenueCollected.toLocaleString() : 0}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="px-4 py-2 rounded-xl text-xs font-bold bg-white/60 text-slate-500 shadow-sm border border-slate-100">
                    Expected ROI: ₹{c.revenueExpected ? c.revenueExpected.toLocaleString() : 0}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

    </div>
  );
}

export default Courses;