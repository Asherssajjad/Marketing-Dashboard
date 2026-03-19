import { Topbar } from "@/components/Topbar";
import { MoreVertical, Plus } from "lucide-react";
import { getContentTrackers } from "@/app/actions/content";
import Link from "next/link";

export default async function ContentEnginePage() {
  const clients = await getContentTrackers();

  return (
    <>
      <Topbar title="Content" breadcrumb="AXION" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Active Clients Content Cards */}
            {clients.map(client => {
              const activePackage = client.packages[0];
              const currentPlan = activePackage?.monthlyPlans[0];
              
              const reelsPublished = currentPlan?.contentItems.filter(i => i.type === "REEL" && i.status === "PUBLISHED").length || 0;
              const reelsTotal = activePackage?.reels_pm || 0;
              
              const postsPublished = currentPlan?.contentItems.filter(i => i.type === "POST" && i.status === "PUBLISHED").length || 0;
              const postsTotal = activePackage?.posts_pm || 0;

              // Generate consistent colors based on name
              const colors = ["bg-teal-600", "bg-emerald-500", "bg-sky-500", "bg-orange-600", "bg-rose-400"];
              const colorIdx = client.name.length % colors.length;

              return (
                <Link href={`/content/${client.id}`} key={client.id} className="block transition-transform hover:scale-[1.02]">
                  <ContentCard 
                    name={client.name} 
                    activeAds={activePackage?.has_ads ? 1 : 0}
                    reelsProgress={reelsPublished} 
                    reelsTotal={reelsTotal}
                    postsProgress={postsPublished} 
                    postsTotal={postsTotal}
                    logoColor={colors[colorIdx]}
                    initial={client.name.charAt(0)}
                    updated={currentPlan ? `Updated ${new Date(currentPlan.month).toDateString()}` : "No active plan"}
                    avatars={[]}
                  />
                </Link>
              )
            })}
            
            {/* Add New Track */}
            <button className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors h-full min-h-[280px] text-gray-500 hover:text-indigo-600 group">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center font-black mb-4 transition-colors">
                <Plus size={24} />
              </div>
              <span className="font-bold">Add New Client Track</span>
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

function ContentCard({ name, activeAds, reelsProgress, reelsTotal, postsProgress, postsTotal, logoColor, initial, updated, avatars, warning, danger }: any) {
  
  let reelsColor = "bg-emerald-500";
  if (reelsProgress / reelsTotal < 0.4 || danger) reelsColor = "bg-rose-500";
  else if (reelsProgress / reelsTotal < 0.7 || warning) reelsColor = "bg-amber-500";

  let postsColor = "bg-emerald-500";
  if (postsProgress / postsTotal < 0.4 || danger) postsColor = "bg-rose-500";
  else if (postsProgress / postsTotal < 0.7 || warning) postsColor = "bg-amber-500";

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
      <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
        <MoreVertical size={20} />
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${logoColor.includes('text') ? logoColor : logoColor + ' text-white'}`}>
          {initial}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-2 h-2 rounded-full ${activeAds > 0 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <p className="text-xs font-bold text-gray-500">{activeAds} Active Ads</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Reels Progress</span>
            <span className={`text-sm font-bold ${reelsColor.replace('bg-', 'text-')}`}>{reelsProgress}/{reelsTotal}</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full">
            <div className={`h-2 rounded-full ${reelsColor}`} style={{ width: `${(reelsProgress/reelsTotal)*100}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Static Posts</span>
            <span className={`text-sm font-bold ${postsColor.replace('bg-', 'text-')}`}>{postsProgress}/{postsTotal}</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full">
            <div className={`h-2 rounded-full ${postsColor}`} style={{ width: `${(postsProgress/postsTotal)*100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-gray-50 pt-4">
        <div className="flex -space-x-2">
          {avatars.map((av: string, i: number) => (
            <div key={i} className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
              {av}
            </div>
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-400">{updated}</p>
      </div>

    </div>
  );
}
