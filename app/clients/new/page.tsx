import { Topbar } from "@/components/Topbar";
import { createClient } from "@/app/actions/clients";
import Link from "next/link";

export default function NewClientPage() {
  return (
    <>
      <Topbar title="Add New Client" breadcrumb="Clients" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[800px] mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form action={createClient} className="space-y-8">
            
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Client Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Client Name *</label>
                  <input name="name" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Acme Corp" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Contact Email</label>
                  <input name="contact" type="email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="hello@acme.com" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Active Platforms</label>
                  <div className="flex gap-4 items-center">
                    {["INSTAGRAM", "TIKTOK", "FACEBOOK", "LINKEDIN", "YOUTUBE"].map(platform => (
                      <label key={platform} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="platforms" value={platform} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        <span className="text-sm text-gray-700 font-medium">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Monthly Package Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Package Name *</label>
                  <input name="package" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Premium Content Engine" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Monthly Price ($)</label>
                  <input name="price" type="number" step="0.01" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="1500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Reels Quota</label>
                  <input name="reels_pm" type="number" defaultValue={8} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Static Posts Quota</label>
                  <input name="posts_pm" type="number" defaultValue={12} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/clients" className="px-6 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                Save Client Profile
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
}
