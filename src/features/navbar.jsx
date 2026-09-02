import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessAddCourse, canAccessManageUsers } from './permissions';

function Navbar() {
  const { user, userRole, isAuthenticated, logout } = useAuth();
  const showAddCourseLink = canAccessAddCourse(userRole);

  return (
    <div id="navbar" className="navbar">
      <nav className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="LearningHub home page">
          <img src="/learninghub-logo.svg" alt="LearningHub logo" className="brand-mark" />
          <span className="brand-wordmark" aria-label="LearningHub">
            <span className="brand-light">LearningHub</span>
          </span>
        </Link>

        <div className="nav-actions">
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
              <Link to="/profile" className="navbar-user" aria-label="Open your profile">
                <span className="user-icon" aria-hidden="true">{user?.username?.charAt(0).toUpperCase()}</span>
                <span>Hi, {user?.username}</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;