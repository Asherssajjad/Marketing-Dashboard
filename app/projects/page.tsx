import { Topbar } from "@/components/Topbar";
import { MoreHorizontal, MessageSquare, Check, Trello, List } from "lucide-react";

export default function ProjectsPage() {
  return (
    <>
      <Topbar title="Web Development Pipeline" breadcrumb="Projects" />
      
      <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between">
         <div className="flex items-center bg-gray-50 rounded-lg p-1">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-white text-gray-900 rounded shadow-sm text-sm font-bold transition-all">
               <Trello size={16} /> Kanban
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 text-gray-500 hover:text-gray-900 text-sm font-bold transition-all">
               <List size={16} /> Table
            </button>
         </div>
         
         <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
            New Project
         </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 flex gap-6 pb-12">
        
        {/* Discovery Column */}
        <KanbanColumn title="DISCOVERY" count={3}>
           <ProjectCard 
              type="REDESIGN"
              typeColor="bg-indigo-50 text-indigo-600"
              date="Jun 12"
              title="E-commerce Portal"
              client="Global Retail Inc."
              progress={35}
              avatars={['AD', 'MS']}
              comments={4}
           />
        </KanbanColumn>

        {/* Design Column */}
        <KanbanColumn title="DESIGN" count={2}>
           <ProjectCard 
              type="NEW PROJECT"
              typeColor="bg-purple-50 text-purple-600"
              date="May 28"
              title="Mobile Banking App"
              client="FinTrust Bank"
              progress={60}
              avatars={['RC']}
              plusAvatar="+2"
              attachment
           />
        </KanbanColumn>

        {/* Development Column */}
        <KanbanColumn title="DEVELOPMENT" count={4}>
           <ProjectCard 
              type="REDESIGN"
              typeColor="bg-indigo-50 text-indigo-600"
              date="May 15"
              title="Corporate Website"
              client="Zenith Corp"
              progress={85}
              avatars={['LM', 'SK']}
              checked
           />
        </KanbanColumn>

        {/* Review Column (empty placeholder) */}
        <KanbanColumn title="REVIEW" count={0}>
            {/* Empty state can be placed here */}
        </KanbanColumn>

      </div>
    </>
  );
}

function KanbanColumn({ title, count, children }: any) {
   return (
      <div className="flex-shrink-0 w-[400px] flex flex-col h-full bg-transparent">
         <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
               <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">{title}</h3>
               <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">{count}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-900">
               <MoreHorizontal size={20} />
            </button>
         </div>
         <div className="flex flex-col gap-4">
            {children}
            
            {/* Add new card placeholder */}
            <button className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-gray-400 font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors">
               + Add Project
            </button>
         </div>
      </div>
   );
}

function ProjectCard({ type, typeColor, date, title, client, progress, avatars, plusAvatar, comments, attachment, checked }: any) {
   return (
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
         <div className="flex items-center justify-between mb-4">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase ${typeColor}`}>
               {type}
            </span>
            <span className="text-xs font-bold text-gray-400">Due {date}</span>
         </div>
         
         <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{title}</h4>
         <p className="text-sm text-gray-500 font-medium mb-6">Client: {client}</p>

         <div className="h-2 w-full bg-gray-100 rounded-full mb-6">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
         </div>

         <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
               {avatars.map((av: string, i: number) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shadow-sm">
                     {av}
                  </div>
               ))}
               {plusAvatar && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 text-gray-500 flex items-center justify-center text-[10px] font-bold shadow-sm">
                     {plusAvatar}
                  </div>
               )}
            </div>

            <div className="flex items-center gap-3 text-gray-400">
               {comments && (
                  <div className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                     <MessageSquare size={16} className="fill-current opacity-20" />
                  </div>
               )}
               {attachment && (
                  <div className="hover:text-gray-600 transition-colors">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </div>
               )}
               {checked && (
                  <div className="text-emerald-500">
                     <Check size={18} strokeWidth={3} />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
