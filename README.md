# LeaveFlow – Employee Leave Management System

A full-stack web application for managing employee leave requests, built using React, Spring Boot, Spring Security, and MySQL.

## 📌 Project Overview

LeaveFlow helps organizations manage employee leave applications through a centralized web application. Users can log in, view leave information, and submit or manage leave requests based on the features implemented in the system.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML & CSS
- Vite

**Backend**
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA / Hibernate
- Maven

**Database**
- MySQL

**Tools**
- Git & GitHub
- Postman
- VS Code

## ✨ Features

- User login with username and password
- Session-based authentication using Spring Security
- Session restoration after browser refresh
- Logout endpoint that invalidates the server-side session
- Employee records retrieval
- Leave request listing and submission
- Leave request approval and rejection
- React dashboard with leave statistics
- REST API communication between React and Spring Boot

## 🏗️ Project Structure

```text
employee-leave-management/
├── backend/
│   ├── src/
│   │   └── main/
│   └── pom.xml
├── frontend/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the application:

- Java 21
- Node.js and npm
- MySQL
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/G-Sabari/employee_leave_management.git
cd employee_leave_management
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE employee_leave;
```

Configure the database connection in your local Spring Boot configuration. Set the MySQL username and password using your own local credentials.

**Do not commit real passwords or other secrets to GitHub.**

### 3. Run the Spring Boot backend

Open a terminal in the `backend` directory and run:

```bash
./mvnw spring-boot:run
```

On Windows Command Prompt, use:

```bat
mvnw.cmd spring-boot:run
```

The backend is configured to run at:

`http://localhost:8080`

### 4. Run the React frontend

Open another terminal in the `frontend` directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally:

`http://localhost:5173`

## 🔐 Authentication Flow

1. The user submits login credentials from the React frontend.
2. Spring Security authenticates the user.
3. Successful authentication is stored in an HTTP session.
4. The frontend sends requests with credentials included.
5. The `/auth/me` endpoint retrieves the current authenticated user.
6. The `/auth/logout` endpoint invalidates the session.

## 🧪 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve the current user |
| POST | `/auth/logout` | Log out and invalidate the session |
| GET | `/employees` | Retrieve employee records |
| GET | `/leaves` | Retrieve leave records |
| POST | `/leaves` | Submit a leave request |

Additional leave approval/rejection endpoints are implemented in the backend.

## 📚 Learning Outcomes

- Building a React frontend connected to a Spring Boot REST API
- Implementing session-based authentication with Spring Security
- Working with MySQL and JPA/Hibernate
- Testing REST endpoints with Postman
- Managing source code using Git and GitHub

## 🔮 Future Improvements

- Role-based access control for Admin, Manager, and Employee
- Employee-specific leave permissions
- Improved validation and error handling
- Automated backend tests using JUnit and Mockito
- Deployment and production security hardening

## 👨‍💻 Author

**Sabari G**

GitHub: [G-Sabari](https://github.com/G-Sabari)

---

*This project is being developed as a learning project to strengthen Java full-stack development skills.*
