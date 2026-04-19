"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workflow_service_js_1 = __importDefault(require("../services/workflow.service.js"));
/**
 * Workflow Controller — API interface for configurable workflow engines.
 */
class WorkflowController {
    async createWorkflow(req, res, next) {
        try {
            const { projectId } = req.body;
            const workflow = await workflow_service_js_1.default.createWorkflow(projectId, req.user.id, req.ip);
            res.status(201).json({ success: true, data: workflow });
        }
        catch (error) {
            next(error);
        }
    }
    async addState(req, res, next) {
        try {
            const state = await workflow_service_js_1.default.addState(req.params.workflowId, req.body, req.user.id, req.ip);
            res.status(201).json({ success: true, data: state });
        }
        catch (error) {
            next(error);
        }
    }
    async addTransition(req, res, next) {
        try {
            const transition = await workflow_service_js_1.default.addTransition(req.params.workflowId, req.body, req.user.id, req.ip);
            res.status(201).json({ success: true, data: transition });
        }
        catch (error) {
            next(error);
        }
    }
    async transitionTask(req, res, next) {
        try {
            const { targetStateName } = req.body;
            const updatedTask = await workflow_service_js_1.default.transitionTask(req.params.taskId, targetStateName, req.user.id, req.ip);
            res.status(200).json({ success: true, data: updatedTask });
        }
        catch (error) {
            next(error);
        }
    }
    async getWorkflow(req, res, next) {
        try {
            const workflow = await workflow_service_js_1.default.getWorkflowByProject(req.params.projectId);
            res.status(200).json({ success: true, data: workflow });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new WorkflowController();
