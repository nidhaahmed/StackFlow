# StackFlow

A full-featured workflow automation platform with project management, role-based access control, and task verification queues. Built with MERN stack (MongoDB, Express, React, Node.js).

## What StackFlow Does

StackFlow is a complete project management and workflow automation system designed for small teams and organizations. It enables teams to:

- **Organize work hierarchically** — Create projects, break them into milestones, and assign individual tasks
- **Manage roles and permissions** — Admin, Tech Lead, and Teammate roles with specific access controls
- **Track progress automatically** — Real-time progress updates cascade from tasks to milestones to projects
- **Verify work quality** — Tasks enter a verification queue where Tech Leads review and approve completed work
- **Control task workflow** — Tasks progress through pending → completed → verified states

## Key Features

### 🔐 Authentication & Authorization

- Secure JWT-based authentication with short-lived access tokens and long-lived refresh tokens
- HttpOnly cookie support for enhanced security
- Role-Based Access Control (RBAC) with Admin, Tech Lead, and Teammate roles
- Secure logout with token invalidation

### 📊 Project Management

- Hierarchical organization: Projects → Milestones → Tasks
- Create and manage projects with descriptions
- Organize work into milestones assigned to Tech Leads
- Assign specific tasks to team members
- Real-time progress tracking at all levels

### ✅ Workflow Queue System

- REST-based task verification queue (FIFO)
- Teammates mark tasks as completed
- Tech Leads verify tasks through a centralized queue
- Automatic progress updates cascade through the hierarchy
- Polling endpoints for real-time status tracking

### 📈 Progress Tracking

- Automatic milestone progress calculation based on verified tasks
- Project-level progress aggregated from all milestones
- Real-time status updates via REST endpoints

## Tech Stack

**Backend:**

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Redis BullMQ for optional async job processing

**Frontend:**

- React 19 with TypeScript
- Vite for fast development
- React Router for navigation
- TailwindCSS + shadcn/ui for styling
- Zod for form validation
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Redis (optional, for advanced queue features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/stackflow.git
   cd stackflow
   ```

2. **Install backend dependencies**

   ```bash
   cd stackflow-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../stackflow-frontend
   npm install
   ```

### Configuration

Create `.env` file in `stackflow-backend/` directory:

```env
# Database
DB_URI=mongodb://localhost:27017/stackflow

# JWT Secrets
ACCESS_SECRET=your_access_token_secret_here
REFRESH_SECRET=your_refresh_token_secret_here

# Server
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Running the Application

**Start the backend server:**

```bash
cd stackflow-backend
npm run dev
```

Server will run on `http://localhost:5000`

**In another terminal, start the frontend:**

```bash
cd stackflow-frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Usage

1. **Register an account** — Navigate to `/register` and create a user account
2. **Login** — Use your credentials to access the dashboard
3. **Create a project** — (Admin role) Create a new project from the projects page
4. **Add milestones** — Break your project into milestones
5. **Create tasks** — Assign specific tasks to team members
6. **Complete and verify** — Team members complete tasks, tech leads verify through the queue

## API Overview

### Authentication Endpoints

```
POST   /api/auth/register      — Create a new user account
POST   /api/auth/login         — Authenticate and receive tokens
POST   /api/auth/logout        — Invalidate tokens and logout
GET    /api/auth/refresh       — Refresh access token
```

### Project Endpoints

```
POST   /api/projects/create    — Create a new project (Admin)
GET    /api/projects           — List all projects
GET    /api/projects/details/:projectId — Get project details with progress
```

### Milestone Endpoints

```
POST   /api/milestones/create/:projectId — Add milestone to project
GET    /api/milestones/:projectId — List milestones in project
GET    /api/milestones/details/:milestoneId — Get milestone details
```

### Task Endpoints

```
POST   /api/tasks/create/:milestoneId — Create task in milestone (Tech Lead)
GET    /api/tasks/:milestoneId — List tasks in milestone
GET    /api/tasks/details/:taskId — Get task details
POST   /api/tasks/complete/:taskId — Mark task as completed (Teammate)
POST   /api/tasks/verify/next — Verify next task in queue (Tech Lead)
GET    /api/tasks/queue/status — Check verification queue status
```

## Project Structure

```
stackflow/
├── stackflow-backend/          # Node.js/Express backend
│   └── src/
│       ├── models/             # MongoDB schemas
│       ├── controllers/        # Route handlers
│       ├── routes/             # API route definitions
│       ├── middlewares/        # Auth & authorization
│       ├── queues/             # Queue system setup
│       └── server.js           # Express app entry point
├── stackflow-frontend/         # React TypeScript frontend
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route pages
│       ├── layouts/            # Page layouts
│       └── utils/              # Helper functions
└── README.md                   # This file
```

## Role-Based Access Control

| Role          | Permissions                                                                |
| ------------- | -------------------------------------------------------------------------- |
| **Admin**     | Create projects, manage organization, create milestones, view all tasks    |
| **Tech Lead** | Create tasks, assign tasks, verify tasks in queue, view milestone progress |
| **Teammate**  | Complete assigned tasks, view task details                                 |

## Development

### Backend Development

```bash
cd stackflow-backend
npm run dev  # Runs with nodemon for auto-reload
npm start    # Run without auto-reload
```

### Frontend Development

```bash
cd stackflow-frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Future Enhancements

- [ ] Real-time updates with WebSocket (Socket.io)
- [ ] Redis-based async job processing (BullMQ integration)
- [ ] Stripe billing and subscription management
- [ ] Multi-tenant organizations with custom workspaces
- [ ] Advanced analytics and reporting dashboards
- [ ] CI/CD integration with GitHub Actions
- [ ] Email notifications for task assignments
- [ ] File attachments and comments on tasks
- [ ] Gantt chart timeline visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For help and support:

- **Issues** — Report bugs and request features via [GitHub Issues](https://github.com/yourusername/stackflow/issues)
- **Documentation** — Check the [project documentation](./docs) for detailed guides
- **Questions** — Open a discussion for general questions and feedback

## License

This project is licensed under the ISC License — see the LICENSE file for details.

## Author

**Nidha Ahmed Mohammad**

- AI & Data Science Engineer
- Workflow Automation & MERN Stack Specialist
- Backend Engineering & System Design

---

**Last Updated:** December 2025
