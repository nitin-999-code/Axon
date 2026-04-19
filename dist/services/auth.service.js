"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _AuthService_instances, _AuthService_generateToken;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = __importDefault(require("../config/index.js"));
const user_repository_js_1 = __importDefault(require("../repositories/user.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
const SALT_ROUNDS = 12;
/**
 * Auth Service — handles registration, login, and token management.
 */
class AuthService {
    constructor() {
        _AuthService_instances.add(this);
    }
    /**
     * Register a new user.
     */
    async register({ name, email, password }, ipAddress) {
        // Check for existing user
        const exists = await user_repository_js_1.default.existsByEmail(email);
        if (exists) {
            throw ApiError_js_1.default.conflict("A user with this email already exists");
        }
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        // Create user
        const user = await user_repository_js_1.default.create({ name, email, passwordHash }, {
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        // Generate token
        const token = __classPrivateFieldGet(this, _AuthService_instances, "m", _AuthService_generateToken).call(this, user.id);
        // Audit log
        await auditLog_service_js_1.default.logAction({
            userId: user.id,
            action: constants_js_1.AUDIT_ACTIONS.USER_REGISTERED,
            entityType: constants_js_1.ENTITY_TYPES.USER,
            entityId: user.id,
            ipAddress,
        });
        return { user, token };
    }
    /**
     * Authenticate a user with email and password.
     */
    async login({ email, password }, ipAddress) {
        // Find user
        const user = await user_repository_js_1.default.findByEmail(email);
        if (!user) {
            throw ApiError_js_1.default.unauthorized("Invalid email or password");
        }
        // Verify password
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw ApiError_js_1.default.unauthorized("Invalid email or password");
        }
        // Generate token
        const token = __classPrivateFieldGet(this, _AuthService_instances, "m", _AuthService_generateToken).call(this, user.id);
        // Audit log
        await auditLog_service_js_1.default.logAction({
            userId: user.id,
            action: constants_js_1.AUDIT_ACTIONS.USER_LOGGED_IN,
            entityType: constants_js_1.ENTITY_TYPES.USER,
            entityId: user.id,
            ipAddress,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        };
    }
    /**
     * Get the current user's profile.
     */
    async getProfile(userId) {
        const user = await user_repository_js_1.default.findById(userId, {
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                memberships: {
                    include: {
                        workspace: { select: { id: true, name: true } },
                    },
                },
            },
        });
        if (!user) {
            throw ApiError_js_1.default.notFound("User not found");
        }
        return user;
    }
}
_AuthService_instances = new WeakSet(), _AuthService_generateToken = function _AuthService_generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, index_js_1.default.jwt.secret, { expiresIn: index_js_1.default.jwt.expiresIn });
};
exports.default = new AuthService();
