import { useEffect, useState } from "react";
import API from "../services/api";
import { BookOpen, Clock, IndianRupee } from "lucide-react";
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
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
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
          <BookOpen className="text-indigo-500" />
          Offered Courses
        </h1>
        <p className="text-gray-500 mt-1">Manage and view all the academic courses currently available.</p>
      </div>

      {loading ? (
        <div className="text-gray-400 py-8">Loading courses details...</div>
      ) : courses.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">
          No courses found.
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {courses.map((c) => (
            <motion.div 
              key={c._id} 
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden relative cursor-pointer"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {c.name}
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    <Clock size={16} />
                  </div>
                  <span className="font-medium text-sm">Duration:</span>
                  <span className="text-sm">{c.duration}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <IndianRupee size={16} />
                  </div>
                  <span className="font-medium text-sm">Fee Structure:</span>
                  <span className="text-sm font-semibold text-gray-900">₹{c.fee}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details &rarr;
                </button>
              </div>

            </motion.div>
          ))}
        </motion.div>
      )}

    </div>
  );
}

export default Courses;