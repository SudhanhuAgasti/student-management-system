import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Menu, BookOpen } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Fees from "./pages/Fees";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import FaceRegistration from "./pages/FaceRegistration";
import TeacherClasses from "./pages/TeacherClasses";
import TeacherNotes from "./pages/TeacherNotes";
import AdminTeacherClasses from "./pages/AdminTeacherClasses";
import StudentContent from "./pages/StudentContent";
import PageTransition from "./components/PageTransition";
import { AnimatePresence } from "framer-motion";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 dark:bg-[#020617] min-h-screen text-slate-800 dark:text-slate-100 font-sans antialiased overflow-hidden relative transition-colors duration-500">
      
      {/* Global Background Elements */}
      {!isAuthPage && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl transition-colors duration-500"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl transition-colors duration-500"></div>
        </div>
      )}

      {!isAuthPage && (
        <>
          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar Drawer */}
          <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:sticky md:translate-x-0 md:top-0 md:h-screen transition-transform duration-300 ease-in-out flex shadow-2xl md:shadow-none`}>
             <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen overflow-x-hidden relative z-10 ${!isAuthPage ? "w-full md:w-auto" : ""}`}>
        
        {/* Mobile Top Bar */}
        {!isAuthPage && (
           <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 z-30 sticky top-0 shadow-sm backdrop-blur-lg transition-colors">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                 <BookOpen size={22} className="text-white" />
               </div>
               <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
                 Edu<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Core</span>
               </h2>
             </div>
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none">
               <Menu size={24} />
             </button>
           </div>
        )}

        <div className={`flex-1 ${!isAuthPage ? "p-4 md:p-8 lg:p-10" : ""}`}>
          <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            
            <Route element={<ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/my-content" element={<PageTransition><StudentContent /></PageTransition>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route path="/teacher-classes" element={<PageTransition><TeacherClasses /></PageTransition>} />
              <Route path="/teacher-notes" element={<PageTransition><TeacherNotes /></PageTransition>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin-teacher-classes" element={<PageTransition><AdminTeacherClasses /></PageTransition>} />
              <Route path="/students" element={<PageTransition><Students /></PageTransition>} />
              <Route path="/face-registration" element={<PageTransition><FaceRegistration /></PageTransition>} />
              <Route path="/addStudent" element={<PageTransition><AddStudent /></PageTransition>} />
              <Route path="/attendance" element={<PageTransition><Attendance /></PageTransition>} />
              <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
              <Route path="/fees" element={<PageTransition><Fees /></PageTransition>} />
            </Route>
          </Routes>
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;