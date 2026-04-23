"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const VALID_PROJECT_TYPES = ["WEBSITE", "LANDING_PAGE", "REDESIGN", "E-COMMERCE"];
const VALID_PROJECT_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "LIVE"];

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function getProjects() {
  // Auth outside try/catch so it can propagate to error boundaries or login redirect
  const session = await requireAuth();

  try {
    return await prisma.project.findMany({
      where: session.user.role === 'ADMIN' ? {} : { client: { tasks: { some: { assignedTo: session.user.id } } } },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        dueDate: true,
        client: {
          select: { id: true, name: true }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    });
  } catch (error) {
    console.error("[GET_PROJECTS_ERROR]", error);
    return [];
  }
}

export async function createProject(formData: FormData) {
  let shouldRedirect = false;
  try {
    const session = await requireAuth();
    if (session.user.role !== 'ADMIN') throw new Error("Forbidden: Admin access required.");

    const name = (formData.get("name") as string)?.trim();
    const clientId = formData.get("clientId") as string;
    const type = formData.get("type") as string;
    const status = formData.get("status") as string || "PENDING";
    const dueDateStr = formData.get("dueDate") as string;
    
    // Validation
    if (!name || name.length > 100) throw new Error("Invalid project name.");
    if (!clientId) throw new Error("Client is required.");
    if (!VALID_PROJECT_TYPES.includes(type)) throw new Error("Invalid project type.");
    if (!VALID_PROJECT_STATUSES.includes(status)) throw new Error("Invalid status.");

    const dueDate = dueDateStr ? new Date(dueDateStr) : null;
    if (dueDate && isNaN(dueDate.getTime())) throw new Error("Invalid due date.");

    await prisma.project.create({
      data: { name, clientId, type, status, dueDate }
    });

    revalidatePath("/projects");
    shouldRedirect = true;
  } catch (error: any) {
    console.error("[CREATE_PROJECT_ERROR]", error);
    return { error: "Failed to create project. Please check your inputs." };
  }
  
  if (shouldRedirect) redirect("/projects");
}

export async function updateProjectStatus(projectId: string, newStatus: string) {
  try {
    const session = await requireAuth();
    
    if (!VALID_PROJECT_STATUSES.includes(newStatus)) throw new Error("Invalid status");

    // Existence & Role Check
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error("Project not found");
    
    if (session.user.role !== 'ADMIN') {
        // Here you could add more complex logic to check if the user is assigned to any task in this project
        throw new Error("Forbidden: Only admins can update project status.");
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus }
    });
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_PROJECT_ERROR]", error);
    return { success: false, message: "Update failed." };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'ADMIN') throw new Error("Forbidden");

    // Existence check before delete
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error("Project not found");

    await prisma.project.delete({ where: { id: projectId } });
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_PROJECT_ERROR]", error);
    return { success: false, message: "Deletion failed." };
  }
}
