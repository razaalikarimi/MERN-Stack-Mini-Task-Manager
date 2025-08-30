MERN Task Manager (Mini)
Features (as per assignment)

JWT Auth (register / login / logout)

Roles:

Admin

Member

Access Control:

Members can CRUD only their own tasks (created by them or assigned to them).

Admins can manage all tasks and users.

Tasks:

Fields: title, description, status (todo / in-progress / done), priority (low / medium / high), dueDate, tags, assignee.

Task List:

Search, filter, pagination, sorting.

Activity Log on tasks (create / update / delete).

Stats:

Counts by status, overdue count, counts by priority.

Backend: Node + Express + MongoDB + Mongoose.

Validation: express-validator.

Password Hashing: bcryptjs.

Tests: At least 3 backend tests using Jest + Supertest + mongodb-memory-server.

Linting: ESLint + Prettier.

README.md with setup instructions + .env.example.

Optional: Docker Compose (Mongo + Server).

Quick Start (Local)
0) Requirements

Node.js 18+

npm or yarn

MongoDB running locally OR use the included Docker Compose

1) Clone / Download
git clone <your-repo-url> mern-task-manager
cd mern-task-manager

2) Setup Server
cd server
cp ../.env.example .env
npm install
npm run dev


Defaults:

Server Port: 4000

Mongo URI: mongodb://localhost:27017/mern_task_manager

Seeded users (on first boot):

Admin → admin@example.com / Admin@123

Member → member@example.com / Member@123

3) Setup Client

Open a new terminal:

cd client
npm install
npm run dev


Client runs at: http://localhost:5173

API runs at: http://localhost:4000

4) Login

Use seeded credentials (above). You can also register more members from the Register page.

API (Minimal Spec)
Auth

POST /auth/register → { name, email, password }

POST /auth/login → { email, password } → returns { token, user }

POST /auth/logout → { message: "Logged out" } (client drops token)

Users (Admin only)

GET /users?search=&page=&limit=

PATCH /users/:id/role → { role: "admin" | "member" }

Tasks

GET /tasks?search=&status=&priority=&assignee=&sort=&page=&limit=&dueFrom=&dueTo=

POST /tasks

GET /tasks/:id

PATCH /tasks/:id

DELETE /tasks/:id

Stats

GET /stats/overview

🔹 Access Control:

Members → Only their own tasks (created or assigned).

Admins → All tasks.

Tests
cd server
npm test


Uses mongodb-memory-server, so no external MongoDB needed during tests.

Docker (Optional)

From project root:

docker compose up --build


API → http://localhost:4000

MongoDB → mongodb://mongo:27017/mern_task_manager

Deployment

Backend → Render.com (Node + Mongo Atlas URI)

Frontend → Netlify / Vercel (set VITE_API_URL to backend URL)

Env variables for server:

SERVER_PORT=4000
MONGO_URI=...
JWT_SECRET=...
CLIENT_ORIGIN=https://your-frontend.example.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
MEMBER_EMAIL=member@example.com
MEMBER_PASSWORD=Member@123

Trade-offs (Sample Points)

Kept UI minimal (no design library) to focus on API correctness.

Used Bearer token in Authorization header (simpler than httpOnly cookies for demo).

Activity log stores only high-level field changes (future: diffing for more detail).

Tests cover core flows (auth, task ACL, stats); not full unit coverage due to timebox.

Simple text search with regex; in real app, consider indexes or Atlas Search.

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
