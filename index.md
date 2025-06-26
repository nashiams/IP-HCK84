✅ DevChecklist.AI – Fullstack AI Code Checker with Static Todoist Integration

Stack: Express.js (Backend) + Gemini AI + React + Google OAuth + Supabase PostgreSQL + Sequelize

Architecture: Your backend handles user authentication, AI analysis, and all Todoist API interactions using a single, static API key. The frontend displays and interacts with this shared Todoist account's data via your backend.
🔧 BACKEND ROUTES (Express.js)
Public Routes (No App JWT Auth Required)

These endpoints do not require a JWT token from your application's authentication system.

Method
	

Endpoint
	

Description
	

Expected Request Body
	

Expected Success Response

POST
	

/api/auth/register
	

Registers a new user account.
	

{"name": "string", "email": "string", "password": "string"}
	

201 Created {"id": "number", "name": "string", "email": "string", ...}

POST
	

/api/auth/login
	

Authenticates a user and issues your application's JWT.
	

{"email": "string", "password": "string"}
	

200 OK {"access_token": "your_app_jwt_token"}

POST
	

/api/auth/google
	

Handles Google OAuth login/registration.
	

{"googleToken": "string"}
	

200 OK {"access_token": "your_app_jwt_token"}

GET
	

/api/health
	

Health check endpoint.
	

None
	

200 OK {"status": "OK"}

POST
	

/api/todoist/create-from-ai
	

Internal Endpoint: Used only by CodeCheckController to create Todoist tasks/subtasks after AI analysis. Bypasses application's JWT authentication. It uses process.env.TODOIST_API_KEY for external Todoist API calls.
	

{"message": "string", "simplifiedChecklist": {"checklist": [{"itemDescription": "string", "isCompleted": boolean, "details": "string"}], "summary": "string"}}
	

