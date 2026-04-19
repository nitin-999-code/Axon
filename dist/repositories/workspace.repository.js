"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
/**
 * Workspace Repository — data access for Workspace entity.
 */
class WorkspaceRepository extends base_repository_js_1.default {
    constructor() {
        super("workspace");
    }
    async findByOwner(ownerId) {
        return this.model.findMany({
            where: { ownerId },
            orderBy: { createdAt: "desc" },
        });
    }
    async findWithMembers(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                _count: { select: { projects: true } },
            },
        });
    }
}
exports.default = new WorkspaceRepository();
