# Submission Checklist & Integration Test Guide

**Employee Leave & Attendance Management System (Mini HR Tool)**

This document provides (1) **5 example employees** for testing, (2) an in-depth verification of functionality against the project specification, and (3) sequential UI integration test steps.

---

## Part 0: 5 Example Employees (for integration testing)

Use these **5 employees** when running the integration test. Create each via **Sign up** (one by one), then use the same credentials to log in and perform employee flows. Use a **single shared password** for simplicity (e.g. `Password123`).

| # | Full Name       | Email                    | Password (example) |
|---|-----------------|---------------------------|--------------------|
| 1 | Priya Sharma    | priya.sharma@company.com   | Password123        |
| 2 | Rahul Verma     | rahul.verma@company.com    | Password123        |
| 3 | Anjali Patel    | anjali.patel@company.com   | Password123        |
| 4 | Vikram Singh    | vikram.singh@company.com   | Password123        |
| 5 | Sneha Reddy     | sneha.reddy@company.com    | Password123        |

**Admin (for admin tests):** Use one seeded admin account from your backend (e.g. from a seed script). If you don’t have one, create an admin user in the database with `role: 'admin'` and note the email/password for the test.

---

## Part 1: In-Depth Functionality Verification (Docs vs Implementation)

### 1. User Authentication & Profile Management

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| User Registration | ✅ | **Employees only** via Signup (`/signup`). No role selector; always `signup(..., 'employee')`. Admin accounts are backend-seeded only. |
| User Login (JWT) | ✅ | `Login.jsx` → POST `/api/auth/login`; token stored in localStorage; sent via Axios interceptor. |
| Password Hashing | ✅ | Backend (bcrypt). Frontend never sees plain password. |
| Profile View: Full Name, Email, Role, Date of Joining | ✅ | `Profile.jsx` displays all four from `useAuth().user`; `loadUser()` refreshes from GET `/api/auth/profile`. |
| Logout securely | ✅ | `AuthContext.logout()` clears token/user; Navbar redirects to `/login`. |
| Forgot password (Send OTP, Verify OTP, Reset) | ✅ | `ForgotPassword.jsx`: Step 1 → POST `/api/auth/send-otp`; Step 2 → POST `/api/auth/reset-password` with email, OTP, newPassword. Login has "Forgot password?" link. |

### 2. Leave Management

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| Apply for Leave (Casual, Sick, Paid) | ✅ | `ApplyLeave.jsx` + `LeaveForm.jsx`; POST `/api/leaves/apply`. |
| Leave fields: Type, Start, End, Total Days (auto), Status, Applied Date, Reason | ✅ | Form has all; Total Days computed in `LeaveForm`; backend sets status/appliedDate. |
| View Leave Requests / History | ✅ | `LeaveHistory.jsx`; GET `/api/leaves/my-leaves`; table with Type, Start, End, Days, Status, Applied, Reason. |
| Edit Pending Leave | ✅ | Edit modal in Leave History; PUT `/api/leaves/:id`; only when status = Pending. |
| Cancel Pending Leave | ✅ | Cancel button with confirm; DELETE `/api/leaves/:id`; only when status = Pending. |
| Status badges: Pending / Approved / Rejected | ✅ | `StatusBadge.jsx` used in Leave History, Dashboard, Admin Leave Requests. |
| End date not before start date | ✅ | Validated in `LeaveForm` and backend. |
| Total days auto-calculated | ✅ | `getTotalDays()` in LeaveForm; displayed and sent to backend. |

### 3. Leave Balance Tracking

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| Fixed balance (e.g. 20 days) | ✅ | Backend User model `leaveBalance: 20`; frontend `INITIAL_LEAVE_BALANCE = 20` in LeaveBalanceCard. |
| Approved leave reduces balance | ✅ | Backend deducts on approve; frontend refreshes user via `loadUser()` so balance updates. |
| Display on employee dashboard | ✅ | `LeaveBalanceCard`: **Total**, **Used**, **Remaining** on Dashboard, Apply Leave, Leave History, Profile. |

