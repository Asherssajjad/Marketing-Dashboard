import { Topbar } from "@/components/Topbar";
import { getTasks, createTask, updateTaskStatus } from "@/app/actions/tasks";
import { CheckCircle2, CircleDashed, Clock, MessageSquare, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <>
      <Topbar title="Task Manager" breadcrumb="Operations" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Main Task List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg">List View</button>
                <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 font-bold text-sm rounded-lg">Kanban Board</button>
              </div>
              
              <div className="flex items-center gap-2">
                <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none shadow-sm">
                  <option>All Tasks</option>
                  <option>My Tasks</option>
                  <option>Overdue Only</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                    <th className="px-6 py-4 w-12"></th>
                    <th className="px-6 py-4">Task Details</th>
                    <th className="px-6 py-4">Client/Project</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
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

          {/* Right Sidebar: Create Task Form */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Create Task</h2>
              <form action={createTask} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Title *</label>
                  <input name="title" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Design assets" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
                  <textarea name="description" rows={3} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Add context..." />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
                  <select name="status" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Needs Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Due Date *</label>
                  <input name="dueDate" type="date" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors mt-2 shadow-sm">
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

  const statusLabels: any = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'REVIEW': 'Review',
    'DONE': 'Done',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

  return (
    <tr className={`hover:bg-gray-50/50 transition-colors group ${isDone ? 'opacity-60' : ''}`}>
      <td className="px-6 py-4">
         {/* Simplified Server Action for ticking a task */}
         <form action={async () => { "use server"; await updateTaskStatus(task.id, isDone ? "TODO" : "DONE") }}>
            <button type="submit" className={`p-0.5 rounded-full hover:bg-gray-200 transition-colors ${isDone ? 'text-emerald-500' : 'text-gray-300 hover:text-gray-500'}`}>
               {isDone ? <CheckCircle2 size={24} /> : <CircleDashed size={24} />}
            </button>
         </form>
      </td>
      <td className="px-6 py-4">
        <p className={`font-bold text-sm leading-tight ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-gray-400">
          <span className="flex items-center gap-1"><MessageSquare size={14} /> {task.comments?.length || 0}</span>
          {task.assignee ? <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">@{task.assignee.name}</span> : <span>Unassigned</span>}
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
        Internal Project
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${statusColors[task.status]}`}>
          {statusLabels[task.status] || task.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 text-sm font-medium">
          {isOverdue && <AlertCircle size={16} className="text-red-500" />}
          <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}>
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) : 'No Date'}
          </span>
        </div>
      </td>
    </tr>
  );
}
