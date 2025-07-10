# 🚀 Intlegance Project Management Platform

Welcome to **Intlegance** – a modern, fullstack project management platform designed for teams and companies to collaborate, manage projects, tasks, subtasks, and communicate in real-time! 🌟

---

## 📝 Overview
Intlegance is a robust solution for:
- Project & task management
- Company & employee management
- Real-time chat & notifications
- Kanban boards, Gantt charts, and calendar views
- User authentication (including Google OAuth)
- Team collaboration & friend system

---

## ✨ Features
- 🗂️ **Project & Task Management**: Create, assign, and track projects, tasks, and subtasks with priorities and deadlines.
- 🏢 **Company Management**: Manage company profiles, employees, and invitations.
- 📅 **Calendar & Gantt**: Visualize projects and tasks on a calendar and Gantt chart.
- 🏷️ **Kanban Board**: Drag-and-drop task management.
- 💬 **Real-time Chat**: Direct and group messaging using Stream Chat.
- 🔔 **Notifications**: Stay updated with in-app notifications.
- 👥 **User Profiles & Friends**: Rich user profiles, friend requests, and team building.
- 🔐 **Authentication**: Secure login, registration, and Google OAuth.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Syncfusion, FullCalendar, Stream Chat, Axios, React Router, Bootstrap Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Passport, Cloudinary, Nodemailer
- **Real-time**: Stream Chat API
- **Other**: ESLint, dotenv

---

## 📁 Directory Structure
```
Pfeesprit/
├── Backend/
│   ├── Src/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Routes/
│   │   ├── Middleware/
│   │   ├── Config/
│   │   ├── Utils/
│   │   ├── app.js
│   │   └── Server.js
│   ├── package.json
│   └── ...
├── Frontend/
│   └── intlegance-frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── services/
│       │   ├── context/
│       │   ├── styles/
│       │   └── ...
│       ├── public/
│       ├── package.json
│       └── ...
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Backend
```bash
cd Backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# EMAIL=your_email_for_nodemailer
# PASSWORD=your_email_password
npm run dev
```
- Runs on `http://localhost:5000`

### 2️⃣ Frontend
```bash
cd Frontend/intlegance-frontend
npm install
npm run dev
```
- Runs on `http://localhost:5173`

---

## 🚦 Usage
- Register or login (email/password or Google)
- Create/join a company
- Create/manage projects, tasks, and subtasks
- Use Kanban, Gantt, and Calendar views
- Chat with team members
- Manage your profile and friends

---

## 📡 API Overview
**Base URL:** `http://localhost:5000/api/`

### 🔑 Auth & Users
- `POST /users/register` – Register
- `POST /users/login` – Login
- `POST /users/google` – Google OAuth
- `GET /users/profile` – Get current user
- `PUT /users/update` – Update profile
- `GET /users/search` – Search users/companies
- `POST /users/friend-request` – Send friend request

### 🏢 Companies
- `POST /companies` – Create company
- `GET /companies/Company` – Get companies by creator
- `GET /companies/:companyId` – Get company by ID
- `POST /companies/AddEmployee` – Add employee
- `GET /companies/Company/employees` – List employees

### 📁 Projects
- `POST /projects/create` – Create project
- `GET /projects/user` – Projects for user
- `GET /projects/creator/:creatorId` – Projects by creator
- `GET /projects/:id` – Project by ID
- `PUT /projects/edit/:id` – Edit project
- `DELETE /projects/delete/:id` – Delete project

### ✅ Tasks & Subtasks
- `POST /tasks/create` – Create task
- `GET /tasks/project/:projectId` – Tasks by project
- `PATCH /tasks/update/:taskId` – Change task status
- `POST /subtask/create` – Create subtask
- `GET /subtask/:taskId` – Subtasks by task

### 💬 Chat
- `POST /chat/channels` – Create channel
- `POST /chat/channels/:channelId/message` – Send message
- `GET /chat/channels/:channelId/messages` – Get messages

---

## 🤝 Contributing
1. Fork the repo 🍴
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request 🚀

---

## 📄 License
This project is licensed under the MIT License.

---

## 📬 Contact
For questions, suggestions, or support:
- [Ram Khammessi](mailto:ram.khammessi@esprit.tn)
- GitHub Issues

---

> Made with ❤️ by Ram Khammessi