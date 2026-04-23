"use client";

import { useState } from "react";
import { X, CheckCircle2, User, Clock, Trash2, Video, Image, Save, Loader2 } from "lucide-react";
import { updateContentItem, deleteContentItem } from "@/app/actions/content";

interface ContentItemModalProps {
  item: any;
  onClose: () => void;
}

export default function ContentItemModal({ item, onClose }: ContentItemModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [notes, setNotes] = useState(item.notes || "");
  const [status, setStatus] = useState(item.status);
  const [date, setDate] = useState(item.scheduledDate ? new Date(item.scheduledDate).toISOString().split('T')[0] : "");

  const handleSave = async () => {
    setIsPending(true);
    const result = await updateContentItem(item.id, {
      notes,
      status,
      scheduledDate: date
    });
    if (result.success) {
      onClose();
    }
    setIsPending(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setIsPending(true);
      const result = await deleteContentItem(item.id);
      if (result.success) onClose();
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'REEL' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'}`}>
              {item.type === 'REEL' ? <Video size={24} /> : <Image size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{item.type} DETAILS</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ref ID: {item.id.slice(-8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publish Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/10"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PRODUCTION">In Production</option>
                  <option value="REVIEW">Under Review</option>
                  <option value="PUBLISHED">Published (Complete)</option>
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none" 
                />
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Content Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-[24px] text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/10 h-32" 
              placeholder="Topic, description or brief..."
            />
          </div>

          {/* User Tracking Info */}
          <div className="bg-indigo-50/50 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                  <User size={14} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Last Updated By</p>
                  <p className="text-xs font-bold text-indigo-900">{item.lastUpdatedBy?.name || "System Initial"}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Modified</p>
               <div className="flex items-center gap-1 text-xs font-bold text-indigo-900 justify-end">
                  <Clock size={12} /> {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <button 
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-700 text-xs font-black uppercase tracking-widest transition-colors"
          >
            <Trash2 size={16} /> Delete Plan
          </button>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={onClose}
               className="px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest"
             >
               Cancel
             </button>
             <button 
               onClick={handleSave}
               disabled={isPending}
               className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
             >
               {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
               Save Changes
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
