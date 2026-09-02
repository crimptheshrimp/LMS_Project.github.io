import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseView from './courseView';
import { fetchCourses, fetchNotifications } from '../api/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user, userRole } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const courseData = await fetchCourses();
                setCourses(courseData);
            } catch (err) {
                setError(err.message || 'Unable to load courses');
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        fetchNotifications()
            .then(setNotifications)
            .catch(() => setNotifications([]));
    }, [user, userRole]);

    const renderContent = () => {
        if (loading) {
            return <p className="empty-state">Loading your LearningHub dashboard…</p>;
        }

        if (error) {
            return <p className="error">Error: {error}. Showing the course catalog anyway.</p>;
        }

        return (
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
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="page-wrapper dashboard-shell">
            <header className="hero-panel">
                <div className="hero-copy">
                    <p className="eyebrow">Learning Management System</p>
                    <h1>Welcome to your learning hub</h1>
                    <p className="hero-subtitle">Discover, learn, and grow with a cleaner path to every course, update, and achievement.</p>
                </div>
                <div className="hero-side">
                    <div className="role-badge">{userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'Student'} role</div>
                    <div className="brand-mini">
                        <img src="/learninghub-logo.svg" alt="LearningHub logo" />
                    </div>
                </div>
            </header>

            {renderContent()}

            {userRole && (
                <section className="notification-section" aria-labelledby="notifications-heading">
                    <div className="section-header">
                        <h2 id="notifications-heading">Notifications</h2>
                        <span className="section-pill">{notifications.length}</span>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="empty-state">You are all caught up.</p>
                    ) : (
                        <div className="notification-list">
                            {notifications.map((notification) => (
                                <article className="notification-item" key={notification.id}>
                                    <span className="notification-mark" aria-hidden="true" />
                                    <div>
                                        <p>{notification.message}</p>
                                        <time dateTime={notification.created_at}>{new Date(notification.created_at).toLocaleDateString()}</time>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}

            <section className="course-section">
                <div className="section-header">
                    <h2>Available Courses</h2>
                    <span className="section-pill">Catalog</span>
                </div>
                <CourseView courses={courses} />
            </section>
        </div>
    );
};

export default HomePage;