# Mini HR - Frontend

Employee Leave & Attendance Management System — React frontend (JavaScript, Vite, Tailwind, React Router, Axios, Context API).

## Tech Stack

- **React** (Vite) — JavaScript only, no TypeScript
- **Tailwind CSS** — styling
- **React Router** — routing
- **Axios** — API calls
- **React Context API** — global auth state (no Redux/Zustand/etc.)

## Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000). API requests are proxied to `http://localhost:5000` (backend).

## Project Structure (Step 1)

```
src/
├── components/     # ui, layout, forms, tables
├── pages/          # auth, employee, admin
├── services/       # api.js (Axios instance)
├── context/        # AuthContext.jsx
├── routes/         # ProtectedRoute.jsx
├── hooks/
├── utils/
├── App.jsx
└── main.jsx
```

## Development Order

Step 1 ✅ Project setup (this step)  
Step 2 — Authentication (Login, Signup, AuthContext, Protected routes)  
Step 3+ — Layout, dashboards, leave/attendance, admin, polish
