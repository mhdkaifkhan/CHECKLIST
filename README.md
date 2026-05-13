# CHECKLIST — Premium Productivity OS

> A cinematic, full-stack productivity operating system for students and developers building daily consistency.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Framer Motion     |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB + Mongoose                              |
| Auth       | Google OAuth 2.0 (Passport.js) + JWT            |
| Storage    | Cloudinary (screenshot uploads)                 |
| Deployment | Frontend → Vercel · Backend → Render            |

---

## Features

- **Live Timers** — Background-persistent, timestamp-based (survives tab switching, minimizing, YouTube, LeetCode)
- **Focus Mode** — Cinematic fullscreen session with ambient glow and progress ring
- **GitHub-style Heatmap** — Full-year consistency heatmap with color-coded completion quality
- **Streak System** — Automatic midnight archiving, streak loss on missed days
- **Daily Journal** — Rich notes with screenshot upload (Cloudinary) and mood tracking
- **Drag-to-reorder Tasks** — @dnd-kit sortable task list with custom durations and colors
- **Two Themes** — Dark (matte black/gold matrix) + Light (royal white/pink floral)
- **History Dashboard** — Browse past days, view sessions, read old notes
- **Mobile-first** — Fully responsive with bottom navigation

---

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console project with OAuth 2.0 credentials
- Cloudinary account (free tier is fine)

---

### 1. Clone & Install

```bash
# Clone
git clone <your-repo-url>
cd CHECKLIST

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/checklist?retryWrites=true&w=majority

# JWT — use a random 32+ character string
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Session — use a random string
SESSION_SECRET=your_session_secret_here

# Google OAuth 2.0
# Create at: console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary (free at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

### 3. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google+ API** / **People API**
4. Go to **APIs & Services → Credentials**
5. Create **OAuth 2.0 Client ID** (Web application type)
6. Add Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://your-render-app.onrender.com/api/auth/google/callback` (production)
7. Copy Client ID and Secret to your `.env`

---

### 5. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- Health:   http://localhost:5000/health

---

## Project Structure

```
CHECKLIST/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        # MongoDB connection
│   │   │   └── passport.js        # Google OAuth strategy
│   │   ├── models/
│   │   │   ├── User.js            # User schema (streak, theme, etc.)
│   │   │   ├── Task.js            # Task template schema
│   │   │   ├── DayRecord.js       # Daily sessions & progress
│   │   │   └── Note.js            # Journal notes + screenshots
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   ├── dayController.js
│   │   │   └── noteController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   ├── days.js
│   │   │   └── notes.js
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   ├── upload.js          # Cloudinary/multer
│   │   │   └── errorHandler.js
│   │   └── utils/
│   │       └── streakCalculator.js # Midnight archive cron logic
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Button, Card, Modal, Badge, Progress, etc.
│   │   │   ├── layout/           # Sidebar, MobileNav, Layout
│   │   │   ├── dashboard/        # DashboardHeader, StatsCard
│   │   │   ├── tasks/            # TaskCard, TaskList, AddTaskModal, EditTaskModal
│   │   │   ├── timer/            # FocusMode
│   │   │   ├── heatmap/          # Heatmap
│   │   │   ├── notes/            # DailyNotes
│   │   │   └── theme/            # ThemeToggle, MatrixBackground
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User auth state
│   │   │   ├── ThemeContext.jsx  # Dark/light theme
│   │   │   └── TimerContext.jsx  # Active timer + focus mode
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── AuthCallback.jsx
│   │   ├── utils/
│   │   │   ├── api.js            # Axios instance + interceptors
│   │   │   ├── taskStore.js      # Zustand store for tasks + day
│   │   │   ├── formatTime.js     # Timer formatting helpers
│   │   │   ├── dateUtils.js      # Date helpers (date-fns)
│   │   │   └── sound.js          # Web Audio API beeps
│   │   ├── styles/globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## API Reference

| Method | Endpoint                           | Description                    |
|--------|------------------------------------|--------------------------------|
| GET    | `/api/auth/google`                 | Initiate Google OAuth          |
| GET    | `/api/auth/google/callback`        | OAuth callback (redirects)     |
| GET    | `/api/auth/me`                     | Get current user               |
| PUT    | `/api/auth/preferences`            | Update theme/targetHours       |
| GET    | `/api/tasks`                       | Get user's tasks               |
| POST   | `/api/tasks`                       | Create task                    |
| PUT    | `/api/tasks/:id`                   | Update task                    |
| DELETE | `/api/tasks/:id`                   | Soft-delete task               |
| PUT    | `/api/tasks/reorder`               | Reorder tasks                  |
| GET    | `/api/days/today`                  | Get today's day record         |
| POST   | `/api/days/session/start`          | Start a timer session          |
| POST   | `/api/days/session/stop`           | Stop session + log duration    |
| GET    | `/api/days/history`                | Paginated history              |
| GET    | `/api/days/heatmap?year=2025`      | Heatmap data for year          |
| GET    | `/api/notes/:date`                 | Get note for date              |
| PUT    | `/api/notes/:date`                 | Upsert note                    |
| POST   | `/api/notes/:date/screenshot`      | Upload screenshot              |
| DELETE | `/api/notes/:date/screenshot`      | Remove screenshot              |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
```

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add all environment variables from `.env.example`
7. Update `GOOGLE_CALLBACK_URL` to your Render URL
8. Update `FRONTEND_URL` to your Vercel URL

---

## Architecture Notes

### Timer Persistence
Timers use `Date.now()` timestamp on start, recalculating elapsed on each tick:
```js
elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
```
This means pausing a YouTube video and coming back 10 minutes later shows the correct elapsed time — no counter drift.

### Streak Logic
- Streaks are updated server-side in `streakCalculator.js`
- A cron job runs at midnight UTC to archive each day
- A day only counts toward streak if ALL tasks are completed
- Missing a day resets streak to 0

### Security
- JWT tokens stored in localStorage, sent as Bearer tokens
- Tokens expire in 7 days
- All routes behind `/api/tasks`, `/api/days`, `/api/notes` require valid JWT
- Uploads are validated (images only, 5MB max) via multer before Cloudinary

---

## License

MIT — Build something great.
