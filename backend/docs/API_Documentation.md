# Axon API Documentation

> **Base URL:** `http://localhost:8000/api`  
> **Auth:** Bearer JWT token in `Authorization` header

---

## 1. Authentication

### POST /auth/register
**Body:**
```json
{ "name": "Nitin Sahu", "email": "nitin@axon.dev", "password": "Secure@123" }
```
**Response (201):**
```json
{ "success": true, "message": "User registered successfully", "data": { "user": { "id": "uuid", "name": "Nitin Sahu", "email": "nitin@axon.dev" }, "token": "jwt..." } }
```

### POST /auth/login
**Body:**
```json
{ "email": "nitin@axon.dev", "password": "Secure@123" }
```
**Response (200):**
```json
{ "success": true, "data": { "user": {...}, "token": "jwt..." } }
```

### GET /auth/me
**Headers:** `Authorization: Bearer <token>`  
**Response (200):** Returns authenticated user profile.

---

## 2. Workspaces

### POST /workspaces
**Body:**
```json
{ "name": "Engineering", "description": "Main engineering workspace" }
```

### GET /workspaces
Returns all workspaces for the authenticated user.

### POST /workspaces/:workspaceId/members
**Body:**
```json
{ "email": "member@axon.dev", "role": "MEMBER" }
```

---

## 3. Projects

### POST /projects
```json
{ "name": "Axon Core", "description": "Core platform", "workspaceId": "uuid" }
```

### GET /projects/:id
### PUT /projects/:id
### DELETE /projects/:id

---

## 4. Tasks

### POST /tasks
```json
{ "title": "Setup CI/CD", "description": "Configure pipeline", "projectId": "uuid", "priority": "HIGH", "dueDate": "2026-05-01", "assigneeId": "uuid", "parentTaskId": "uuid" }
```

### GET /tasks/:id
Returns task with dependencies, subtasks, and assignee.

### PUT /tasks/:id
### DELETE /tasks/:id
### PATCH /tasks/:id/assign
```json
{ "assigneeId": "uuid" }
```

### PATCH /tasks/:id/move
```json
{ "newProjectId": "uuid" }
```

---

## 5. Workflow Engine

### POST /workflows
```json
{ "projectId": "uuid" }
```

### GET /workflows/project/:projectId
### POST /workflows/:workflowId/states
```json
{ "name": "IN_PROGRESS", "description": "Work in progress", "isInitial": false, "isFinal": false }
```

### POST /workflows/:workflowId/transitions
```json
{ "fromStateId": "uuid", "toStateId": "uuid", "allowedRoles": ["ADMIN", "OWNER"] }
```

### POST /workflows/tasks/:taskId/transition
```json
{ "targetStateName": "IN_PROGRESS" }
```

---

## 6. Dependencies

### POST /dependencies
```json
{ "taskId": "uuid", "dependsOnId": "uuid" }
```

### GET /dependencies/project/:projectId/analyze
Returns topological sort, cycle detection status, critical path, and bottleneck tasks.

**Response (200):**
```json
{ "success": true, "data": { "hasCycle": false, "topologicalOrder": ["uuid1", "uuid2"], "criticalPath": { "length": 3, "path": ["uuid1", "uuid2", "uuid3"] }, "bottlenecks": [{ "taskId": "uuid1", "dependentCount": 5 }] } }
```

---

## 7. Sprints

### POST /sprints
```json
{ "projectId": "uuid", "name": "Sprint 1", "goal": "MVP", "startDate": "2026-04-01", "endDate": "2026-04-14" }
```

### POST /sprints/assign
```json
{ "taskId": "uuid", "sprintId": "uuid" }
```

### GET /sprints/:sprintId/velocity
### GET /sprints/:sprintId/burndown
### POST /sprints/:sprintId/detect-overdue

---

## 8. Comments

### POST /comments/:taskId
```json
{ "content": "This needs review", "parentCommentId": "uuid (optional)" }
```

### GET /comments/:taskId?page=1&limit=10

---

## 9. Activity Feed

### GET /activity/project/:projectId?page=1&limit=20
Returns paginated audit log entries for a project timeline.

---

## 10. Approvals

### POST /approvals/:taskId/request-approval
Requests completion approval for a task.

### POST /approvals/:taskId/approve
Approves a pending request and transitions task to COMPLETED.

### POST /approvals/:taskId/reject
Rejects a pending approval request.

### GET /approvals/:taskId
Returns all approval records for a task.

---

## 11. Templates

### POST /templates
```json
{ "name": "Bug Fix Template", "description": "Standard bug fix", "defaultPriority": "HIGH", "defaultPoints": 3, "workspaceId": "uuid" }
```

### GET /templates/workspace/:workspaceId

### POST /templates/:templateId/create-task
```json
{ "projectId": "uuid" }
```

---

## Error Responses

All errors follow this structure:
```json
{ "success": false, "statusCode": 400, "message": "Validation failed", "errors": [{ "field": "body.email", "message": "Invalid email" }] }
```

| Code | Meaning |
|------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Internal Error |
