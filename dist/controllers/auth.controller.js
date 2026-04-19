"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_js_1 = __importDefault(require("../services/auth.service.js"));
const asyncHandler_js_1 = __importDefault(require("../middleware/asyncHandler.js"));
const ApiResponse_js_1 = __importDefault(require("../utils/ApiResponse.js"));
/**
 * Auth Controller — handles registration, login, and profile endpoints.
 */
class AuthController {
    constructor() {
        /**
         * POST /api/auth/register
         */
        this.register = (0, asyncHandler_js_1.default)(async (req, res) => {
            const ipAddress = req.ip;
            const result = await auth_service_js_1.default.register(req.body, ipAddress);
            // Set token in httpOnly cookie
            res.cookie("accessToken", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return ApiResponse_js_1.default.created(res, "User registered successfully", result);
        });
        /**
         * POST /api/auth/login
         */
        this.login = (0, asyncHandler_js_1.default)(async (req, res) => {
            const ipAddress = req.ip;
            const result = await auth_service_js_1.default.login(req.body, ipAddress);
            res.cookie("accessToken", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return ApiResponse_js_1.default.ok(res, "Login successful", result);
        });
        /**
         * POST /api/auth/logout
         */
        this.logout = (0, asyncHandler_js_1.default)(async (_req, res) => {
            res.clearCookie("accessToken");
            return ApiResponse_js_1.default.ok(res, "Logged out successfully");
        });
        /**
         * GET /api/auth/me
         */
        this.getProfile = (0, asyncHandler_js_1.default)(async (req, res) => {
            const user = await auth_service_js_1.default.getProfile(req.user.id);
            return ApiResponse_js_1.default.ok(res, "Profile retrieved", user);
        });
    }
}
exports.default = new AuthController();
