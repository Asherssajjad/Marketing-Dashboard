import { Topbar } from "@/components/Topbar";
import { getClientContent, createContentLog } from "@/app/actions/content";
import { Calendar as CalendarIcon, MapPin, Video, Image, ChevronLeft, ChevronRight, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function ClientContentPage({ params }: { params: { clientId: string } }) {
  const client = await getClientContent(params.clientId);
  
  if (!client) return <div>Client not found</div>;

  const currentPlan = client.packages[0]?.monthlyPlans[0];
  const items = currentPlan?.contentItems || [];
  
  // Group items by date for the calendar
  const itemsByDate: any = {};
  items.forEach(item => {
    if (item.scheduledDate) {
      const dateKey = new Date(item.scheduledDate).toISOString().split('T')[0];
      if (!itemsByDate[dateKey]) itemsByDate[dateKey] = [];
      itemsByDate[dateKey].push(item);
    }
  });

  return (
    <>
      <Topbar title={`${client.name} - Content Track`} breadcrumb="Content / Client" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="text-indigo-600" /> Social Media Calendar
            </h2>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Previous Month</button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Next Month</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Calendar Grid */}
            <div className="lg:col-span-3">
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden border-collapse">
                  <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="px-4 py-3 text-[10px] font-black tracking-widest text-gray-400 uppercase text-center border-r last:border-0 border-gray-100">{day}</div>
                    ))}
                  </div>
                   <div className="grid grid-cols-7 border-gray-100">
                     {(() => {
                        const now = new Date();
                        const currentYear = now.getFullYear();
                        const currentMonth = now.getMonth();
                        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
                        // Adjust for Mon-Sun (getDay is 0 for Sun)
                        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
                        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                        const today = now.getDate();
                        
                        return Array.from({ length: 35 }).map((_, i) => {
                           const dayNum = i - startOffset + 1;
                           const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                           const dateKey = isCurrentMonth 
                              ? `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
                              : null;
                           const dayItems = dateKey ? itemsByDate[dateKey] || [] : [];
                           const isToday = isCurrentMonth && dayNum === today;

                           return (
                             <div key={i} className={`border-r border-b border-gray-100 p-2 min-h-[120px] hover:bg-gray-50/50 transition-colors group relative overflow-y-auto ${isToday ? 'bg-indigo-50/30' : ''}`}>
                                {isCurrentMonth && (
                                   <>
                                      <div className="flex items-center justify-between mb-2">
                                         <span className={`text-[11px] font-black ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                                           {dayNum}
                                         </span>
                                         {isToday && <span className="text-[8px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Today</span>}
                                      </div>
                                      <div className="space-y-1">
                                         {dayItems.map((item: any) => (
                                           <div key={item.id} className={`p-1.5 rounded-lg text-[9px] font-bold truncate flex items-center gap-1.5 shadow-sm border ${item.type === 'REEL' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                              {item.type === 'REEL' ? <Video size={10} className="shrink-0"/> : <Image size={10} className="shrink-0"/>}
                                              <span className="truncate">{item.notes || item.type}</span>
                                           </div>
                                         ))}
                                         {dayItems.length === 0 && isToday && (
                                            <div className="flex flex-col items-center justify-center h-12 border-2 border-dashed border-indigo-100 rounded-xl opacity-40">
                                               <Plus size={12} className="text-indigo-300" />
                                               <span className="text-[8px] font-bold text-indigo-300 uppercase">Plan Now</span>
                                            </div>
                                         )}
                                      </div>
                                   </>
                                )}
                             </div>
                           );
                        });
                     })()}
                  </div>
               </div>
            </div>

            {/* Quick Log Side Panel */}
            <div className="space-y-6">
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Log Production</h3>
                  <form action={createContentLog} className="space-y-4">
                     <input type="hidden" name="planId" value={currentPlan?.id || ""} />
                     <input type="hidden" name="clientId" value={client.id} />
                     
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Content Type</label>
                        <select name="type" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                           <option value="REEL">Video / Reel</option>
                           <option value="POST">Static Post</option>
                           <option value="AD">Paid Ad</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Publish Date</label>
                        <input type="date" name="scheduledDate" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" defaultValue={new Date().toISOString().split('T')[0]} />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Notes (Optional)</label>
                        <textarea name="notes" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none h-20" placeholder="Topic: Agency Showcase..."></textarea>
                     </div>

                     <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100">
                        <Plus size={18} /> Add to Timeline
                     </button>
                  </form>
               </div>

               <div className="bg-indigo-600 rounded-3xl shadow-xl p-6 text-white overflow-hidden relative">
                  <div className="relative z-10">
                     <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1 leading-none">Monthly Quota</p>
                     <h4 className="text-2xl font-black">{Math.round((items.filter(i => i.status === 'PUBLISHED').length / (client.packages[0]?.reels_pm + client.packages[0]?.posts_pm || 1)) * 100)}%</h4>
                     <p className="text-xs font-medium text-indigo-100 mt-2 leading-relaxed opacity-80 italic">"Consistency is the currency of social media growth."</p>
                  </div>
                  {/* Decorative background circle */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
