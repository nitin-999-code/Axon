import { Request, Response, NextFunction } from "express";
import workflowService from "../services/workflow.service.js";

/**
 * Workflow Controller — API interface for configurable workflow engines.
 */
class WorkflowController {
  async createWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.body as any;
      const workflow = await workflowService.createWorkflow(projectId, (req as any).user.id, (req.ip as string));
      res.status(201).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }

  async addState(req: Request, res: Response, next: NextFunction) {
    try {
      const state = await workflowService.addState(req.params.workflowId as string, req.body, (req as any).user.id, (req.ip as string));
      res.status(201).json({ success: true, data: state });
    } catch (error) {
      next(error);
    }
  }

  async addTransition(req: Request, res: Response, next: NextFunction) {
    try {
      const transition = await workflowService.addTransition(req.params.workflowId as string, req.body, (req as any).user.id, (req.ip as string));
      res.status(201).json({ success: true, data: transition });
    } catch (error) {
      next(error);
    }
  }

  async transitionTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetStateName } = req.body as any;
      const updatedTask = await workflowService.transitionTask(
        req.params.taskId as string,
        targetStateName,
        (req as any).user.id,
        (req.ip as string)
      );
      res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
      next(error);
    }
  }

  async getWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = await workflowService.getWorkflowByProject(req.params.projectId as string);
      res.status(200).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkflowController();
