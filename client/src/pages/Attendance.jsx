import { useEffect, useState } from "react";
import API from "../services/api";
import { CalendarCheck, Sparkles } from "lucide-react";
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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    API.get("/students").then(res => setStudents(res.data));
    API.get("/attendance/stats").then(res => setStats(res.data));


    const interval = setInterval(() => {
      if (date) {
        API.get(`/attendance?date=${date}`)
          .then(res => setAttendance(res.data));
      } else {
        fetchAll();
      }
    }, 5000);

    return () => clearInterval(interval);

  }, [date]);

  const fetchAll = () => {
    API.get("/attendance")
      .then((res) => {
        setAttendance(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch attendance", err);
        setLoading(false);
      });
  };

  const loadByDate = () => {
    if (!date) return alert("Select date first");

    API.get(`/attendance?date=${date}`)
      .then(res => setAttendance(res.data));
  };

  const markAttendance = async (id, status) => {
    if (!date) return alert("Select date first");

    await API.post("/attendance", {
      studentId: id,
      date,
      status
    });

    loadByDate();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center gap-3 tracking-tight">
            <CalendarCheck className="text-teal-500" size={36} />
            Attendance Log
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Monitor and digitally record daily student attendance.
          </p>
        </div>

        <div className="flex bg-white/60 p-2 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-md gap-2">
          <input
            type="date"
            className="border-0 bg-transparent text-slate-800 font-bold focus:outline-none focus:ring-0 px-4 py-2"
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={loadByDate}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            Load
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Mark & Stats */}
        <div className="lg:col-span-1 space-y-8">

          <div className="glass border-0 bg-white/70 rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-xl font-black text-slate-800 mb-6 tracking-tight relative z-10 flex items-center gap-2">
              Quick Register
            </h2>

            <div className="space-y-3 relative z-10 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {students.map((s) => (
                <div key={s._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/50 p-4 rounded-2xl border border-white">
                  <span className="font-bold text-slate-700">{s.name}</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => markAttendance(s._id, "Present")}
                      className="flex-1 sm:flex-none bg-emerald-100 hover:bg-emerald-500 text-emerald-700 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                      P
                    </button>
                    <button
                      onClick={() => markAttendance(s._id, "Absent")}
                      className="flex-1 sm:flex-none bg-red-100 hover:bg-red-500 text-red-700 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                      A
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass border-0 bg-white/70 rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-xl font-black text-slate-800 mb-6 tracking-tight relative z-10">Attendance Rates</h2>

            <div className="space-y-4 relative z-10">
              {stats.map((s) => (
                <div key={s._id} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>{s.name}</span>
                    <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                      {s.percentage?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${s.percentage >= 75 ? "bg-teal-500" : s.percentage >= 50 ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${s.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: History */}
        <div className="lg:col-span-2">
          <div className="border border-slate-200/60 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden p-2">
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-50 dark:bg-slate-900/50">
              <div className="max-h-[600px] overflow-y-auto overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm">
                      <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">Student Name</th>
                      <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">Date Logged</th>
                      <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">Status</th>
                    </tr>
                  </thead>

                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-slate-100 dark:divide-slate-800/50"
                  >
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-16 text-center text-slate-500 font-medium text-lg">
                          <div className="flex items-center justify-center gap-3">
                            <Sparkles className="animate-spin text-teal-400" /> Connecting to ledgers...
                          </div>
                        </td>
                      </tr>
                    ) : attendance.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-16 text-center text-slate-500 font-medium text-lg">
                          No records visible for this selection.
                        </td>
                      </tr>
                    ) : (
                      attendance.map((a) => (
                        <motion.tr
                          variants={rowVariants}
                          key={a._id}
                          className="hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300 group"
                        >
                          <td className="px-8 py-5 font-bold text-slate-800 dark:text-slate-200 text-lg tracking-tight">
                            {a.studentId?.name || a.studentName}
                          </td>

                          <td className="px-8 py-5 text-slate-500 font-medium">
                            <div className="bg-slate-100/80 dark:bg-slate-800 px-4 py-2 rounded-xl inline-block text-sm dark:text-slate-300">
                              {new Date(a.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </td>

                          <td className="px-8 py-5">
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm ${
                              a.status === "Present"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400"
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
        </div>
      </div>
    </div>
  );
}

export default Attendance;