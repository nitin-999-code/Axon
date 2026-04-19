import { TaskPriority, WorkspaceRole } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  projectId: string;
  sprintId: string | null;
  assigneeId: string | null;
  parentTaskId: string | null;
  storyPoints: number;
  createdBy: string;
  currentStatus: string;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  parentCommentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string | null;
  startDate: Date;
  endDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTransition {
  id: string;
  workflowId: string;
  fromStateId: string;
  toStateId: string;
  allowedRoles: WorkspaceRole[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  timestamp: Date;
}
