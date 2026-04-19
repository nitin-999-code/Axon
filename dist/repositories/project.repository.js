"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
/**
 * Project Repository — data access for Project entity.
 */
class ProjectRepository extends base_repository_js_1.default {
    constructor() {
        super("project");
    }
    async findByWorkspace(workspaceId, options = {}) {
        return this.findMany({
            where: { workspaceId },
            ...options,
        });
    }
    async findWithWorkflow(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                workflow: {
                    include: { transitions: true },
                },
                _count: { select: { tasks: true } },
            },
        });
    }
}
exports.default = new ProjectRepository();
