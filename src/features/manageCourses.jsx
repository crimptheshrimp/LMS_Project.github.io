import { useEffect, useState } from 'react';
import { fetchManagedCourses, updateCourse } from '../api/api';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', estimated_length: 0, tags: [] });
  const [message, setMessage] = useState('');

  const loadCourses = () => fetchManagedCourses().then(setCourses).catch((error) => setMessage(error.message));

  useEffect(() => {
    loadCourses();
  }, []);

  const beginEditing = (course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      estimated_length: course.estimated_length || 0,
      tags: course.tags || [],
    });
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateCourse(editingId, { ...form, estimated_length: form.estimated_length || 0 });
      setEditingId(null);
      setMessage('Course updated successfully.');
      await loadCourses();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="page-wrapper manage-courses-wrapper">
      <section className="course-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Course operations</p>
            <h1>Manage courses</h1>
          </div>
          <span className="section-pill">{courses.length} courses</span>
        </div>
        {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
        {!courses.length && <p className="empty-state">No courses are available to manage.</p>}
        <div className="management-list">
          {courses.map((course) => (
            <article className="management-course" key={course.id}>
              {editingId === course.id ? (
                <form className="user-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`title-${course.id}`}>Title</label>
                    <input id={`title-${course.id}`} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`description-${course.id}`}>Description</label>
                    <textarea id={`description-${course.id}`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`length-${course.id}`}>Length (hours)</label>
                    <input id={`length-${course.id}`} type="number" min="0" step="0.5" value={form.estimated_length} onChange={(event) => setForm({ ...form, estimated_length: event.target.value })} />
                  </div>
                  <div className="user-actions">
                    <button type="submit" className="primary-button">Save changes</button>
                    <button type="button" className="secondary-button" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="management-course-header">
                    <div>
                      <h2>{course.title}</h2>
                      <p>{course.description}</p>
                      <p>Length: {course.estimated_length || 0} hours{course.tags?.length ? ` | Tags: ${course.tags.join(', ')}` : ''}</p>
                    </div>
                    <button type="button" className="secondary-button" onClick={() => beginEditing(course)}>Edit course</button>
                  </div>
                  <div className="enrolled-students">
                    <strong>Enrolled students ({course.enrolled_students.length})</strong>
                    {course.enrolled_students.length === 0 ? <p className="empty-state">No students enrolled yet.</p> : (
                      <ul>{course.enrolled_students.map((student) => <li key={student.id}>{student.username}</li>)}</ul>
                    )}
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ManageCourses;