### 4. Attendance Management

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| Mark Daily Attendance (Present / Absent) | ✅ | `Attendance.jsx`; POST `/api/attendance/mark` with `{ status }`. |
| View Attendance History | ✅ | `AttendanceHistory.jsx`; GET `/api/attendance/my-attendance`. |
| One record per day | ✅ | Backend enforces; frontend shows "Attendance already marked for today" and hides form when today exists. |
| No future dates | ✅ | Backend uses server "today" only. |
| Admin: View all attendance | ✅ | `admin/Attendance.jsx`; GET `/api/attendance/all`. |
| Admin: Filter by date or employee | ✅ | Date input and employee dropdown; client-side filter on fetched list. |

### 5. Admin Role & Controls

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| Approve / Reject Leave | ✅ | `LeaveRequests.jsx`; PUT `/api/admin/leaves/:leaveId` with `{ status: 'Approved' \| 'Rejected' }`. |
| View all employee records | ✅ | `Employees.jsx`; GET `/api/admin/users`; table: Name, Email, Role, Date of Joining, Leave Balance; role filter. |
| Admin dashboard: Total Employees, Pending Leaves, Attendance Overview | ✅ | `admin/Dashboard.jsx`; GET `/api/admin/dashboard`; stat cards + quick links. |
| Admin credentials seeded manually | ✅ | No admin option on Signup; admins created via backend seeding. |

### 6. Frontend Requirements (UI)

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| Login & Signup pages | ✅ | `Login.jsx`, `Signup.jsx`; public routes with redirect if already logged in. |
| Employee Dashboard: balance, leave history, attendance | ✅ | Dashboard shows LeaveBalanceCard, recent leaves table, recent attendance table, quick actions. |
| Admin Dashboard: leave approval, attendance overview | ✅ | Stats (employees, pending leaves, today attendance, total leaves); links to Leave Requests, Employees, Attendance. |
| Forms: Apply Leave, Mark Attendance | ✅ | LeaveForm component; Attendance page with Present/Absent radios. |
| Logout | ✅ | Navbar Logout → clear auth, redirect to `/login`. |
| Responsive UI, success/error messages | ✅ | Toasts (ToastContext), Alert component, LoadingSpinner; Tailwind responsive classes; sidebar collapses on mobile. |

### 7. Authorization & Security

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| Employee: own data only | ✅ | API uses `req.userId`; employee routes only expose own leaves/attendance. |
| Admin: full access | ✅ | Admin routes and APIs for all leaves, users, attendance. |
| Protected routes, role-based | ✅ | `ProtectedRoute` checks `user` and `allowedRoles`; employee routes `allowedRoles={['employee']}`, admin `allowedRoles={['admin']}`. |
| 401/403 handling | ✅ | Axios response interceptor clears auth and redirects to `/login`. |

### 8. Login Redirect by Role

| Doc Requirement | Status | Implementation Detail |
|-----------------|--------|------------------------|
| role = admin → Admin Dashboard | ✅ | `getDashboardPath('admin')` → `/admin/dashboard`; Login uses `data.user.role` after login. |
| role = employee → Employee Dashboard | ✅ | `getDashboardPath('employee')` → `/employee/dashboard`. |

### 9. README & Submission (per doc)

