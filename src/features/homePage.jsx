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
            return <p className="empty-state">Loading your dashboard…</p>;
        }

        if (error) {
            return <p className="error">Error: {error}. Showing the course catalog anyway.</p>;
        }

        return (
            <div className="dashboard-grid">
                {userRole === 'student' && (
                    <div className="dashboard-card">
                        <h3>Student dashboard</h3>
                        <p>Browse classes, keep up with enrollment, and stay on top of the latest updates.</p>
                    </div>
                )}

                {userRole === 'instructor' && (
                    <div className="dashboard-card">
                        <h3>Instructor dashboard</h3>
                        <p>Publish new courses, keep materials current, and support your learners.</p>
                        <ul>
                            <li><Link to="/addCourse">+ Add a new course</Link></li>
                        </ul>
                    </div>
                )}

                {userRole === 'admin' && (
                    <div className="dashboard-card">
                        <h3>Administration</h3>
                        <p>Review access, manage roles, and keep the platform running smoothly.</p>
                        <ul>
                            <li><Link to="/manageUsers">Manage users</Link></li>
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
                    <p className="eyebrow">Academic portal</p>
                    <h1>Welcome back</h1>
                    <p className="hero-subtitle">Find the right course, follow updates, and keep your learning moving forward.</p>
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
                        <h2 id="notifications-heading">Announcements</h2>
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
                    <h2>Available courses</h2>
                    <span className="section-pill">Catalog</span>
                </div>
                <CourseView courses={courses} />
            </section>
        </div>
    );
};

export default HomePage;