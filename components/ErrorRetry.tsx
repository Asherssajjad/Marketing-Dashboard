"use client";

import React from "react";

export default function ErrorRetry() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <button 
      onClick={handleRetry}
      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-100/50"
    >
      Retry Load
    </button>
  );
}
