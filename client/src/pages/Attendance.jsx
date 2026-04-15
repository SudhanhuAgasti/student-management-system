import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import API from "../services/api";
import { 
  CalendarCheck, 
  Sparkles, 
  ScanFace, 
  Loader2, 
  History, 
  MonitorCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateAttendanceReport } from "../utils/pdfGenerator";

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
  const [stats, setStats] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [isRecognitionLoading, setIsRecognitionLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models", err);
      }
    };
    loadModels();
    fetchAll();
    API.get("/attendance/stats").then((res) => setStats(res.data));
  }, [date]);

  const markRemainingAbsent = async () => {
    if (!window.confirm("Mark all students who haven't scanned today as Absent?")) return;
    setIsRecognitionLoading(true);
    try {
      await API.get("/attendance/auto-absent");
      fetchAll();
      setRecognitionResult({ type: "success", message: "Successfully marked others as Absent" });
    } catch (err) {
      console.error(err);
      setRecognitionResult({ type: "error", message: "Failed to mark absent" });
    } finally {
      setIsRecognitionLoading(false);
    }
  };

  const fetchAll = () => {
    setLoading(true);
    API.get(`/attendance?date=${date}`)
      .then((res) => {
        setAttendance(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch attendance", err);
        setLoading(false);
      });
  };

  const handleRecognize = async () => {
    if (!webcamRef.current || !webcamRef.current.video) {
        setRecognitionResult({ type: "error", message: "Camera system not initialized yet. Please wait." });
        return;
    }
    
    // Check if the camera is actually producing frames
    if (webcamRef.current.video.readyState < 2) {
        setRecognitionResult({ type: "error", message: "Camera feed connecting... Please try again in a moment." });
        return;
    }

    setIsRecognitionLoading(true);
    setRecognitionResult(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Capture failed. Browser blocked camera frame access or camera was interrupted.");

      const img = await faceapi.fetchImage(imageSrc);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setRecognitionResult({ type: "error", message: "Face not detected. Look clearly into the camera." });
        return;
      }

      // Euclidean distance thresholding is done on backend for efficiency/security
      const embedding = Array.from(detection.descriptor);
      const response = await API.post("/attendance/recognize", { embedding });

      setRecognitionResult({ type: "success", message: response.data.msg, student: response.data.student });
      fetchAll();
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setRecognitionResult(null), 5000);

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.msg || err.message || "Recognition failed";
      setRecognitionResult({ type: "error", message: errorMessage });
    } finally {
      setIsRecognitionLoading(false);
    }
  };

  const userRole = localStorage.getItem("userRole") || "";

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-emerald-600 flex items-center gap-3 tracking-tight">
            <ScanFace className="text-teal-500" size={36} />
            Smart Attendance
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
             AI-Powered face recognition for instant, contact-free logs.
          </p>
        </div>

        <div className="flex flex-wrap bg-white/80 dark:bg-slate-800/80 p-2 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl gap-2 w-full md:w-auto">
          <input
            type="date"
            value={date}
            className="flex-1 min-w-[150px] border-0 bg-transparent text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-0 px-4 py-2"
            onChange={(e) => setDate(e.target.value)}
          />
          {userRole === "admin" && (
            <button
              onClick={markRemainingAbsent}
              className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              Mark Remaining Absent
            </button>
          )}
          <button
            onClick={fetchAll}
            className="flex-1 md:flex-none bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 w-full overflow-hidden">
        <div className="flex items-center gap-2 pl-4 text-slate-400">
           <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search identity or name..."
          className="flex-1 bg-transparent border-0 focus:ring-0 text-sm font-bold placeholder:text-slate-400 py-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Recognition Terminal */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass border-0 bg-white/70 dark:bg-slate-800/70 rounded-4xl shadow-2xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldCheck size={120} className="text-teal-500" />
             </div>
             
             <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 tracking-tight flex items-center gap-2">
               <MonitorCheck className="text-teal-500" size={24} />
               Recognition Terminal
             </h2>

             <div className="relative group mx-auto max-w-sm">
                <div className="absolute -inset-4 bg-linear-to-r from-teal-500 to-emerald-500 rounded-5xl blur-2xl opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative bg-black rounded-4xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 aspect-square flex items-center justify-center">
                   {modelsLoaded ? (
                     <Webcam
                       audio={false}
                       ref={webcamRef}
                       screenshotFormat="image/jpeg"
                       className="w-full h-full object-cover grayscale brightness-110 contrast-125"
                       videoConstraints={{
                           facingMode: "user",
                           width: 720,
                           height: 720
                       }}
                     />
                   ) : (
                     <div className="flex flex-col items-center gap-4">
                       <Loader2 className="text-white/20 animate-spin" size={48} />
                       <span className="text-white/50 font-bold uppercase tracking-widest text-[10px] tracking-tighter">Initializing AI Core</span>
                     </div>
                   )}
                   
                   {/* Scanning Grid Animation Overlay */}
                   <div className="absolute inset-0 bg-linear-to-b from-transparent via-teal-500/10 to-transparent h-1 w-full animate-scan pointer-events-none shadow-lg"></div>
                   
                   {/* HUD */}
                   <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE FEED</span>
                   </div>
                </div>
             </div>

             <div className="mt-8 space-y-4">
                <button
                  onClick={handleRecognize}
                  disabled={!modelsLoaded || isRecognitionLoading}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                    !modelsLoaded || isRecognitionLoading
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-emerald-500/25 active:scale-[0.98]"
                  }`}
                >
                  {isRecognitionLoading ? <Loader2 className="animate-spin" /> : <ScanFace />}
                  {isRecognitionLoading ? "Identifying..." : "Scan & Verify"}
                </button>

                <AnimatePresence mode="wait">
                  {recognitionResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-5 rounded-3xl border-2 flex flex-col gap-3 ${
                        recognitionResult.type === "success"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                          : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 font-black tracking-tight">
                        {recognitionResult.type === "success" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        <span className="text-lg leading-tight">{recognitionResult.message}</span>
                      </div>
                      {recognitionResult.student && (
                        <div className="flex items-center justify-between pl-9 text-sm opacity-80 font-bold">
                           <span>{recognitionResult.student.course}</span>
                           <div className="flex items-center gap-1">
                              <Clock size={14} /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

          {/* Mini Stats */}
          <div className="glass border-0 bg-white/70 dark:bg-slate-800/70 rounded-4xl shadow-xl p-8">
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest">Attendance Status</h2>
            <div className="space-y-4">
              {stats.slice(0, 3).map((s) => (
                <div key={s._id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                    <span className="truncate w-32">{s.name}</span>
                    <span className="text-teal-600 bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded-md text-xs">
                      {s.percentage?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${s.percentage >= 75 ? "bg-teal-500" : s.percentage >= 50 ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${s.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Logs History */}
        <div className="lg:col-span-7">
          <div className="border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-800 rounded-4xl shadow-2xl overflow-hidden p-2 min-h-200">
            <div className="p-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50">
               <div className="flex items-center gap-6">
                 <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                   <History size={24} className="text-teal-500" />
                   Engagement Logs
                 </h2>
                 <button 
                   onClick={() => generateAttendanceReport(attendance[0]?.studentId || { name: "Group", course: "Attendance" }, attendance)}
                   className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-500/20"
                 >
                   <Download size={14} /> Export Table PDF
                 </button>
               </div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full">
                 {attendance.length} Records Found
               </div>
            </div>
            
            <div className="overflow-hidden bg-slate-50 dark:bg-slate-900/50">
              <div className="max-h-180 overflow-y-auto scrollbar-hide">
                <table className="w-full text-left border-collapse relative min-w-[600px]">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-700">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Snapshot</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Verified</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
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
                            <Sparkles className="animate-spin text-teal-400" /> Synchronizing ledgers...
                          </div>
                        </td>
                      </tr>
                    ) : attendance.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-16 text-center text-slate-500 font-medium text-lg">
                          <div className="flex flex-col items-center gap-4 opacity-30">
                             <History size={64} />
                             No authentication recorded yet.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      attendance
                        .filter(a => (a.studentId?.name || a.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((a) => (
                        <motion.tr
                          variants={rowVariants}
                          key={a._id}
                          className="hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300 group"
                        >
                          <td className="px-8 py-5">
                             <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden border border-white/20 shadow-sm transition-transform group-hover:scale-105">
                               <ScanFace size={24} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                             </div>
                          </td>

                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 dark:text-slate-200 text-lg tracking-tight leading-none mb-1">
                                {a.studentId?.name || a.studentName}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={10} /> {new Date(a.date).toLocaleDateString()}
                              </span>
                            </div>
                          </td>

                          <td className="px-8 py-5 text-right">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                              a.status === "Present"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                                : "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
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