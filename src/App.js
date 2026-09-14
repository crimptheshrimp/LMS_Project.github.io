import './App.css';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './features/navbar';
import HomePage from './features/homePage';
import RequireAuth from './components/RequireAuth';

const Login = lazy(() => import('./features/login'));
const Register = lazy(() => import('./features/register'));
const AddCourse = lazy(() => import('./features/addCourse'));
const Profile = lazy(() => import('./features/profile'));
const ManageUsers = lazy(() => import('./features/manageUsers'));
const EnrolledCourses = lazy(() => import('./features/enrolledCourses'));
const ManageCourses = lazy(() => import('./features/manageCourses'));

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Suspense fallback={<p className="empty-state">Loading page...</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/addCourse"
              element={
                <RequireAuth allowedRoles={['instructor', 'admin']}>
                  <AddCourse />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/enrolledCourses"
              element={
                <RequireAuth allowedRoles={['student']}>
                  <EnrolledCourses />
                </RequireAuth>
              }
            />
            <Route
              path="/manageCourses"
              element={
                <RequireAuth allowedRoles={['instructor', 'admin']}>
                  <ManageCourses />
                </RequireAuth>
              }
            />
            <Route
              path="/manageUsers"
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <ManageUsers />
                </RequireAuth>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
