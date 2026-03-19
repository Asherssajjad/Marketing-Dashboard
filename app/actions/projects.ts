"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return prisma.project.findMany({
    include: {
      client: true,
      tasks: true,
    },
    orderBy: { dueDate: 'asc' }
  });
}

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const clientId = formData.get("clientId") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string || "DISCOVERY";
  const dueDateStr = formData.get("dueDate") as string;
  
  const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

  if (!name || !clientId) return { error: "Name and Client are required" };

  try {
    await prisma.project.create({
      data: {
        name,
        clientId,
        type,
        status,
        dueDate,
      }
    });

    revalidatePath("/projects");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project" }
  }
}

export async function updateProjectStatus(projectId: string, newStatus: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus }
    });
    revalidatePath("/projects");
  } catch (error) {
    console.error("Failed to update project status:", error);
  }
}
