# AuthFlow — Django + Next.js Authentication

A full-stack authentication app with JWT-based login, registration, profile management, and image upload.

## Tech Stack

- **Backend:** Django, Django REST Framework, SimpleJWT
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion

## Features

- User registration & login with JWT
- Token blacklisting on logout
- Profile viewing & editing (age, school, location, email)
- Profile picture upload with live preview
- Dark/light theme toggle
- Animated UI with glassmorphism design

## Project Structure

```
backend/          — Django API (port 8000)
frontend/         — Next.js app (port 3000)
```

## API Endpoints

| Method | Endpoint        | Auth | Description          |
|--------|-----------------|------|----------------------|
| POST   | /api/register/  | No   | Create account       |
| POST   | /api/login/     | No   | Get JWT tokens       |
| POST   | /api/logout/    | No   | Blacklist refresh    |
| GET    | /api/profile/   | Yes  | Get profile          |
| PUT    | /api/profile/   | Yes  | Update profile       |

## Run Locally

```bash
# Backend
cd backend
source ../venv/bin/activate
python manage.py runserver

# Frontend (separate terminal)
cd frontend
npm run dev
```

## Deployed URL

**Live app:** `https://your-app-name.onrender.com`
