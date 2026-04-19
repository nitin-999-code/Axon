"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const database_1 = require("../config/database");
/**
 * JWT authentication middleware.
 * Extracts token from Authorization header or cookies,
 * verifies it, and attaches user to (req as any).user.
 */
const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]) ||
            req.cookies?.accessToken;
        if (!token) {
            throw ApiError_1.default.unauthorized("Access token is required");
        }
        const decoded = jsonwebtoken_1.default.verify(token, index_1.default.jwt.secret);
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw ApiError_1.default.unauthorized("User no longer exists");
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error instanceof ApiError_1.default ? error : ApiError_1.default.unauthorized(error.message));
    }
};
exports.authenticate = authenticate;
/**
 * Role-based authorization middleware factory.
 * Must be used AFTER authenticate middleware.
 */
const authorize = (...allowedRoles) => {
    return async (req, _res, next) => {
        try {
            const { workspaceId } = req.params;
            if (!workspaceId) {
                throw ApiError_1.default.badRequest("Workspace ID is required for authorization");
            }
            const membership = await database_1.prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId: req.user.id,
                    },
                },
            });
            if (!membership) {
                throw ApiError_1.default.forbidden("You are not a member of this workspace");
            }
            if (!allowedRoles.includes(membership.role)) {
                throw ApiError_1.default.forbidden(`Role '${membership.role}' is not authorized for this action`);
            }
            req.membership = membership;
            next();
        }
        catch (error) {
            next(error instanceof ApiError_1.default ? error : ApiError_1.default.internal(error.message));
        }
    };
};
exports.authorize = authorize;
