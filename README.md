# TaskFlow - Advanced Task Management System

A modern, feature-rich task management application with a beautiful UI and advanced functionality.

## 🚀 New Features

### Core Features
- ✅ **Task Management** - Create, edit, delete, and organize tasks
- 🎯 **Priority Levels** - High, Medium, Low priority tasks
- 📊 **Status Tracking** - Pending, In Progress, Completed
- 🏷️ **Categories & Tags** - Organize tasks by projects
- 📅 **Due Dates** - Set deadlines and track overdue tasks
- ⏱️ **Pomodoro Timer** - Built-in focus timer with work/break cycles
- 🔍 **Advanced Search & Filters** - Find tasks quickly
- 📈 **Analytics Dashboard** - Track your productivity
- 🌓 **Dark/Light Mode** - Toggle between themes
- 🔔 **Notifications** - In-app notifications for task updates
- 👑 **Admin Panel** - User management and progress tracking

## 📁 Project Structure

```
task-manager-v2/
├── backend/                    # Node.js backend (reuse from v1)
│   ├── config/
│   ├── middleware/
│   ├── routes/
|   |── .env
|   |── create-admin.js
│   ├── server.js
│   └── package.json
│
├── database/                   # MySQL database (reuse from v1)
│   ├── schema.sql
│   └── README.md
│
└── frontend/                   # Modern frontend
    ├── index.html              # Main HTML file
    │
    ├── assets/
    │   ├── css/
    │   │   ├── variables.css   # CSS custom properties & themes
    │   │   ├── base.css        # Base styles & typography
    │   │   ├── components.css  # Reusable component styles
    │   │   ├── pages.css       # Page-specific styles
    │   │   └── animations.css  # Animations & transitions
    │   │
    │   └── js/
    │       └── app.js          # Main application coordinator
    │
    ├── components/             # Reusable UI components
    │   ├── navbar.js           # Top navigation bar
    │   ├── sidebar.js          # Side navigation
    │   ├── taskCard.js         # Individual task card
    │   ├── taskModal.js        # Task create/edit modal
    │   ├── taskTimer.js        # Pomodoro timer
    │   └── analytics.js        # Analytics widgets
    │
    ├── pages/                  # Page components
    │   ├── login.js            # Login page
    │   ├── register.js         # Registration page
    │   ├── dashboard.js        # User dashboard
    │   └── admin.js            # Admin panel
    │
    └── utils/                  # Utility functions
        ├── api.js              # API communication
        ├── storage.js          # LocalStorage management
        └── helpers.js          # Helper functions


## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - Component-based architecture
- **Google Fonts** - Syne & DM Sans typography

### Backend (Unchanged)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Database (Unchanged)
- **MySQL** - Relational database


## 📦 Installation

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file example below
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

#To create the admin user
node create-admin

npm start
```


### 2. Database Setup

```bash
cd database
mysql -u root -p < schema.sql

```

### 3. Frontend Setup

```bash
cd frontend

npx http-server -p 8080
# It will ask to download a dependency click yes
# also if you want to be a bad ass you can just open the index.html after running the backend

```
### 4. Access the Application

Open your browser and navigate to:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`


## 🌟 Future Enhancements

Planned features for future versions:
- 📧 Email notifications
- 👥 Task collaboration
- 📎 File attachments
- 🔄 Task recurring/repeating
- 📊 Advanced charts and graphs
- 🗓️ Calendar view
- 🎯 Goals and milestones
- 📱 Mobile app (React Native)
- 🌐 Multi-language support
- 🔌 Third-party integrations