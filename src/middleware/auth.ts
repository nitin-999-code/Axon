import jwt from "jsonwebtoken";
import config from "../config/index.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/database.js";

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header or cookies,
 * verifies it, and attaches user to req.user.
 */
const authenticate = async (req, _res, next) => {
  try {
    // Extract token from header or cookie
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]) ||
      req.cookies?.accessToken;

    if (!token) {
      throw ApiError.unauthorized("Access token is required");
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Fetch user from DB (ensures user still exists & isn't deleted)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : ApiError.unauthorized(error.message));
  }
};

/**
 * Role-based authorization middleware factory.
 * Must be used AFTER authenticate middleware.
 *
 * @param  {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
  return async (req, _res, next) => {
    try {
      const { workspaceId } = req.params;

      if (!workspaceId) {
        throw ApiError.badRequest("Workspace ID is required for authorization");
      }

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        throw ApiError.forbidden("You are not a member of this workspace");
      }

      if (!allowedRoles.includes(membership.role)) {
        throw ApiError.forbidden(
          `Role '${membership.role}' is not authorized for this action`
        );
      }

      // Attach membership info to request for downstream use
      req.membership = membership;
      next();
    } catch (error) {
      next(error instanceof ApiError ? error : ApiError.internal(error.message));
    }
  };
};

export { authenticate, authorize };
