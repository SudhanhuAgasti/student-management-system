import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import API from "../services/api";
import { UserPlus, Camera, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FaceRegistration() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models", err);
        setStatus({ type: "error", message: "Failed to load face detection models" });
      }
    };
    loadModels();

    API.get("/students").then((res) => setStudents(res.data));
  }, []);

  const captureAndRegister = async () => {
    if (!selectedStudent) {
      setStatus({ type: "error", message: "Please select a student first" });
      return;
    }

    if (!webcamRef.current || !webcamRef.current.video) {
        setStatus({ type: "error", message: "Camera system not initialized yet." });
        return;
    }

  
    if (webcamRef.current.video.readyState < 2) {
        setStatus({ type: "error", message: "Camera feed connecting... Please try again." });
        return;
    }

    setLoading(true);
    setStatus({ type: "info", message: "Detecting face..." });

    // Give the browser a moment to paint the loading spinner before heavy AI computation starts
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Capture failed. Browser blocked camera frame access or camera was interrupted.");

      const img = await faceapi.fetchImage(imageSrc);
      
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatus({ type: "error", message: "No face detected. Please look clearly into the camera." });
        setLoading(false);
        return;
      }

      // Liveness check (simple: ensure face score is high)
      if (detection.detection.score < 0.8) {
          setStatus({ type: "error", message: "Low detection score. Ensure good lighting and look directly at camera." });
          setLoading(false);
          return;
      }

      const embedding = Array.from(detection.descriptor);

      await API.post(`/student/${selectedStudent}/face`, { embedding });
      
      setStatus({ type: "success", message: "Face data registered successfully!" });
      setSelectedStudent("");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center md:justify-start gap-3 tracking-tight">
          <UserPlus className="text-indigo-500" size={36} />
          Face Registration
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Enroll student face data for AI-powered attendance tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
     
        <div className="glass border-0 bg-white/70 dark:bg-slate-800/70 rounded-4xl shadow-xl p-8 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            >
              <option value="">Choose a student...</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rollNumber || "No Roll #"})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <button
              onClick={captureAndRegister}
              disabled={!modelsLoaded || loading || !selectedStudent}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                !modelsLoaded || loading || !selectedStudent
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Camera />
              )}
              {loading ? "Processing..." : "Capture & Register"}
            </button>
            {!modelsLoaded && (
              <p className="text-xs text-center text-amber-500 font-bold flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Loading Face AI Models...
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-sm font-bold ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : status.type === "error"
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}
              >
                {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
        <div className="relative group">
          <div className="absolute -inset-4 bg-linear-to-r from-indigo-500 to-purple-500 rounded-5xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative bg-black rounded-4xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 aspect-video flex items-center justify-center">
            {modelsLoaded ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                    facingMode: "user",
                    width: 1280,
                    height: 720
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="text-white/20 animate-spin" size={48} />
                <span className="text-white/50 font-bold uppercase tracking-widest text-xs">Waiting for Models</span>
              </div>
            )}
            
            <div className="absolute inset-0 border-40 border-black/20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-indigo-400/50 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRegistration;
