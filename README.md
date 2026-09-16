# LearningHub

A small learning management system for a teaching environment with students, instructors, and administrators. The app combines a Django API with a React interface so users can sign in, browse available courses, enroll, and manage course-related updates.

## What it does
- Students can register, sign in, view courses, and enroll in classes.
- Instructors can create new courses and keep the catalog current.
- Instructors and administrators can edit courses and see the students enrolled in each course.
- Students can use My Courses to view every course in which they are enrolled.
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

Enable debug mode for local development:
On Windows:
```bash
set DJANGO_DEBUG=True
```
On macOS/Linux:
```bash
export DJANGO_DEBUG=True
```

### 2. Install backend dependencies
```bash
pip install -r requirements.txt
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

## Production deployment

Set these environment variables in the hosting provider. Do not commit their values:

```text
DJANGO_DEBUG=False
SECRET_KEY=<long-random-production-secret>
DATABASE_URL=<production-database-url>
DJANGO_ALLOWED_HOSTS=<api-domain>
DJANGO_CSRF_TRUSTED_ORIGINS=https://<frontend-domain>
```

Configure the provider to run these commands from the repository root:

```bash
python backendLms/manage.py migrate
python backendLms/manage.py collectstatic --noinput
gunicorn --chdir backendLms backendLms.wsgi:application
```

The production settings require `SECRET_KEY` and `DATABASE_URL`, enable HTTPS-only
cookies and redirects, and configure WhiteNoise for collected static files.

## Key API routes
- `POST /api/register/` — create a user account
- `POST /api/login/` — sign in
- `POST /api/logout/` — sign out
- `GET /api/auth/user/` — get the current user
- `GET /api/courses/` — list available courses
- `POST /api/courses/` — create a course
- `GET /api/managed-courses/` — list manageable courses with enrolled students for instructors/admins
- `PATCH /api/courses/<id>/` — edit a course as its instructor or an administrator
- `POST /api/courses/<id>/enroll/` — enroll a student
- `GET /api/students/enrollments/` — list the signed-in student's enrolled courses

Course create and update notifications include the course title, estimated length, and subject tags.

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

### Standards validation
```bash
npm run validate:html
npm run validate:css
```

Run the complete validation and test workflow with:
```bash
npm run validate
```

HTML is checked through the W3C Nu validator, and CSS is checked through the W3C Jigsaw validator. The HTML targets include the public entry point and the standalone preview/specification pages; CSS targets include the source stylesheets.

## Notes
This project is intentionally kept small and focused so it is easy to extend. It is structured to support a real teaching workflow without being overly complex for local development