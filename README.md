# Learning Management System (LMS)

## Project Overview
This project is a full-stack Learning Management System built with Django, Django REST Framework, SQLite, and React. Users can register, log in, browse courses, and access features based on their role as a student, instructor, or admin.

The goal of the project is to combine Python, Django, SQL, JavaScript, React, HTML, and CSS into a working LMS that includes authentication, authorization, and simple course management.

## Project Aim
The application is designed to support:
- student browsing and enrollment
- instructor course creation and management
- admin course and user management
- frontend-backend communication through a REST API
- SQLite for local data storage during development

## Key Features
- registration and login
- role-based access control
- course listing and creation
- student, instructor, and admin dashboard views
- Django REST API integration with React
- automated tests for backend and frontend behavior

## User Roles
### Student
- View available courses
- Enroll in courses
- Access personal learning content

### Instructor
- Create and manage courses
- View course information
- Manage course content

### Admin
- Manage courses
- Manage users
- Access all system administration features

## Tech Stack
- Backend: Python, Django, Django REST Framework
- Database: SQLite
- Frontend: React, JavaScript, HTML, CSS
- Testing: Django TestCase, React Testing Library

## Application Architecture
The project is split into two main parts:
- Backend: Django project and API logic
- Frontend: React app with routing and state management

The frontend makes API requests to the Django backend, which handles authentication, user management, and course operations.

## Project Structure
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
│   │   ├── tests.py
│   │   └── ...
│   ├── manage.py
│   └── db.sqlite3
├── src/
│   ├── App.js
│   ├── features/
│   ├── context/
│   ├── api/
│   └── ...
├── package.json
├── public/
├── README.md
└── ...
```

## Front-End Wireframes / UI Notes
The application includes a simple multi-page layout with the following views:
- Home page
- Login page
- Registration page
- Course listing page
- Add course page
- Role-specific dashboard content

The design uses a clean, simple UI with consistent spacing, color contrast, and navigation links to create an intuitive experience.

## Prerequisites
Before running the project, ensure you have:
- Python 3.10+
- Node.js and npm
- A terminal or command prompt

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd lms-project
```

### 2. Create and activate a virtual environment
```bash
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

### 3. Install Python dependencies
```bash
cd backendLms
pip install django djangorestframework
```

### 4. Run database migrations
```bash
python manage.py migrate
```

### 5. Start the Django backend
```bash
python manage.py runserver
```
The backend should run on:
```text
http://localhost:8000
```

### 6. Install frontend dependencies
Open a second terminal window and run:
```bash
cd ..
npm install
```

### 7. Start the React frontend
```bash
npm start
```
The frontend should run on:
```text
http://localhost:3000
```

## API Endpoints
The backend provides the following API routes:

### Authentication
- `POST /api/register/` — register a user
- `POST /api/login/` — log in a user
- `POST /api/logout/` — log out a user
- `GET /api/auth/user/` — fetch current authenticated user

### Courses
- `GET /api/courses/` — list all courses
- `POST /api/courses/` — create a new course
- `GET /api/courses/lectures/` — list lecture courses
- `GET /api/courses/quizzes/` — list quiz courses
- `GET /api/courses/assignments/` — list assignment courses

## Testing

### Backend tests
Run:
```bash
cd backendLms
python manage.py test
```

### Frontend tests
Run:
```bash
cd ..
npm test -- --watch=false --runInBand
```

## Deployment
This project is currently set up for local development. For deployment, the frontend can be built for production with:
```bash
npm run build
```
The generated build can then be deployed to a hosting platform such as Netlify or Vercel, while the Django backend can be deployed to a platform such as Heroku or a VPS.

Live deployment URL: Not yet deployed

## Known Limitations / Future Improvements
- Expand course detail pages
- Add student enrollment tracking
- Add teacher-specific management tools
- Improve admin user management
- Enhance visual styling and responsiveness
- Add more advanced access-control checks

## Summary
This LMS project demonstrates a working full-stack application with Python, Django, REST APIs, React, and a SQLite database. It includes authentication, role-based access, course management, and automated testing, and it is structured to be extended into a more complete learning platform.

## References
- Django Documentation
- Django REST Framework Documentation
- React Documentation
- Create React App Documentation