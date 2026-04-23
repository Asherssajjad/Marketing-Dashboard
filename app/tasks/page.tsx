import { Topbar } from "@/components/Topbar";
import { getTasks, createTask, updateTaskStatus, deleteTask } from "@/app/actions/tasks";
import { getClients } from "@/app/actions/clients";
import { getProjects } from "@/app/actions/projects";
import { CheckCircle2, CircleDashed, Clock, MessageSquare, AlertCircle, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function TasksPage() {
  const [tasks, clients, projects] = await Promise.all([
    getTasks(),
    getClients(),
    getProjects()
  ]);

  return (
    <>
      <Topbar title="Task Manager" breadcrumb="Operations" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg">List View</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                    <th className="px-6 py-4 w-12"></th>
                    <th className="px-6 py-4">Task Details</th>
                    <th className="px-6 py-4">Related To</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Due Date</th>
                    <th className="px-6 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                        No tasks found. Create one using the panel on the right.
                      </td>
                    </tr>
                  ) : (
                    tasks.map(task => (
                      <TaskRow key={task.id} task={task} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full lg:w-[340px] shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Create Task</h2>
              <form action={createTask} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Title *</label>
                  <input name="title" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Design assets" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
                  <textarea name="description" rows={2} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Add context..." />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
                    <select name="status" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none">
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Due Date *</label>
                    <input name="dueDate" type="date" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Link to Client</label>
                  <select name="clientId" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none">
                    <option value="">None</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Link to Project</label>
                  <select name="projectId" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none">
                    <option value="">None</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 mt-2">
                  Save Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TaskRow({ task }: any) {
  const isDone = task.status === "DONE";
  const statusColors: any = {
    'TODO': 'bg-gray-100 text-gray-700',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700',
    'REVIEW': 'bg-amber-100 text-amber-700',
    'DONE': 'bg-emerald-100 text-emerald-700',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

  return (
    <tr className={`hover:bg-gray-50/50 transition-colors group ${isDone ? 'opacity-60' : ''}`}>
      <td className="px-6 py-4">
         <form action={async () => { "use server"; await updateTaskStatus(task.id, isDone ? "TODO" : "DONE") }}>
            <button type="submit" className={`p-0.5 rounded-full transition-colors ${isDone ? 'text-emerald-500' : 'text-gray-300 hover:text-gray-500'}`}>
               {isDone ? <CheckCircle2 size={24} /> : <CircleDashed size={24} />}
            </button>
         </form>
      </td>
      <td className="px-6 py-4">
        <p className={`font-bold text-sm leading-tight ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span className="flex items-center gap-1"><MessageSquare size={12} /> {task.comments?.length || 0}</span>
          {task.assignee ? <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">@{task.assignee.name}</span> : <span>Unassigned</span>}
        </div>
      </td>
      <td className="px-6 py-4">
        {task.client ? (
          <span className="text-xs font-bold text-indigo-600">{task.client.name}</span>
        ) : task.project ? (
          <span className="text-xs font-bold text-purple-600">{task.project.name}</span>
        ) : (
          <span className="text-xs font-medium text-gray-400">Internal</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 text-xs font-bold text-gray-600">
          {isOverdue && <AlertCircle size={14} className="text-red-500" />}
          <span className={isOverdue ? 'text-red-600 font-black' : ''}>
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) : 'No Date'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <form action={async () => { "use server"; await deleteTask(task.id) }}>
          <button type="submit" className="text-gray-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1">
            <Trash2 size={16} />
          </button>
        </form>
      </td>
    </tr>
  );
}
