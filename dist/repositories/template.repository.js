"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
/**
 * Template Repository — data access for TaskTemplate entity.
 * Extends BaseRepository (Inheritance).
 */
class TemplateRepository extends base_repository_1.default {
    constructor() {
        super("taskTemplate");
    }
    async findByWorkspace(workspaceId) {
        return this.model.findMany({
            where: { workspaceId },
            orderBy: { createdAt: "desc" },
        });
    }
}
exports.default = new TemplateRepository();
