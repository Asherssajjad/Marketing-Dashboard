import { Topbar } from "@/components/Topbar";
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ReportsPage() {
  const clientsCount = await prisma.client.count();
  const projectsCount = await prisma.project.count({ where: { status: 'LIVE' } });
  
  return (
    <>
      <Topbar title="Analytics & Reports" breadcrumb="Home" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Top Row KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard label="M.R.R" value="$12,480" change="+12.5%" positive color="text-indigo-600" />
            <MetricCard label="AD SPEND" value="$4,200" change="+2.1%" positive color="text-red-500" />
            <MetricCard label="C.A.C" value="$145.20" change="-5.4%" positive={false} color="text-emerald-500" />
            <MetricCard label="ROAS" value="4.2x" change="+0.4x" positive color="text-blue-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Revenue Chart Placeholder */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">Revenue Growth</h3>
                    <p className="text-xs text-gray-500 font-medium">Monthly recurring revenue over the last 6 months</p>
                 </div>
                 <select className="text-xs font-bold text-gray-500 border border-gray-100 rounded-lg px-3 py-1.5 focus:outline-none">
                    <option>Last 6 Months</option>
                    <option>Year to Date</option>
                 </select>
              </div>
              
              <div className="h-[300px] w-full flex items-end justify-between gap-4 px-4 pb-4 border-b border-gray-100 mb-4">
                 <Bar height="40%" label="May" />
                 <Bar height="55%" label="Jun" />
                 <Bar height="48%" label="Jul" />
                 <Bar height="72%" label="Aug" />
                 <Bar height="85%" label="Sep" active />
                 <Bar height="95%" label="Oct" active />
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">System Health</h3>
                  <div className="space-y-6">
                     <HealthItem label="Project Completion" percent={82} color="bg-indigo-600" />
                     <HealthItem label="Content Quota Hit" percent={94} color="bg-emerald-500" />
                     <HealthItem label="Client Satisfaction" percent={89} color="bg-blue-500" />
                     <HealthItem label="Payment On-time" percent={100} color="bg-rose-500" />
                  </div>
                </div>
                <button className="w-full mt-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                   Download Detailed PDF
                </button>
            </div>

          </div>

          {/* Bottom Table: Client Performance Snapshot */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50">
               <h3 className="text-lg font-bold text-gray-900 tracking-tight">Individual Performance</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left font-medium text-sm">
                   <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Revenue</th>
                        <th className="px-6 py-4">Efficiency</th>
                        <th className="px-6 py-4 text-right">Trend</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      <PerfRow name="Luxe E-commerce" status="High" revenue="$2,400" efficiency="98%" trend="up" />
                      <PerfRow name="Global Tech" status="Medium" revenue="$1,800" efficiency="72%" trend="down" />
                      <PerfRow name="Pet Paradise" status="Critical" revenue="$900" efficiency="45%" trend="down" />
                   </tbody>
                </table>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}

function MetricCard({ label, value, change, positive, color }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className={`text-2xl font-black ${color.includes('red') ? 'text-gray-900' : 'text-gray-900'}`}>{value}</h4>
        <div className={`flex items-center gap-0.5 text-xs font-bold ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
           {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
           {change}
        </div>
      </div>
    </div>
  )
}

function Bar({ height, label, active = false }: any) {
   return (
      <div className="flex flex-col items-center gap-4 h-full flex-1">
         <div className="w-full flex-1 flex items-end justify-center rounded-t-lg">
            <div 
              className={`w-12 rounded-t-lg transition-all duration-1000 ${active ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-gray-100'}`} 
              style={{ height }}></div>
         </div>
         <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
      </div>
   )
}

function HealthItem({ label, percent, color }: any) {
   return (
      <div>
         <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-widest text-gray-500">
            <span>{label}</span>
            <span className="text-gray-900">{percent}%</span>
         </div>
         <div className="h-1.5 w-full bg-gray-100 rounded-full">
            <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
         </div>
      </div>
   )
}

function PerfRow({ name, status, revenue, efficiency, trend }: any) {
   return (
      <tr className="hover:bg-gray-50/50 transition-colors">
         <td className="px-6 py-4 font-bold text-gray-900">{name}</td>
         <td className="px-6 py-4">
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest italic ${status === 'High' ? 'bg-emerald-50 text-emerald-600' : status === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
               {status}
            </span>
         </td>
         <td className="px-6 py-4 font-bold text-gray-500">{revenue}</td>
         <td className="px-6 py-4">
            <div className="flex items-center gap-2">
               <div className="w-10 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${efficiency === '98%' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: efficiency }}></div>
               </div>
               <span className="text-xs font-bold text-gray-400">{efficiency}</span>
            </div>
         </td>
         <td className="px-6 py-4 text-right">
            {trend === 'up' ? <ArrowUpRight className="ml-auto text-emerald-500" size={16} /> : <ArrowDownRight className="ml-auto text-rose-500" size={16} />}
         </td>
      </tr>
   )
}
