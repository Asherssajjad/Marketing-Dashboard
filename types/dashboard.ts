export interface Client {
  name: string;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client?: Client | null;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
}

export interface DashboardStats {
  userName: string | null;
  clientCount: number;
  projectCount: number;
  overdueTasks: number;
  totalRevenue: number;
  latestTasks: Task[];
  latestProjects: Project[];
}
