# CampusCare — Campus Complaint Management System (React)

A responsive frontend prototype for students to report campus issues and track their status.

## Features
- Dashboard cards for total, pending, in-progress, and resolved complaints.
- Submit a complaint with title, category, location, and description.
- Search complaints.
- Filter by complaint status.
- Change a complaint's demo status.
- Delete a complaint after confirmation.
- Responsive layout.
- Saves records in browser Local Storage.

## Run it
1. Install Node.js (LTS).
2. Extract this folder and open it in a terminal.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local address shown in the terminal.

## Main files
- `src/App.jsx`: UI, form handling, search/filter, and Local Storage logic.
- `src/style.css`: layout and styling.
- `src/main.jsx`: React entry point.

## Important limitation
This version is frontend-only. It uses Local Storage, so it does not have real user accounts, role-based admin permissions, a server, or a database. The status selector is included as a demonstration. To turn it into a full-stack project, add a Node.js/Express API, MongoDB, authentication, and separate student/admin access.
