import { getClientContentDetail, markContentAsPublished, addContentItem } from "@/app/actions/content";
import { Topbar } from "@/components/Topbar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  Video, 
  Image as ImageIcon, 
  MoreVertical,
  Calendar,
  Layers,
  TrendingUp,
  Zap,
  ArrowUpRight,
  TrendingDown,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ContentDetailPage({ params }: { params: { clientId: string } }) {
  const client = await getClientContentDetail(params.clientId);

  if (!client) {
    return notFound();
  }

  const activePackage = client.packages[0];
  const currentPlan = activePackage?.monthlyPlans[0];

  const reelsPublished = currentPlan?.contentItems.filter(i => i.type === "REEL" && i.status === "PUBLISHED").length || 0;
  const postsPublished = currentPlan?.contentItems.filter(i => i.type === "POST" && i.status === "PUBLISHED").length || 0;

  return (
    <>
      <Topbar title="Creative Strategy" breadcrumb={`Content / ${client.name}`} />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Plan Intelligence Header */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm flex flex-col lg:row justify-between items-start lg:items-center gap-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full translate-x-40 -translate-y-40 blur-3xl -z-10 group-hover:bg-indigo-100/50 transition-colors"></div>
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 ring-8 ring-indigo-50">
                <Layers size={36} />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                   <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">{currentPlan ? `${new Date(0, currentPlan.month - 1).toLocaleString('default', { month: 'long' })} Cycle` : "Strategy Inactive"}</h1>
                   {currentPlan && <Badge className="bg-emerald-500 text-white border-none font-black tracking-widest text-[9px] px-3 py-1 uppercase italic shadow-sm ring-4 ring-emerald-50 animate-pulse">LIVE TRACKER</Badge>}
                </div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3 italic">
                   Partner: <span className="text-indigo-600">{client.name}</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                   Year: {currentPlan?.year || '2024'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 opacity-60 italic">Monthly Quota</p>
                <div className="flex gap-4">
                   <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <p className="text-lg font-black text-gray-900 italic tracking-tighter leading-none">{activePackage?.reels_pm} <span className="text-[10px] text-gray-400 uppercase">Reels</span></p>
                   </div>
                   <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <p className="text-lg font-black text-gray-900 italic tracking-tighter leading-none">{activePackage?.posts_pm} <span className="text-[10px] text-gray-400 uppercase">Posts</span></p>
                   </div>
                </div>
              </div>
              <button className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 italic">
                Initialize Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Reels Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm border-l-8 border-l-indigo-600">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                     <Video size={20} />
                  </div>
                  <h2 className="font-black text-gray-900 uppercase italic tracking-widest">High-Velocity Reels</h2>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-indigo-600 italic leading-none">{reelsPublished}<span className="text-gray-200 font-bold mx-0.5">/</span>{activePackage?.reels_pm}</p>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Throughput</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentPlan?.contentItems.filter(i => i.type === "REEL").map(item => (
                  <ContentItemRow key={item.id} item={item} />
                ))}
                <AddContentButton planId={currentPlan?.id} type="REEL" />
              </div>
            </div>

            {/* Posts Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm border-l-8 border-l-emerald-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                     <ImageIcon size={20} />
                  </div>
                  <h2 className="font-black text-gray-900 uppercase italic tracking-widest">Static Output</h2>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-emerald-500 italic leading-none">{postsPublished}<span className="text-gray-200 font-bold mx-0.5">/</span>{activePackage?.posts_pm}</p>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Production</p>
                </div>
              </div>

              <div className="space-y-4">
                {currentPlan?.contentItems.filter(i => i.type === "POST").map(item => (
                  <ContentItemRow key={item.id} item={item} />
                ))}
                <AddContentButton planId={currentPlan?.id} type="POST" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

function ContentItemRow({ item }: any) {
  const isPublished = item.status === "PUBLISHED";
  return (
    <div className={`bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-between group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${isPublished ? 'bg-gray-50/50 grayscale opacity-70' : ''}`}>
      {!isPublished && <div className="absolute left-0 top-0 w-1 h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>}
      <div className="flex items-center gap-6">
        <form action={async () => { "use server"; if (!isPublished) await markContentAsPublished(item.id) }}>
          <button type="submit" className={`transition-all transform hover:scale-110 ${isPublished ? 'text-emerald-500' : 'text-gray-200 hover:text-indigo-400'}`}>
            <CheckCircle size={28} />
          </button>
        </form>
        <div>
          <p className={`font-black text-base uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors ${isPublished ? 'text-gray-300 line-through' : 'text-gray-900'}`}>{item.notes || `Digital Asset #${item.id.slice(-4)}`}</p>
          <div className="flex items-center gap-4 mt-2">
             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>{item.status.replace("_", " ")}</span>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Assigned: {item.assignedTo || 'CORE SYSTEM'}</span>
             </div>
          </div>
        </div>
      </div>
      <button className="text-gray-200 group-hover:text-gray-900 transition-colors p-2">
        <MoreVertical size={20} />
      </button>
    </div>
  )
}

function AddContentButton({ planId, type }: any) {
  if (!planId) return null;
  return (
    <form action={async () => { "use server"; await addContentItem(planId, { type, notes: `New ${type.toLowerCase()} item initialization` }) }}>
      <button type="submit" className="w-full py-5 border-2 border-dashed border-gray-100 rounded-[28px] text-gray-300 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:border-indigo-400 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-100/30 transition-all flex items-center justify-center gap-3 italic">
        <Plus size={18} /> Initialize New Asset Track
      </button>
    </form>
  )
}
