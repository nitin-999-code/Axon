import workflowService from "../services/workflow.service.js";

/**
 * Workflow Controller — API interface for configurable workflow engines.
 */
class WorkflowController {
  async createWorkflow(req, res, next) {
    try {
      const { projectId } = req.body;
      const workflow = await workflowService.createWorkflow(projectId, req.user.id, req.ip);
      res.status(201).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }

  async addState(req, res, next) {
    try {
      const state = await workflowService.addState(req.params.workflowId, req.body, req.user.id, req.ip);
      res.status(201).json({ success: true, data: state });
    } catch (error) {
      next(error);
    }
  }

  async addTransition(req, res, next) {
    try {
      const transition = await workflowService.addTransition(req.params.workflowId, req.body, req.user.id, req.ip);
      res.status(201).json({ success: true, data: transition });
    } catch (error) {
      next(error);
    }
  }

  async transitionTask(req, res, next) {
    try {
      const { targetStateName } = req.body;
      const updatedTask = await workflowService.transitionTask(
        req.params.taskId,
        targetStateName,
        req.user.id,
        req.ip
      );
      res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
      next(error);
    }
  }

  async getWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.getWorkflowByProject(req.params.projectId);
      res.status(200).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkflowController();
