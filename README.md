# QuestLog Full-Stack App

QuestLog is a React + Express + MySQL implementation of the gamified task management web application described in the SRS prompt.

The project includes:

- React, Vite, Tailwind CSS, React Router, and Axios frontend
- Node.js and Express backend
- MySQL schema and seed script
- JWT authentication
- bcrypt password hashing with 12 salt rounds
- User task CRUD
- Admin user management, notifications, and activity logs

## Demo Accounts

```text
User:
demo@questlog.test
demo1234

Admin:
admin@questlog.test
admin1234
```

## Requirements

Install these first:

- Node.js LTS
- VS Code
- Git
- MySQL Server 8.0
- MySQL Workbench 8.0

## Database Setup

1. Open MySQL Workbench.
2. Connect to your local MySQL Server.
3. Open `backend/database/schema.sql`.
4. Run the full SQL script.

This creates the `questlog` database and these tables:

- `users`
- `tasks`
- `notifications`
- `activity_logs`

## Backend Setup

From the project root:

```powershell
cd backend
npm install
copy .env.example .env
```

Open `backend/.env` and set your MySQL password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=questlog
DB_SSL=false
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
```

Seed demo data:

```powershell
npm run seed
```

Start the backend:

```powershell
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

## Frontend Setup

Open a second terminal from the project root:

```powershell
npm install
npm run dev
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:5173
```

## Build Test

Frontend:

```powershell
npm run build
npm run preview
```

Backend:

```powershell
cd backend
npm start
```

## API Summary

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/reset-password
POST   /api/auth/logout

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:taskId
DELETE /api/tasks/:taskId
PATCH  /api/tasks/:taskId/status

GET    /api/notifications
PATCH  /api/notifications/:notificationId

GET    /api/admin/users
PATCH  /api/admin/users/:userId/status
GET    /api/admin/logs
```

## Deploy Frontend To Vercel

Deploy the project root to Vercel.

Use:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add this frontend environment variable in Vercel:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

## Deploy Backend To Render

Deploy the `backend` folder as a Render Web Service.

Use:

```text
Build Command: npm install
Start Command: npm start
```

Add backend environment variables in Render:

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
FRONTEND_URLS=https://your-vercel-app.vercel.app,http://localhost:5173
DB_HOST=your_online_mysql_host
DB_PORT=3306
DB_USER=your_online_mysql_user
DB_PASSWORD=your_online_mysql_password
DB_NAME=questlog
DB_SSL=true
DB_SSL_CA=your_mysql_ca_certificate_if_required
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
```

Your deployed backend cannot connect to a MySQL database that only exists on your laptop. For online deployment, use an online MySQL provider.
