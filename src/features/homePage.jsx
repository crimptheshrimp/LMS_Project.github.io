import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseView from './courseView';
import { fetchCourses } from '../api/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { userRole } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchCourses();
                setCourses(data);
            } catch (err) {
                setError(err.message || 'Unable to load courses');
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p>Loading courses and permissions...</p>;
        }

        if (error) {
            return <p className="error">Error: {error}. Showing the course catalog anyway.</p>;
        }

        return (
            <>
            <div className="dashboard-grid">
                {userRole === 'student' && (
                    <div className="dashboard-card">
                        <h3>Student Dashboard</h3>
                        <p>You can browse available courses and track your progress.</p>
                    </div>
                )}

                {userRole === 'instructor' && (
                    <div className="dashboard-card">
                        <h3>Instructor Dashboard</h3>
                        <p>You can create courses, manage content, and help students learn.</p>
                        <ul>
                            <li><Link to="/addCourse">+ Add New Course</Link></li>
                        </ul>
                    </div>
                )}

                {userRole === 'admin' && (
                    <div className="dashboard-card">
                        <h3>Administrator Dashboard</h3>
                        <p>You have full access to all system features and user management.</p>
                        <ul>
                            <li><Link to="/manageUsers">Manage Users</Link></li>
                            <li><Link to="/systemSettings">System Settings</Link></li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
    };

    return (
        <div className="page-wrapper dashboard-shell">
            <header className="hero-panel">
                <div>
                    <p className="eyebrow">Learning Management System</p>
                    <h1>Welcome to your learning hub</h1>
                </div>
                <div className="role-badge">Your role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
            </header>

            {renderContent()}

            <section className="course-section">
                <div className="section-header">
                    <h2>Available Courses</h2>
                    <span className="section-pill">Catalog</span>
                </div>
                <CourseView courses={courses} />
            </section>
};

export default HomePage;