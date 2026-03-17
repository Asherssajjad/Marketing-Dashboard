import { Topbar } from "@/components/Topbar";
import { MoreVertical, Plus, Layers, Search, Filter, TrendingUp, Zap } from "lucide-react";
import { getContentTrackers } from "@/app/actions/content";
import Link from "next/link";

export default async function ContentEnginePage() {
  const clients = await getContentTrackers();

  return (
    <>
      <Topbar title="Content Architecture" breadcrumb="AXION" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
             <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">Content Pipeline</h1>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 opacity-60">Status of high-velocity creative assets</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm uppercase tracking-tighter" placeholder="Search track..." />
                </div>
                <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm">
                   <Filter size={18} />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Active Clients Content Cards */}
            {clients.map(client => {
              const activePackage = client.packages[0];
              const currentPlan = activePackage?.monthlyPlans[0];
              
              const reelsPublished = currentPlan?.contentItems.filter(i => i.type === "REEL" && i.status === "PUBLISHED").length || 0;
              const reelsTotal = activePackage?.reels_pm || 0;
              
              const postsPublished = currentPlan?.contentItems.filter(i => i.type === "POST" && i.status === "PUBLISHED").length || 0;
              const postsTotal = activePackage?.posts_pm || 0;

              // Color palette
              const colors = ["bg-indigo-600", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-sky-500"];
              const colorIdx = client.name.length % colors.length;

              return (
                <Link href={`/content/${client.id}`} key={client.id} className="block group">
                  <ContentCard 
                    name={client.name} 
                    activeAds={activePackage?.has_ads ? 1 : 0}
                    reelsProgress={reelsPublished} 
                    reelsTotal={reelsTotal}
                    postsProgress={postsPublished} 
                    postsTotal={postsTotal}
                    logoColor={colors[colorIdx]}
                    initial={client.name.charAt(0)}
                    updated={currentPlan ? `${new Date(currentPlan.month).toLocaleString('default', { month: 'short' })} ${currentPlan.year}` : "N/A"}
                    avatars={[]}
                  />
                </Link>
              )
            })}
            
            {/* Add New Track */}
            <button className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-[32px] hover:border-indigo-400 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/30 transition-all group min-h-[320px]">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-gray-300 transition-all mb-4 shadow-inner">
                <Plus size={32} />
              </div>
              <span className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 group-hover:text-indigo-600">Initialize New Track</span>
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

function ContentCard({ name, activeAds, reelsProgress, reelsTotal, postsProgress, postsTotal, logoColor, initial, updated, avatars }: any) {
  
  const reelsPercent = reelsTotal > 0 ? (reelsProgress / reelsTotal) * 100 : 0;
  const postsPercent = postsTotal > 0 ? (postsProgress / postsTotal) * 100 : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-indigo-50 transition-colors -z-10"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 italic ${logoColor}`}>
            {initial}
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-lg leading-none uppercase italic tracking-tighter truncate max-w-[150px]">{name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${activeAds > 0 ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeAds} ACTIVE CAMPAIGNS</p>
            </div>
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-900 transition-colors p-2">
           <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-gray-400 tracking-[0.1em] uppercase italic flex items-center gap-1.5"><TrendingUp size={12} className="text-emerald-500" /> Reels Performance</span>
            <span className="text-sm font-black text-gray-900 italic">{reelsProgress}<span className="text-gray-300 font-bold mx-0.5">/</span>{reelsTotal}</span>
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
            <div className="h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${reelsPercent}%` }}></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-gray-400 tracking-[0.1em] uppercase italic flex items-center gap-1.5"><Zap size={12} className="text-indigo-500" /> Static Output</span>
            <span className="text-sm font-black text-gray-900 italic">{postsProgress}<span className="text-gray-300 font-bold mx-0.5">/</span>{postsTotal}</span>
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
            <div className="h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000" style={{ width: `${postsPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 border-t border-gray-50 pt-6">
        <div className="flex -space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-indigo-700 italic">S</div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-emerald-700 italic">A</div>
        </div>
        <div className="text-right">
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">PLAN PERIOD</p>
           <p className="text-[11px] font-black text-gray-400 uppercase italic tracking-tighter">{updated}</p>
        </div>
      </div>

    </div>
  );
}
