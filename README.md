# MyTeam – Leave & Attendance Management System

## 1. Project Overview

A mini HR system for managing employee leave requests, attendance records, and employee data. Built as a take-home assignment to demonstrate full-stack development.

**Purpose:** Streamline HR operations for small to medium-sized teams with secure authentication, role-based access, and clear workflows.

**Features:**
- **Employee:** Apply for leave (Casual, Sick, Paid), mark daily attendance, view leave & attendance history, track leave balance.
- **Admin:** Approve/reject leave, monitor attendance, view all employee data.
- **Security:** JWT authentication, role-based access (Employee vs Admin), password hashing, protected API routes.

---

## 2. Tech Stack & Justification

| Layer        | Choice           | Justification |
|-------------|------------------|---------------|
| **Frontend** | React (Vite)     | Fast dev experience, modern tooling, easy to deploy. |
| **Backend**  | Node.js + Express | Lightweight, widely used, good ecosystem for REST APIs. |
| **Database** | MongoDB          | Flexible schema, good fit for leave/attendance documents; Atlas for hosting. |
| **Auth**     | JWT              | Stateless, standard for SPAs; tokens in headers. |
| **Styling**  | Tailwind CSS     | Utility-first, responsive, quick UI consistency. |
| **Password** | bcryptjs         | Industry-standard hashing for passwords. |

**Project structure:**
```
root/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── services/
├── frontend/
│   ├── pages/
│   ├── components/
│   └── services/   (API calls)
└── README.md
```

---

## 3. Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/muskanndas/MYTEAM-Mini-HR-management-.git
   cd MYTEAM-Mini-HR-management-
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   ```
   Create `.env` (see Environment Variables below), then:
   ```bash
   npm run dev    # development with auto-restart
   # or
   npm start      # production
   ```
   Backend runs at `http://localhost:5000`.

3. **Seed admin (optional, for first run)**
   ```bash
   node createAdmin.js
   ```

4. **Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:3000` (or the port Vite shows).

5. **Production:** Ensure frontend is configured to call the deployed backend URL (e.g. via `VITE_API_ORIGIN`).

---

## 4. Environment Variables

Configure these in `backend/.env`. Do not commit real secrets.

| Variable        | Required | Description |
|-----------------|----------|-------------|
| `MONGODB_URI`   | Yes      | MongoDB connection string (e.g. Atlas URI). |
| `JWT_SECRET`    | Yes      | Secret key for signing JWT tokens. Use a long, random value in production. |
| `JWT_EXPIRE`    | No       | Token expiry (e.g. `7d`). Defaults as set in code. |
| `PORT`          | No       | Server port (default `5000`). |
| `NODE_ENV`      | No       | `development` or `production`. |
| `EMAIL_USER`    | No       | Email address for OTP/password reset (e.g. Gmail). |
| `EMAIL_PASS`    | No       | App password or SMTP password for the above. |



---

## 5. API Endpoints

Base URL: `/api`. Auth-required routes need header: `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|--------|----------|--------|
| POST | `/api/auth/register` | Register (employee); body: `fullName`, `email`, `password` |
| POST | `/api/auth/login` | Login; body: `email`, `password`; returns token and user |
| GET | `/api/auth/profile` | Current user profile (auth required) |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/send-otp` | Send OTP to email; body: `email` |
| POST | `/api/auth/verify-otp` | Verify OTP; body: `email`, `otp` |
| POST | `/api/auth/reset-password` | Reset password; body: `email`, `otp`, `newPassword` |
| POST | `/api/leaves/apply` | Apply leave (auth); body: `leaveType`, `startDate`, `endDate`, `reason` |
| GET | `/api/leaves/my-leaves` | Current user's leave list (auth) |
| PUT | `/api/leaves/:id` | Update leave (auth); body: `leaveType`, `startDate`, `endDate`, `reason` |
| DELETE | `/api/leaves/:id` | Delete/cancel leave (auth) |
| POST | `/api/attendance/mark` | Mark attendance (auth); body: `status` (Present/Absent) |
| GET | `/api/attendance/my-attendance` | Current user's attendance (auth) |
| GET | `/api/attendance/all` | All attendance (admin only) |
| GET | `/api/admin/dashboard` | Dashboard stats (admin only) |
| GET | `/api/admin/leaves` | All leaves; optional query: `status`, `employeeId` (admin only) |
| PUT | `/api/admin/leaves/:leaveId` | Approve/reject leave; body: `status` (admin only) |
| GET | `/api/admin/users` | All users (admin only) |
| GET | `/api/admin/users/:userId` | User by ID (admin only) |

---

## 6. Database Models

**User**
- `fullName` (String), `email` (String, unique), `password` (String, hashed), `role` (`employee` | `admin`), `dateOfJoining` (Date), `leaveBalance` (Number, default 20).
- Relationships: referenced by `Leave.userId` and `Attendance.userId`.

**Leave**
- `userId` (ObjectId, ref User), `leaveType` (`Casual` | `Sick` | `Paid`), `startDate`, `endDate` (Date), `totalDays` (Number), `status` (`Pending` | `Approved` | `Rejected`), `appliedDate` (Date), `reason` (String, optional).
- Relationship: belongs to one User.

**Attendance**
- `userId` (ObjectId, ref User), `date` (Date), `status` (`Present` | `Absent`).
- Relationship: belongs to one User. One record per user per day; no future dates.

---

## 7. Admin Credentials

Admin is seeded via script (not signup). After running:

```bash
cd backend && node createAdmin.js
```

use these credentials to log in as admin:

- **Email:** `admin@gmail.com`  
- **Password:** `admin123`  
- **Role:** `admin`

---

## 8. AI Tools Declaration

AI-assisted tools (e.g. ChatGPT, GitHub Copilot) may have been used for:
- Boilerplate, project setup, and documentation structure.
- Code suggestions and refactoring.
- README and inline comments.



---

## 9. Known Limitations

- Leave reason may be required or optional depending on backend validation configuration.
- OTP/password reset depends on email config (`EMAIL_USER`, `EMAIL_PASS`); without it, OTP may only be logged server-side for testing.
- Admin accounts are created only via `createAdmin.js` or manually in the database (no admin signup in the app).
- Single attendance record per user per day; no future-dated attendance.

---

## 10. Time Spent

Approximate time spent on the project: 6 hours over 2 days.

---

## Deployment

For submission, deploy both applications and add the live URLs here:

- **Project_Link** : https://myteam-mini-hr-management.onrender.com

Ensure the frontend uses the deployed backend API URL in production (e.g. via `VITE_API_ORIGIN`).

---

## License & Contact

Licensed under the MIT License. Built by Muskan Das as part of a full-stack development assessment.
