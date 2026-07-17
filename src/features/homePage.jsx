
import Link from 'react'
import { useState } from 'react';

const HomePage = () => {
    const [userRole, setUserRole] = useState('teacher'); // Default role for demonstration purposes');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    {/*useEffect(() => {
        // Fetch user permissions from placeholder API
        const fetchUserPermissions = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await fetch('/api/user/permissions');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch user permissions');
                }

                const data = await response.json();
                setUserRole(data.role); // Expected: 'student', 'teacher', or 'admin'
                setError(null);
            } catch (err) {
                console.error('Error fetching permissions:', err);
                setError(err.message);
                // Fallback to 'student' role if API fails
                setUserRole('student');
            } finally {
                setLoading(false);
            }
        };

        fetchUserPermissions();
    }, []);*/}

    const renderContent = () => {
        if (loading) {
            return <p>Loading user permissions...</p>;
        }

        if (error) {
            return <p style={{ color: 'red' }}>Error: {error}. Proceeding as student.</p>;
        }

        return (
            <>
                <p style={{ color: '#007bff', fontWeight: 'bold' }}>Your Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                
                {userRole === 'student' && (
                    <div>
                        <h3>Student Dashboard</h3>
                        <p>You can enroll in courses and track your progress.</p>
                    </div>
                )}

                {userRole === 'teacher' && (
                    <div>
                        <h3>Teacher Dashboard</h3>
                        <p>You can create courses, manage students, and grade assignments.</p>
                        <a to="/addCourse">+ Add New Course</a>
                    </div>
                )}

                {userRole === 'admin' && (
                    <div>
                        <h3>Administrator Dashboard</h3>
                        <p>You have full access to all system features and user management.</p>
                        <ul>
                            <li><a to="/addCourse">Manage Courses</a></li>
                            <li><a href="/manageUsers">Manage Users</a></li>
                            <li><a href="/systemSettings">System Settings</a></li>
                        </ul>
                    </div>
                )}
            </>
        );
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
            <h1>Welcome to the Learning Management System!</h1>
            <p>This is the home page of the LMS. Please register or log in to access your courses.</p>
            <br />
            
            {renderContent()}

            <br />
            <h2>Available Courses:</h2>
            <ul>
                <li>Course 1</li>
                <li>Course 2</li>
                <li>Course 3</li>
            </ul>
        </div>
    );
};

export default HomePage;