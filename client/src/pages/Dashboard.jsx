import { useEffect, useState } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import StudentDashboard from "../components/StudentDashboard";
import TeacherDashboard from "../components/TeacherDashboard";
import {
  Users, ClipboardCheck, IndianRupee, TrendingDown,
  BellRing, CheckCircle2, AlertCircle, BookOpen,
  BarChart3, PieChart, ArrowUpRight, Sparkles, Phone, X
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend
} from "recharts";
import NoticeBoard from "../components/NoticeBoard";
import BroadcastBanner from "../components/BroadcastBanner";

const RADIAN = Math.PI / 180;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-2xl">
        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

function StatCard({ icon, label, value, color, trend, prefix = "" }) {
  const colors = {
    indigo: { bg: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-100 dark:border-indigo-500/20" },
    emerald: { bg: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-500/20" },
    rose: { bg: "bg-rose-500", light: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-100 dark:border-rose-500/20" },
    amber: { bg: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-500/20" },
  };

  const c = colors[color] || colors.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/40 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl ${c.light} ${c.border} border flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <ArrowUpRight size={13} />{trend}
          </div>
        )}
      </div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums`}>
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </motion.div>
  );
}

function Dashboard() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [reminderStatus, setReminderStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [defaulters, setDefaulters] = useState([]);
  const [showDefaultersModal, setShowDefaultersModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get("/dashboard")
      .then(res => { 
        setData(res.data);
        // Cache institute code for TopNavbar to read
        if (res.data.instituteCode) {
          localStorage.setItem("instituteCode", res.data.instituteCode);
        }
        setIsLoading(false); 
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-8">
           <div>
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-10 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
              <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
           </div>
           <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm h-36">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
             </div>
           ))}
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm h-48">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                    <div>
                       <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-1"></div>
                       <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between">
                       <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                       <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                 </div>
              </div>
              <div className="sm:border-l border-slate-100 dark:border-slate-800 sm:pl-8">
                 <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
                 <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm min-h-80">
           </div>
           <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm min-h-80">
           </div>
        </div>
      </div>
    );
  }

  // Render Role-Specific Dashboards
  if (data.role === "student") {
    return <StudentDashboard data={data} />;
  }

  if (data.role === "teacher") {
    return <TeacherDashboard data={data} />;
  }

  if (data.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle size={48} className="text-rose-500 mb-2" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Account Error</h2>
        <p className="text-slate-500 font-medium max-w-md">
          Your account role is not recognized or the dashboard failed to load. 
          Please try logging out and back in.
        </p>
      </div>
    );
  }

  // Admin Dashboard View (role === "admin")
  const handleSendReminders = async () => {
    setIsSending(true);
    try {
      const res = await API.post("/fees/reminders");
      if (res.data.defaulters && res.data.defaulters.length > 0) {
        setDefaulters(res.data.defaulters);
        setShowDefaultersModal(true);
      } else {
        setReminderStatus({ type: "success", message: res.data.message });
      }
    } catch {
      setReminderStatus({ type: "error", message: "Could not fetch defaulters." });
    } finally {
      setIsSending(false);
      setTimeout(() => setReminderStatus(null), 5000);
    }
  };

  const barData = [
    { name: "Students", value: data.totalStudents || 0, fill: "#6366f1" },
    { name: "Attendance", value: data.totalAttendance || 0, fill: "#10b981" },
    { name: "Transactions", value: data.feeTransactionsCount || 0, fill: "#f59e0b" },
  ];

  const pieData = (data.courseStats || []).map((c, i) => ({
    name: c._id || "Other",
    value: c.count,
    fill: COLORS[i % COLORS.length],
  }));

  const totalRevenue = data.totalRevenue || 0;
  const totalPending = data.totalPendingFees || 0;
  const collectRate = totalRevenue + totalPending > 0
    ? Math.round((totalRevenue / (totalRevenue + totalPending)) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      <BroadcastBanner />

     
      <AnimatePresence>
        {reminderStatus && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-8 right-8 z-200 min-w-80 p-6 rounded-3xl shadow-2xl flex items-center gap-5 border-2 transition-all ${
              reminderStatus.type === "success"
                ? "bg-white dark:bg-[#111827] border-emerald-500 text-emerald-600"
                : "bg-white dark:bg-[#111827] border-rose-500 text-rose-600"
            }`}
          >
            {reminderStatus.type === "success"
              ? <CheckCircle2 size={24} />
              : <AlertCircle size={24} />}
            <div>
              <p className="font-black text-slate-900 dark:text-white text-sm">Fee Reminders</p>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400 font-medium">{reminderStatus.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Admin Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"},{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {localStorage.getItem("userName") || "Admin"}
            </span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Here's what's happening at your institute today.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pr-2">Live Data</span>
          </div>
        </div>
      </div>

     
      {/* ── Stat Overview ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={22} />}
          label="Total Students"
          value={data.totalStudents || 0}
          color="indigo"
        />
        <StatCard
          icon={<ClipboardCheck size={22} />}
          label="Attendance Logs"
          value={data.totalAttendance || 0}
          color="emerald"
        />
        <StatCard
          icon={<IndianRupee size={22} />}
          label="Net Revenue"
          value={data.totalRevenue || 0}
          color="amber"
          prefix="₹"
        />
        <StatCard
          icon={<TrendingDown size={22} />}
          label="Pending Fees"
          value={data.totalPendingFees || 0}
          color="rose"
          prefix="₹"
        />
      </div>

     
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
         
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg leading-none">Financial Overview</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Collection progress this cycle</p>
              </div>
            </div>

           
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Collected — ₹{totalRevenue.toLocaleString()}</span>
                <span className="font-black text-slate-900 dark:text-white">{collectRate}%</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${collectRate}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500">
                <span>₹0</span>
                <span className="text-rose-500 dark:text-rose-400">Outstanding — ₹{totalPending.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/*  Right: Send Reminders Button  */}
          <div className="sm:border-l border-slate-100 dark:border-slate-800 sm:pl-8 shrink-0">
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              {data.totalPendingFees > 0 ? "Action Needed" : "All Clear"}
            </p>
            <motion.button
              onClick={handleSendReminders}
              disabled={isSending}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${
                isSending
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-linear-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/25 hover:shadow-rose-500/40"
              }`}
            >
              <BellRing size={18} className={isSending ? "" : "animate-none"} />
              {isSending ? "Sending…" : "Notify Defaulters"}
            </motion.button>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-2">
              {totalPending > 0 ? `${pieData.length} course(s) with dues` : "No pending dues 🎉"}
            </p>
          </div>
        </div>
      </motion.div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

   
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Growth Analytics</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Students · Attendance · Transactions</p>
            </div>
            <span className="self-start sm:self-auto px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
              Overall
            </span>
          </div>

          {isLoading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barSize={48}>
                <defs>
                  {barData.map((entry, i) => (
                    <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={entry.fill} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontWeight: 700, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontWeight: 700, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.04)" }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={`url(#grad${i})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Courses</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Student split</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
              <PieChart size={20} />
            </div>
          </div>

          {isLoading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : (data.courseStats || []).length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center gap-3 text-slate-300 dark:text-slate-700">
              <BookOpen size={48} />
              <p className="text-sm font-bold">No courses yet</p>
            </div>
          ) : (
            <>
              <div className="relative flex items-center justify-center h-52 w-full">
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie
                      data={(data.courseStats || []).map((c, i) => ({
                        name: c._id || "Other",
                        value: c.count || 0,
                        fill: COLORS[i % COLORS.length],
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {(data.courseStats || []).map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                    {(data.courseStats || []).reduce((s, c) => s + (c.count || 0), 0)}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">TOTAL</span>
                </div>
              </div>
              <div className="space-y-2.5 mt-4">
                {(data.courseStats || []).slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }}></div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-24">{c._id || "Other"}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{c.count || 0}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Notice Board Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
           <NoticeBoard />
        </div>
      </div>

      {/* ── Quick Access ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" /> Quick Actions
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Shortcuts to common admin tasks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Add Student", icon: "👤", color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", href: "/addStudent" },
            { label: "View Students", icon: "👥", color: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400", href: "/students" },
            { label: "Attendance", icon: "📋", color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", href: "/attendance" },
            { label: "Fee Records", icon: "💰", color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", href: "/fees" },
            { label: "Courses", icon: "📚", color: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400", href: "/courses" },
            { label: "Face Register", icon: "🤖", color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400", href: "/face-registration" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl ${item.color} border border-current/10 hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer`}
            >
              <div className="text-3xl">{item.icon}</div>
              <span className="text-xs font-black tracking-tight text-center leading-tight">{item.label}</span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* ── Defaulters Modal ── */}
      <AnimatePresence>
        {showDefaultersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Fee Defaulters</h2>
                  <p className="text-sm text-slate-500 font-medium">Click on WhatsApp to send a direct reminder.</p>
                </div>
                <button 
                  onClick={() => setShowDefaultersModal(false)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {defaulters.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.course} · {item.phone}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Due</p>
                        <p className="font-black text-slate-900 dark:text-white">₹{item.pendingAmount.toLocaleString()}</p>
                      </div>
                      <a
                        href={item.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center"
                        title="Send WhatsApp Reminder"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.711 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowDefaultersModal(false)}
                  className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Dashboard;