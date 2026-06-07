# QuestLog Frontend

QuestLog is a frontend-only React implementation of the gamified task management web application described in the SRS prompt. Backend, MySQL, JWT, bcrypt, and server-side API behavior are intentionally excluded because this version is designed for frontend checking and Vercel deployment.

The app still demonstrates the requested workflows using browser `localStorage`:

- User registration, login, logout, password reset, and session persistence
- User task CRUD: create, view, update, delete, complete, and revert tasks
- Easy, medium, and hard priority badges
- Deadline storage, overdue display, and notifications
- Progress percentage and progress bar
- Isolated administrator dashboard
- User search, deactivate/reactivate controls, notifications, and activity logs
- Responsive light/dark mode UI

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

## Local Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Build Test

```bash
npm run build
npm run preview
```

## Deploy To Vercel

1. Push this folder to a GitHub repository.
2. Open Vercel.
3. Click `Add New Project`.
4. Import the GitHub repository.
5. Use these settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

The included `vercel.json` supports React Router page refreshes after deployment.

## Future Backend Integration

When you are ready to add MySQL and a backend, replace the localStorage logic in `src/context/AppContext.jsx` with API calls to your Node/Express server. The frontend routes and screens are already separated enough to connect these workflows to real endpoints later.
