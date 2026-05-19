"use client";

interface DeleteClientButtonProps {
  clientName: string;
}

export function DeleteClientButton({ clientName }: DeleteClientButtonProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm(
      `Are you sure you want to permanently delete "${clientName}"? This will delete all their contents, plans and billing invoices. This action cannot be undone.`
    );
    if (!confirmed) {
      e.preventDefault();
    }
  };

  return (
    <button
      type="submit"
      onClick={handleDelete}
      className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-rose-100 text-center"
    >
      Delete Client
    </button>
  );
}
