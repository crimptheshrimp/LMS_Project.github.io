import { useEffect, useState } from 'react';
import { fetchStudentEnrollments } from '../api/api';

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentEnrollments().then(setCourses).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <main className="page-wrapper">
      <section className="course-section">
        <div className="section-header">
          <h1>My enrolled courses</h1>
          <span className="section-pill">{courses.length} courses</span>
        </div>
        {error && <p className="error">{error}</p>}
        {!error && courses.length === 0 && <p className="empty-state">You are not enrolled in any courses yet.</p>}
        <div className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Instructor: {course.instructor}</p>
              <p>Length: {course.estimated_length || 0} hours</p>
              {course.tags?.length > 0 && <p>Tags: {course.tags.join(', ')}</p>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}