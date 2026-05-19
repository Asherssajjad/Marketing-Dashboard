import { Topbar } from "@/components/Topbar";
import { getClients } from "@/app/actions/clients";
import { getProjects } from "@/app/actions/projects";
import NewTaskForm from "@/components/NewTaskForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Fetch clients and projects
  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects()
  ]);

  return (
    <>
      <Topbar title="Create New Task" breadcrumb="Tasks" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[640px] mx-auto bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Create Task</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Assign a new task to your team workflow</p>
          </div>

          <NewTaskForm clients={clients} projects={projects} />
        </div>
      </div>
    </>
  );
}
