import React from "react";

export interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  isWarning?: boolean;
}

export interface ActivityRowProps {
  initial: string;
  clientName: string;
  taskTitle: string;
  time: string;
  tag: string;
  color: string;
}

export interface ProgressItemProps {
  label: string;
  percent: number;
}

export function StatCard({ label, value, trend, icon, color, bgColor, isWarning = false }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${bgColor} ${color}`}>
          {icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm ${isWarning ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'}`}>{trend}</span>
      </div>
      <div>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</h3>
        <p className="text-3xl font-black text-gray-900 leading-none tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export function ActivityRow({ initial, clientName, taskTitle, time, tag, color }: ActivityRowProps) {
  return (
    <div className="flex items-start justify-between group">
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-sm transition-transform group-hover:rotate-6 ${color}`}>
          {initial}
        </div>
        <div>
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors leading-snug">
            Task <span className="font-bold text-gray-900">{taskTitle}</span> was updated for {clientName}
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1.5">{time}</p>
        </div>
      </div>
      <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase border border-gray-100 px-2.5 py-1 rounded-lg bg-gray-50/50">{tag}</span>
    </div>
  );
}

export function ProgressItem({ label, percent }: ProgressItemProps) {
  const safePercent = Math.min(100, Math.max(0, percent));
  
  const getProgressColor = (val: number) => {
    if (val === 100) return "bg-emerald-500";
    if (val >= 60)   return "bg-indigo-500";
    if (val >= 30)   return "bg-amber-500";
    return "bg-rose-500";
  };

  const getTextColor = (val: number) => {
    if (val === 100) return "text-emerald-600";
    if (val >= 60)   return "text-indigo-600";
    if (val >= 30)   return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-bold text-gray-700 truncate pr-2 tracking-tight">{label}</span>
        <span className={`text-[10px] font-black ${getTextColor(safePercent)}`}>{safePercent}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`${getProgressColor(safePercent)} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${safePercent}%` }}></div>
      </div>
    </div>
  );
}
