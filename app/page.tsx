import { Topbar } from "@/components/Topbar";
import { Plus, Users, DollarSign, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getDashboardSummary } from "@/app/actions/dashboard";
import Link from "next/link";
import { StatCard, ActivityRow, ProgressItem } from "@/components/DashboardComponents";
import { DashboardStats } from "@/types/dashboard";
import ErrorRetry from "@/components/ErrorRetry";
import { formatDate } from "@/lib/formatDate";
import { STATUS_COLORS } from "@/lib/taskStatus";

export default async function DashboardPage() {
  let stats: DashboardStats | null = null;
  let errorMsg: string | null = null;

  try {
    stats = await getDashboardSummary();
  } catch (err) {
    console.error("[DASHBOARD_PAGE_ERROR]", err);
    errorMsg = "Failed to load dashboard overview. Please check your connection or reload.";
  }

  // If loading failed, render a clean fallback error layout with client-side refresh button
  if (errorMsg || !stats) {
    return (
      <>
        <Topbar title="Dashboard Overview" breadcrumb="Home" />
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
          <div className="max-w-[1280px] mx-auto space-y-6">
            <div className="p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl text-sm font-bold flex items-center gap-3">
              <AlertTriangle size={20} />
              {errorMsg || "An unexpected error occurred while loading dashboard statistics."}
            </div>
            <div className="flex justify-center">
              <ErrorRetry />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Dynamic Agency Health calculation
  const healthStatus = stats.overdueTasks > 0 ? "At Risk" : "Stable";
  const healthColor = stats.overdueTasks > 0 ? "text-rose-600 font-black" : "text-emerald-600 font-black";
  const healthLabelColor = stats.overdueTasks > 0 ? "text-rose-600 font-black" : "text-indigo-600 font-black";
  const healthCardBg = stats.overdueTasks > 0 
    ? "bg-rose-50/50 border-rose-100/50" 
    : "bg-indigo-50/50 border-indigo-100/50";

  return (
    <>
      <Topbar title="Dashboard Overview" breadcrumb="Home" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Main Dashboard</h1>
              <p className="text-sm text-gray-500 font-medium">Welcome back, <span className="text-indigo-600 font-bold">{stats.userName || "Managing Director"}</span></p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/clients" className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all text-center shadow-sm">
                View Clients
              </Link>
              <Link href="/tasks/new" className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100">
                <Plus size={18} /> New Task
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
               label="ACTIVE CLIENTS" 
               value={stats.clientCount.toString()} 
               trend="Active" 
               icon={<Users size={20} />} 
               color="text-indigo-600" 
               bgColor="bg-indigo-50"
            />
            <StatCard 
               label="MONTHLY REVENUE" 
               value={stats.totalRevenue.toLocaleString("en-US", {
                 style: "currency",
                 currency: "USD",
                 maximumFractionDigits: 0
               })} 
               trend="Gross" 
               icon={<DollarSign size={20} />} 
               color="text-emerald-600" 
               bgColor="bg-emerald-50"
            />
            <StatCard 
               label="OPEN PROJECTS" 
               value={stats.projectCount.toString()} 
               trend="Pipeline" 
               icon={<Clock size={20} />} 
               color="text-amber-600" 
               bgColor="bg-amber-50"
            />
            <StatCard 
               label="OVERDUE TASKS" 
               value={stats.overdueTasks.toString()} 
               trend={stats.overdueTasks > 0 ? "Action Required" : "All Clear"} 
               icon={<AlertTriangle size={20} />} 
               color="text-rose-600" 
               bgColor="bg-rose-50"
               isWarning={stats.overdueTasks > 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity List */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Recent Operational History</h3>
                  <Link href="/tasks" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">View Tracker</Link>
               </div>
               <div className="space-y-8">
                  {stats.latestTasks.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 font-medium italic">No recent activity detected in the system.</div>
                  ) : (
                    stats.latestTasks.map((t) => (
                      <ActivityRow 
                         key={t.id}
                         initial={t.client?.name.charAt(0).toUpperCase() || "?"}
                         clientName={t.client?.name || "General"}
                         taskTitle={t.title}
                         time={formatDate(t.updatedAt)}
                         tag={t.status}
                         color={STATUS_COLORS[t.status] ?? "bg-gray-50 text-gray-500"}
                      />
                    ))
                  )}
               </div>
            </div>

            {/* Project Snapshot */}
            <div className="space-y-6">
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Project Status</h3>
                    <Link href="/projects" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Board</Link>
                  </div>
                  <div className="space-y-6">
                     {stats.latestProjects.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center italic">No active projects currently.</p>
                     ) : (
                        stats.latestProjects.map(p => (
                          <ProgressItem 
                            key={p.id} 
                            label={p.name} 
                            percent={p.progress} 
                          />
                        ))
                     )}
                  </div>
                  <div className={`mt-10 rounded-2xl p-6 border relative overflow-hidden group ${healthCardBg}`}>
                    <div className="relative z-10">
                      <p className={`text-[10px] font-black tracking-widest mb-2 uppercase ${healthLabelColor}`}>Agency Health</p>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">
                        System monitoring indicates{" "}
                        <span className={healthColor}>{healthStatus}</span> operations.{" "}
                        {stats.overdueTasks > 0 
                          ? `Please address the ${stats.overdueTasks} overdue items.` 
                          : "Great job on staying ahead of schedule!"
                        }
                      </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      {stats.overdueTasks > 0 
                        ? <AlertTriangle size={80} className="text-rose-600" />
                        : <CheckCircle2 size={80} className="text-indigo-600" />
                      }
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
