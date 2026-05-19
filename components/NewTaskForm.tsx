"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/app/actions/tasks";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface NewTaskFormProps {
  clients: Client[];
  projects: Project[];
}

export default function NewTaskForm({ clients, projects }: NewTaskFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await createTask(formData);
        if (result.success) {
          setStatusMessage({ success: true, text: result.message || "Task created successfully!" });
          setTimeout(() => {
            router.push("/tasks");
          }, 1000);
        } else {
          setStatusMessage({ success: false, text: result.message || "Failed to create task." });
        }
      } catch (err) {
        console.error(err);
        setStatusMessage({ success: false, text: "An unexpected error occurred." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {statusMessage && (
        <div 
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
            statusMessage.success 
              ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
              : "bg-rose-50 border-rose-100 text-rose-700"
          }`}
        >
          {statusMessage.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {statusMessage.text}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Title *</label>
        <input 
          name="title" 
          required 
          disabled={isPending}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50" 
          placeholder="e.g., Design UI Assets" 
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Description</label>
        <textarea 
          name="description" 
          rows={3} 
          disabled={isPending}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50" 
          placeholder="Add detailed context or notes..." 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</label>
          <select 
            name="status" 
            disabled={isPending}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Due Date *</label>
          <input 
            name="dueDate" 
            type="date" 
            required 
            disabled={isPending}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50" 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Link to Client</label>
        <select 
          name="clientId" 
          disabled={isPending}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
        >
          <option value="">None (Internal)</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Link to Project</label>
        <select 
          name="projectId" 
          disabled={isPending}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
        >
          <option value="">None</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="flex gap-3 pt-3">
        <button 
          type="button"
          onClick={() => router.push("/tasks")}
          disabled={isPending}
          className="flex-1 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
