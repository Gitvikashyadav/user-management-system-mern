# 🚀 User Management System (RBAC)

## 🔗 Live Demo

* **Frontend:** https://user-management-system-mern-frontend-fidn.onrender.com
* **Backend:** https://user-management-system-mern-backend.onrender.com

---

## 📌 Overview

A production-ready **MERN stack User Management System** with secure authentication and **Role-Based Access Control (RBAC)**.

Built with scalability and security in mind, the system supports **Admin, Manager, and User roles**, each with clearly defined permissions and protected API access.

---

## ✨ Core Features

###  Authentication & Security

* JWT-based authentication (Access Token)
* Password hashing using bcrypt
* Protected routes via middleware (`protect`)
* Role-based authorization (`authorize`)
* Rate limiting & secure API middleware
* XSS protection & secure headers (Helmet)
* Centralized error handling

---

###  Role-Based Access Control (RBAC)

* **Admin**

  * Full system access
  * Create, update, delete users
  * View all users

* **Manager**

  * View all non-admin users
  * Update user details

* **User**

  * Access and update own profile only

---

###  User Management

* Create users (Admin only)
* Update user details
* Soft delete / deactivate users
* Pagination support
* Search & filter (role, status)
* View individual user profiles

---

##  Test Credentials

Use the following credentials to test the system:

```json
{
  "email": "testuser@gmail.com",
  "password": "Test12345"
}
```

---

##  API Usage Guide

### 1️⃣ Login (Get Access Token)

**POST** `/api/auth/login`

```json
{
  "email": "testuser@gmail.com",
  "password": "Test12345"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "YOUR_ACCESS_TOKEN",
    "refreshToken": "YOUR_REFRESH_TOKEN",
    "user": {}
  }
}
```

---

### 2️⃣ Get Logged-in User

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

### 3️⃣ Get All Users (Admin / Manager Only)

**GET** `/api/users?page=1&limit=10`

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

##  Admin Access Control

* Only **Admin** can access full user list and management features
* Managers have limited visibility (non-admin users only)
* Admin access links can be securely shared via email

---

## 🛠️ Tech Stack

**Tech Used**

* JavaScript
* React
* Node.js
* Express.js
* Redux
* MongoDB
* HTML5
* CSS3
* NPM
* Render

---
## 📂 Project Structure Frontend (src)
```

src/
├── api/
│   ├── authApi.js
│   ├── axiosInstance.js
│   └── usersApi.js
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.jsx
│   │   ├── Modal.jsx
│   │   └── ProtectedRoute.jsx
│   └── layout/
│       ├── AppLayout.jsx
│       └── Sidebar.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── admin/
│   │   ├── DashboardPage.jsx
│   │   ├── UsersListPage.jsx
│   │   ├── UserDetailPage.jsx
│   │   ├── CreateUserPage.jsx
│   │   └── EditUserModal.jsx
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   └── user/
│       └── ProfilePage.jsx
├── App.jsx
├── main.jsx
└── index.css
```


## 📂 Project Structure (Backend)

```
backend/
├── controllers/
├── services/
├── models/
├── routes/
├── middleware/
│   ├── protect.js
│   ├── authorize.js
│   ├── rateLimiter.js
│   └── secureApi.js
├── utils/
├── config/
└── server.js
```

---

## ⚙️ Installation

### 1️⃣ Clone Repo

```bash
git clone <your-repo-link>
cd user-management-system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_ACCESS_SECRET=your_secret
```

Run:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

---

##  Highlights

* Clean architecture (Controller → Service → Model)
* Secure and scalable backend
* RBAC implemented correctly
* Production deployment on Render
* Optimized API performance

---

##  Future Improvements

* Refresh token flow
* Audit logs UI
* Email notifications
* Docker support

---

##  Contact

* GitHub: https://github.com/Gitvikashyadav/user-management-system-mern
* LinkedIn: https://www.linkedin.com/in/vikashrj/

---

## ⭐ Support

If you found this project useful, consider giving it a star ⭐