| Doc Requirement | Status | Notes |
|-----------------|--------|--------|
| Project Overview | ✅ | README has About, Architecture, Features. |
| Tech Stack & Justification | ⚠️ | README lists backend; frontend still says "Planned" – update to React (Vite), Tailwind, Axios, React Router, Context API. |
| Installation Steps | ⚠️ | Backend only; add frontend: `cd frontend`, `npm install`, `npm run dev`. |
| Environment Variables | ✅ | Backend .env described. |
| API Endpoints list | ❌ | Not in README – add a section listing all endpoints (see below). |
| Database Models | ✅ | Users, Leaves, Attendance in README. |
| Admin Credentials | ⚠️ | Add if you have a seed script and default admin. |
| AI Tools Declaration | ❌ | Add to README per submission guidelines. |
| Known Limitations | Optional | E.g. reason required on backend for leave. |
| Deployment links | ❌ | Add when frontend and backend are deployed (Vercel, Render, etc.). |

**API Endpoints (for README):**

| Method | Endpoint | Purpose |
|--------|----------|--------|
| POST | /api/auth/register | Register (employee); body: fullName, email, password |
| POST | /api/auth/login | Login; body: email, password; returns token, user |
| GET | /api/auth/profile | Current user profile (auth) |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/send-otp | Send OTP to email (body: email) |
| POST | /api/auth/verify-otp | Verify OTP (body: email, otp) |
| POST | /api/auth/reset-password | Reset password (body: email, otp, newPassword) |
| POST | /api/leaves/apply | Apply leave (auth); body: leaveType, startDate, endDate, reason |
| GET | /api/leaves/my-leaves | My leave list (auth) |
| PUT | /api/leaves/:id | Update leave (auth); body: leaveType, startDate, endDate, reason |
| DELETE | /api/leaves/:id | Delete/cancel leave (auth) |
| POST | /api/attendance/mark | Mark attendance (auth); body: status (Present/Absent) |
| GET | /api/attendance/my-attendance | My attendance (auth) |
| GET | /api/attendance/all | All attendance (admin) |
| GET | /api/admin/dashboard | Dashboard stats (admin) |
| GET | /api/admin/leaves | All leaves, optional ?status=&employeeId= (admin) |
| PUT | /api/admin/leaves/:leaveId | Approve/reject leave (admin); body: status |
| GET | /api/admin/users | All users (admin) |
| GET | /api/admin/users/:userId | User by ID (admin) |

---

## Part 2: Sequential UI Integration Test (complete flow)

**Prerequisites:** Backend running (e.g. port 5000), frontend running (e.g. port 3000). Use the **5 example employees** from Part 0 and one **admin** account (seeded or created in DB).

Follow the steps in order. Each step assumes you are on the correct page or have just completed the previous step.

---

### 1. App & route protection (unauthenticated)

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Open app root (e.g. `http://localhost:3000`) | Redirect to `/login` |
| 2 | While logged out, open `/employee/dashboard` in the URL | Redirect to `/login` |
| 3 | While logged out, open `/admin/dashboard` in the URL | Redirect to `/login` |

---

### 2. Create 5 employees via Sign up

| # | Action | Expected result |
|---|--------|-----------------|
| 4 | On Login, click **Sign up** | Navigate to `/signup` |
| 5 | On Signup page: confirm there is **no Role dropdown** | Only employee registration; text like "Register as employee. Admin accounts are managed separately." |
| 6 | Sign up **Employee 1**: Priya Sharma, priya.sharma@company.com, Password123, Confirm → Submit | Success toast; redirect to `/login` |
| 7 | Sign up **Employee 2**: Rahul Verma, rahul.verma@company.com, Password123, Confirm → Submit | Success toast; redirect to `/login` |
| 8 | Sign up **Employee 3**: Anjali Patel, anjali.patel@company.com, Password123, Confirm → Submit | Success toast; redirect to `/login` |
| 9 | Sign up **Employee 4**: Vikram Singh, vikram.singh@company.com, Password123, Confirm → Submit | Success toast; redirect to `/login` |
| 10 | Sign up **Employee 5**: Sneha Reddy, sneha.reddy@company.com, Password123, Confirm → Submit | Success toast; redirect to `/login` |

---

### 3. Employee login, dashboard, profile & logout

