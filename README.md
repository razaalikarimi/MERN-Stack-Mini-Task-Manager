MERN Task Manager (Mini)
Features (as per assignment)

JWT auth (register/login/logout)
Roles: admin, member
Members can CRUD only their tasks (created by them or assigned to them)
Admins can manage all tasks and users
Tasks: title, description, status (todo/in-progress/done), priority (low/medium/high), dueDate, tags, assignee
Task list: search, filter, pagination, sorting
Activity Log on tasks (create/update/delete)
Stats: counts by status, overdue count, counts by priority
Backend: Node + Express + MongoDB + Mongoose
Validation: express-validator
Password hashing: bcryptjs
At least 3 backend tests with Jest + Supertest + mongodb-memory-server
Linting: ESLint + Prettier
README.md with setup + .env.example
Optional: Docker Compose (Mongo + Server)
Quick Start (Local)
0) Requirements
Node.js 18+
npm or yarn
MongoDB running locally OR use the included Docker Compose
1) Clone / Download
If you downloaded the zip from ChatGPT, unzip it. Otherwise:

git clone <your-repo-url> mern-task-manager
cd mern-task-manager
2) Setup Server
cd server
cp ../.env.example .env
npm install
# dev run
npm run dev
Server defaults:

Port: 4000
Mongo: mongodb://localhost:27017/mern_task_manager
Seeded users (on first boot):
Admin: admin@example.com / Admin@123
Member: member@example.com / Member@123
3) Setup Client
Open a new terminal:

cd client
npm install
npm run dev
Client runs at http://localhost:5173 and expects API at http://localhost:4000.

4) Login
Use seeded credentials (above). You can register more members from the Register page.

API (Minimal Spec)
Auth

POST /auth/register → body: { name, email, password }
POST /auth/login → body: { email, password } returns { token, user }
POST /auth/logout → returns { message: "Logged out" } (client drops token)
Users (Admin only)

GET /users?search=&page=&limit=
PATCH /users/:id/role → body: { role: "admin" | "member" }
Tasks

GET /tasks?search=&status=&priority=&assignee=&sort=&page=&limit=&dueFrom=&dueTo=
POST /tasks
GET /tasks/:id
PATCH /tasks/:id
DELETE /tasks/:id
Stats

GET /stats/overview
Members only see/manipulate tasks they created or that are assigned to them. Admins see all.

Tests
cd server
npm test
Uses mongodb-memory-server so no external Mongo needed during tests.

Docker (Optional)
# From project root
docker compose up --build
API at http://localhost:4000
Mongo at mongodb://mongo:27017/mern_task_manager (configured in Docker env)
Deployment (One simple path)
Backend → Render.com (Node + Mongo Atlas URI)
Frontend → Netlify or Vercel (set VITE_API_URL to your backend URL)
Env you need for server:

SERVER_PORT=4000
MONGO_URI=...
JWT_SECRET=...
CLIENT_ORIGIN=https://your-frontend.example.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
MEMBER_EMAIL=member@example.com
MEMBER_PASSWORD=Member@123
Trade-offs (sample points for your form)
Kept UI minimal (no design lib) to focus on correctness and API; used small, readable components.
Used Bearer token in Authorization header (simpler than httpOnly cookies for this demo).
Activity log stores high-level field changes only to keep write path fast (could expand diffing later).
Tests cover core flows (auth, task ACL, stats); not full unit coverage due to timebox.
Simple text search with regex; in real app, add indexes or Atlas Search for scale.
Project Structure
mern-task-manager/
  server/
    src/
      config/
      middleware/
      models/
      routes/
      utils/
      validators/
      app.js
      index.js
    tests/
    package.json
  client/
    src/
      components/
      pages/
      api.js
      main.jsx
      App.jsx
      styles.css
    package.json
README.md
.env.example
docker-compose.yml
