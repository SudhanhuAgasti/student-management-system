import React from 'react';
import { BookOpen, Github, Twitter, Linkedin, Heart, Instagram } from 'lucide-react';

const StudentTeacherFooter = () => {
  return (
    <footer className="mt-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 pt-12 pb-8 px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BookOpen size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
                Edu<span className="text-transparent bg-clip-text bg-linear-to-br from-indigo-500 to-purple-500">Core</span>
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering education through seamless management. Your digital gateway to academic excellence and efficient learning.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Platform
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">My Courses</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">Class Schedule</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">Results & Grades</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">Library Access</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Support
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">Student Guide</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">Teacher Toolkit</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter/Status */}
          <div className="bg-linear-to-br  from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl p-6 border border-indigo-500/10 dark:border-indigo-500/20">
            <h3 className="text-slate-900 dark:text-white font-bold mb-2">Campus Updates</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Stay informed about the latest campus events and academic announcements.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans" 
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/20">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            © 2026 EduCore. All academic rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs transition-colors">Terms of Service</a>
            <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
              Made with <Heart size={12} className="text-rose-500 fill-rose-500" /> for EduCore
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StudentTeacherFooter;
