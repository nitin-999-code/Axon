import BaseRepository from "./base.repository.js";
import { prisma } from "../config/database.js";

/**
 * Workflow Repository — data access for Workflow and its configuration.
 */
class WorkflowRepository extends BaseRepository {
  constructor() {
    super("workflow");
  }

  async findByProject(projectId) {
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

  async createState(data) {
    return prisma.workflowState.create({ data });
  }

  async createTransition(data) {
    return prisma.workflowTransition.create({ data });
  }

  async findStateByName(workflowId, name) {
    return prisma.workflowState.findUnique({
      where: {
        workflowId_name: { workflowId, name },
      },
    });
  }

  async findTransition(workflowId, fromStateId, toStateId) {
    return prisma.workflowTransition.findUnique({
      where: {
        workflowId_fromStateId_toStateId: { workflowId, fromStateId, toStateId },
      },
    });
  }
}

export default new WorkflowRepository();
