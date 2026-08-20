import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessAddCourse, canAccessManageUsers } from './permissions';

function Navbar() {
  const { user, userRole, isAuthenticated, logout } = useAuth();
  const showAddCourseLink = canAccessAddCourse(userRole);

  return (
    <div id="navbar" className="navbar">
      <nav className="navbar-inner">
        <div className="navbar-brand">LMS</div>
        <Link to="/" className="navbar-link">
          Home
        </Link>

        {!isAuthenticated && (
          <>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            {showAddCourseLink && (
              <Link to="/addCourse" className="navbar-link">
                Add Course
              </Link>
            )}
            {canAccessManageUsers(userRole) && (
              <Link to="/manageUsers" className="navbar-link">
                Manage Users
              </Link>
            )}
            <button type="button" className="navbar-link navbar-button" onClick={logout}>
              Logout
            </button>
            <span className="navbar-user">Hi, {user?.username}</span>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;