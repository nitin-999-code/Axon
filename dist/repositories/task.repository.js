"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
/**
 * Task Repository — data access for Task entity.
 */
class TaskRepository extends base_repository_js_1.default {
    constructor() {
        super("task");
    }
    async findByProject(projectId, options = {}) {
        return this.findMany({
            where: { projectId },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true } },
            },
            ...options,
        });
    }
    async findByAssignee(assigneeId, options = {}) {
        return this.findMany({
            where: { assigneeId },
            ...options,
        });
    }
    async updateStatus(id, status) {
        return this.model.update({
            where: { id },
            data: { currentStatus: status },
        });
    }
    async findWithDependencies(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                dependencies: {
                    include: {
                        dependsOn: {
                            select: { id: true, title: true, currentStatus: true },
                        },
                    },
                },
                dependents: {
                    include: {
                        task: {
                            select: { id: true, title: true, currentStatus: true },
                        },
                    },
                },
            },
        });
    }
}
exports.default = new TaskRepository();
