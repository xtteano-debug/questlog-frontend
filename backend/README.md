# QuestLog Backend

Express + MySQL API for QuestLog.

## Local Setup

```powershell
cd backend
npm install
copy .env.example .env
```

Update `.env` with your MySQL credentials.

Create the database in MySQL Workbench by running:

```text
database/schema.sql
```

Seed demo data:

```powershell
npm run seed
```

Run the API:

```powershell
npm run dev
```

Health check:

```text
http://localhost:5000/health
```

## Security

- Passwords are hashed with bcryptjs using 12 salt rounds by default.
- JWTs are required for protected routes.
- Admin routes require the `admin` role.
- SQL queries use parameterized `mysql2` statements.
- Helmet, CORS, JSON body limits, validation, and rate limiting are enabled.
