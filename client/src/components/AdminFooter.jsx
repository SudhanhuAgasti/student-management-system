import React from 'react';
import { Shield, Activity, Database, Server, Cpu } from 'lucide-react';

const AdminFooter = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10 pb-8 px-8 bg-slate-50 dark:bg-slate-900/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-10">
          {/* Admin Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center shadow-xl">
                <Shield size={20} className="text-white dark:text-slate-900" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Admin Console
                </h2>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">EduCore Infrastructure</p>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs">
              Secure administrative gateway for full system orchestration, student lifecycle management, and institutional analytics.
            </p>
          </div>

          {/* System Telemetry (Simulated) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1 w-full lg:w-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <Activity size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">System Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Operational</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <Database size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Database</span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Connected</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <Server size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Storage</span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">82% Available</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Cluster</span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">v3.4.2-stable</p>
            </div>
          </div>
        </div>

        {/* Administrative Links & Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2">
            <a href="#" className="text-[11px] font-bold text-slate-500 hover:text-indigo-500 transition-colors uppercase tracking-wider">Security Logs</a>
            <a href="#" className="text-[11px] font-bold text-slate-500 hover:text-indigo-500 transition-colors uppercase tracking-wider">API Documentation</a>
            <a href="#" className="text-[11px] font-bold text-slate-500 hover:text-indigo-500 transition-colors uppercase tracking-wider">Access Control</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 py-1.5 px-3 rounded-md bg-slate-200/50 dark:bg-slate-800/50">
              SECURE SESSION ID: 88-X2-EduCore
            </span>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
              © 2026 Administrative Control Panel
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
