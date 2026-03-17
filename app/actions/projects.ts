"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const clientId = formData.get("clientId") as string;
  const status = formData.get("status") as string || "DISCOVERY";
  const dueDate = formData.get("dueDate") as string;
  const type = formData.get("type") as string || "Website";

  if (!name || !clientId) return { error: "Name and Client are required" };

  try {
    await prisma.project.create({
      data: {
        name,
        clientId,
        status,
        type,
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    });

    revalidatePath("/projects");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project" }
  }

  redirect("/projects");
}

export async function getProjects() {
  return prisma.project.findMany({
    include: {
      client: true,
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateProjectStatus(projectId: string, newStatus: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus }
    });
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to update project status:", error);
  }
}

export async function getProjectDetail(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      tasks: {
        include: { 
          client: true,
          comments: true 
        }
      }
    }
  });
}

export async function updateProjectMilestones(projectId: string, milestones: any) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { milestones }
    });
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects`);
  } catch (error) {
    console.error("Failed to update milestones:", error);
  }
}
