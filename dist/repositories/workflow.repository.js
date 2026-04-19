"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
const database_js_1 = require("../config/database.js");
/**
 * Workflow Repository — data access for Workflow and its configuration.
 */
class WorkflowRepository extends base_repository_js_1.default {
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
        return database_js_1.prisma.workflowState.create({ data });
    }
    async createTransition(data) {
        return database_js_1.prisma.workflowTransition.create({ data });
    }
    async findStateByName(workflowId, name) {
        return database_js_1.prisma.workflowState.findUnique({
            where: {
                workflowId_name: { workflowId, name },
            },
        });
    }
    async findTransition(workflowId, fromStateId, toStateId) {
        return database_js_1.prisma.workflowTransition.findUnique({
            where: {
                workflowId_fromStateId_toStateId: { workflowId, fromStateId, toStateId },
            },
        });
    }
}
exports.default = new WorkflowRepository();
