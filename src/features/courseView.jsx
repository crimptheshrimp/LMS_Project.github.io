import { useState } from 'react';
import { enrollInCourse } from '../api/api';
import { useAuth } from '../context/AuthContext';

const CourseView = ({ courses = [] }) => {
  const { isAuthenticated, userRole } = useAuth();
  const [enrollmentMessages, setEnrollmentMessages] = useState({});

  const handleEnroll = async (courseId) => {
    try {
      const data = await enrollInCourse(courseId);
      setEnrollmentMessages((current) => ({
        ...current,
        [courseId]: data.message || 'Enrollment successful.',
      }));
    } catch (error) {
      setEnrollmentMessages((current) => ({
        ...current,
        [courseId]: error.message || 'Unable to enroll.',
      }));
    }
  };

  if (!courses.length) {
    return <p>No courses available yet.</p>;
  }

  return (
    <div className="course-grid">
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>Instructor: {course.instructor}</p>

          {isAuthenticated && userRole === 'student' && (
            <>
              <button type="button" className="primary-button" onClick={() => handleEnroll(course.id)}>
                Enroll
              </button>
              {enrollmentMessages[course.id] && (
                <p className={enrollmentMessages[course.id].includes('successful') ? 'success' : 'error'}>
                  {enrollmentMessages[course.id]}
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseView;