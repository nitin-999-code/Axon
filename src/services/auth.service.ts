import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import userRepository from "../repositories/user.repository.js";
import auditLogService from "./auditLog.service.js";
import ApiError from "../utils/ApiError.js";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants.js";

const SALT_ROUNDS = 12;

/**
 * Auth Service — handles registration, login, and token management.
 */
class AuthService {
  /**
   * Register a new user.
   */
  async register({ name, email, password }: any, ipAddress: any) {
    // Check for existing user
    const exists = await userRepository.existsByEmail(email);
    if (exists) {
      throw ApiError.conflict("A user with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await userRepository.create(
      { name, email, passwordHash },
      {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }
    );

    // Generate token
    const token = this.#generateToken(user.id);

    // Audit log
    await auditLogService.logAction({
      userId: user.id,
      action: AUDIT_ACTIONS.USER_REGISTERED,
      entityType: ENTITY_TYPES.USER,
      entityId: user.id,
      ipAddress,
    });

    return { user, token };
  }

  /**
   * Authenticate a user with email and password.
   */
  async login({ email, password }: any, ipAddress: any) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Generate token
    const token = this.#generateToken(user.id);

    // Audit log
    await auditLogService.logAction({
      userId: user.id,
      action: AUDIT_ACTIONS.USER_LOGGED_IN,
      entityType: ENTITY_TYPES.USER,
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
  async getProfile(userId: any) {
    const user = await userRepository.findById(userId, {
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
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  /**
   * Generate a JWT token.
   * @param {string} userId
   * @returns {string}
   */
  #generateToken(userId: any) {
    return jwt.sign({ userId }, (config.jwt.secret as string), { expiresIn: config.jwt.expiresIn } as any);
  }
}

export default new AuthService();
