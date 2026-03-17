"use client";

import { Users, CreditCard, LayoutList, Target, Bell, Search, Menu, LogOut, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden">
      {/* Sidebar - Fixed 240px */}
      <aside className="hidden md:flex flex-col w-[240px] bg-white border-r border-[#E2E8F0] shadow-sm shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
          <span className="font-extrabold text-[#111827] text-2xl tracking-tight">AXION</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarItem icon={<Target size={18} />} label="Dashboard" active />
          <SidebarItem icon={<Users size={18} />} label="Clients" />
          <SidebarItem icon={<LayoutList size={18} />} label="Tasks" />
          <SidebarItem icon={<CreditCard size={18} />} label="Payments" />
        </nav>

        <div className="p-4 border-t border-[#E2E8F0]">
          <button className="flex items-center gap-3 px-3 py-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-md transition-colors w-full text-sm font-medium">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 text-[#6B7280] hover:bg-[#F3F4F6] rounded-md">
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-lg text-[#111827]">Dashboard Overview</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white transition-all w-64"
              />
            </div>
            
            <button className="relative p-2 text-[#6B7280] hover:bg-[#F3F4F6] rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                A
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">Admin User</span>
                <span className="text-xs text-indigo-600 font-medium">Agency Owner</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-[1280px] mx-auto space-y-8">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <KpiCard title="Active Clients" value="24" trend="+3 this month" />
              <KpiCard title="Monthly Revenue" value="$42,500" trend="+12% vs last month" />
              <KpiCard title="Tasks Overdue" value="5" trend="-2 vs last week" isWarning />
              <KpiCard title="Payments Pending" value="$8,400" trend="4 invoices open" />
            </div>

            {/* Quick Actions & Recent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 subtle-shadow transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Recent Tasks</h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    <TaskRow client="Apex Fitness" task="Design April Social Pack" status="In Progress" date="Today" />
                    <TaskRow client="Lumina Co." task="Review Landing Page Copy" status="Review" date="Tomorrow" />
                    <TaskRow client="TechFlow" task="Weekly Ad Optimization" status="To Do" date="Apr 5" />
                    <TaskRow client="Urban Grind" task="Setup Email Campaign" status="Done" date="Yesterday" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 subtle-shadow transition-shadow">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition-colors text-left group">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Add New Client</p>
                        <p className="text-xs text-gray-500">Create a new client profile</p>
                      </div>
                    </button>
                    
                    <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 transition-colors text-left group">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <LayoutList size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Create Task</p>
                        <p className="text-xs text-gray-500">Assign work to the team</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponents for the dashboard

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
      {icon}
      <span>{label}</span>
    </a>
  );
}

function KpiCard({ title, value, trend, isWarning = false }: { title: string, value: string, trend: string, isWarning?: boolean }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 subtle-shadow transition-all hover:-translate-y-1">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className={`text-xs mt-2 font-medium ${isWarning ? 'text-red-600' : 'text-emerald-600'}`}>{trend}</p>
    </div>
  );
}

function TaskRow({ client, task, status, date }: { client: string, task: string, status: string, date: string }) {
  const statusColors: any = {
    'Done': 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Review': 'bg-amber-100 text-amber-700',
    'To Do': 'bg-gray-100 text-gray-700',
  };
  
  return (
    <div className="flex items-center justify-between p-3 border border-gray-50 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {status === 'Done' ? (
           <CheckCircle2 className="text-emerald-500" size={18} />
        ) : (
           <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300"></div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{task}</p>
          <p className="text-xs text-gray-500 mt-0.5">{client}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
          {status}
        </span>
        <span className="text-xs font-medium text-gray-500 w-16 text-right">{date}</span>
      </div>
    </div>
  );
}
