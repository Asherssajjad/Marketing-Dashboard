import { Topbar } from "@/components/Topbar";
import { getClients } from "@/app/actions/clients";
import { createProject } from "@/app/actions/projects";
import Link from "next/link";

export default async function NewProjectPage() {
  const clients = await getClients();

  return (
    <>
      <Topbar title="New Web Project" breadcrumb="Projects" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[800px] mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form action={createProject} className="space-y-8">
            
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Project Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Project Name *</label>
                  <input name="name" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Website Redesign" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Client *</label>
                  <select name="clientId" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Project Type *</label>
                  <select name="type" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="WEBSITE">Website</option>
                    <option value="LANDING_PAGE">Landing Page</option>
                    <option value="REDESIGN">Redesign</option>
                    <option value="E-COMMERCE">E-commerce</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Initial Status</label>
                  <select name="status" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="DISCOVERY">Discovery</option>
                    <option value="DESIGN">Design</option>
                    <option value="DEVELOPMENT">Development</option>
                    <option value="REVIEW">Review</option>
                    <option value="TESTING">Testing</option>
                    <option value="LIVE">Live</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Target Due Date</label>
                  <input name="dueDate" type="date" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link href="/projects" className="px-6 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                Launch Project
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
}
