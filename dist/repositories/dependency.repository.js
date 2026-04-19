"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
const database_js_1 = require("../config/database.js");
/**
 * Dependency Repository — data access for TaskDependencies.
 */
class DependencyRepository extends base_repository_js_1.default {
    constructor() {
        super("taskDependency");
    }
    async fetchProjectGraphQuery(projectId) {
        // We need all tasks in the project
        const tasks = await database_js_1.prisma.task.findMany({
            where: { projectId },
            select: { id: true, title: true, currentStatus: true },
        });
        const taskIds = tasks.map((t) => t.id);
        // Fetch all dependencies where both tasks are in this project
        const dependencies = await this.model.findMany({
            where: {
                AND: [
                    { taskId: { in: taskIds } },
                    { dependsOnId: { in: taskIds } }
                ]
            }
        });
        return { tasks, dependencies };
    }
    async dependencyExists(taskId, dependsOnId) {
        const existing = await this.model.findUnique({
            where: {
                taskId_dependsOnId: { taskId, dependsOnId }
            }
        });
        return !!existing;
    }
}
exports.default = new DependencyRepository();
