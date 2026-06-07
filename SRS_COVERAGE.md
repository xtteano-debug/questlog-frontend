# QuestLog SRS Frontend Coverage

This full-stack build represents FR-001 through FR-025 with React frontend routes and Express/MySQL backend endpoints. JWT authentication, bcrypt password hashing, protected routes, admin authorization, database schema, and seed scripts are included.

## Authentication Module

- FR-001 User Registration: `/register`
- FR-002 User Login: `/login`
- FR-003 Password Reset: `/forgot-password`
- FR-004 Session Management: localStorage session persistence and protected routes

## Task Management Module

- FR-005 Create Task: `/tasks`
- FR-006 View Tasks: `/tasks`, `/dashboard`
- FR-007 Update Task: `/tasks`
- FR-008 Delete Task: `/tasks`
- FR-009 Mark Task Completed: `/tasks`, `/dashboard`
- FR-010 Revert Task to Pending: `/tasks`, `/dashboard`

## Task Priority Module

- FR-011 Assign Priority: task form priority selector
- FR-012 Easy Priority: easy badge
- FR-013 Medium Priority: medium badge
- FR-014 Hard Priority: hard badge

## Notification Module

- FR-015 Store Deadlines: task deadline field
- FR-016 Send Notifications: browser-generated notification records
- FR-017 Display Overdue Tasks: overdue state on task cards

## Progress Tracking Module

- FR-018 Track Completed Tasks: dashboard task totals
- FR-019 Calculate Progress Percentage: dashboard percentage calculation
- FR-020 Display Progress Indicators: dashboard progress bar and stats

## Administrator Module

- FR-021 Administrator Login: admin account route flow
- FR-022 View Registered Users: `/admin/users`
- FR-023 Deactivate Users: user status action buttons
- FR-024 View Activity Logs: `/admin/logs`
- FR-025 Manage Notifications: `/notifications` as admin
