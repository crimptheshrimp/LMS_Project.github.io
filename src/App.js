import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './features/navbar';
import HomePage from './features/homePage';
import Login from './features/login';
import Register from './features/register';
import AddCourse from './features/addCourse';
import RequireAuth from './components/RequireAuth';
import Profile from './features/profile';
import ManageUsers from './features/manageUsers';

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
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
            path="/manageUsers"
            element={
              <RequireAuth allowedRoles={['admin']}>
                <ManageUsers />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
