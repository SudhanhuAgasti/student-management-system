import { useEffect, useState } from "react";
import API from "../services/api";
import { CreditCard, Sparkles } from "lucide-react";
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

function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/fees")
      .then((res) => {
        setFees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch fees", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center gap-3 tracking-tight">
          <CreditCard className="text-emerald-500" size={36} />
          Financial Records
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Review the historical log of all fee transactions and payments seamlessly.</p>
      </div>

      <div className="glass border-0 bg-white/60 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden backdrop-blur-xl p-2">
        <div className="overflow-x-auto rounded-[1.5rem] bg-white/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 bg-white/50">
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Amount Paid</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Transaction Date</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-100/50"
            >
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center text-slate-500 font-medium text-lg">
                    <div className="flex items-center justify-center gap-3">
                      <Sparkles className="animate-spin text-emerald-400" /> Loading financial records...
                    </div>
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-16 text-center text-slate-500 font-medium text-lg">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                fees.map((f) => (
                  <motion.tr 
                    variants={rowVariants}
                    key={f._id} 
                    className="hover:bg-white/80 transition-all duration-300 group cursor-pointer"
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.9)" }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <td className="px-8 py-5 whitespace-nowrap font-bold text-slate-800 text-lg tracking-tight group-hover:text-emerald-600 transition-colors">
                      {f.studentName}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-lg font-black bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm border border-emerald-200/50 group-hover:scale-105 transition-transform">
                        ₹{f.amount}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap font-medium text-slate-500">
                      <div className="bg-slate-100/80 px-4 py-2 rounded-xl inline-block text-sm">
                        {new Date(f.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Fees;