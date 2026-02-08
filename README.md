# HRMS Lite

Lightweight Human Resource Management System (employees + attendance) — FastAPI backend + React (Vite) frontend.

## Features

✅ Employee Management (Add, View, Delete)  
✅ Attendance Tracking (Mark, View)  
✅ Dashboard Summary (total employees, avg attendance)  
✅ Email validation & duplicate handling  
✅ Clean, responsive UI  
✅ Production-ready API  

## Tech Stack

- **Backend:** FastAPI, SQLModel, SQLite
- **Frontend:** React 18, Vite, CSS3
- **Database:** SQLite (local), PostgreSQL (production-ready)

## Local Setup

### Backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend API: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Frontend: `http://localhost:5173`

## Environment Variables

**Frontend `.env` (local development):**
```
VITE_API_URL=http://localhost:8000
```

**Frontend `.env.production` (production):**
```
VITE_API_URL=https://hrms-lite-backend.onrender.com
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/employees` | Create employee |
| GET | `/employees` | List all employees |
| DELETE | `/employees/{employee_id}` | Delete employee |
| POST | `/employees/{employee_id}/attendance` | Mark attendance |
| GET | `/employees/{employee_id}/attendance` | Get attendance records |

## Deployment

### Backend (Render)

1. Create account at [render.com](https://render.com)
2. Push code to GitHub
3. Create new Web Service on Render
4. Connect GitHub repo (backend folder)
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
7. Set env: `DATABASE_URL` (optional, uses SQLite by default)

### Frontend (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Set root directory: `frontend`
4. Build command: `npm install --legacy-peer-deps && npm run build`
5. Output directory: `dist`
6. Add env: `VITE_API_URL` = backend URL (e.g., `https://hrms-lite-backend.onrender.com`)
7. Deploy

## GitHub Repository

Push to GitHub:

```bash
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"
git add -A
git commit -m "Initial HRMS Lite commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git push -u origin main
```

## Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py          # FastAPI app & endpoints
│   ├── models.py        # SQLModel definitions
│   ├── requirements.txt  # Python dependencies
│   └── render.yaml      # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json      # Vercel deployment config
│   └── .env             # Local env vars
├── README.md
├── .gitignore
└── start.sh
```

## Notes

- No authentication required (admin-only assumption)
- Single user (no roles/permissions)
- SQLite for local, PostgreSQL ready for production
- Attendance date format: YYYY-MM-DD
- Status values: "Present" or "Absent"

## Assumptions & Limitations

- Single admin user (no login)
- SQLite database (suitable for demo; use PostgreSQL for production)
- Attendance cannot be edited (only added)
- No audit logs or soft deletes

Enjoy! 🚀
