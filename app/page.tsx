import { Topbar } from "@/components/Topbar";
import { Users, CreditCard, LayoutList, Target, Bell, Search, Menu, LogOut, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" breadcrumb="Pages" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Action Buttons Row */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm shadow-indigo-600/20">
              <Users size={16} />
              New Client
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors shadow-sm">
              <span className="font-bold">›</span> New Project
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors shadow-sm">
              <CheckCircle2 size={16} /> Create Task
            </button>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <KpiCard icon={<Users className="text-blue-500" size={20} />} title="Active Clients" value="24" trend="+12%" iconBg="bg-blue-50" />
            <KpiCard icon={<CreditCard className="text-emerald-500" size={20} />} title="Monthly Revenue" value="$42,500" trend="+8.2%" iconBg="bg-emerald-50" />
            <KpiCard icon={<Target className="text-orange-500" size={20} />} title="Overdue Tasks" value="8" trend="-2 today" isWarning iconBg="bg-orange-50" />
            <KpiCard icon={<LayoutList className="text-purple-500" size={20} />} title="Pending Payments" value="5" trend="Next: 12th" iconBg="bg-purple-50" isNeutral />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Content Delivery</h2>
                  <p className="text-sm text-gray-500">Volume across last 6 months</p>
                </div>
                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700 focus:outline-none">
                  <option>Year 2024</option>
                </select>
              </div>
              
              <div className="h-48 flex items-end justify-between px-4 pb-4 border-b border-gray-100 relative">
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
                  <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
                  <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
                </div>
                {/* Simulated Chart Bars */}
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                  <div key={month} className="flex flex-col items-center gap-3 z-10 w-12">
                    <div className={`w-10 rounded-t-sm bg-indigo-500 hover:bg-indigo-600 transition-all ${[40, 60, 45, 80, 50, 75][i]}%`} style={{minHeight: `${[40, 60, 45, 80, 50, 75][i]}%`}}></div>
                    <span className="text-xs font-medium text-gray-400">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Status Pie */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Payment Status</h2>
                <p className="text-sm text-gray-500">Overall distribution</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center py-6">
                <div className="relative w-40 h-40">
                  {/* Simplified CSS Circle for demo */}
                  <div className="absolute inset-0 rounded-full border-[12px] border-indigo-500 border-r-emerald-500 border-t-emerald-500 border-b-rose-500 transform rotate-45"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white m-[12px] rounded-full">
                    <span className="text-2xl font-bold text-gray-900">75%</span>
                    <span className="text-[10px] font-bold text-gray-400 mt-1">PAID</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-gray-600 font-medium">Paid</span></div>
                  <span className="font-bold text-gray-900">75%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-gray-600 font-medium">Pending</span></div>
                  <span className="font-bold text-gray-900">20%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div><span className="text-gray-600 font-medium">Overdue</span></div>
                  <span className="font-bold text-gray-900">5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All</button>
              </div>
              
              <div className="space-y-6">
                <ActivityRow 
                  initial="M" 
                  title={<span>New client <strong>Alpha Corp</strong> registered</span>} 
                  time="2 hours ago" 
                  tag="Marketing" 
                  color="bg-indigo-50 text-indigo-600" 
                />
                <ActivityRow 
                  initial="$" 
                  title={<span>Invoice <strong>#INV-4420</strong> was paid by client</span>} 
                  time="5 hours ago" 
                  tag="Financial" 
                  color="bg-emerald-50 text-emerald-600" 
                />
                <ActivityRow 
                  initial="C" 
                  title={<span>Marketing Plan v2 was updated by Admin</span>} 
                  time="Yesterday at 4:30 PM" 
                  tag="Content" 
                  color="bg-purple-50 text-purple-600" 
                />
                <ActivityRow 
                  initial="!" 
                  title={<span>Reminder: Project <strong>Axion UI</strong> deadline approaching</span>} 
                  time="Oct 24, 2023" 
                  tag="Project" 
                  color="bg-orange-50 text-orange-600" 
                />
              </div>
            </div>

            {/* Active Project Status */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Active Project Status</h2>
              
              <div className="space-y-6">
                <ProjectProgress title="Client Onboarding" percent={85} color="bg-indigo-500" />
                <ProjectProgress title="Q4 Strategy Planning" percent={42} color="bg-emerald-500" />
                <ProjectProgress title="Website Redesign" percent={18} color="bg-purple-500" />
              </div>

              <div className="mt-8 bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 tracking-wider mb-2">PRO TIP</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">Review your overdue tasks every Monday morning to maintain high client satisfaction.</p>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </>
  );
}

// Subcomponents for the dashboard

function KpiCard({ title, value, trend, isWarning = false, isNeutral = false, icon, iconBg }: any) {
  let trendClass = 'text-emerald-600 bg-emerald-50';
  if (isWarning) trendClass = 'text-rose-600 bg-rose-50';
  if (isNeutral) trendClass = 'text-gray-500 bg-gray-50';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${trendClass}`}>{trend}</span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-1">{title}</h3>
        <p className="text-[28px] font-bold text-gray-900 leading-none">{value}</p>
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
          <p className="text-sm text-gray-900 font-medium group-hover:text-indigo-600 transition-colors">{title}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">{time}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{tag}</span>
    </div>
  );
}

function ProjectProgress({ title, percent, color }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-gray-700">{title}</span>
        <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>{percent}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
