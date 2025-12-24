# 🚗 Cost-Effective Parking System

A modern, full-stack web application designed to simplify parking management. Find, book, and manage parking spots with ease.



---

## ✨ Features

- **🔍 Search & Book**: Find parking spots by location and book them instantly.
- **� Entry Code System**: Automatic 5-digit entry code generation for each booking for secure parking access.
- **👁️ Password Visibility Toggle**: Show/hide password on login and signup pages for better user experience.
- **�👑 Admin Dashboard**: Manage spots, view revenue, oversee all bookings, and view entry codes for active bookings.
- **📱 Mobile Responsive**: Fully optimized for mobile with hamburger menu navigation.
- **🌗 Dark Mode**: Built-in dark mode support across all pages.
- **🔐 Secure Auth**: JWT-based authentication with bcrypt password hashing.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

---

## 🚀 Step-by-Step Installation Guide

Follow these instructions to set up the project locally.

### 📋 Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [Git](https://git-scm.com/)

### 1️⃣ Project Setup
Clone the repository:
```bash
git clone https://github.com/anikket7/ParkEasy.git
cd ParkEasy
```

---

### 2️⃣ Backend Setup (Server & Database)

1.  **Navigate to backend:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the `backend` folder and add:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/parkeasy
    JWT_SECRET=your_super_secret_key_change_this
    SESSION_SECRET=your_session_secret
    ```
    *(If using MongoDB Atlas, replace `mongodb://localhost...` with your connection string)*

4.  **🌱 Database Setup & Seeding (Crucial Step):**
    This command clears the database and sets up the **Admin account** and **Parking Spots**.
    ```bash
    npm run seed
    ```
    > **Note:** This will reset all data! Use this to initialize the project for the first time or to reset everything.

    **Default Admin Credentials:**
    - **Email**: `admin@parkeasy.in`
    - **Password**: `admin@1234`

5.  **Start the Backend Server:**
    ```bash
    node server.js
    ```
    *You should see: `Server running on port 5000` and `MongoDB Connected`.*

---

### 3️⃣ Frontend Setup (Client)

1.  **Open a new terminal** and navigate to frontend:
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the React App:**
    ```bash
    npm run dev
    ```

4.  **Access the App:**
    Open `http://localhost:5173` in your browser.

---

## 👥 How to Share/Run for Team Members

1.  **Share the Code**: Send the project folder (excluding `node_modules`) or share the Git repo.
2.  **Install Everything**: Run `npm install` in both `backend` and `frontend`.
3.  **Create .env**: Team members must create their own `.env` file in `backend/` (see step 2.3).
4.  **Run Seed Script**: They **MUST** run `npm run seed` inside `backend/` to get the Admin account and spots.
5.  **Start Servers**: Run backend and frontend servers as described above.

---

## 🔐 API Endpoints

- `GET /api/parking` - List all spots
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration (Admin creation blocked)
- `POST /api/parking/:id/book` - Book a spot
