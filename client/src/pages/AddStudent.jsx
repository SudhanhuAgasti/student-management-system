import { useState, useEffect } from "react";
import API from "../services/api";
import { UserPlus, User, Phone, BookOpen, CheckCircle2, IndianRupee } from "lucide-react";

function AddStudent() {
  const [student, setStudent] = useState({
    name: "",
    phone: "",
    rollNumber: "",
    course: "",
    totalFees: "",
    parentPhone: ""
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
    const { name, value } = e.target;
    setStudent(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "course") {
        const selectedCourse = courses.find(c => c.name === value);
        if (selectedCourse) {
          updated.totalFees = selectedCourse.fees;
        }
      }
      return updated;
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
      const res = await API.post("/addStudent", student);
      setStatus({
        message: "Student added successfully! Now register their face data.",
        type: "success",
        showFaceBtn: true
      });
      setStudent({ name: "", phone: "", rollNumber: "", course: "", totalFees: "", parentPhone: "" });
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
        <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
          <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl">
            <UserPlus className="text-indigo-600 dark:text-indigo-400" size={32} />
          </div>
          Add New Student
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium tracking-wide">Fill in the details below to enroll a new member into the institution.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-700 transition-colors">
        <form onSubmit={addStudent} className="space-y-6">

          {status.message && (
            <div className={`p-4 rounded-xl flex flex-col gap-3 text-sm font-semibold ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
              <div className="flex items-center gap-3">
                {status.type === "success" && <CheckCircle2 size={20} className="text-emerald-500" />}
                {status.message}
              </div>
              {status.showFaceBtn && (
                <button
                  type="button"
                  onClick={() => window.location.href = "/face-registration"}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors w-fit"
                >
                  Go to Face Registration
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  name="name"
                  value={student.name}
                  required
                  placeholder="e.g. John Doe"
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  name="phone"
                  value={student.phone}
                  required
                  placeholder="+91 0000 0000"
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Roll Number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] group-focus-within:text-indigo-500 transition-colors uppercase tracking-widest">UID</div>
                <input
                  name="rollNumber"
                  value={student.rollNumber}
                  required
                  placeholder="e.g. CS2024001"
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Parent's WhatsApp Number (Mandatory)</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  name="parentPhone"
                  value={student.parentPhone}
                  required
                  placeholder="For Automated Attendance Alerts"
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Assign Program</label>
              <div className="relative group">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <select 
                  name="course"
                  value={student.course}
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 
bg-slate-50 dark:bg-slate-900 
border border-slate-300 dark:border-slate-700 
rounded-2xl 
overflow-hidden
shadow-sm 
hover:border-indigo-500 hover:shadow-lg 
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
transition duration-300 ease-in-out 
text-slate-800 dark:text-white font-semibold 
appearance-none cursor-pointer"
                >
                  <option value="">📚 Select a course</option>


                  <option value="MBA">🎓 MBA • Business</option>
                  <option value="MCA">💻 MCA • Computer Applications</option>
                  <option value="M-TECH">🛠️ M-TECH • Engineering</option>
                  <option value="B-TECH">⚙️ B-TECH • Technology</option>
                  <option value="DIPLOMA">📘 DIPLOMA • Technical</option>


                  {courses.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Tuition Fees (₹)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="number"
                  name="totalFees"
                  value={student.totalFees}
                  required
                  placeholder="Amount in INR"
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-white font-black text-xl"
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