| # | Action | Expected result |
|---|--------|-----------------|
| 11 | Log in as **Priya** (priya.sharma@company.com / Password123) | Redirect to `/employee/dashboard`; sidebar: Dashboard, Apply Leave, Leave History, Mark Attendance, Attendance History, Profile; navbar shows name and Logout |
| 12 | On Dashboard: confirm **Leave Balance** card shows Total 20, Used, Remaining; confirm **Recent Leaves** and **Recent Attendance** sections (can be empty) | Correct labels and layout |
| 13 | Open **Profile** from sidebar | Full Name (Priya Sharma), Email, Role (Employee), Date of Joining; Leave Balance card (Total/Used/Remaining) |
| 14 | Click **Logout** | Redirect to `/login` |

---

### 4. Employee: Apply leave, view history, edit & cancel (Priya)

| # | Action | Expected result |
|---|--------|-----------------|
| 15 | Log in as **Priya** again | Employee dashboard |
| 16 | Open **Apply Leave**; choose Type **Casual**, set Start and End dates (e.g. next week, 2 days), add Reason → Submit | Success toast; leave appears in Leave History with status **Pending** |
| 17 | Open **Leave History** | Table shows the new leave; **Edit** and **Cancel** visible for Pending |
| 18 | Click **Edit** on that leave → change reason or dates → Save | Success toast; row updates |
| 19 | Create another pending leave (e.g. Sick, 1 day). In Leave History, click **Cancel** on it → confirm | Success toast; that row removed |
| 20 | Open **Dashboard** and **Profile** | Leave balance still shows Total 20, Used 0, Remaining 20 (no approval yet) |

---

### 5. Employee: Mark attendance & view history (Priya)

| # | Action | Expected result |
|---|--------|-----------------|
| 21 | Open **Mark Attendance** | Today’s date shown; if not yet marked: Present/Absent options and Submit |
| 22 | Select **Present** → Mark Attendance | Success toast; then message like "Attendance already marked for today" with Present |
| 23 | Open **Attendance History** | Today’s record with status **Present** (or Absent if you chose that) |
| 24 | Open **Mark Attendance** again | No form to mark again; message that today is already marked |

---

### 6. More employees: leave & attendance (optional spread across 5 employees)

| # | Action | Expected result |
|---|--------|-----------------|
| 25 | Logout; log in as **Rahul** (rahul.verma@company.com / Password123) | Employee dashboard |
| 26 | Apply leave: **Sick**, 1 day, reason → Submit. Open Leave History | One Pending leave for Rahul |
| 27 | Mark Attendance → **Present** (or Absent) | Success toast |
| 28 | Logout; log in as **Anjali**; apply one **Paid** leave (e.g. 3 days); mark attendance | Leaves and attendance recorded for Anjali |
| 29 | Repeat for **Vikram** and **Sneha** (one leave each, mark attendance) if you want all 5 with data | 5 employees with leaves and attendance |

---

### 7. Role-based route protection

| # | Action | Expected result |
|---|--------|-----------------|
| 30 | While logged in as **Priya** (employee), type `/admin/dashboard` in the URL and press Enter | Redirect to `/employee/dashboard` (employee cannot access admin) |
| 31 | Logout; log in with **admin** credentials (your seeded admin) | Redirect to `/admin/dashboard`; sidebar: Dashboard, Leave Requests, Employees, Attendance |
| 32 | As admin, type `/employee/dashboard` in the URL and press Enter | Redirect to `/admin/dashboard` (admin sent to admin area) |

---

### 8. Admin: Dashboard, Employees list, Attendance

| # | Action | Expected result |
|---|--------|-----------------|
| 33 | On **Admin Dashboard**: confirm stat cards (e.g. Total Employees, Pending Leaves, Today’s Attendance, Total Leaves) and quick links | Numbers and links visible |
| 34 | Open **Employees** | Table lists all users: Name, Email, Role, Date of Joining, Leave Balance; filter by role (Employees / Admins / All) works |
| 35 | Confirm **all 5 employees** (Priya, Rahul, Anjali, Vikram, Sneha) appear in the list | 5 rows (plus admin if in same table) |
| 36 | Open **Attendance** | Table: Employee, Date, Status; filters for employee and date work; "Clear filters" works |

