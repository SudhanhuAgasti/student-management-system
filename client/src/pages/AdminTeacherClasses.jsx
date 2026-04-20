import { useState, useEffect } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { 
  Users, BookOpen, Clock, Presentation, GraduationCap, X, User,
  IndianRupee, TrendingDown, CheckCircle2, Trash2
} from "lucide-react";

function AdminTeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Payment Form States
  const [salary, setSalary] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  // The backend now returns a pre-grouped array: [{ teacher, classes }, ...]
  const groupedClasses = classes;

  useEffect(() => {
    fetchInstituteClasses();
  }, []);

  const fetchInstituteClasses = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/admin/institute-classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPaymentModal = (teacher) => {
    setSelectedTeacher(teacher);
    setSalary(teacher.salary || 0);
    setPaidAmount(teacher.paidAmount || 0);
    setShowPaymentModal(true);
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    try {
      await API.post(`/admin/teacher-payment/${selectedTeacher._id}`, { salary, paidAmount });
      setShowPaymentModal(false);
      fetchInstituteClasses(); // refresh to get updated data
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeacher = async (teacherId, teacherName) => {
    if (!window.confirm(`Are you sure you want to permanently remove ${teacherName} and all their associated classes?`)) {
      return;
    }
    try {
      await API.delete(`/admin/teachers/${teacherId}`);
      fetchInstituteClasses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete teacher.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">Loading Teacher Insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Institute Oversight
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Educator <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Insights</span> 📈
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Monitor all active classes, view teacher schedules, and track student assignments across your institute.
          </p>
        </div>
        <div className="flex bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2.5 rounded-2xl gap-3 border border-indigo-100 dark:border-indigo-500/20">
          <div className="flex flex-col">
             <span className="text-xs font-bold text-indigo-500 uppercase">Active Teachers</span>
             <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{groupedClasses.length}</span>
          </div>
        </div>
      </div>

      {groupedClasses.length === 0 ? (
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-12 text-center border border-dashed border-slate-200 dark:border-slate-700">
           <Presentation size={60} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
           <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Teacher Data Found</h3>
           <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">None of your registered teachers have created active classes or batches yet. Share your Institute Code to invite more teachers.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {groupedClasses.map(({ teacher, classes: teacherClasses }) => (
            <motion.div 
              key={teacher._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Teacher Header */}
              <div className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative">
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteTeacher(teacher._id, teacher.name)}
                  title="Remove Teacher"
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg shadow-indigo-500/20 flex items-center justify-center shrink-0">
                  <User size={32} className="text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{teacher.name}</h2>
                  <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-xs font-bold uppercase">Educator</span>
                    {teacher.email}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                     <p className="text-xs font-bold text-slate-400 uppercase">Batches</p>
                     <p className="text-xl font-black text-slate-800 dark:text-slate-200">{teacherClasses.length}</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                     <p className="text-xs font-bold text-slate-400 uppercase">Students</p>
                     <p className="text-xl font-black text-slate-800 dark:text-slate-200">{teacherClasses.reduce((sum, c) => sum + c.students.length, 0)}</p>
                  </div>
                </div>
                
                {/* Financial Overview Button */}
                <div className="sm:ml-4 pl-4 sm:border-l border-slate-200 dark:border-slate-700 w-full sm:w-auto">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Contract & Pay</p>
                  </div>
                  <button 
                    onClick={() => handleOpenPaymentModal(teacher)}
                    className="w-full sm:w-auto bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl font-bold flex flex-col items-start gap-1 transition-colors text-left border border-emerald-100 dark:border-emerald-500/20"
                  >
                    <div className="flex justify-between items-center w-full gap-4">
                       <span className="text-xs">Settled: ₹{teacher.paidAmount || 0}</span>
                       <span className="text-xs text-rose-500 dark:text-rose-400 font-black">Due: ₹{Math.max(0, (teacher.salary || 0) - (teacher.paidAmount || 0))}</span>
                    </div>
                    <div className="text-sm border-t border-emerald-200 dark:border-emerald-500/30 w-full pt-1 mt-1">
                      Target: ₹{teacher.salary || 0}
                    </div>
                  </button>
                </div>
              </div>

              {/* Batches Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teacherClasses.map(c => (
                  <div key={c._id} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-shadow bg-slate-50/30 dark:bg-slate-900/40">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-slate-800 dark:text-white leading-tight capitalize">{c.name}</h4>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-500 mt-1">
                          <BookOpen size={14} /> {c.subject}
                        </div>
                      </div>
                    </div>
                    {c.schedule && (
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4 bg-white dark:bg-slate-800 py-1.5 px-3 rounded-lg border border-slate-100 dark:border-slate-700 w-max">
                         <Clock size={14} className="text-amber-500" /> {c.schedule}
                       </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Users size={14} /> Assigned Students ({c.students.length})
                      </p>
                      {c.students.length === 0 ? (
                        <p className="text-sm font-medium text-slate-400">No students assigned yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {c.students.slice(0, 3).map(s => (
                            <li key={s._id} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="truncate pr-2">{s.name}</span>
                              <span className="text-xs font-bold text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 rounded-md">{s.rollNumber || "N/A"}</span>
                            </li>
                          ))}
                          {c.students.length > 3 && (
                            <li className="text-xs font-bold text-slate-500 text-center py-1">
                              +{c.students.length - 3} more students
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-4xl p-8 shadow-2xl relative z-10 w-full max-w-md border border-slate-100 dark:border-slate-800"
          >
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-full">
              <X size={20} />
            </button>
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center rounded-2xl text-emerald-600 dark:text-emerald-400 mb-4">
                <IndianRupee size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Financial Details</h3>
              <p className="text-slate-500 font-medium mt-1">Manage payment contract for <span className="font-bold text-indigo-500">{selectedTeacher?.name}</span>.</p>
            </div>

            <form onSubmit={handleUpdatePayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Total Contract Salary (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <TrendingDown className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={salary} 
                    onChange={(e) => setSalary(Number(e.target.value))} 
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Amount Paid (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={paidAmount} 
                    onChange={(e) => setPaidAmount(Number(e.target.value))} 
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm" 
                  />
                </div>
              </div>

              {/* Status Note */}
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-500 flex justify-between items-center">
                  <span>Pending Due:</span>
                  <span className="text-lg">₹{Math.max(0, salary - paidAmount)}</span>
                </p>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl mt-4 transition-colors">
                Update Payment
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminTeacherClasses;
