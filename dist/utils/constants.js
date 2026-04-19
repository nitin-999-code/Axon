"use strict";
/**
 * Application-wide constants.
 * Centralized to prevent magic strings scattered across the codebase.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTITY_TYPES = exports.AUDIT_ACTIONS = exports.DEFAULT_WORKFLOW_STATUSES = exports.APPROVAL_STATUSES = exports.TASK_PRIORITIES = exports.ROLES = void 0;
exports.ROLES = Object.freeze({
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
});
exports.TASK_PRIORITIES = Object.freeze({
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    URGENT: "URGENT",
});
exports.APPROVAL_STATUSES = Object.freeze({
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
});
exports.DEFAULT_WORKFLOW_STATUSES = Object.freeze([
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "DONE",
]);
exports.AUDIT_ACTIONS = Object.freeze({
    // Auth
    USER_REGISTERED: "USER_REGISTERED",
    USER_LOGGED_IN: "USER_LOGGED_IN",
    // Workspace
    WORKSPACE_CREATED: "WORKSPACE_CREATED",
    WORKSPACE_UPDATED: "WORKSPACE_UPDATED",
    MEMBER_ADDED: "MEMBER_ADDED",
    MEMBER_REMOVED: "MEMBER_REMOVED",
    MEMBER_ROLE_CHANGED: "MEMBER_ROLE_CHANGED",
    // Project
    PROJECT_CREATED: "PROJECT_CREATED",
    PROJECT_UPDATED: "PROJECT_UPDATED",
    PROJECT_DELETED: "PROJECT_DELETED",
    // Task
    TASK_CREATED: "TASK_CREATED",
    TASK_UPDATED: "TASK_UPDATED",
    TASK_DELETED: "TASK_DELETED",
    TASK_ASSIGNED: "TASK_ASSIGNED",
    STATUS_CHANGED: "STATUS_CHANGED",
    // Approval
    APPROVAL_REQUESTED: "APPROVAL_REQUESTED",
    APPROVAL_GRANTED: "APPROVAL_GRANTED",
    APPROVAL_REJECTED: "APPROVAL_REJECTED",
    // Dependency
    DEPENDENCY_ADDED: "DEPENDENCY_ADDED",
    DEPENDENCY_REMOVED: "DEPENDENCY_REMOVED",
});
exports.ENTITY_TYPES = Object.freeze({
    USER: "USER",
    WORKSPACE: "WORKSPACE",
    PROJECT: "PROJECT",
    TASK: "TASK",
    WORKFLOW: "WORKFLOW",
    APPROVAL: "APPROVAL",
});
