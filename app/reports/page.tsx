import { Topbar } from "@/components/Topbar";
import { BarChart3, TrendingUp, Users, CheckCircle2, DollarSign, Calendar } from "lucide-react";
import { getDashboardSummary } from "@/app/actions/dashboard";
import { getClients } from "@/app/actions/clients";
import { getProjects } from "@/app/actions/projects";

export default async function ReportsPage() {
  const stats = await getDashboardSummary();
  const clients = await getClients();
  const projects = await getProjects();

  return (
    <>
      <Topbar title="Agency Performance Reports" breadcrumb="Analytics" />

      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <TrendingUp className="text-indigo-600" /> Executive Overview
            </h2>
            <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <button className="px-4 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-md">Last 30 Days</button>
                <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-md transition-colors">Last Quarter</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ReportMetric label="Client Growth" current={stats.clientCount} target={30} trend="+12.5%" icon={<Users size={20}/>} color="bg-indigo-600" />
            <ReportMetric label="Revenue Goal" current={stats.totalRevenue} target={20000} trend="+8.2%" icon={<DollarSign size={20}/>} color="bg-emerald-600" isCurrency />
            <ReportMetric label="Project Efficiency" current={Math.round((projects.filter(p => p.status === 'LIVE').length / (projects.length || 1)) * 100)} target={100} trend="+5%" icon={<CheckCircle2 size={20}/>} color="bg-amber-600" isPercent />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Client Portfolio Mix</h3>
               <div className="space-y-6">
                 {clients.map(c => (
                   <div key={c.id} className="flex items-center justify-between">
                     <span className="text-sm font-bold text-gray-700">{c.name}</span>
                     <div className="flex-1 mx-8 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
                     </div>
                     <span className="text-xs font-black text-gray-400 uppercase">Premium</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4 w-full">Operations Health Score</h3>
               </div>
               <div className="flex flex-col items-center justify-center pt-8 pb-4">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* SVG Circle for visual flair */}
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                       <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={553} strokeDashoffset={553 - (553 * 0.85)} className="text-indigo-600" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                       <span className="text-4xl font-black text-gray-900 leading-none">85%</span>
                       <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-2">Optimal</span>
                    </div>
                  </div>
               </div>
               <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                  <div className="text-center border-r border-gray-50">
                    <p className="text-xl font-bold text-emerald-600">Stable</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Churn Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-indigo-600">4.2d</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg Lead Time</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ReportMetric({ label, current, target, trend, icon, color, isCurrency, isPercent }: any) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color} shadow-lg shadow-${color.split('-')[1]}-200`}>
          {icon}
        </div>
        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{trend}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
           <h4 className="text-2xl font-black text-gray-900 tracking-tight">
             {isCurrency ? `$${current.toLocaleString()}` : isPercent ? `${current}%` : current}
           </h4>
           <span className="text-xs font-bold text-gray-400">/ {isCurrency ? `$${target.toLocaleString()}` : target}</span>
        </div>
        <div className="mt-4 w-full h-1 bg-gray-50 rounded-full overflow-hidden">
           <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    </div>
  );
}
