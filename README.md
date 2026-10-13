# WorkNest – Employee Management System

WorkNest is a full-stack Employee Management System developed using the MERN stack. It provides separate Admin and Employee interfaces with role-based authentication and secure profile management.

## Tech Stack

* Frontend: React.js, Vite, Tailwind CSS
* Backend: Node.js, Express.js
* Database: MongoDB, Mongoose
* Authentication: JWT
* File Handling: Multer

## Features

### Admin Panel

* Admin dashboard
* Add, view, edit and delete employees
* Search employees by name or email
* View individual employee details

### Employee Panel

* Separate employee dashboard
* View personal and employment details
* Update permitted profile information
* Upload and update profile image

### Security

* JWT-based authentication
* Role-based authorization
* Protected frontend routes and backend APIs
* File type and size validation
* Restricted access to employee information

## Project Structure

```text
WorkNest/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite.

## Notes

* Admin and Employee have separate interfaces.
* Employees can access and modify only their permitted profile information.
* Uploaded profile images are validated and stored securely.
* Environment variables and uploaded files are excluded from Git version control.
