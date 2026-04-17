import { useState, useEffect } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { 
  FileText, UploadCloud, Trash2, Download, BookOpen, AlertCircle
} from "lucide-react";

function TeacherNotes() {
  const [notes, setNotes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [selectedClass, setSelectedClass] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [notesRes, classesRes] = await Promise.all([
        API.get("/teacher/notes"),
        API.get("/teacher/classes")
      ]);
      setNotes(notesRes.data);
      setClasses(classesRes.data);
      if (classesRes.data.length > 0) {
        setSelectedClass(classesRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedClass || !title) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("classId", selectedClass);
    formData.append("title", title);
    if (description) formData.append("description", description);

    try {
      // Must use multipart/form-data
      const res = await API.post("/teacher/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setNotes([res.data.note, ...notes]);
      
      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      // reset file input
      document.getElementById('file-upload').value = '';
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      await API.delete(`/teacher/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">Loading Materials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Resource Management
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Course <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-emerald-500">Materials</span> 📚
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Upload and share PDF notes, assignments, and reference materials directly with your batches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#111827] rounded-4xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm sticky top-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <UploadCloud className="text-teal-500" />
              Upload New File
            </h3>

            {classes.length === 0 ? (
              <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl text-amber-700 dark:text-amber-500 text-sm font-bold flex items-start gap-3 border border-amber-100 dark:border-amber-500/20">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p>You need to create a class/batch first before uploading notes.</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Target Class</label>
                  <select 
                    value={selectedClass} 
                    onChange={e => setSelectedClass(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
                  >
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name} ({c.subject})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Document Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Chapter 1: Physics Intro" 
                    className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-teal-500 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description (Optional)</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Add some context..." 
                    rows={2}
                    className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-teal-500 transition-all resize-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Attach File</label>
                  <input 
                    id="file-upload"
                    type="file" 
                    required 
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-3 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-black file:uppercase file:tracking-wider
                      file:bg-teal-50 file:text-teal-700
                      hover:file:bg-teal-100
                      dark:file:bg-teal-500/10 dark:file:text-teal-400 dark:hover:file:bg-teal-500/20
                      cursor-pointer
                    "
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading || !file}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl mt-4 transition-colors"
                >
                  {isUploading ? "Uploading..." : "Upload Material"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Existing Notes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Uploaded Resources</h3>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-slate-700">
              {notes.length} Files
            </span>
          </div>

          {notes.length === 0 ? (
            <div className="bg-slate-50 dark:bg-[#111827] border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">No resources available</h4>
              <p className="text-sm text-slate-500 mt-1">Upload your first PDF or document to share with your classes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map(note => (
                <motion.div 
                  key={note._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                      <FileText size={24} />
                    </div>
                    <button 
                      onClick={() => handleDelete(note._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1" title={note.title}>{note.title}</h4>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 mb-3 bg-indigo-50 dark:bg-indigo-500/10 py-1 px-2 rounded-md w-max">
                    <BookOpen size={12} />
                    {note.classId?.name || "Unknown Class"}
                  </div>

                  {note.description && (
                    <p className="text-sm text-slate-500 flex-1 line-clamp-2 mb-4">{note.description}</p>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400" title={note.originalFileName}>
                      {new Date(note.uploadDate).toLocaleDateString()}
                    </span>
                    
                    <a 
                      href={note.fileUrl.startsWith('http') ? note.fileUrl : `http://localhost:5000${note.fileUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
                    >
                      <Download size={14} /> View File
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default TeacherNotes;
