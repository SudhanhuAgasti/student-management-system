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
import PageTransition from "./components/PageTransition";
import { AnimatePresence } from "framer-motion";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-900 font-sans antialiased overflow-hidden">
      {!isAuthPage && (
        <>
          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar Drawer */}
          <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex`}>
             <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen overflow-x-hidden ${!isAuthPage ? "w-full md:w-auto" : ""}`}>
        
        {/* Mobile Top Bar */}
        {!isAuthPage && (
           <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 z-30 sticky top-0 shadow-sm">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                 <BookOpen size={20} className="text-white" />
               </div>
               <h2 className="text-lg font-bold tracking-wide">
                 Edu<span className="text-indigo-400">Core</span>
               </h2>
             </div>
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
               <Menu size={24} />
             </button>
           </div>
        )}

        <div className={`flex-1 ${!isAuthPage ? "p-4 md:p-8" : ""}`}>
          <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/students" element={<PageTransition><Students /></PageTransition>} />
              <Route path="/addStudent" element={<PageTransition><AddStudent /></PageTransition>} />
              <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
              <Route path="/fees" element={<PageTransition><Fees /></PageTransition>} />
              <Route path="/attendance" element={<PageTransition><Attendance /></PageTransition>} />
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