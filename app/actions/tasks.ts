"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTasks(options?: {
  status?: string;
  clientId?: string;
  projectId?: string;
  search?: string;
}) {
  const where: any = {};
  if (options?.status && options.status !== "ALL") where.status = options.status;
  if (options?.clientId) where.clientId = options.clientId;
  if (options?.projectId) where.projectId = options.projectId;
  if (options?.search) where.title = { contains: options.search, mode: 'insensitive' };

  return prisma.task.findMany({
    where,
    include: {
      client: true,
      project: true,
      assignee: true,
      comments: true,
    },
    orderBy: { dueDate: 'asc' }
  });
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string || "TODO";
  const dueDateStr = formData.get("dueDate") as string;
  const clientId = formData.get("clientId") as string || undefined;
  const projectId = formData.get("projectId") as string || undefined;
  
  const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

  if (!title) return { error: "Title is required" };

  try {
    await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
        clientId,
        projectId,
      }
    });

    revalidatePath("/tasks");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Failed to create task" }
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });
    revalidatePath("/tasks");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}
