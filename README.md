# MyTeam – Leave & Attendance Management System

A comprehensive Employee Leave & Attendance Management System designed to streamline HR operations for small to medium-sized teams.

## About This Project

This HR management system was built as a take-home assignment to demonstrate full-stack development capabilities. It provides essential HR functionalities including leave management, attendance tracking, and user role management with a clean, modern architecture.

## Architecture Overview

The project follows a clean architecture pattern with clear separation of concerns:

```
miniHRmanagementSystem/
├── backend/                    # Node.js + Express API
│   ├── controllers/           # Business logic handlers
│   ├── routes/               # API route definitions
│   ├── models/               # Database schemas (clean architecture)
│   ├── middleware/           # Authentication & authorization
│   ├── config/               # Database configuration
│   └── services/             # Utility services
├── frontend/                  # React.js application
│   ├── pages/                # React page components
│   ├── components/           # Reusable UI components
│   └── services/             # API integration layer
└── README.md
```

##  Technology Stack

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Architecture**: Clean architecture pattern

### Frontend
- **Framework**: React.js (Vite)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: React Context API (auth, toasts)
- **HTTP Client**: Axios (with JWT interceptors)
- **Icons**: react-icons (Heroicons)

### Database Design
The MongoDB database uses three main collections:

#### Users Collection
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: ["employee", "admin"],
  dateOfJoining: Date,
  leaveBalance: Number (default: 20)
}
```

#### Leaves Collection
```javascript
{
  userId: ObjectId (ref: User),
  leaveType: ["Casual", "Sick", "Paid"],
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  status: ["Pending", "Approved", "Rejected"],
  appliedDate: Date,
  reason: String
}
```

#### Attendance Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  status: ["Present", "Absent"]
}
```

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/muskanndas/MYTEAM-Mini-HR-management-.git
   cd MYTEAM-Mini-HR-management-
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your MongoDB connection string and JWT secret:
   ```env
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

4. **Start the Backend Server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```
   The server will start on `http://localhost:5000`.

5. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:3000` and proxy API requests to the backend.

##  Features & Functionality

###  Employee Features
- **User Management**: Registration and secure login system
- **Leave Management**: 
  - Apply for different types of leave (Casual, Sick, Paid)
  - View leave history and current status
  - Edit/cancel pending leave requests
- **Attendance Tracking**: 
  - Mark daily attendance (Present/Absent)
  - View attendance history
  - Automatic validation (one record per day, no future dates)
- **Leave Balance**: Track remaining leave days (starts at 20 days)

###  Admin Features
- **Leave Management**: Approve or reject employee leave requests
- **Employee Oversight**: View all employee data and records
- **Attendance Monitoring**: 
  - View attendance records of all employees
  - Filter attendance by date or employee
- **System Administration**: Full access to all system features

###  Security Features
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control (Employee vs Admin)
- **Password Security**: bcrypt password hashing
- **Data Validation**: Input validation and sanitization
- **API Security**: Protected routes with proper error handling

##  Business Logic & Rules

### Leave Management Rules
- Each employee starts with 20 leave days
- Leave balance decreases only when leave is approved
- Total days are calculated automatically from date range
- End date must be after start date
- Leave status flows: Pending → Approved/Rejected

### Attendance Rules
- Only one attendance record allowed per user per day
- Cannot mark attendance for future dates
- Attendance status: Present or Absent
- Unique constraint enforced at database level

### User Roles & Permissions
- **Employees**: Can only access their own data
- **Admins**: Full access to all employee data and system features
- Protected API routes enforce role-based access

## API Endpoints

All endpoints are prefixed with `/api`. Auth-required routes need the `Authorization: Bearer <token>` header.

| Method | Endpoint | Purpose |
|--------|----------|--------|
| POST | /api/auth/register | Register (employee); body: fullName, email, password |
| POST | /api/auth/login | Login; body: email, password; returns token, user |
| GET | /api/auth/profile | Current user profile (auth required) |
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
| GET | /api/admin/leaves | All leaves; optional ?status=&employeeId= (admin) |
| PUT | /api/admin/leaves/:leaveId | Approve/reject or update leave status (admin); body: status |
| GET | /api/admin/users | All users (admin) |
| GET | /api/admin/users/:userId | User by ID (admin) |

## Admin Credentials

Admin accounts are not created via the frontend signup. If you have a backend seed script, run it and use the seeded admin email/password to log in. Otherwise, create an admin user directly in the database with `role: 'admin'` and note the credentials for testing.

## Deployment

For submission, deploy both applications and add the live URLs here:

- **Frontend**: (e.g. Vercel, Netlify) — _Add your frontend URL_
- **Backend**: (e.g. Render, Railway) — _Add your backend URL_

Ensure the frontend is configured to call the deployed backend API URL in production.

## AI Tools Declaration

This project may have used AI-assisted tools (e.g. Cursor, ChatGPT, GitHub Copilot) for scaffolding, code suggestions, and documentation. All business logic and architecture decisions were implemented with human review. AI usage is disclosed in accordance with submission guidelines.

## Known Limitations

- Leave reason may be required by backend validation depending on configuration.
- OTP delivery depends on backend email setup (e.g. Nodemailer); without it, OTP may be logged server-side for testing.
- Admin accounts must be created via database seed or manually in the database.

## Development Notes

### Clean Architecture Implementation
The project follows clean architecture principles:

- **Models**: Only contain data structure definitions
- **Controllers**: Handle all business logic and calculations
- **Middleware**: Handle cross-cutting concerns (auth, validation)
- **Routes**: Define API endpoints and route handlers

### API Design
RESTful API design with proper HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Database Design
- **Indexes**: Optimized for performance with compound indexes
- **Constraints**: Unique constraints prevent duplicate data
- **References**: Proper foreign key relationships
- **Validation**: Schema-level data validation

## Current Status

### Completed
- Backend: Express API, auth (JWT, bcrypt), leave & attendance APIs, admin routes, role middleware
- Frontend: React (Vite), Login/Signup/Forgot Password, Employee & Admin dashboards, leave & attendance flows, profile, role-based routing
- Leave balance tracking (20 days, Total/Used/Remaining)
- OTP send/verify and password reset
- Responsive UI with Tailwind, toasts, and loading states

##  Contributing

This project is part of a full-stack development assessment. While contributions are welcome, the primary focus is on demonstrating clean code practices, proper architecture, and comprehensive functionality.

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Contact

Built by Muskan Das as part of a full-stack development assessment.

---

**Note**: This is a demonstration project showcasing modern web development practices including clean architecture, secure authentication, and comprehensive HR management features.
