import { Request, Response, NextFunction } from "express";

/**
 * Wraps async route handlers to catch rejected promises automatically.
 * Eliminates try/catch boilerplate in every controller method.
 */
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
