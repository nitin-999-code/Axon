import { Request, Response, NextFunction } from "express";
import workspaceService from "../services/workspace.service.js";

/**
 * Workspace Controller — translates HTTP requests into service calls
 * for Workspace management.
 */
class WorkspaceController {
  /**
   * Create a new workspace.
   */
  async createWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body as any;
      const ownerId = (req as any).user.id;
      const ipAddress = (req.ip as string);

      const workspace = await workspaceService.createWorkspace(
        { name, description },
        ownerId,
        ipAddress
      );

      res.status(201).json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add a member to a workspace.
   */
  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as any;
      const { email, role } = req.body as any;
      const adminId = (req as any).user.id;
      const ipAddress = (req.ip as string);

      const member = await workspaceService.addMember(
        workspaceId,
        adminId,
        { email, role },
        ipAddress
      );

      res.status(200).json({
        success: true,
        message: "Member added successfully",
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all workspaces for the authenticated user.
   */
  async getUserWorkspaces(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const workspaces = await workspaceService.getUserWorkspaces(userId);

      res.status(200).json({
        success: true,
        data: workspaces,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific workspace's details.
   */
  async getWorkspaceDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as any;
      const userId = (req as any).user.id;

      const workspace = await workspaceService.getWorkspaceDetails(workspaceId, userId);

      res.status(200).json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkspaceController();
