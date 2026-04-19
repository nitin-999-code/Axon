import sprintRepository from "../repositories/sprint.repository.js";
import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import auditLogService from "./auditLog.service.js";
import EventBus from "../utils/eventBus.js";
import ApiError from "../utils/ApiError.js";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants.js";
import { prisma } from "../config/database.js";

/**
 * Sprint Service — handles analytics, assignments, and publishes events.
 */
class SprintService {
  /**
   * Create a sprint for a project.
   */
  async createSprint(data, userId, ipAddress) {
    const project = await projectRepository.findById(data.projectId);
    if (!project) throw ApiError.notFound("Project not found");

    const sprint = await sprintRepository.create(data);

    await auditLogService.logAction({
      userId,
      action: "SPRINT_CREATED",
      entityType: "SPRINT",
      entityId: sprint.id,
      metadata: { projectId: data.projectId },
      ipAddress,
    });

    return sprint;
  }

  /**
   * Assign a logical task to a targeted Sprint.
   */
  async assignTaskToSprint(taskId, sprintId, userId, ipAddress) {
    const sprint = await sprintRepository.findById(sprintId);
    if (!sprint) throw ApiError.notFound("Sprint not found");

    const task = await taskRepository.findById(taskId);
    if (!task) throw ApiError.notFound("Task not found");

    if (task.projectId !== sprint.projectId) {
      throw ApiError.badRequest("Task and Sprint must belong to the same project");
    }

    const updatedTask = await taskRepository.update(taskId, { sprintId });

    await auditLogService.logAction({
      userId,
      action: "TASK_ADDED_TO_SPRINT",
      entityType: ENTITY_TYPES.TASK,
      entityId: taskId,
      metadata: { sprintId },
      ipAddress,
    });

    return updatedTask;
  }

  /**
   * Analytics: Compute velocity of a completed or active sprint.
   * Defined as sum of story points for all "DONE" tasks.
   */
  async computeVelocity(sprintId) {
    const sprint = await sprintRepository.findWithTasks(sprintId);
    if (!sprint) throw ApiError.notFound("Sprint not found");

    let totalPoints = 0;
    let completedPoints = 0;

    const completedStates = ["DONE", "COMPLETED", "RESOLVED"];

    sprint.tasks.forEach(task => {
      totalPoints += task.storyPoints || 0;
      if (completedStates.includes(task.currentStatus.toUpperCase())) {
        completedPoints += task.storyPoints || 0;
      }
    });

    return {
      sprintId: sprint.id,
      totalPoints,
      completedPoints,
      completionPercentage: totalPoints > 0 ? ((completedPoints / totalPoints) * 100).toFixed(2) : 0,
      velocity: completedPoints, // Velocity of this sprint specifically
    };
  }

  /**
   * Analytics: Generate mathematical Burn-Down Chart dataset.
   */
  async generateBurndownData(sprintId) {
    const sprint = await sprintRepository.findWithTasks(sprintId);
    if (!sprint) throw ApiError.notFound("Sprint not found");

    // Total story points at the beginning
    const initialPoints = sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);

    // In a real historical app, you would query task transition histories to build 
    // an accurate day-by-day burndown. For immediate analytical purposes, we approximate
    // the remaining points today.
    const { completedPoints } = await this.computeVelocity(sprintId);
    const pointsRemaining = initialPoints - completedPoints;

    const daysTotal = Math.ceil((new Date(sprint.endDate) - new Date(sprint.startDate)) / (1000 * 60 * 60 * 24));
    const idealBurnRate = initialPoints / (daysTotal || 1);

    return {
      sprintId,
      sprintName: sprint.name,
      metrics: {
        totalStoryPoints: initialPoints,
        pointsRemaining: pointsRemaining,
        idealDailyBurnRate: idealBurnRate.toFixed(2),
        totalDays: daysTotal,
      }
    };
  }

  /**
   * Detect overdue tasks locally and fire specific EventBus events decoupled from DB layer.
   */
  async detectOverdueTasks(sprintId) {
    const now = new Date();
    const overdueTasks = await sprintRepository.fetchOverdueTasksInSprint(sprintId, now);

    overdueTasks.forEach(task => {
      const msOverdue = now - new Date(task.dueDate);
      const daysOverdue = Math.floor(msOverdue / (1000 * 60 * 60 * 24));
      
      // DECOUPLED ALERT - The Event Bus handles notification scaling internally without slowing HTTP throughput!
      EventBus.publish("TASK_OVERDUE", { task, daysOverdue });
    });

    return {
      scanned: true,
      overdueCount: overdueTasks.length,
      tasks: overdueTasks.map(t => ({ id: t.id, title: t.title, dueDate: t.dueDate }))
    };
  }
}

export default new SprintService();