201 Created {"message": "string", "createdTasks": [...]}
Protected Routes (Your App's Bearer JWT Token Required)

These endpoints require a valid JWT token issued by your application. The token must be sent in the Authorization header as Bearer <your_jwt_token>.

Method
	

Endpoint
	

Description
	

Expected Request Body
	

Expected Success Response

POST
	

/api/check-code
	

Analyzes user's code against requirements using Gemini AI, then triggers creation of tasks in the configured Todoist account via the internal /api/todoist/create-from-ai endpoint.
	

{"requirements": "string", "code": "string"}
	

200 OK {"message": "string", "simplifiedChecklist": {"summary": "string", "checklist": [{"itemDescription": "string", "isCompleted": boolean, "details": "string"}]}, "next": "string"}

GET
	

/api/todoist/tasks
	

Fetches all active tasks (and their subtasks) from the configured Todoist account. Subtasks are identified by parent_id.
	

None
	

200 OK `[{"id": "string", "content": "string", "parent_id": "string

POST
	

/api/todoist/tasks/:id
	

Updates an existing task (content, description, etc.) in the configured Todoist account.
	

{"content": "string (optional)", "description": "string (optional)", ...}
	

200 OK {"id": "string", "content": "string", ...} (Updated task object)

POST
	

/api/todoist/tasks/:id/complete
	

Marks a task as completed in the configured Todoist account.
	

None
	

204 No Content

DELETE
	

/api/todoist/tasks/:id
	

Deletes a task from the configured Todoist account.
	

None
	

204 No Content
📁 BACKEND STRUCTURE

server/
├─ controllers/
│   ├─ authController.js       // Handles manual and Google authentication
│   ├─ codeCheckController.js  // Core AI logic, calls TodoistController.createTask directly
│   └─ todoistController.js    // Handles CRUD for the shared Todoist account using static key
├─ routes/
│   ├─ authRoutes.js
│   ├─ codeCheckRoutes.js
│   └─ todoistRoutes.js        // Routes for shared Todoist CRUD operations (includes internal AI route)
├─ utils/
│   └─ // (No unzip.js or folderToPromptString.js needed)
├─ models/
│   └─ User.js                 // Sequelize model for PostgreSQL 'users' table
├─ middleware/
│   ├─ authentication.js       // Your app's JWT authentication middleware
│   └─ errorHandler.js         // Global error handling
├─ config/
│   └─ database.js             // Sequelize config for Supabase
├─ services/
│   └─ geminiService.js        // Untouched Gemini API call helper
├─ helpers/
│   ├─ jwt.js                  // JWT token signing
│   └─ bcrypts.js              // Password hashing
├─ app.js                      // Main Express app setup
└─ .env                        // JWT_SECRET, GEMINI_API_KEY, GOOGLE_CLIENT_ID, TODOIST_API_KEY, FRONTEND_URL, PORT

🔄 USER FLOW (Updated)

    Authentication: User registers or logs in via email/password or Google OAuth. Your backend issues a JWT (JSON Web Token), stored on the frontend.

    Code Analysis & Todoist Task Creation:

        Logged-in user goes to /check-code page.

        Inputs "Exam Requirements" and "Your Code".

        Frontend sends these to POST /api/check-code (authenticated with your app's JWT).

        Backend CodeCheckController:

            Uses Gemini AI to analyze the code against requirements.

            Receives a detailed checklist from AI (including isCompleted status for each item).

            Makes an internal POST request to /api/todoist/create-from-ai. This internal call does not use your app's JWT; instead, it uses the static TODOIST_API_KEY to authenticate with your own TodoistController.

            The TodoistController then interacts with the external Todoist API to create a main task (from AI summary) and subtasks (from AI checklist items), marking them completed if isCompleted: true.

        Backend responds to the frontend with the AI's analysis and a confirmation message.

    Task Management (Dashboard):

        Logged-in user goes to / (Dashboard).

        Frontend dispatches fetchTodoistTasks which calls GET /api/todoist/tasks (authenticated with your app's JWT).

        Backend TodoistController fetches all tasks from the shared Todoist account (using TODOIST_API_KEY for the external API).

        Frontend displays tasks hierarchically using parent_id.

        Users can interact (edit, delete, complete) with tasks directly from the dashboard. These actions trigger POST /api/todoist/tasks/:id, DELETE /api/todoist/tasks/:id, or POST /api/todoist/tasks/:id/complete on your backend (all authenticated with your app's JWT). Your backend then makes the corresponding call to the external Todoist API.

🧠 GEMINI PROMPT TEMPLATE (Unchanged)

Exam Requirements:
[User's pasted exam questions]

User Code:
[User's pasted code snippet]

Task: Analyze if the provided code snippet fulfills each of the exam requirements. For each requirement, determine its status (complete or incomplete) and provide specific details on what was found or what's missing.

Response format:
{
  "summary": "A concise overall summary of how well the provided code fulfills the exam requirements. This should be a brief general assessment.",
  "checklist": [
    {
      "itemDescription": "Requirement 1 text exactly as written in Exam Requirements",
      "isCompleted": true|false,
      "details": "Specific explanation of implementation or what's missing."
    },
    {
      "itemDescription": "Requirement 2 text exactly as written in Exam Requirements",
      "isCompleted": true|false,
      "details": "Specific explanation of implementation or what's missing."
    }
    // ... continue for all requirements, up to 30 items
  ]
}

🖥️ FRONTEND PAGES (React)

Component
	

Route
	

Purpose
	

Authentication

Login.jsx
	

/login
	

User login (manual or Google)
	

Public

Register.jsx
	

/register
	

User registration
	

Public

AuthLayout.jsx
	

(Wrapper)
	

Checks authentication; renders Navbar and Outlet for child routes.
	

Protected (redirects to /login if unauthenticated)

Navbar.jsx
	

(Included in AuthLayout)
	

Navigation links for authenticated users, logout button.
	

Protected (always shown when authenticated)

Dashboard.jsx
	

/
	

Main page to view/manage Todoist tasks.
	

Protected

CodeChecker.jsx
	

/check-code
	

Input exam requirements and code for AI analysis.
	

Protected
🗄️ DATABASE (Supabase PostgreSQL)

users table schema:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  google_id VARCHAR(255) UNIQUE,       -- NULLABLE: Present if logged in via Google
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

🔑 KEY ARCHITECTURE DECISIONS

    Strict Authentication Separation:

        External Todoist API: Always uses process.env.TODOIST_API_KEY.

        Your Application API: Uses JWTs for user authentication.

        Internal Server-to-Server Calls: A dedicated unprotected route (/api/todoist/create-from-ai) for CodeCheckController to communicate with TodoistController without needing your app's JWT, but still leveraging TODOIST_API_KEY for the external Todoist API.

    Static Todoist Integration: All users of your application interact with a single, shared Todoist account. There is no per-user Todoist integration.

    AI Data Cleansing: The deepCleanAndTrimStrings utility ensures AI-generated JSON is always valid for internal communication and external API calls.

    Redux Toolkit: Centralized state management for fetching and interacting with Todoist tasks.

    No edit.jsx: In-place editing and action buttons are implemented directly within TaskCard.jsx for a streamlined UI.