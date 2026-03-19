import { Bell, Search } from "lucide-react";

export function Topbar({ title, breadcrumb }: { title: string, breadcrumb?: string }) {
  return (
    <header className="h-[72px] bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 z-10 w-full">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center text-sm font-medium">
        {breadcrumb ? (
          <>
            <span className="text-gray-400">{breadcrumb}</span>
            <span className="text-gray-400 mx-2">›</span>
            <span className="text-gray-900 font-bold">{title}</span>
          </>
        ) : (
          <span className="text-gray-900 font-bold text-lg">{title}</span>
        )}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search clients, projects or IDs..." 
            className="pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all w-[300px]"
          />
        </div>
        
        <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-gray-900 leading-tight">Admin User</span>
            <span className="text-xs text-gray-400 font-medium">Super Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-100">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
