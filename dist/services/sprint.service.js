"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sprint_repository_js_1 = __importDefault(require("../repositories/sprint.repository.js"));
const project_repository_js_1 = __importDefault(require("../repositories/project.repository.js"));
const task_repository_js_1 = __importDefault(require("../repositories/task.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const eventBus_js_1 = __importDefault(require("../utils/eventBus.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
/**
 * Sprint Service — handles analytics, assignments, and publishes events.
 */
class SprintService {
    /**
     * Create a sprint for a project.
     */
    async createSprint(data, userId, ipAddress) {
        const project = await project_repository_js_1.default.findById(data.projectId);
        if (!project)
            throw ApiError_js_1.default.notFound("Project not found");
        const sprint = await sprint_repository_js_1.default.create(data);
        await auditLog_service_js_1.default.logAction({
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
        const sprint = await sprint_repository_js_1.default.findById(sprintId);
        if (!sprint)
            throw ApiError_js_1.default.notFound("Sprint not found");
        const task = await task_repository_js_1.default.findById(taskId);
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        if (task.projectId !== sprint.projectId) {
            throw ApiError_js_1.default.badRequest("Task and Sprint must belong to the same project");
        }
        const updatedTask = await task_repository_js_1.default.update(taskId, { sprintId });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: "TASK_ADDED_TO_SPRINT",
            entityType: constants_js_1.ENTITY_TYPES.TASK,
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
        const sprint = await sprint_repository_js_1.default.findWithTasks(sprintId);
        if (!sprint)
            throw ApiError_js_1.default.notFound("Sprint not found");
        let totalPoints = 0;
        let completedPoints = 0;
        const completedStates = ["DONE", "COMPLETED", "RESOLVED"];
        sprint.tasks.forEach((task) => {
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
        const sprint = await sprint_repository_js_1.default.findWithTasks(sprintId);
        if (!sprint)
            throw ApiError_js_1.default.notFound("Sprint not found");
        // Total story points at the beginning
        const initialPoints = sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
        // In a real historical app, you would query task transition histories to build 
        // an accurate day-by-day burndown. For immediate analytical purposes, we approximate
        // the remaining points today.
        const { completedPoints } = await this.computeVelocity(sprintId);
        const pointsRemaining = initialPoints - completedPoints;
        const daysTotal = Math.ceil((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24));
        const idealBurnRate = initialPoints / (daysTotal || 1);
        return {
            sprintId: sprintId,
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
        const overdueTasks = await sprint_repository_js_1.default.fetchOverdueTasksInSprint(sprintId, now);
        overdueTasks.forEach((task) => {
            const msOverdue = Number(now) - new Date(task.dueDate).getTime();
            const daysOverdue = Math.floor(msOverdue / (1000 * 60 * 60 * 24));
            // DECOUPLED ALERT - The Event Bus handles notification scaling internally without slowing HTTP throughput!
            eventBus_js_1.default.publish("TASK_OVERDUE", { task, daysOverdue });
        });
        return {
            scanned: true,
            overdueCount: overdueTasks.length,
            tasks: overdueTasks.map((t) => ({ id: t.id, title: t.title, dueDate: t.dueDate }))
        };
    }
}
exports.default = new SprintService();
