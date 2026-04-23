"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Action Result Type for consistent feedback
export type ActionResult<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

// Valid Statuses Enum-like array
const VALID_STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be logged in.");
  }
  return session;
}

export async function getTasks() {
  try {
    const session = await requireSession();
    
    // If Admin, they might see more, but for now we filter by their assigned tasks
    // or tasks within their scope. 
    return await prisma.task.findMany({
      where: session.user.role === 'ADMIN' ? {} : { assignedTo: session.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        client: {
          select: { id: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        },
        assignee: {
          select: { id: true, name: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    });
  } catch (error) {
    console.error("[GET_TASKS_ERROR]", error);
    return [];
  }
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireSession();
    
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const status = formData.get("status") as string || "TODO";
    const dueDateStr = formData.get("dueDate") as string;
    const clientId = formData.get("clientId") as string;
    const projectId = formData.get("projectId") as string;

    // Validation
    if (!title || title.length < 3 || title.length > 100) {
      return { success: false, message: "Title must be between 3 and 100 characters." };
    }
    if (!VALID_STATUSES.includes(status)) {
      return { success: false, message: "Invalid status provided." };
    }
    
    const dueDate = dueDateStr ? new Date(dueDateStr) : null;
    if (dueDateStr && isNaN(dueDate!.getTime())) {
      return { success: false, message: "Invalid due date format." };
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
        clientId: clientId || null,
        projectId: projectId || null,
        assignedTo: session.user.id // Defaulting to creator
      }
    });

    revalidatePath("/tasks");
    return { success: true, message: "Task created successfully!", data: newTask };
  } catch (error) {
    console.error("[CREATE_TASK_ERROR]", error);
    return { success: false, message: "Failed to create task. Please try again." };
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string): Promise<ActionResult> {
  try {
    const session = await requireSession();

    if (!VALID_STATUSES.includes(newStatus)) {
      return { success: false, message: "Invalid status." };
    }

    // Ownership Check: Only Admin or the Assignee can change status
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { assignedTo: true }
    });

    if (!existingTask) return { success: false, message: "Task not found." };
    if (session.user.role !== 'ADMIN' && existingTask.assignedTo !== session.user.id) {
      return { success: false, message: "You don't have permission to update this task." };
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });

    revalidatePath("/tasks");
    return { success: true, message: "Status updated!" };
  } catch (error) {
    console.error("[UPDATE_TASK_ERROR]", error);
    return { success: false, message: "Failed to update status." };
  }
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  try {
    const session = await requireSession();

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { assignedTo: true }
    });

    if (!existingTask) return { success: false, message: "Task not found." };
    
    // Deletion is usually Admin only or restricted
    if (session.user.role !== 'ADMIN' && existingTask.assignedTo !== session.user.id) {
      return { success: false, message: "Unauthorized deletion attempt." };
    }

    await prisma.task.delete({ where: { id: taskId } });

    revalidatePath("/tasks");
    return { success: true, message: "Task deleted." };
  } catch (error) {
    console.error("[DELETE_TASK_ERROR]", error);
    return { success: false, message: "Deletion failed." };
  }
}
