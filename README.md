# LearningHub

A small learning management system for a teaching environment with students, instructors, and administrators. The app combines a Django API with a React interface so users can sign in, browse available courses, enroll, and manage course-related updates.

## What it does
- Students can register, sign in, view courses, and enroll in classes.
- Instructors can create new courses and keep the catalog current.
- Administrators can review users and update roles within the system.
- The frontend and backend communicate through a lightweight REST API.

## Tech stack
- Backend: Python, Django, Django REST Framework
- Database: SQLite
- Frontend: React, JavaScript, HTML, CSS
- Testing: Django test suite and React Testing Library

## Project structure
```text
lms-project/
├── backendLms/
│   ├── backendLms/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── lms_app/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── ...
│   ├── manage.py
│   └── db.sqlite3
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── features/
│   ├── App.js
│   └── index.js
├── package.json
├── README.md
└── ...
```

## Local setup

### Prerequisites
- Python 3.10+
- Node.js and npm

### 1. Create a virtual environment
```bash
cd backendLms
python -m venv .venv
```
On Windows:
```bash
.venv\Scripts\activate
```
On macOS/Linux:
```bash
source .venv/bin/activate
```

### 2. Install backend dependencies
```bash
pip install django djangorestframework
```

### 3. Apply database migrations
```bash
python manage.py migrate
```

### 4. Start the API
```bash
python manage.py runserver
```
This should be available at:
```text
http://localhost:8000
```

### 5. Install frontend dependencies
Open a second terminal and run:
```bash
cd ..
npm install
```

### 6. Run the React app
```bash
npm start
```
The app will normally run at:
```text
http://localhost:3000
```

## Key API routes
- `POST /api/register/` — create a user account
- `POST /api/login/` — sign in
- `POST /api/logout/` — sign out
- `GET /api/auth/user/` — get the current user
- `GET /api/courses/` — list available courses
- `POST /api/courses/` — create a course
- `POST /api/courses/<id>/enroll/` — enroll a student

## Testing

### Backend
```bash
cd backendLms
python manage.py test
```

### Frontend
```bash
cd ..
npm test -- --watch=false --runInBand
```

## Notes
This project is intentionally kept small and focused so it is easy to extend. It is structured to support a real teaching workflow without being overly complex for local development