---

### 9. Admin: Leave approval & balance update

| # | Action | Expected result |
|---|--------|-----------------|
| 37 | Open **Leave Requests** | Table of all leave requests; filters by status and employee |
| 38 | **Approve** one pending leave (e.g. Priya’s Casual 2-day leave) | Success toast; status changes to **Approved** |
| 39 | **Reject** another pending leave (e.g. Rahul’s) | Success toast; status changes to **Rejected** |
| 40 | Logout; log in as **Priya** (whose leave was approved) | Employee dashboard |
| 41 | Check **Dashboard** and **Profile** Leave Balance | **Remaining** = 18 (20 − 2), **Used** = 2 |

---

### 10. Forgot password (OTP send & reset)

| # | Action | Expected result |
|---|--------|-----------------|
| 42 | Logout; on Login page click **Forgot password?** | Navigate to `/forgot-password` |
| 43 | Enter **Priya’s email** (priya.sharma@company.com) → **Send OTP** | Success toast "OTP sent to your email" (or check backend logs if email is not configured); form switches to OTP + new password step |
| 44 | Enter the OTP received (or from backend log), new password (e.g. NewPass123), confirm → **Verify OTP & Reset password** | Success toast "Password reset successfully" |
| 45 | Click **Sign in**; log in as Priya with **NewPass123** | Login succeeds; redirect to employee dashboard |
| 46 | (Optional) Reset Priya’s password back to Password123 via Forgot password again for reuse in tests | — |

---

### 11. End-to-end check with 5 employees

| # | Action | Expected result |
|---|--------|-----------------|
| 47 | Log in as **admin** | Admin dashboard |
| 48 | **Leave Requests**: filter by employee; confirm you see leaves from multiple of the 5 employees | Multiple employees’ leaves visible |
| 49 | **Attendance**: filter by today’s date; confirm you see attendance for employees who marked today | Rows for those employees, today |
| 50 | **Employees**: filter "Employees only"; confirm list shows exactly the 5 (Priya, Rahul, Anjali, Vikram, Sneha) with correct names and emails | 5 employees listed; data consistent with signup |

---

**Summary:** Steps 1–3 verify auth and routing; 4–6 cover employee leave and attendance with the 5 users; 7 verifies role guards; 8–9 cover admin views and leave approval; 10 verifies OTP/reset; 11 is a final cross-check. If all steps pass, the full flow from the docs is covered.

---

## Part 3: Submission Guidelines Checklist

1. **GitHub repository link** – Provide when submitting.
2. **Deployment links** – Deploy frontend (e.g. Vercel) and backend (e.g. Render, Railway); add both URLs to README and submission.
3. **AI usage and contributions** – In README, add a short section listing AI tools used (e.g. Cursor, ChatGPT, Copilot) and what they were used for (e.g. scaffolding, UI components, documentation).

---

## Summary

- **Core functionality** from the assignment docs is implemented: auth (employee-only signup, login by role, profile, logout, **forgot password with OTP send & reset**), leave (apply, history, edit/cancel, status badges), leave balance (Total/Used/Remaining), attendance (mark, history, admin view + filters), admin (dashboard, leave approval, employees list, attendance monitoring), role-based routing, and responsive UI with loading/error/success handling.
- **Integration test:** Use the **5 example employees** (Part 0); run the **sequential steps** in Part 2 (steps 1–50) to validate the full flow from the UI.
- **README gaps** to address before submission: update frontend tech stack and installation, add **API Endpoints** section (table above), add **AI Tools Declaration**, and add **deployment links** once deployed.
