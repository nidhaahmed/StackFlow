# StackFlow — Workflow Automation Platform (MERN + RBAC + REST Queue Engine)

StackFlow is a role-based workflow automation backend for small teams and organizations. It handles project planning, milestone tracking, task assignment, verification queues, and auto-updated progress. This is a full workflow engine (not a simple CRUD demo).

## Features

### Authentication & Authorization
- Secure registration/login with bcrypt
- JWT-based access control:
    - Access tokens: short-lived (e.g., 15 min)
    - Refresh tokens: long-lived (e.g., 7 days) stored in DB + HttpOnly cookie
- Secure logout (DB + cookie invalidation)
- Role-Based Access Control (RBAC): Admin, Tech Lead, Teammate

### Project Management Engine
- Admins create and manage projects
- Projects contain milestones; milestones contain tasks
- Automatic tracking of:
    - Verified tasks
    - Milestone completion %
    - Overall project progress %

### Workflow Queue System (REST-Based)
- Teammates mark tasks as completed → tasks enter a verification queue (FIFO)
- Tech Leads verify tasks → status moves to verified
- Automatic cascade updates: task → milestone progress → project progress
- REST-based polling endpoints for queue status and entity details

### Progress Metrics
- Milestone stores % based on verified tasks
- Project computes overall progress across milestones
- All accessible via REST endpoints

### Architecture & Extensibility
- Clean, modular backend (controllers, models, routes)
- Environment-based config
- Designed to extend with Redis, Stripe, CI/CD

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (Access + Refresh tokens)
- HTTP-only cookies
- REST queue system
- Optional: Redis (BullMQ), Stripe, CI/CD

## Authentication Flow
- User registers with name, email, password, role
- Login returns access token (short-lived) and refresh token (stored in DB + HttpOnly cookie)
- Protected routes require `Authorization: Bearer <access_token>`
- When access token expires, call `/api/auth/refresh` to obtain a new access token
- Logout clears refresh token from DB and cookie

## Entities & Relationships
- User
    - Roles: admin, techlead, teammate
- Project
    - createdBy (Admin)
    - milestones []
    - progress %
- Milestone
    - assignedTo (Tech Lead)
    - tasks []
    - progress %
- Task
    - assignedTo (Teammate)
    - status: pending → completed → verified
    - verificationQueue flag

## Queue Workflow (REST-Based)
1. Teammate completes task
     - POST /api/tasks/complete/:taskId
     - Task enters verification queue
2. Tech Lead verifies next task
     - POST /api/tasks/verify/next
     - Updates task status, milestone progress, project progress
3. Polling APIs (frontend polls every few seconds)
     - GET /api/tasks/queue/status
     - GET /api/projects/details/:projectId
     - GET /api/milestones/details/:milestoneId
     - GET /api/tasks/details/:taskId

## API Endpoints Overview

Auth
- POST /api/auth/register — Create user
- POST /api/auth/login — Login user
- POST /api/auth/logout — Logout user
- GET  /api/auth/refresh — Refresh access token

Projects
- POST /api/projects/create — (admin) Create project
- GET  /api/projects — List projects
- GET  /api/projects/details/:projectId — Full project info

Milestones
- POST /api/milestones/create/:projectId — (admin/techlead) Add milestone
- GET  /api/milestones/:projectId — Get milestones
- GET  /api/milestones/details/:milestoneId — Milestone details

Tasks
- POST /api/tasks/create/:milestoneId — (techlead) Add task
- POST /api/tasks/complete/:taskId — (teammate) Complete task
- POST /api/tasks/verify/next — (techlead) Verify next task
- GET  /api/tasks/:milestoneId — List tasks
- GET  /api/tasks/details/:taskId — Task details
- GET  /api/tasks/queue/status — (techlead) Queue status

## Installation & Setup

1. Clone repository
```bash
git clone https://github.com/yourname/stackflow.git
cd stackflow-backend
```

2. Install packages
```bash
npm install
```

3. Add .env
```
MONGO_URI=your_mongodb_url
ACCESS_SECRET=secret
REFRESH_SECRET=secret
PORT=5000
```

4. Run server
```bash
npm run dev
```

## Future Enhancements
- Redis-based async engine (BullMQ)
- Stripe billing integration
- Multi-tenant organizations
- React dashboards
- CI/CD with GitHub Actions
- WebSocket real-time support

## Author
Nidha Ahmed Mohammad — AI & DS Engineer | Workflow Automation | MERN Stack | Backend Engineering
