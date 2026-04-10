import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText, Video, Download, BookOpen, ExternalLink,
  Calendar, Clock, ShieldCheck, GraduationCap
} from "lucide-react";

import API_INSTANCE from "../services/api";

function StudentContent() {
  const [content, setContent] = useState({ notes: [], onlineClasses: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyContent();
  }, []);

  const fetchMyContent = async () => {
    setIsLoading(true);
    try {
      const res = await API_INSTANCE.get("/student/my-content");
      setContent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">Loading Your Materials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-indigo-500" /> Authorized Access Only
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            My Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Resources</span> 🎓
          </h1>
          <p className="text-slate-500 font-medium mt-3 max-w-2xl">
            Access exclusive notes, assignments and join live classes assigned specifically to your batch.
          </p>
        </div>
      </div>

      {/* Online Classes Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm border border-rose-100 dark:border-rose-500/20">
            <Video size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Live Classes</h2>
        </div>

        {content.onlineClasses.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 font-bold">No active online classes at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.onlineClasses.map((oc) => (
              <motion.div
                key={oc._id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 truncate pr-4">{oc.title}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <GraduationCap size={14} className="text-indigo-500" />
                    <span>{oc.classId?.name} ({oc.classId?.subject})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Calendar size={14} className="text-indigo-500" />
                    <span>{new Date(oc.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock size={14} className="text-indigo-500" />
                    <span>{new Date(oc.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <a
                  href={oc.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                >
                  Join Meeting <ExternalLink size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Notes Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
            <FileText size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Study Material</h2>
        </div>

        {content.notes.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 font-bold">Your teachers haven't uploaded any notes for your batch yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.notes.map((note) => (
              <motion.div
                key={note._id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {new Date(note.uploadDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 line-clamp-1">{note.title}</h3>
                <p className="text-xs font-bold text-indigo-500 mb-3">{note.classId?.name} • {note.classId?.subject}</p>
                {note.description && (
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{note.description}</p>
                )}
                <a
                  href={`http://localhost:5000${note.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline underline-offset-4"
                >
                  <Download size={14} /> Download PDF
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentContent;
