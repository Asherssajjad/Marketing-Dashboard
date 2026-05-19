"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardStats } from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardStats> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const [
    clientCount,
    projectCount,
    overdueTasks,
    clients,
    latestTasks,
    latestProjects
  ] = await Promise.all([
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.project.count({ where: { status: "LIVE" } }),
    prisma.task.count({ 
      where: { 
        dueDate: { lt: new Date() },
        status: { not: "DONE" }
      } 
    }),
    prisma.client.findMany({
      include: { packages: true },
    }),
    prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: { select: { name: true } } }
    }),
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { 
        client: { select: { name: true } },
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } }
      }
    })
  ]);

  // Calculate real revenue - Summing ALL packages for ALL clients
  const totalRevenue = clients.reduce((sum, client) => {
    const clientTotal = client.packages.reduce(
      (pkgSum, pkg) => pkgSum + (pkg.price || 0),
      0
    );
    return sum + clientTotal;
  }, 0);

  // Calculate real project progress based on task completion
  const projectsWithProgress = latestProjects.map(p => {
    const totalTasks = p._count.tasks;
    const completedTasks = p.tasks.filter(t => t.status === "DONE").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      id: p.id,
      name: p.name,
      status: p.status,
      progress: p.status === "LIVE" ? 100 : progress
    };
  });

  return {
    userName: session.user.name,
    clientCount,
    projectCount,
    overdueTasks,
    totalRevenue,
    latestTasks: latestTasks.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      client: t.client
    })),
    latestProjects: projectsWithProgress
  };
}
