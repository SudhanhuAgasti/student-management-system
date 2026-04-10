import { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, Plus, Trash2, Calendar, 
  MapPin, Clock, Award, X, ChevronRight, UserPlus,
  Video, Globe, Link2
} from "lucide-react";

function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [instituteStudents, setInstituteStudents] = useState([]);

  // Form states
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [schedule, setSchedule] = useState("");

  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  // Online Class States
  const [onlineClasses, setOnlineClasses] = useState([]);
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [meetTitle, setMeetTitle] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    fetchClasses();
    fetchInstituteStudents();
    fetchOnlineClasses();
  }, []);

  const fetchOnlineClasses = async () => {
    try {
      const res = await API.get("/teacher/online-classes");
      setOnlineClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/teacher/classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstituteStudents = async () => {
    try {
      const res = await API.get("/teacher/institute-students");
      setInstituteStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await API.post("/teacher/classes", { name: className, subject, schedule });
      setShowAddModal(false);
      setClassName(""); setSubject(""); setSchedule("");
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClass = async (e, classId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await API.delete(`/teacher/classes/${classId}`);
      fetchClasses();
      if (selectedClass && selectedClass._id === classId) {
        setSelectedClass(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      const selectedStudent = instituteStudents.find(s => s._id === studentName);
      const studentLabel = selectedStudent ? selectedStudent.name : studentName;
      const rollLabel = selectedStudent && selectedStudent.rollNumber ? selectedStudent.rollNumber : rollNumber;

      const res = await API.post(`/teacher/classes/${selectedClass._id}/students`, {
        name: studentLabel,
        rollNumber: rollLabel,
        grade: "N/A"
      });
      setSelectedClass(res.data.class);
      setClasses(classes.map(c => c._id === selectedClass._id ? res.data.class : c));
      setShowStudentModal(false);
      setStudentName(""); setRollNumber("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Remove student from this class?")) return;
    try {
      const res = await API.delete(`/teacher/classes/${selectedClass._id}/students/${studentId}`);
      setSelectedClass(res.data.class);
      setClasses(classes.map(c => c._id === selectedClass._id ? res.data.class : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOnlineClass = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await API.post("/teacher/online-classes", {
        classId: selectedClass._id,
        title: meetTitle,
        meetLink,
        scheduledDate
      });
      setShowOnlineModal(false);
      setMeetTitle(""); setMeetLink(""); setScheduledDate("");
      fetchOnlineClasses();
    } catch (err) {
      console.error(err);
      alert("Failed to create online class");
    }
  };

  const handleDeleteOnlineClass = async (id) => {
    if (!window.confirm("Delete this online class link?")) return;
    try {
      await API.delete(`/teacher/online-classes/${id}`);
      fetchOnlineClasses();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">Loading Classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Class <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Create and organize your batches and students.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-shadow shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} />
          <span>New Class</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Classes List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs mb-4">Your Batches</h3>
          {classes.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 text-center border border-dashed border-slate-200 dark:border-slate-700">
              <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 font-medium">No classes created yet. Start by creating your first batch.</p>
            </div>
          ) : (
            classes.map(c => (
              <motion.div
                key={c._id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedClass(c)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  selectedClass?._id === c._id 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white capitalize">{c.name}</h4>
                  <button 
                    onClick={(e) => handleDeleteClass(e, c._id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <BookOpen size={14} className="text-indigo-400" />
                  <span className="font-medium">{c.subject}</span>
                </div>
                {c.schedule && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>{c.schedule}</span>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><Users size={14} /> {c.students?.length || 0} Students</span>
                  <ChevronRight size={14} className="opacity-50" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Selected Class Detail View */}
        <div className="lg:col-span-2">
          {selectedClass ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{selectedClass.name} <span className="text-indigo-500">({selectedClass.subject})</span></h2>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                    {selectedClass.schedule && <span className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-400"/> {selectedClass.schedule}</span>}
                    <span className="flex items-center gap-1.5"><Users size={16} className="text-purple-400"/> {selectedClass.students.length} Enrolled</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudentModal(true)}
                  className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
                >
                  <UserPlus size={18} /> Add Student
                </button>
              </div>

              {/* Online Classes Section */}
              <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Video size={18} className="text-rose-500" /> Active Online Classes
                  </h4>
                  <button 
                    onClick={() => setShowOnlineModal(true)}
                    className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Schedule New
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onlineClasses.filter(oc => oc.classId?._id === selectedClass._id).map(oc => (
                    <div key={oc._id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{oc.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {new Date(oc.scheduledDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={oc.meetLink} target="_blank" rel="noreferrer" className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                          <Link2 size={14} />
                        </a>
                        <button onClick={() => handleDeleteOnlineClass(oc._id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {onlineClasses.filter(oc => oc.classId?._id === selectedClass._id).length === 0 && (
                    <p className="col-span-full py-4 text-center text-xs font-bold text-slate-400 italic">No online classes scheduled for this batch.</p>
                  )}
                </div>
              </div>

              {selectedClass.students.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No students found</h4>
                  <p className="text-slate-500 mt-1">Add students to start managing their records.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/20">
                        <th className="py-4 px-4 rounded-tl-xl w-12">#</th>
                        <th className="py-4 px-4">Student Name</th>
                        <th className="py-4 px-4">Roll No.</th>
                        <th className="py-4 px-4">Grade</th>
                        <th className="py-4 px-4 rounded-tr-xl text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm font-medium">
                      {selectedClass.students.map((student, idx) => (
                        <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 px-4 text-slate-400">{idx + 1}</td>
                          <td className="py-4 px-4 text-slate-800 dark:text-slate-200">{student.name}</td>
                          <td className="py-4 px-4 text-slate-500">{student.rollNumber || "-"}</td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-lg text-xs font-bold">{student.grade || "N/A"}</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => handleRemoveStudent(student._id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center h-full border border-dashed border-slate-200 dark:border-slate-800 min-h-[400px]">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-6">
                 <LayoutDashboard size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Select a Class</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Click on any class from the list to view its students and manage records.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Class Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl relative z-10 w-full max-w-md border border-slate-100 dark:border-slate-800"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-full">
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Create New Batch</h3>
                <p className="text-slate-500 font-medium mt-1">Set up a new class or batch.</p>
              </div>

              <form onSubmit={handleAddClass} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Class Name</label>
                  <input type="text" required value={className} onChange={(e) => setClassName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Morning Batch A" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Subject</label>
                  <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Mathematics" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Schedule / Timings (Optional)</label>
                  <input type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Mon-Wed, 10:00 AM" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl mt-4 transition-colors">Create Class</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Student Modal */}
        {showStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowStudentModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl relative z-10 w-full max-w-md border border-slate-100 dark:border-slate-800"
            >
              <button onClick={() => setShowStudentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-full">
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center rounded-2xl text-purple-600 dark:text-purple-400 mb-4">
                  <UserPlus size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Add Student</h3>
                <p className="text-slate-500 font-medium mt-1">Enroll a new student to {selectedClass?.name}.</p>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Select Student</label>
                  <select 
                    required 
                    value={studentName} 
                    onChange={(e) => setStudentName(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="" disabled>Select from institute students...</option>
                    {instituteStudents.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} {student.course ? `(${student.course})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Override Roll No. (Optional)</label>
                  <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500" placeholder="e.g. #1024" />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl mt-4 transition-colors">Add Student</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create Online Class Modal */}
        {showOnlineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowOnlineModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl relative z-10 w-full max-w-md border border-slate-100 dark:border-slate-800"
            >
              <button onClick={() => setShowOnlineModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-full">
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center rounded-2xl text-rose-600 dark:text-rose-400 mb-4">
                  <Video size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Schedule Online Class</h3>
                <p className="text-slate-500 font-medium mt-1">For batch: {selectedClass?.name}</p>
              </div>

              <form onSubmit={handleCreateOnlineClass} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Meeting Title</label>
                  <input type="text" required value={meetTitle} onChange={(e) => setMeetTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500" placeholder="e.g. Weekly Doubt Session" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Meeting Link (Google Meet / Zoom)</label>
                  <input type="url" required value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500" placeholder="https://meet.google.com/..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Scheduled Date & Time</label>
                  <input type="datetime-local" required value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none px-5 py-4 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500" />
                </div>
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl mt-4 transition-colors">Start Session</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Needed to import LayoutDashboard here for the empty state.
import { LayoutDashboard } from "lucide-react";
export default TeacherClasses;
