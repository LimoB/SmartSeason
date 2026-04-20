# SmartSeason Field Monitoring System

## Overview

SmartSeason is a full-stack agricultural field monitoring system designed to track crop progress across multiple fields during a growing season.

It enables:

* Coordinators (Admins) to manage fields and field agents
* Field Agents to update crop progress and add observations
* Real-time dashboard insights for monitoring field activity

---

## Key Features

### Authentication & Roles

* JWT-based authentication
* Role-based access control:

  * Admin (Coordinator)
  * Field Agent
* Secure route protection on both backend and frontend

---

### Field Management

* Create and manage agricultural fields
* Assign fields to specific agents
* Track crop lifecycle per field
* Store essential field data:

  * Name
  * Crop type
  * Planting date
  * Current stage

---

### Field Updates

Field Agents can:

* Update field growth stage
* Add notes and observations
* Submit progress updates per field

Admins can:

* View all fields
* Monitor updates across all agents
* Track field performance and activity history

---

### Field Lifecycle

The system uses a simple crop lifecycle:

Planted → Growing → Ready → Harvested

---

## Field Status Logic

Each field has a computed status based on its lifecycle and activity.

| Status    | Description                                             |
| --------- | ------------------------------------------------------- |
| Active    | Field is progressing normally (Planted, Growing, Ready) |
| At Risk   | Field shows delays, missing updates, or overdue harvest |
| Completed | Field has been harvested                                |

Status is computed using field stage and update activity patterns.

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
↓
REST API (Express)
↓
Service Layer (Business Logic)
↓
Drizzle ORM
↓
PostgreSQL

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

* Modular backend structure (auth, users, fields, updates, dashboard)
* Drizzle ORM for type-safe database access
* RTK Query for efficient API caching and state management
* Immutable update logs for audit history tracking
* Role-based access enforced at middleware and controller level

---

## Assumptions

* One field is assigned to one agent at a time
* Admin has full system access
* Agents can only update assigned fields
* Field updates are immutable for historical tracking

---

## Future Improvements

* Geo-mapping of fields
* Image uploads for field reports
* Notification system for updates
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

SmartSeason is a full-stack field monitoring system designed to demonstrate practical software engineering skills including:

* Clean architecture and modular design
* Secure authentication and role-based access control
* Real-world agricultural workflow modeling
* Scalable backend and modern frontend integration
