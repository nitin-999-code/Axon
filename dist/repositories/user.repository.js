"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
/**
 * User Repository — data access for User entity.
 * Extends BaseRepository (Inheritance).
 */
class UserRepository extends base_repository_1.default {
    constructor() {
        super("user");
    }
    async findByEmail(email) {
        return this.model.findUnique({
            where: { email },
        });
    }
    async existsByEmail(email) {
        const count = await this.model.count({
            where: { email },
        });
        return count > 0;
    }
}
exports.default = new UserRepository();
