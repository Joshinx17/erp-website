# CampusOS

CampusOS is an education operations platform for schools, colleges, universities, and coaching institutes. This repository is being progressively migrated from a small MERN education portal to a tenant-aware ERP; it intentionally delivers working vertical slices rather than a collection of disconnected placeholder modules.

## Current phase

Phase 1 establishes the CampusOS application shell, responsive workspace, command palette (`Ctrl/Cmd + K`), initial institution/campus/academic-year models, expanded role and permission foundations, and soft-archive behavior for students. Legacy attendance, assignments, examinations, and notifications are retained while their data models are migrated.

## Stack

- React 18, Vite, React Router
- Node.js, Express, Mongoose, MongoDB
- JWT and bcrypt password hashing

## Run locally

1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET` and MongoDB connection string.
2. Install dependencies with `npm run install:all`.
3. Optionally create legacy demo records with `npm run seed`.
4. Run `npm run dev`; the API is served on port 5000 and the Vite client normally on port 5173.

Build the client with `npm run client:build`, then run `npm start` to serve it from Express.

## Important development notes

New institutional data must be scoped to an institution and, where appropriate, a campus. New protected endpoints must verify a server-side permission and scope every query by the authenticated user’s tenant. Do not rely on client-side control hiding for authorization, and do not hard-delete academic or financial history.

Detailed design notes are in [Architecture](docs/ARCHITECTURE.md), [Database](docs/DATABASE.md), and [RBAC](docs/RBAC.md).

## Roadmap

The next vertical slices are a tenant-migrated Student 360 and academic structure, followed by attendance, timetable, examinations, finance, admissions, and service modules. Each module must include persistence, authorization, validation, auditability, responsive behavior, and test coverage before it is considered complete.
