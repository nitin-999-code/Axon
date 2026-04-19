# Sequence Diagram — Task Creation & Workflow Transition

## Overview

This sequence diagram illustrates the end-to-end flow when a user creates a task and subsequently transitions it to the next workflow state. The flow demonstrates the interaction between all architectural layers following the **Controller → Service → Repository** pattern, including permission checks, workflow validation, and audit logging.

---

## Flow 1: Task Creation

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend (React)
    participant Controller as API Controller
    participant Service as TaskService
    participant RBAC as RBAC Middleware
    participant Repo as TaskRepository
    participant DB as MongoDB
    participant Audit as AuditLogService

    User->>Frontend: Fill task form & submit
    Frontend->>Controller: POST /api/tasks (title, projectId, assignee)
    
    Controller->>RBAC: Validate JWT & check permissions
    RBAC-->>Controller: Authorized ✅

    Controller->>Controller: Validate request body
    Controller->>Service: createTask(taskData, userId)

    Service->>Service: Validate project exists
    Service->>Service: Set initial workflow status (e.g., "Draft")
    Service->>Repo: save(taskDocument)
    Repo->>DB: insertOne(task)
    DB-->>Repo: Acknowledged (taskId)
    Repo-->>Service: Task created

    Service->>Audit: logAction("TASK_CREATED", userId, taskId)
    Audit->>DB: insertOne(auditLog)
    DB-->>Audit: Acknowledged

    Service-->>Controller: Task response object
    Controller-->>Frontend: 201 Created (task JSON)
    Frontend-->>User: Display success notification
```

---

## Flow 2: Workflow State Transition

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend (React)
    participant Controller as API Controller
    participant Service as TaskService
    participant Workflow as WorkflowEngine
    participant Approval as ApprovalService
    participant Dependency as DependencyService
    participant Repo as TaskRepository
    participant DB as MongoDB
    participant Audit as AuditLogService

    User->>Frontend: Click "Move to Review"
    Frontend->>Controller: PATCH /api/tasks/:id/status (newStatus: "Review")
    
    Controller->>Controller: Validate JWT & extract userId
    Controller->>Service: changeTaskStatus(taskId, newStatus, userId)

    Service->>Repo: findById(taskId)
    Repo->>DB: findOne(taskId)
    DB-->>Repo: Task document
    Repo-->>Service: Current task (status: "Draft")

    Service->>Service: Check user has permission (RBAC)

    Service->>Dependency: checkDependenciesResolved(taskId)
    Dependency->>DB: Find dependencies for task
    DB-->>Dependency: Dependencies list
    Dependency-->>Service: All dependencies resolved ✅

    Service->>Workflow: validateTransition("Draft", "Review", projectId)
    Workflow->>DB: Fetch transition rules
    DB-->>Workflow: Valid transitions
    Workflow-->>Service: Transition valid ✅

    Service->>Workflow: requiresApproval("Draft", "Review")
    Workflow-->>Service: No approval required

    Service->>Repo: updateStatus(taskId, "Review")
    Repo->>DB: updateOne(taskId, status: "Review")
    DB-->>Repo: Updated
    Repo-->>Service: Task updated

    Service->>Audit: logAction("STATUS_CHANGED", userId, taskId, metadata)
    Audit->>DB: insertOne(auditLog)
    DB-->>Audit: Acknowledged

    Service-->>Controller: Updated task
    Controller-->>Frontend: 200 OK (updated task JSON)
    Frontend-->>User: Update task card status
```

---

## Flow 3: Transition Requiring Approval

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend (React)
    participant Controller as API Controller
    participant Service as TaskService
    participant Workflow as WorkflowEngine
    participant Approval as ApprovalService
    participant DB as MongoDB
    participant Audit as AuditLogService

    User->>Frontend: Click "Move to Approved"
    Frontend->>Controller: PATCH /api/tasks/:id/status (newStatus: "Approved")
    Controller->>Service: changeTaskStatus(taskId, "Approved", userId)

    Service->>Workflow: validateTransition("Review", "Approved", projectId)
    Workflow-->>Service: Transition valid ✅

    Service->>Workflow: requiresApproval("Review", "Approved")
    Workflow-->>Service: Approval required ⚠️

    Service->>Approval: createApprovalRequest(taskId, userId, "Approved")
    Approval->>DB: insertOne(approvalRequest)
    DB-->>Approval: Acknowledged
    Approval-->>Service: Approval request created (status: Pending)

    Service->>Audit: logAction("APPROVAL_REQUESTED", userId, taskId)
    Audit->>DB: insertOne(auditLog)

    Service-->>Controller: 202 Accepted (awaiting approval)
    Controller-->>Frontend: Approval pending response
    Frontend-->>User: Show "Awaiting Approval" badge

    Note over User, Audit: Later — Approver grants approval

    actor Approver
    Approver->>Frontend: Click "Approve"
    Frontend->>Controller: POST /api/approvals/:id/approve
    Controller->>Approval: approveRequest(approvalId, approverId)

    Approval->>DB: Update approval status to "Approved"
    Approval->>Service: triggerTransition(taskId, "Approved")
    Service->>DB: updateOne(taskId, status: "Approved")

    Service->>Audit: logAction("APPROVAL_GRANTED", approverId, taskId)
    Service->>Audit: logAction("STATUS_CHANGED", approverId, taskId)

    Service-->>Controller: Task transitioned
    Controller-->>Frontend: 200 OK
    Frontend-->>Approver: Task status updated
```

---

## Key Observations

| Step                     | Layer            | Responsibility                                      |
|--------------------------|------------------|-----------------------------------------------------|
| Request validation       | Controller       | Schema validation, JWT extraction                   |
| Permission check         | Service / RBAC   | Role-based authorization via `role.canDo(action)`   |
| Dependency verification  | DependencyService| Ensure all blocking tasks are resolved              |
| Workflow validation      | WorkflowEngine   | Verify the transition is defined and valid           |
| Approval gating          | ApprovalService  | Create approval request if transition requires it   |
| Data persistence         | Repository       | Database operations abstracted from business logic  |
| Audit trail              | AuditLogService  | Immutable record of every significant action        |
