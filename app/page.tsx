import { Topbar } from "@/components/Topbar";
import { Users, DollarSign, ArrowRight, FileText, BarChart2 } from "lucide-react";
import { getDashboardSummary } from "@/app/actions/dashboard";
import Link from "next/link";
import { StatCard } from "@/components/DashboardComponents";
import { DashboardStats } from "@/types/dashboard";
import ErrorRetry from "@/components/ErrorRetry";

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
              <span className="text-xl">⚠️</span>
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
              <Link href="/clients" className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all text-center shadow-lg shadow-indigo-100">
                View Clients
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid - Two Clean Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Workspace Quick Links Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Quick Shortcuts</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Manage marketing operations, client packages, and content strategy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Clients management shortcut */}
              <Link href="/clients" className="group p-6 border border-gray-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300 flex items-start justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 group-hover:text-indigo-600 transition-colors">Client Directory</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Register new accounts, manage active service packages, and track billing details.
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>

              {/* Content calendar shortcut */}
              <Link href="/content" className="group p-6 border border-gray-100 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/20 transition-all duration-300 flex items-start justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 group-hover:text-emerald-600 transition-colors">Content Calendar</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Plan social media updates, manage platform releases, and control marketing channels.
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>

            </div>

            {/* Bottom info section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Platform Analytics</p>
                <p className="text-sm text-gray-700 font-medium">To view invoicing summaries, revenue breakdowns, and reports, navigate to payments.</p>
              </div>
              <Link href="/payments" className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shrink-0">
                <BarChart2 size={16} /> Reports & Payments
              </Link>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
