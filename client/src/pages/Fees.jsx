import { useEffect, useState } from "react";
import API from "../services/api";
import { CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
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
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
          <CreditCard className="text-purple-500" />
          Financial Records
        </h1>
        <p className="text-gray-500 mt-1">Review the historical log of all fee transactions and payments.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Date</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-100"
            >
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">Loading fee records...</td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No fee records found.</td>
                </tr>
              ) : (
                fees.map((f) => (
                  <motion.tr 
                    variants={rowVariants}
                    key={f._id} 
                    className="hover:bg-purple-50/30 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{f.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ₹{f.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(f.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
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