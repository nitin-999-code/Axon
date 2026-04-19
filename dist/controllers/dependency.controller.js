"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_service_js_1 = __importDefault(require("../services/dependency.service.js"));
/**
 * Dependency Controller — API mapping for Task Dependency Graphs
 */
class DependencyController {
    async addDependency(req, res, next) {
        try {
            const { taskId, dependsOnId } = req.body;
            const dependency = await dependency_service_js_1.default.addDependency(taskId, dependsOnId, req.user.id, req.ip);
            res.status(201).json({ success: true, data: dependency });
        }
        catch (error) {
            next(error);
        }
    }
    async analyzeGraph(req, res, next) {
        try {
            const { projectId } = req.params;
            const metrics = await dependency_service_js_1.default.analyzeDependencyGraph(projectId);
            res.status(200).json({ success: true, data: metrics });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new DependencyController();
