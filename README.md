# HAJ School of Engineering - ERP System

A full-stack MERN (MongoDB, Express, React, Node.js) ERP website for school/college management with three roles: **Admin**, **Teacher**, and **Student**.

## Features

### Admin
- Dashboard with system-wide statistics
- User management (add/delete students & teachers)
- Class & section management
- Subject management with teacher assignments
- Gallery management

### Teacher
- Dashboard with class overview
- Mark student attendance
- Create and manage assignments
- View & grade submissions
- Add exam results
- Send notifications

### Student
- Dashboard with attendance %, upcoming exams & pending assignments
- View personal attendance records (Present/Absent/Leave)
- View assignments & submit files
- View exam schedule
- Check exam results & grades

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Bootstrap 5, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas URI)

## Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd erp-website

# 2. Create .env file (or use the existing one)
#    Edit .env with your MongoDB URI

# 3. Install all dependencies
npm run install:all

# 4. Seed the database with demo data
npm run seed

# 5. Start development (backend + frontend concurrently)
npm run dev
```

The server runs on **http://localhost:5000** and the client on **http://localhost:3000**.

> The Vite dev server proxies `/api` and `/uploads` requests to the backend, so all API calls work seamlessly.

## Production Build

```bash
# Build the React frontend
npm run client:build

# The production build is served by Express
npm start
```

## Demo Credentials

After running `npm run seed`, use these login credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@haj.edu | admin123 |
| **Teacher** | sharma@haj.edu | teacher123 |
| **Student** | joshin@haj.edu | student123 |
| **Student** | priya@haj.edu | student123 |
| **Student** | arjun@haj.edu | student123 |

## Project Structure

```
erp-website/
├── server/                  # Backend API
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth & upload middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   ├── uploads/             # Uploaded files
│   ├── seed.js              # Database seeder
│   └── index.js             # Express entry point
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Axios API client
│   │   ├── components/      # Shared components
│   │   ├── context/         # Auth context
│   │   └── pages/           # Page components
│   │       ├── public/      # Home, About, Gallery, Login
│   │       ├── student/     # Student portal
│   │       ├── teacher/     # Teacher portal
│   │       └── admin/       # Admin portal
│   ├── index.html
│   └── vite.config.js
├── .env                     # Environment variables
├── .env.example             # Environment template
└── package.json             # Root scripts
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | User login |
| `GET /api/auth/me` | Get profile |
| `POST /api/auth/register` | Register user (admin only) |
| `GET/POST /api/students` | Student CRUD |
| `GET/POST /api/teachers` | Teacher CRUD |
| `GET/POST /api/classes` | Class CRUD |
| `GET/POST /api/subjects` | Subject CRUD |
| `POST/GET /api/attendance` | Attendance management |
| `GET/POST /api/assignments` | Assignment management |
| `POST/GET /api/submissions` | Submission management |
| `GET/POST /api/exams` | Exam management |
| `GET/POST /api/results` | Result management |
| `GET/POST /api/notifications` | Notification management |
| `GET/POST /api/gallery` | Gallery management |
| `GET /api/dashboard/*` | Dashboard data per role |

## Old Static Site

The original HTML/CSS static files are preserved in the `HTML/`, `CSS/`, `HTML_FOR_STUDENT/`, `CSS_FOR_STUDENT/`, `HTML_FOR_TEACHER/`, and `CSS_FOR_TEACHER/` directories.
