# Axon — Smart Project Management Platform

## Overview

**Axon** is a workflow-driven smart project management platform designed to manage projects, tasks, approvals, and dependencies in a structured and scalable way.

This project is developed as part of the **System Design & Software Engineering (SESD)** course and focuses primarily on **backend architecture, object-oriented design, and clean software engineering practices**.

Unlike traditional task management tools, Axon introduces a configurable workflow engine, approval-based task transitions, and dependency management to simulate real-world enterprise project management systems.

---

## Project Type

**Full Stack Application**

Backend Weightage: **75%**
Frontend Weightage: **25%**

The backend is the primary focus of this system, emphasizing:

* System Design
* OOP Principles
* Clean Architecture
* Design Patterns
* Modular Services

---

## Objectives

The primary objectives of this project are:

* Design a modular backend architecture using clean architecture principles
* Implement object-oriented programming concepts
* Build a configurable workflow engine
* Implement role-based access control (RBAC)
* Manage task dependencies and detect circular dependencies
* Maintain audit logs for system transparency
* Demonstrate system design best practices

---

## Key Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-Based Access Control (RBAC)
* Permission-based access validation

---

### Workspace & Project Management

* Create and manage workspaces
* Invite members to workspace
* Create projects within workspace
* Assign users to projects

---

### Task Management

* Create, update, and delete tasks
* Assign tasks to users
* Set priority and due date
* Create subtasks
* Move tasks between workflow states

---

### Custom Workflow Engine (Core Feature)

Users can define custom workflows instead of fixed statuses.

Example workflow:

Draft → Review → Approved → Done

Capabilities:

* Dynamic workflow configuration
* State transition validation
* Role-based transition permissions
* Workflow enforcement

---

### Approval-Based Task Workflow

Certain tasks require approval before progressing.

Example:

Developer completes task
Manager approves task
Task moves to next stage

---

### Task Dependency Management

Tasks can depend on other tasks.

Capabilities:

* Define dependencies between tasks
* Prevent circular dependencies
* Calculate critical path
* Identify blocked tasks

---

### Audit Logging System

Every important system action is recorded.

Examples:

* Task created
* Task status changed
* Project updated
* User assigned

This improves:

* Traceability
* Accountability
* Debugging

---

## Unique Differentiators

This system is not a simple task manager.

It includes:

* Custom workflow engine
* Approval-based transitions
* Dependency graph engine
* Critical path calculation
* Role-based permissions (RBAC)
* Audit logging system
* Clean modular architecture

---

## Technology Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose / Prisma
* JWT Authentication

### Frontend

* React
* Tailwind CSS

### Tools

* Git
* GitHub
* Postman
* Mermaid (for diagrams)

---

## System Architecture

The backend follows a **Clean Architecture** pattern:

Controller → Service → Repository → Database

```
Client (React)
      ↓
API Layer (Express)
      ↓
Controllers
      ↓
Services
      ↓
Repositories
      ↓
Database (MongoDB)
```

This structure ensures:

* Separation of concerns
* Maintainability
* Scalability
* Testability

---

## Design Patterns Used

The system uses industry-standard design patterns:

* Repository Pattern
* Service Layer Pattern
* Observer Pattern (Notifications)
* Strategy Pattern (Priority / Dependency logic)
* Middleware Pattern (Authentication & RBAC)

---

## Project Structure

```
axon/
│
├── controllers/
├── services/
├── repositories/
├── models/
├── middleware/
├── routes/
├── config/
│
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
├── ErDiagram.md
│
└── README.md
```

---

## Core Modules

* Authentication Service
* User Management
* Workspace Management
* Project Management
* Task Management
* Workflow Engine
* Dependency Graph Engine
* Audit Logging
* Notification Service

## API Design Principles

* RESTful APIs
* Versioned endpoints
* Standard response format
* Input validation
* Error handling middleware

## Author
**Nitin Sahu**
