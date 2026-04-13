import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index";
import ApiError from "../utils/ApiError";
import { prisma } from "../config/database";

interface JwtPayload {
  userId: string;
}

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header or cookies,
 * verifies it, and attaches user to req.user.
 */
const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]) ||
      (req as any).cookies?.accessToken;

    if (!token) {
      throw ApiError.unauthorized("Access token is required");
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

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

    (req as any).user = user;
    next();
  } catch (error: any) {
    next(error instanceof ApiError ? error : ApiError.unauthorized(error.message));
  }
};

/**
 * Role-based authorization middleware factory.
 * Must be used AFTER authenticate middleware.
 */
const authorize = (...allowedRoles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { workspaceId } = req.params;

      if (!workspaceId) {
        throw ApiError.badRequest("Workspace ID is required for authorization");
      }

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: (req as any).user.id,
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

      (req as any).membership = membership;
      next();
    } catch (error: any) {
      next(error instanceof ApiError ? error : ApiError.internal(error.message));
    }
  };
};

export { authenticate, authorize };
