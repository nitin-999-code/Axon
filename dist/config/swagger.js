"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Axon — Smart Project Management Platform API",
        version: "1.0.0",
        description: "Production-grade project management API with workflow engine, dependency graph analysis, sprint analytics, and approval workflows.",
        contact: {
            name: "Nitin Sahu",
            email: "nitin@axon.dev",
        },
    },
    servers: [
        {
            url: "http://localhost:8000/api",
            description: "Development server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
            Task: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    title: { type: "string" },
                    description: { type: "string" },
                    projectId: { type: "string", format: "uuid" },
                    currentStatus: { type: "string" },
                    priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] },
                    storyPoints: { type: "integer" },
                    dueDate: { type: "string", format: "date-time" },
                    requiresApproval: { type: "boolean" },
                },
            },
            Project: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string" },
                    description: { type: "string" },
                    workspaceId: { type: "string", format: "uuid" },
                },
            },
            Approval: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    taskId: { type: "string", format: "uuid" },
                    status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] },
                    requestedBy: { type: "string", format: "uuid" },
                    decidedBy: { type: "string", format: "uuid" },
                },
            },
            Error: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    statusCode: { type: "integer" },
                    message: { type: "string" },
                    errors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                field: { type: "string" },
                                message: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "email", "password"],
                                properties: {
                                    name: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", minLength: 6 },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "User registered successfully" } },
            },
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login user",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "200": { description: "Login successful" } },
            },
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get authenticated user profile",
                responses: { "200": { description: "Profile retrieved" } },
            },
        },
        "/tasks": {
            post: {
                tags: ["Tasks"],
                summary: "Create a new task",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/Task" },
                        },
                    },
                },
                responses: { "201": { description: "Task created" } },
            },
        },
        "/tasks/{id}": {
            get: {
                tags: ["Tasks"],
                summary: "Get task by ID",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { "200": { description: "Task retrieved" } },
            },
        },
        "/approvals/{taskId}/request-approval": {
            post: {
                tags: ["Approvals"],
                summary: "Request approval for task completion",
                parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" } }],
                responses: { "201": { description: "Approval requested" } },
            },
        },
        "/approvals/{taskId}/approve": {
            post: {
                tags: ["Approvals"],
                summary: "Approve a pending task",
                parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" } }],
                responses: { "200": { description: "Task approved" } },
            },
        },
        "/approvals/{taskId}/reject": {
            post: {
                tags: ["Approvals"],
                summary: "Reject a pending task",
                parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" } }],
                responses: { "200": { description: "Task rejected" } },
            },
        },
        "/templates": {
            post: {
                tags: ["Templates"],
                summary: "Create a reusable task template",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "workspaceId"],
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    defaultPriority: { type: "string" },
                                    defaultPoints: { type: "integer" },
                                    workspaceId: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Template created" } },
            },
        },
        "/templates/{templateId}/create-task": {
            post: {
                tags: ["Templates"],
                summary: "Create a task from template",
                parameters: [{ name: "templateId", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["projectId"],
                                properties: { projectId: { type: "string" } },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Task created from template" } },
            },
        },
        "/dependencies": {
            post: {
                tags: ["Dependencies"],
                summary: "Add a dependency between tasks",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["taskId", "dependsOnId"],
                                properties: {
                                    taskId: { type: "string" },
                                    dependsOnId: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Dependency added" } },
            },
        },
        "/dependencies/project/{projectId}/analyze": {
            get: {
                tags: ["Dependencies"],
                summary: "Analyze dependency graph — topological sort, critical path, bottlenecks",
                parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string" } }],
                responses: { "200": { description: "Graph analysis returned" } },
            },
        },
        "/sprints/{sprintId}/velocity": {
            get: {
                tags: ["Sprints"],
                summary: "Get sprint velocity",
                parameters: [{ name: "sprintId", in: "path", required: true, schema: { type: "string" } }],
                responses: { "200": { description: "Velocity data" } },
            },
        },
        "/sprints/{sprintId}/burndown": {
            get: {
                tags: ["Sprints"],
                summary: "Get burndown chart data",
                parameters: [{ name: "sprintId", in: "path", required: true, schema: { type: "string" } }],
                responses: { "200": { description: "Burndown data" } },
            },
        },
        "/comments/{taskId}": {
            post: {
                tags: ["Comments"],
                summary: "Add a comment to a task",
                parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["content"],
                                properties: {
                                    content: { type: "string" },
                                    parentCommentId: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Comment added" } },
            },
            get: {
                tags: ["Comments"],
                summary: "Get paginated comments for a task",
                parameters: [
                    { name: "taskId", in: "path", required: true, schema: { type: "string" } },
                    { name: "page", in: "query", schema: { type: "integer" } },
                    { name: "limit", in: "query", schema: { type: "integer" } },
                ],
                responses: { "200": { description: "Comments retrieved" } },
            },
        },
        "/activity/project/{projectId}": {
            get: {
                tags: ["Activity"],
                summary: "Get project activity feed",
                parameters: [
                    { name: "projectId", in: "path", required: true, schema: { type: "string" } },
                    { name: "page", in: "query", schema: { type: "integer" } },
                ],
                responses: { "200": { description: "Activity feed" } },
            },
        },
    },
};
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    swaggerDefinition,
    apis: [],
});
exports.default = swaggerSpec;
