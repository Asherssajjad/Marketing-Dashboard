import { Topbar } from "@/components/Topbar";
import { Plus, Users, DollarSign, Clock, AlertTriangle, MessageSquare, CheckCircle2 } from "lucide-react";
import { getDashboardSummary } from "@/app/actions/dashboard";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await getDashboardSummary();

  return (
    <>
      <Topbar title="Dashboard Overview" breadcrumb="Home" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Main Dashboard</h1>
              <p className="text-sm text-gray-500 font-medium">Welcome back, Managing Director</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Export CSV</button>
              <Link href="/clients/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-indigo-100">
                <Plus size={18} /> Add New Client
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
               value={`$${stats.totalRevenue.toLocaleString()}`} 
               trend="Estimated" 
               icon={<DollarSign size={20} />} 
               color="text-emerald-600" 
               bgColor="bg-emerald-50"
            />
            <StatCard 
               label="ACTIVE PROJECTS" 
               value={stats.projectCount.toString()} 
               trend="In Pipeline" 
               icon={<Clock size={20} />} 
               color="text-amber-600" 
               bgColor="bg-amber-50"
            />
            <StatCard 
               label="OVERDUE TASKS" 
               value={stats.overdueTasks.toString()} 
               trend={stats.overdueTasks > 0 ? "Critical" : "Clear"} 
               icon={<AlertTriangle size={20} />} 
               color="text-rose-600" 
               bgColor="bg-rose-50"
               isWarning={stats.overdueTasks > 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Operational History</h3>
                  <Link href="/tasks" className="text-sm text-indigo-600 font-bold hover:underline">View All</Link>
               </div>
               <div className="space-y-6">
                  {stats.latestTasks.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 font-medium">No recent activity detected.</div>
                  ) : (
                    stats.latestTasks.map((t) => (
                      <ActivityRow 
                         key={t.id}
                         initial={t.client?.name.charAt(0) || "T"}
                         title={<span>Task <strong>{t.title}</strong> added for {t.client?.name || "General"}</span>}
                         time={new Date(t.createdAt).toLocaleDateString()}
                         tag="Activity"
                         color="bg-indigo-50 text-indigo-600"
                      />
                    ))
                  )}
               </div>
            </div>

            {/* Project Snapshot */}
            <div className="space-y-6">
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Projects</h3>
                  <div className="space-y-4">
                     {stats.latestProjects.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">No active projects.</p>
                     ) : (
                        stats.latestProjects.map(p => (
                          <ProgressItem 
                            key={p.id} 
                            label={p.name} 
                            percent={p.status === "LIVE" ? 100 : 25} 
                            color="bg-indigo-500" 
                          />
                        ))
                     )}
                  </div>
                  <div className="mt-8 bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 tracking-wider mb-2">PRO TIP</p>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">Review your overdue tasks every Monday morning to maintain high client satisfaction.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, trend, icon, color, bgColor, isWarning }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor} ${color}`}>
          {icon}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${isWarning ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'}`}>{trend}</span>
      </div>
      <div>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</h3>
        <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function ActivityRow({ initial, title, time, tag, color }: any) {
  return (
    <div className="flex items-start justify-between group cursor-pointer">
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5 ${color}`}>
          {initial}
        </div>
        <div>
          <div className="text-sm text-gray-900 font-medium group-hover:text-indigo-600 transition-colors">{title}</div>
          <p className="text-xs text-gray-400 font-medium mt-1">{time}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase border border-gray-100 px-2 py-0.5 rounded">{tag}</span>
    </div>
  );
}

function ProgressItem({ label, percent, color }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-gray-700 truncate pr-2">{label}</span>
        <span className="text-xs font-bold text-indigo-600">{percent}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
