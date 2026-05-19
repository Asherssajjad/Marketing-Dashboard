import { Topbar } from "@/components/Topbar";
import { getClientContent, createContentLog } from "@/app/actions/content";
import { Calendar as CalendarIcon, Video, Image, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import CalendarGrid from "./CalendarGrid";

interface ClientContentPageProps {
  params: {
    clientId: string;
  };
  searchParams: {
    month?: string;
    year?: string;
  };
}

export default async function ClientContentPage({ params, searchParams }: ClientContentPageProps) {
  const now = new Date();
  
  // parse searchParams (Next.js passes them as string or undefined)
  const currentMonth = searchParams.month ? parseInt(searchParams.month) : now.getMonth();
  const currentYear = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();

  // getClientContent expects database month 1-12
  const client = await getClientContent(params.clientId, currentMonth + 1, currentYear);
  
  if (!client) return <div className="p-8 text-center text-gray-500 font-bold">Client not found</div>;

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

  // Calculate previous month calendar parameters
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear -= 1;
  }

  // Calculate next month calendar parameters
  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear += 1;
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[currentMonth];

  // Quota denominator limits from packages
  const reelsLimit = client.packages[0]?.reels_pm ?? 0;
  const postsLimit = client.packages[0]?.posts_pm ?? 0;
  const totalLimit = reelsLimit + postsLimit;
  const publishedCount = items.filter(i => i.status === 'PUBLISHED').length;
  const quotaPercent = totalLimit > 0 ? Math.round((publishedCount / totalLimit) * 100) : 0;

  // Format default date string (YYYY-MM-DD) for selected month calendar
  const todayDate = new Date();
  const isQueryingCurrentMonth = todayDate.getMonth() === currentMonth && todayDate.getFullYear() === currentYear;
  const defaultLogDate = isQueryingCurrentMonth
    ? todayDate.toISOString().split('T')[0]
    : new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];

  return (
    <>
      <Topbar title={`${client.name} - Content Track`} breadcrumb="Content / Client" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Header Month Navigation Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
              <CalendarIcon className="text-indigo-600" /> {currentMonthName} {currentYear}
            </h2>
            <div className="flex items-center gap-2">
              <Link 
                href={`/content/${client.id}?month=${prevMonth}&year=${prevYear}`}
                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-indigo-600 hover:border-indigo-100 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ChevronLeft size={16} /> Prev Month
              </Link>
              <Link 
                href={`/content/${client.id}?month=${nextMonth}&year=${nextYear}`}
                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-indigo-600 hover:border-indigo-100 flex items-center gap-1.5 transition-all shadow-sm"
              >
                Next Month <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Calendar Grid Section */}
            <div className="lg:col-span-3">
               <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                 <div className="overflow-x-auto">
                   <div className="min-w-[750px]">
                      <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="px-4 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase text-center border-r last:border-0 border-gray-100">{day}</div>
                        ))}
                      </div>
                      
                      <CalendarGrid 
                        itemsByDate={itemsByDate} 
                        currentMonth={currentMonth} 
                        currentYear={currentYear} 
                      />
                   </div>
                 </div>
               </div>
            </div>

            {/* Quick Log Side Panel */}
            <div className="space-y-6">
               <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Log Production</h3>
                  <form action={createContentLog} className="space-y-5">
                     <input type="hidden" name="planId" value={currentPlan?.id || ""} />
                     <input type="hidden" name="clientId" value={client.id} />
                     
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Content Type</label>
                        <select name="type" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all">
                           <option value="REEL">Video / Reel</option>
                           <option value="POST">Static Post</option>
                           <option value="AD">Paid Ad</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Publish Date</label>
                        <input 
                          type="date" 
                          name="scheduledDate" 
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10" 
                          defaultValue={defaultLogDate} 
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Initial Notes</label>
                        <textarea name="notes" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/10" placeholder="Topic: Agency Showcase..."></textarea>
                     </div>

                     <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 mt-4">
                        <Plus size={18} /> Add to Timeline
                     </button>
                  </form>
               </div>

               <div className="bg-indigo-600 rounded-[32px] shadow-xl p-8 text-white overflow-hidden relative group">
                  <div className="relative z-10">
                     <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1 leading-none">Monthly Quota</p>
                     <h4 className="text-3xl font-black">{quotaPercent}%</h4>
                     <p className="text-xs font-semibold text-indigo-100 mt-2 opacity-90">{publishedCount} of {totalLimit} published</p>
                     <p className="text-[10px] text-indigo-200/80 mt-3 leading-relaxed border-t border-white/10 pt-3">
                       Reels: {items.filter(i => i.status === 'PUBLISHED' && i.type === 'REEL').length}/{reelsLimit} | Posts: {items.filter(i => i.status === 'PUBLISHED' && i.type === 'POST').length}/{postsLimit}
                     </p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
