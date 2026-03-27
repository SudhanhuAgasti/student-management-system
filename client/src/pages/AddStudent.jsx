import { useState, useEffect } from "react";
import API from "../services/api";
import { UserPlus, User, Phone, BookOpen, CheckCircle2, IndianRupee } from "lucide-react";

function AddStudent() {
  const [student, setStudent] = useState({
    name: "",
    phone: "",
    course: "",
    totalFees: ""
  });
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error fetching courses", err));
  }, []);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const addStudent = async (e) => {
    e.preventDefault();
    if (!student.course) {
      setStatus({ message: "Please select a course.", type: "error" });
      return;
    }
    setIsLoading(true);
    setStatus({ message: "", type: "" });
    try {
      await API.post("/addStudent", student);
      setStatus({ message: "Student added successfully!", type: "success" });
      setStudent({ name: "", phone: "", course: "", totalFees: "" });
    } catch (err) {
      console.error(err);
      setStatus({ message: err.response?.data?.message || "Failed to add student.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <UserPlus className="text-indigo-600" size={28} />
          Add New Student
        </h1>
        <p className="text-slate-500 mt-1">Fill in the details below to enroll a new student.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
        <form onSubmit={addStudent} className="space-y-6">

          {status.message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
              {status.type === "success" && <CheckCircle2 size={20} className="text-emerald-500" />}
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="name"
                  value={student.name}
                  required
                  placeholder="e.g. John Doe"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="phone"
                  value={student.phone}
                  required
                  placeholder="+1 (555) 000-0000"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Assign Course</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="course"
                  value={student.course}
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 appearance-none"
                >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                  {!courses.find(c => ["MCA", "MBA", "M-TECH", "B-TECH"].includes(c.name)) && (
                    <>
                      <option value="MCA">MCA</option>
                      <option value="MBA">MBA</option>
                      <option value="M-TECH">M-TECH</option>
                      <option value="B-TECH">B-TECH</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["MCA", "MBA", "M-TECH", "B-TECH"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setStudent({ ...student, course: c })}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      student.course === c 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    + {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Total Fees (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  name="totalFees"
                  value={student.totalFees}
                  required
                  placeholder="Amount in INR"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-70 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              {isLoading ? "Enrolling..." : "Submit Enrollment"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

export default AddStudent;