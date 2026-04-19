"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activity_service_js_1 = __importDefault(require("../services/activity.service.js"));
class ActivityController {
    async getProjectFeed(req, res, next) {
        try {
            const { projectId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const feed = await activity_service_js_1.default.getProjectFeed(projectId, page, limit);
            res.status(200).json({ success: true, ...feed });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ActivityController();
