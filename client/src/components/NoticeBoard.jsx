import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, Ticket, Calendar, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import API from '../services/api';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'general' });

  useEffect(() => {
    fetchNotices();
    setIsAdmin(localStorage.getItem('userRole') === 'admin');
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await API.get('/notices');
      setNotices(res.data);
    } catch (err) {
      console.error("Failed to fetch notices");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/notices', newNotice);
      setShowModal(false);
      setNewNotice({ title: '', content: '', type: 'general' });
      fetchNotices();
    } catch (err) {
      alert("Failed to create notice");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await API.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'urgent': return "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20";
      case 'event': return "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20";
      case 'holiday': return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
      default: return "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-500/20";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return <AlertTriangle size={14} />;
      case 'event': return <Calendar size={14} />;
      case 'holiday': return <Ticket size={14} />;
      default: return <Megaphone size={14} />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
            <Megaphone size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-lg leading-none">Notice Board</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Stay updated with institute news</p>
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {notices.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 py-10">
            <Megaphone size={40} className="mb-2 opacity-20" />
            <p className="text-sm font-bold">No announcements yet</p>
          </div>
        ) : (
          notices.map((notice) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              key={notice._id} 
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 group relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getTypeStyle(notice.type)}`}>
                  {getTypeIcon(notice.type)}
                  {notice.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{notice.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {notice.content}
              </p>
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(notice._id)}
                  className="absolute top-10 right-4 text-rose-500 transition-all p-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl"
                  title="Delete Notice"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add Notice Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.form 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onSubmit={handleCreate}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Post New Notice</h2>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Title</label>
                  <input 
                    required 
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    placeholder="e.g., Annual Sports Meet"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Announcement Type</label>
                  <select 
                    value={newNotice.type}
                    onChange={(e) => setNewNotice({...newNotice, type: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  >
                    <option value="general">General Announcement</option>
                    <option value="urgent">Urgent / Important</option>
                    <option value="event">Upcoming Event</option>
                    <option value="holiday">Holiday Notice</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Content</label>
                  <textarea 
                    required 
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white resize-none"
                    placeholder="Provide details about the announcement..."
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-600/25 mt-4">
                  Publish Announcement
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticeBoard;
