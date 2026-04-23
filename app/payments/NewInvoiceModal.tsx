"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";
import { createPayment } from "@/app/actions/payments";

interface Client {
  id: string;
  name: string;
}

interface NewInvoiceModalProps {
  clients: Client[];
}

export default function NewInvoiceModal({ clients }: NewInvoiceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTranslate();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const closeTranslate = () => {
    setIsOpen(false);
    setError(null);
    formRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createPayment(formData);
      
      if (result?.success) {
        closeTranslate();
      } else {
        setError(result?.error || "Failed to create invoice.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm"
        aria-label="Open New Invoice Modal"
      >
        <Plus size={16} /> New Invoice
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
          onClick={closeTranslate}
          role="presentation"
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 id="modal-title" className="text-lg font-bold text-gray-900">Create New Invoice</h3>
              <button 
                onClick={closeTranslate} 
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="clientId" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Client</label>
                <select 
                  id="clientId"
                  name="clientId" 
                  required 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="amount" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount ($)</label>
                <input 
                  id="amount"
                  name="amount" 
                  type="number" 
                  required 
                  min="1"
                  max="1000000"
                  step="0.01" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  placeholder="0.00" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="month" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Month</label>
                  <select 
                    id="month"
                    name="month" 
                    required
                    defaultValue={currentMonth}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en', {month: 'long'})}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="year" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Year</label>
                  <input 
                    id="year"
                    name="year" 
                    type="number" 
                    required
                    min={2000}
                    max={2100}
                    defaultValue={currentYear} 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Generate Invoice
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
