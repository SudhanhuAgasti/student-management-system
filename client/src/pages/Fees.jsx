import { useEffect, useState } from "react";
import API from "../services/api";
import { CreditCard, Sparkles, AlertCircle, MessageCircle, Wallet, Download, Search } from "lucide-react";
import { motion } from "framer-motion";
import { generateFeeReceipt, shareFeeReceipt } from "../utils/pdfGenerator";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);

    Promise.all([
      API.get("/fees").catch(() => ({ data: [] })),
      API.get("/students").catch(() => ({ data: [] }))
    ]).then(([feesRes, studentsRes]) => {
      setFees(feesRes.data);
      setStudents(studentsRes.data);
      setLoading(false);
    });
  }, []);

  const handlePayment = async (student) => {
    const pendingAmount = student.totalFees - student.feesPaid;
    const amountStr = window.prompt(`Record payment for ${student.name}.\nPending amount: ₹${pendingAmount}\n\nEnter amount paid (₹):`, pendingAmount);

    if (amountStr === null) return;
    const amount = Number(amountStr);

    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount entered.");
      return;
    }

    try {
      await API.post("/payFees", {
        studentId: student._id,
        amountPaid: amount
      });
      alert("Payment recorded successfully! The transaction log and pending balance have been updated.");
      window.location.reload();
    } catch (err) {
      console.error("Failed to record payment", err);
      alert("Failed to record payment. Please check server logs.");
    }
  };

  const pendingStudents = students.filter(s => (s.totalFees || 0) > (s.feesPaid || 0));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-600 flex items-center gap-3 tracking-tighter">
            <Wallet className="text-emerald-500" size={36} />
            Fee Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium tracking-wide">Monitor collections, dispatch reminders, and audit institutional logs.</p>
        </div>

        <div className="flex flex-wrap items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-2 rounded-2xl md:rounded-4xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <AlertCircle size={18} />
            Defaulters ({pendingStudents.length})
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'transactions' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <CreditCard size={18} />
            Ledger
          </button>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 w-full overflow-hidden">
        <div className="flex items-center gap-2 pl-4 text-slate-400">
           <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder={`Search ${activeTab === 'pending' ? 'defaulters' : 'transactions'}...`}
          className="flex-1 bg-transparent border-0 focus:ring-0 text-sm font-bold placeholder:text-slate-400 py-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="glass border-0 bg-white/60 dark:bg-slate-800/60 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-xl p-4 min-h-100">
        {loading ? (
          activeTab === "pending" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </div>
                      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between">
                         <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                         <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </div>
                      <div className="flex justify-between">
                         <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                         <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </div>
                   </div>
                   <div className="flex gap-2 pt-2">
                      <div className="h-10 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                      <div className="h-10 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl bg-white/40 custom-scrollbar-hide animate-pulse">
              <table className="w-full text-left border-collapse min-w-175">
                 <thead>
                   <tr className="border-b border-slate-200/60 bg-white/50">
                     <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Student Information</th>
                     <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Amount Paid</th>
                     <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Transaction Date</th>
                     <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Receipt</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100/50">
                   {[1, 2, 3, 4, 5].map(i => (
                     <tr key={i}>
                       <td className="px-8 py-5">
                          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                       </td>
                       <td className="px-8 py-5 text-right flex justify-end">
                          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          )
        ) : activeTab === "pending" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {pendingStudents.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 font-medium text-lg bg-emerald-50/30 rounded-3xl border border-dashed border-emerald-200">
                🎉 Awesome! No pending fees across any student.
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="contents">
                {pendingStudents
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(student => {
                  const pendingAmount = student.totalFees - student.feesPaid;
                  const message = `*🎓 Educore Institute Notice*\n\nDear ${student.name},\nThis is an official reminder regarding your pending fees for the *${student.course || "enrolled"}* course.\n\n*Pending Details:*\n- Total Fee: ₹${student.totalFees}\n- Amount Paid: ₹${student.feesPaid}\n- *Pending Balance: ₹${pendingAmount}*\n\nPlease clear your dues at the earliest convenience to avoid any disruption in your classes.\n\nRegards,\n*Educore Administration !!*`;
                  return (
                    <motion.div key={student._id} variants={rowVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-red-500/10 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-black text-slate-800 dark:text-white text-xl tracking-tight">{student.name}</h3>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase mt-2">{student.course || "GENERAL"}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black px-4 py-1.5 rounded-xl text-sm border border-red-100 dark:border-red-500/20 shadow-sm">
                          ₹{pendingAmount}
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Total Fee</span>
                          <span className="font-bold text-slate-700">₹{student.totalFees || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Amount Paid</span>
                          <span className="font-bold text-emerald-600">₹{student.feesPaid || 0}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePayment(student)}
                          className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shadow-indigo-500/20"
                        >
                          <Wallet size={16} />
                          Receive
                        </button>

                        <a
                          href={`https://wa.me/91${student.phone}?text=${encodeURIComponent(message)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shadow-green-500/20"
                        >
                          <MessageCircle size={16} />
                          Remind
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white/40 custom-scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="border-b border-slate-200/60 bg-white/50">
                  <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Student Information</th>
                  <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Amount Paid</th>
                  <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Transaction Date</th>
                  <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Receipt</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-100/50"
              >
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-16 text-center text-slate-500 font-medium text-lg">
                      No fee records found.
                    </td>
                  </tr>
                ) : (
                  fees
                    .filter(f => (f.studentId?.name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((f) => (
                    <motion.tr
                      variants={rowVariants}
                      key={f._id}
                      className="hover:bg-white/80 transition-all duration-300 group cursor-pointer"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-emerald-600 transition-colors">
                          {f.studentId?.name || "Unknown Student"}
                        </div>
                        <div className="text-sm font-medium text-slate-500 mt-1">
                          {f.studentId?.phone || "No Phone"}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-lg font-black bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm border border-emerald-200/50">
                          ₹{f.amountPaid || f.amount || 0}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap font-medium text-slate-500">
                        <div className="bg-slate-100/80 px-4 py-2 rounded-xl inline-block text-sm">
                          {new Date(f.paymentDate || f.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <button 
                          onClick={() => generateFeeReceipt({ 
                            student: { 
                              name: f.studentId?.name || "Student", 
                              _id: f.studentId?._id || "ID", 
                              course: f.studentId?.course || "Course" 
                            }, 
                            transaction: { 
                              amount: f.amountPaid || f.amount || 0, 
                              remaining: (f.studentId?.totalFees || 0) - (f.studentId?.feesPaid || 0) 
                            } 
                          })}
                          className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 rounded-xl transition-all"
                          title="Download Receipt"
                        >
                          <Download size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Fees;