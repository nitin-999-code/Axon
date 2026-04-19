"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activity_repository_js_1 = __importDefault(require("../repositories/activity.repository.js"));
const project_repository_js_1 = __importDefault(require("../repositories/project.repository.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const database_js_1 = require("../config/database.js");
class ActivityService {
    async getProjectFeed(projectId, page = 1, limit = 20) {
        const project = await project_repository_js_1.default.findById(projectId);
        if (!project)
            throw ApiError_js_1.default.notFound("Project not found");
        // Retrieve all tasks associated with this project 
        // to comprehensively grab all scoped task-level audit actions.
        const tasks = await database_js_1.prisma.task.findMany({
            where: { projectId },
            select: { id: true }
        });
        const taskIds = tasks.map((t) => t.id);
        const skip = (page - 1) * limit;
        const [activities, totalCount] = await Promise.all([
            activity_repository_js_1.default.getProjectActivity(projectId, taskIds, skip, limit),
            activity_repository_js_1.default.countProjectActivity(projectId, taskIds)
        ]);
        return {
            data: activities,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }
}
exports.default = new ActivityService();
