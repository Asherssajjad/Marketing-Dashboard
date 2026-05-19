import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30 animate-pulse">
      <div className="max-w-[1280px] mx-auto space-y-8">
        
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-xl"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="h-10 w-28 bg-gray-200 rounded-xl flex-1 sm:flex-none"></div>
            <div className="h-10 w-28 bg-gray-200 rounded-xl flex-1 sm:flex-none"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-7 space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-200"></div>
                <div className="w-16 h-5 rounded-full bg-gray-200"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Skeleton */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Snapshot Skeleton */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-6">
            <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
