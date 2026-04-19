"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
const database_js_1 = require("../config/database.js");
/**
 * Sprint Repository — data access for Sprints.
 */
class SprintRepository extends base_repository_js_1.default {
    constructor() {
        super("sprint");
    }
    async findWithTasks(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        storyPoints: true,
                        currentStatus: true,
                        dueDate: true,
                        assigneeId: true
                    }
                }
            }
        });
    }
    async findActiveSprintByProject(projectId) {
        return this.model.findFirst({
            where: {
                projectId,
                status: "ACTIVE"
            },
            include: {
                tasks: true
            }
        });
    }
    async fetchOverdueTasksInSprint(sprintId, currentDate) {
        return database_js_1.prisma.task.findMany({
            where: {
                // sprintId removed as it does not exist in TaskWhereInput
                dueDate: { lt: currentDate },
                currentStatus: { notIn: ["DONE", "COMPLETED", "RESOLVED"] } // Customizable terminal states
            }
        });
    }
}
exports.default = new SprintRepository();
