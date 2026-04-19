"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Request validation middleware factory using Zod schemas.
 * Validates body, query, and/or params against provided schemas.
 */
const validate = (schemas) => {
    return (req, _res, next) => {
        const errors = [];
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                errors.push(...result.error.issues.map((issue) => ({
                    field: `body.${issue.path.join(".")}`,
                    message: issue.message,
                })));
            }
            else {
                req.body = result.data;
            }
        }
        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                errors.push(...result.error.issues.map((issue) => ({
                    field: `query.${issue.path.join(".")}`,
                    message: issue.message,
                })));
            }
            else {
                req.query = result.data;
            }
        }
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                errors.push(...result.error.issues.map((issue) => ({
                    field: `params.${issue.path.join(".")}`,
                    message: issue.message,
                })));
            }
            else {
                req.params = result.data;
            }
        }
        if (errors.length > 0) {
            return next(ApiError_1.default.unprocessable("Validation failed", errors));
        }
        next();
    };
};
exports.default = validate;
