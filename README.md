# SmartSeason Field Monitoring System

## Overview

SmartSeason is a full-stack agricultural field monitoring system designed to track crop progress across multiple fields throughout a growing season.

The system enables:

* Coordinators (Admins) to manage fields and assign field agents
* Field Agents to submit crop progress updates and field observations
* Real-time dashboard insights for monitoring agricultural activity

---

## Key Features

### Authentication and Role Management

* JWT-based authentication system
* Role-based access control with two roles:

  * Admin (Coordinator)
  * Field Agent
* Secure route protection on both backend and frontend

---

### Field Management

* Create, update, and manage agricultural fields
* Assign fields to specific field agents
* Track crop lifecycle per field
* Store and manage key field data:

  * Field name
  * Crop type
  * Planting date
  * Current growth stage

---

### Field Updates

Field Agents can:

* Submit crop growth stage updates
* Add notes and field observations
* Track progress per assigned field

Admins can:

* View all fields across the system
* Monitor updates from all agents
* Track field performance and historical activity

---

### Crop Lifecycle

The system models a simplified crop lifecycle:

Planted → Growing → Ready → Harvested

---

## Field Status Logic

Each field status is computed dynamically based on lifecycle stage and update activity.

| Status    | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| Active    | Field is progressing normally through Planted, Growing, or Ready stages |
| At Risk   | Field shows delays, missing updates, or overdue harvest activity        |
| Completed | Field has been fully harvested                                          |

---

## Tech Stack

### Backend

* Node.js (Express)
* TypeScript
* Drizzle ORM
* PostgreSQL
* JWT Authentication

### Frontend

* React (Vite)
* Redux Toolkit
* RTK Query
* Tailwind CSS 3.4
* React Router

---

## System Architecture

Frontend (React + RTK Query)
→ REST API (Express)
→ Service Layer (Business Logic)
→ Drizzle ORM
→ PostgreSQL

---

## API Overview

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/me`

### Fields

* GET `/api/fields`
* POST `/api/fields`
* PUT `/api/fields/:id`
* PATCH `/api/fields/:id/assign`
* DELETE `/api/fields/:id`

### Updates

* POST `/api/updates`
* GET `/api/updates/field/:fieldId`

### Dashboard

* GET `/api/dashboard/admin`
* GET `/api/dashboard/agent`

---

## Setup Instructions

### Backend Setup

```bash
cd backend
pnpm install
```

### Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/smartseason
JWT_SECRET=supersecret
PORT=8000
```

### Run Backend

```bash
pnpm run dev
```

---

### Frontend Setup

```bash
cd frontend
pnpm install
```

### Environment Variables

```
VITE_API_URL=http://localhost:8000/api
```

### Run Frontend

```bash
pnpm dev
```

---

## Demo Credentials

### Admin

* Email: [admin@smartseason.com](mailto:admin@smartseason.com)
* Password: 123456

### Field Agent

* Email: [agent@smartseason.com](mailto:agent@smartseason.com)
* Password: 123456

---

## Design Decisions

* Modular backend architecture separating auth, users, fields, updates, and dashboard modules
* Drizzle ORM used for type-safe database operations
* RTK Query for efficient API caching and state synchronization
* Immutable update logs for audit and traceability
* Role-based access enforced at middleware and service layers

---

## Assumptions

* Each field is assigned to only one agent at a time
* Admin has full system access
* Agents can only update assigned fields
* Field updates are immutable for audit history

---

## Future Improvements

* Geo-mapping and visualization of fields
* Image uploads for field reporting
* Notification system for updates and alerts
* Real-time updates using WebSockets
* Advanced analytics dashboard with predictive insights

---

## Project Structure

```
SmartSeason/
├── backend/
│   ├── src/
│   ├── drizzle/
│   └── modules/
├── frontend/
│   ├── src/
│   ├── features/
│   └── pages/
```

---

## Conclusion

SmartSeason demonstrates practical full-stack engineering skills, including:

* Clean and modular system architecture
* Secure authentication and role-based authorization
* Real-world agricultural workflow modeling
* Scalable backend design with modern frontend integration
