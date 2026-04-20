🚀 Overview

SmartSeason is a full-stack agricultural field monitoring system designed to track crop progress across multiple fields during a growing season.

It enables:

👨‍💼 Coordinators (Admins) to manage fields and agents
👨‍🌾 Field Agents to update crop progress
📊 Real-time dashboard analytics
🎯 Key Features
🔐 Authentication & Roles
JWT-based authentication
Role-based access control:
Admin (Coordinator)
Field Agent
🌱 Field Management
Create & manage fields
Assign fields to agents
Track crop lifecycle
📈 Field Updates
Stage updates (Planted → Growing → Ready → Harvested)
Notes & observations
Update history tracking
📊 Dashboards
Admin analytics dashboard
Agent personal dashboard
Field status breakdown
🧠 Field Lifecycle
Planted → Growing → Ready → Harvested
⚙️ Tech Stack
Backend
Node.js (Express)
TypeScript
Drizzle ORM
PostgreSQL
JWT Authentication
Frontend
React (Vite)
Redux Toolkit
RTK Query
Tailwind CSS 3.4
React Router
🏗️ System Architecture
Frontend (React + RTK Query)
        ↓
REST API (Express)
        ↓
Service Layer (Business Logic)
        ↓
Drizzle ORM
        ↓
PostgreSQL
📊 Field Status Logic
Status	Description
🟢 Active	Field is in progress (Planted / Growing / Ready)
🟡 At Risk	Overdue harvest or inactive updates


🌱 Field Management

📦 API Overview
Auth
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Fields
GET    /api/fields
POST   /api/fields
PUT    /api/fields/:id
PATCH  /api/fields/:id/assign
DELETE /api/fields/:id
Updates
POST /api/updates
GET  /api/updates/field/:fieldId
Dashboard
GET /api/dashboard/admin
GET /api/dashboard/agent
⚙️ Setup Instructions
🔧 Backend Setup
cd backend
pnpm install
Environment Variables
DATABASE_URL=postgresql://user:password@localhost:5432/smartseason
JWT_SECRET=supersecret
PORT=8000
Run Server
pnpm run dev
💻 Frontend Setup
cd frontend
pnpm install
Environment Variables
VITE_API_URL=http://localhost:8000/api
Run Frontend
pnpm dev
🔑 Demo Credentials
Admin
Email: admin@smartseason.com
Password: 123456
Field Agent
Email: agent@smartseason.com
Password: 123456
🧩 Design Decisions
Modular backend (auth, users, fields, updates, dashboard)
Drizzle ORM for type safety
RTK Query for API caching
Immutable update logs (audit trail design)
Role-based security enforced at middleware + controller level
⚖️ Assumptions
One field = one assigned agent
Admin has full system access
Agents only update assigned fields
Updates are immutable (history tracking system)
🚀 Future Improvements
📍 Geo-mapping of fields
📷 Image uploads for field reports
🔔 Notifications system
📡 Real-time updates (WebSockets)
📊 Advanced analytics dashboard
📁 Project Structure
SmartSeason/
 ├── backend/
 │   ├── src/
 │   ├── drizzle/
 │   └── modules/
 ├── frontend/
 │   ├── src/
 │   ├── features/
 │   └── pages/
🏁 Conclusion

SmartSeason demonstrates a real-world SaaS-style agricultural monitoring system, focusing on:

Clean architecture
Scalable backend design
Role-based access control
Modern frontend state management
Practical business logic implementation
⭐ Author

Built as a Full Stack Developer Technical Assessment Project.