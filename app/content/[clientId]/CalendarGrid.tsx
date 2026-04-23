"use client";

import { useState } from "react";
import { Video, Image, Plus, CheckCircle2 } from "lucide-react";
import ContentItemModal from "./ContentItemModal";

interface CalendarGridProps {
  itemsByDate: any;
  currentYear: number;
  currentMonth: number;
}

export default function CalendarGrid({ itemsByDate, currentYear, currentMonth }: CalendarGridProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const now = new Date();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = now.getDate();
  const isNowMonth = now.getMonth() === currentMonth && now.getFullYear() === currentYear;

  return (
    <>
      <div className="grid grid-cols-7 border-gray-100">
        {Array.from({ length: 35 }).map((_, i) => {
          const dayNum = i - startOffset + 1;
          const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
          const dateKey = isCurrentMonth 
            ? `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
            : null;
          const dayItems = dateKey ? itemsByDate[dateKey] || [] : [];
          const isToday = isNowMonth && dayNum === today;

          return (
            <div 
              key={i} 
              className={`border-r border-b border-gray-100 p-3 min-h-[130px] hover:bg-gray-50/50 transition-colors group relative overflow-y-auto ${isToday ? 'bg-indigo-50/20' : ''}`}
            >
              {isCurrentMonth && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-black ${isToday ? 'text-indigo-600' : 'text-gray-300'}`}>
                      {dayNum}
                    </span>
                    {isToday && <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Today</span>}
                  </div>
                  <div className="space-y-1.5">
                    {dayItems.map((item: any) => {
                      const isPublished = item.status === "PUBLISHED";
                      return (
                        <button 
                          key={item.id} 
                          onClick={() => setSelectedItem(item)}
                          className={`w-full p-2 rounded-xl text-[9px] font-bold text-left flex items-center gap-2 shadow-sm border transition-all hover:scale-[1.02] active:scale-95 ${
                            isPublished 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : item.type === 'REEL' 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          <div className={`p-1 rounded-lg ${isPublished ? 'bg-emerald-500 text-white' : 'bg-white/50'}`}>
                            {isPublished ? <CheckCircle2 size={10}/> : item.type === 'REEL' ? <Video size={10}/> : <Image size={10}/>}
                          </div>
                          <span className="truncate flex-1">{item.notes || item.type}</span>
                        </button>
                      );
                    })}
                    {dayItems.length === 0 && isToday && (
                      <div className="flex flex-col items-center justify-center h-16 border-2 border-dashed border-indigo-100/50 rounded-2xl opacity-40">
                        <Plus size={14} className="text-indigo-300" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <ContentItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </>
  );
}
