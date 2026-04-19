# Axon API Documentation

## Base URL
`/api`

## Authentication
All endpoints (except `/health`, `/auth/register`, `/auth/login`) require a Bearer token.
Header: `Authorization: Bearer <token>`

---

## 1. Authentication
- `POST /auth/register`: Register a new user (body: name, email, password)
- `POST /auth/login`: Login (body: email, password, returns token)
- `POST /auth/logout`: Logout user
- `GET  /auth/me`: Fetch authenticated profile

## 2. Workspaces
- `GET  /workspaces`: Get all workspaces for user
- `POST /workspaces`: Create workspace (body: name, description)
- `GET  /workspaces/:workspaceId`: Get specific workspace
- `POST /workspaces/:workspaceId/members`: Add a member (Requires OWNER/ADMIN role. body: email, role)

## 3. Projects
- `POST /projects`: Create project (body: name, description, workspaceId)
- `GET  /projects/:id`: Get project details
- `PUT  /projects/:id`: Update project details
- `DELETE /projects/:id`: Delete project

## 4. Tasks
- `POST /tasks`: Create a task (body: title, description, projectId, assigneeId, parentTaskId, priority, dueDate)
- `GET  /tasks/:id`: Get task details incl. dependencies & subtasks
- `PUT  /tasks/:id`: Update task
- `DELETE /tasks/:id`: Delete task
- `PATCH /tasks/:id/assign`: Assign task (body: assigneeId)
- `PATCH /tasks/:id/move`: Move to new project (body: newProjectId)

## 5. Workflows
- `POST /workflows`: Create workflow base for project (body: projectId)
- `GET  /workflows/project/:projectId`: Get project's workflow
- `POST /workflows/:workflowId/states`: Add state (body: name, description, isInitial, isFinal)
- `POST /workflows/:workflowId/transitions`: Add transition (body: fromStateId, toStateId, allowedRoles)
- `POST /workflows/tasks/:taskId/transition`: Execute task state change (body: targetStateName)

## 6. Dependencies (Graph Engine)
- `POST /dependencies`: Link two tasks (body: taskId, dependsOnId)
- `GET  /dependencies/project/:projectId/analyze`: Run topological sort, circular detection, and identify bottlenecks

## 7. Sprints (Analytics)
- `POST /sprints`: Create sprint (body: projectId, name, goal, startDate, endDate)
- `POST /sprints/assign`: Mount task into a sprint (body: taskId, sprintId)
- `GET  /sprints/:sprintId/velocity`: Calculate total completed vs remaining points
- `GET  /sprints/:sprintId/burndown`: Generate burndown trajectory data
- `POST /sprints/:sprintId/detect-overdue`: Trigger EventBus for overdue alerts (Observer pattern)
