Option 2: Real-Time Interaction Module
A real-time web application that allows an admin (host) to create live polls, share session codes, and view audience responses in real time using visual charts.

📌 Project Description
This module simulates a live interaction platform between a host (admin) and multiple audience members (users). The admin can create a poll, and participants can join the session via a unique code to cast their votes. The admin and users can see live-updated poll results using charts.

🎯 Core Features
✅ 1. Admin Poll Creation
Admin fills in a form to create a poll.

A unique session code is generated for each poll.

Admin receives the session code to share with users.

✅ 2. User Participation
Users join the poll using the session code.

Each user selects and submits a vote from available options.

✅ 3. Real-Time Updates
Vote results are updated live for all participants.

Data is reflected instantly via a bar chart or pie chart.

✅ 4. Live Results Visualization
Results are displayed using Chart.js as either bar or pie charts.

Total votes and per-option counts are visible.

✅ 5. (Optional) Session History
Admin can view history of past polls (limited to recent 10).

Each historical entry shows question, options, and vote stats.

✅ 6. (Optional) Countdown Timer
Admin can trigger a countdown timer (e.g., 5 minutes) to auto-close voting (not implemented by default but can be added).

🧰 Technologies Used
🔹 Frontend (Client)
React.js — Component-based UI

React Router — Page navigation

Context API — Global state for poll data and socket

Socket.IO Client — Real-time communication

Axios — HTTP requests

Chart.js + react-chartjs-2 — Visualization for live poll results

🔹 Backend (Server)
Node.js — Runtime environment

Express.js — REST API handling

Socket.IO — Real-time bidirectional communication

Mongoose — MongoDB object modeling

MongoDB — NoSQL database to store poll data

📂 Directory Structure Overview
📦 Backend
/models/Poll.js — Poll schema (question, options, votes, session code)

/controllers/pollController.js — Logic for poll creation, retrieval

/routes/pollRoutes.js — API route definitions

/services/socketService.js — Socket.io logic for vote and session join

server.js — Entry point and server configuration

.env — MongoDB URI, server port, frontend CORS config

📦 Frontend
/context/PollContext.jsx — Global state and socket manager

/pages/AdminPage.jsx — Admin poll creation & result display

/pages/UserPage.jsx — User vote interface

/components/admin/CreatePoll.jsx — Poll creation form

/components/user/JoinSession.jsx — User session join form

/components/common/ChartDisplay.jsx — Chart.js bar/pie display

/services/api.js — Axios API methods

/services/socket.js — Initializes socket client

.env — API and socket server URL config

⚙️ How It Works (Flow)
Admin Flow:

Visits /admin

Fills out question and options

Submits poll → gets session code

Shares session code with audience

Views real-time bar chart of responses

User Flow:

Visits home page /

Enters session code

Sees poll question and options

Casts a vote → result updates live

Real-Time Sync:

Each new vote triggers a submitVote socket event

Backend updates the database and broadcasts results via updateResults

All connected clients receive and render new data

🛠️ Setup Instructions
🔧 Prerequisites
Node.js and npm

MongoDB (local or cloud, e.g., MongoDB Atlas)

📦 Installation
Backend:
bash
Copy code
cd backend
npm install
Create a .env file in /backend:

ini
Copy code
MONGODB_URI=mongodb://localhost:27017/realtimepoll
PORT=5000
FRONTEND_URL=http://localhost:3000
Start backend server:

bash
Copy code
npm start
Frontend:
bash
Copy code
cd frontend
npm install
Create a .env file in /frontend:

ini
Copy code
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
Start frontend dev server:

bash
Copy code
npm start
✅ Summary
This Real-Time Interaction Module is an effective solution for engaging audience participation through live polling. It demonstrates full-stack development using React, Node.js, MongoDB, and WebSockets, with optional advanced features like session history and timers.
