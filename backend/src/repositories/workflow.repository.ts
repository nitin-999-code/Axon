import BaseRepository from "./base.repository.js";
import { prisma } from "../config/database.js";

/**
 * Workflow Repository — data access for Workflow and its configuration.
 */
class WorkflowRepository extends BaseRepository {
  constructor() {
    super("workflow");
  }

  async findByProject(projectId: any) {
    return this.model.findUnique({
      where: { projectId },
      include: {
        states: true,
        transitions: {
          include: {
            fromState: true,
            toState: true,
          },
        },
      },
    });
  }

  async createState(data: any) {
    return (prisma as any).workflowState.create({ data });
  }

  async createTransition(data: any) {
    return (prisma as any).workflowTransition.create({ data });
  }

  async findStateByName(workflowId: any, name: any) {
    return (prisma as any).workflowState.findUnique({
      where: {
        workflowId_name: { workflowId, name },
      },
    });
  }

  async findTransition(workflowId: any, fromStateId: any, toStateId: any) {
    return (prisma as any).workflowTransition.findUnique({
      where: {
        workflowId_fromStateId_toStateId: { workflowId, fromStateId, toStateId },
      },
    });
  }
}

export default new WorkflowRepository();
