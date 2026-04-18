# 🚀 User Management System (RBAC)

## 🔗 Live Demo

**Frontend:** https://user-management-system-mern-frontend-fidn.onrender.com
**Backend:** https://user-management-system-mern-backend.onrender.com

---

## 📌 Description

A full-stack **MERN (MongoDB, Express, React, Node.js)** application implementing a secure and scalable **User Management System** with **JWT-based authentication** and **Role-Based Access Control (RBAC)**.

The system supports **Admin, Manager, and User roles** with fine-grained permissions, secure API handling, and production-ready architecture.

---

## ✨ Features

### 🔐 Authentication & Security

* JWT-based authentication (Access Token)
* Secure password hashing using bcrypt
* Protected routes with middleware (`protect`)
* Role-based authorization (`authorize`)

---

### 👥 Role-Based Access Control (RBAC)

* **Admin**

  * Full access (create, update, delete users)
* **Manager**

  * View and update non-admin users
* **User**

  * Manage own profile only

---

### 🧑‍💼 User Management

* Create users (Admin only)
* Update user details
* Soft delete / deactivate users
* Paginated user list
* Search and filter users (role, status)
* View individual user details

---

est Credentials & API Usage

To help recruiters and developers quickly test the backend APIs, use the following demo credentials.

🔐 Test Login Credentials
{
  "email": "testuser@gmail.com",
  "password": "Test12345"
}
🚀 Step-by-Step API Testing Guide
1️⃣ Login to Get Access Token

Endpoint:

POST /api/auth/login

Full URL:

https://user-management-system-mern-backend.onrender.com/api/auth/login

Request Body:

{
  "email": "testuser@gmail.com",
  "password": "Test12345"
}

Response:

{
  "success": true,
  "data": {
    "accessToken": "YOUR_ACCESS_TOKEN",
    "refreshToken": "YOUR_REFRESH_TOKEN",
    "user": { ... }
  }
}

👉 Copy the accessToken for next requests.

2️⃣ Get Logged-in User Info

Endpoint:

GET /api/auth/me

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN
3️⃣ Get All Users (Protected Route)

Endpoint:

GET /api/users?page=1&limit=10

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN


### 🛡️ Security Best Practices

* Input validation middleware
* Centralized error handling
* XSS protection
* Rate limiting
* Secure headers (Helmet)

---

## 🛠️ Tech Stack

**Frontend**

* React (Hooks, Context API)
* Axios
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB (Mongoose)

**Authentication**

* JWT

**Deployment**

* Render

---

## 📦 Installation & Setup

### 🔧 Prerequisites

* Node.js
* MongoDB Atlas
* Git

---

### 1️⃣ Clone Repository

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

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_ACCESS_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## 🔐 API Endpoints

### Auth

* POST `/api/auth/login`
* GET `/api/auth/me`

### Users

* GET `/api/users`
* POST `/api/users`
* PUT `/api/users/:id`
* DELETE `/api/users/:id`
* PATCH `/api/users/profile`

---

## 📊 Key Highlights

* Production-level authentication & RBAC
* Clean architecture (Controller → Service → Model)
* Secure API design
* Full-stack deployment
* Scalable code structure

---

## 🎥 Demo Video

👉 Add your demo video link here

---

## 📌 Future Improvements

* Refresh token implementation
* Audit logs UI
* Email notifications
* Docker support

---

## 📧 Contact

**Your Name**

* GitHub: [Github.com](https://github.com/Gitvikashyadav/user-management-system-mern)
* LinkedIn: [ LinkedIn.com](https://www.linkedin.com/in/vikashrj/)

---

## ⭐ Star this repo if you like it!
