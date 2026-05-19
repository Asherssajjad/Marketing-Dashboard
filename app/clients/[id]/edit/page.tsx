import { Topbar } from "@/components/Topbar";
import { updateClient, deleteClient } from "@/app/actions/clients";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface EditClientProps {
  params: {
    id: string;
  };
}

export default async function EditClientPage({ params }: EditClientProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/clients");
  }

  // Fetch client by ID
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { packages: true }
  });

  if (!client) {
    notFound();
  }

  const activePackage = client.packages[0];
  const updateClientWithId = updateClient.bind(null, client.id);
  const deleteClientWithId = deleteClient.bind(null, client.id);

  return (
    <>
      <Topbar title="Edit Client Profile" breadcrumb="Clients" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[800px] mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <form action={updateClientWithId} className="space-y-8">
            
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Client Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Client Name *</label>
                  <input 
                    name="name" 
                    required 
                    defaultValue={client.name}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                    placeholder="e.g. Acme Corp" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact Email</label>
                  <input 
                    name="contact" 
                    type="email" 
                    defaultValue={client.contact || ""}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                    placeholder="hello@acme.com" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Client Status</label>
                  <select 
                    name="status"
                    defaultValue={client.status}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Platforms</label>
                  <div className="flex flex-wrap gap-4 items-center">
                    {["INSTAGRAM", "TIKTOK", "FACEBOOK", "LINKEDIN", "YOUTUBE"].map(platform => (
                      <label key={platform} className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100/80 px-4 py-2 rounded-xl border border-gray-100 transition-all">
                        <input 
                          type="checkbox" 
                          name="platforms" 
                          value={platform} 
                          defaultChecked={client.platforms.includes(platform)}
                          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
                        />
                        <span className="text-xs text-gray-700 font-bold tracking-wide">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Monthly Package Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Package Name *</label>
                  <input 
                    name="package" 
                    required 
                    defaultValue={activePackage?.name || "Standard"}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                    placeholder="e.g. Premium Content Engine" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Monthly Price (PKR)</label>
                  <input 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    defaultValue={activePackage?.price || 0}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                    placeholder="1500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reels Quota</label>
                  <input 
                    name="reels_pm" 
                    type="number" 
                    defaultValue={activePackage?.reels_pm ?? 8}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Static Posts Quota</label>
                  <input 
                    name="posts_pm" 
                    type="number" 
                    defaultValue={activePackage?.posts_pm ?? 12}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/clients" className="px-6 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold rounded-xl text-xs uppercase tracking-widest transition-all">
                Cancel
              </Link>
              <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-100">
                Save Client Profile
              </button>
            </div>
            
          </form>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-rose-100/60">
            <div className="bg-rose-50/30 rounded-3xl border border-rose-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest">Danger Zone</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Permanently remove this client, their active packages, monthly content schedules, and invoices.</p>
              </div>
              <form action={deleteClientWithId} className="w-full sm:w-auto flex justify-end">
                <button 
                  type="submit" 
                  onClick={(e) => {
                    if (!confirm("Are you sure you want to permanently delete this client? This will delete all their contents, plans and billing invoices. This action cannot be undone.")) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md shadow-rose-100 text-center"
                >
                  Delete Client
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
