import { useState } from 'react';
import { createCourse } from '../api/api';

export default function AddCourse() {
  const [courseTitle, setCourseTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedLength, setEstimatedLength] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage('');

    try {
      const data = await createCourse({
        title: courseTitle,
        description,
      });

      setServerMessage(`Course created successfully: ${data.title}`);
      setCourseTitle('');
      setDescription('');
      setEstimatedLength('');
    } catch (error) {
      setServerMessage(error.message || 'Unable to create course');
    }
  };

  return (
    <div className="page-wrapper">
      <h1>Add New Course</h1>
      <form onSubmit={handleSubmit} className="user-form">
        
        <div className="form-group">
          <label htmlFor="courseTitle" className="form-label">
            Course Title
          </label>
          <input
            id="courseTitle"
            type="text"
            placeholder="Enter course title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="estimatedLength" className="form-label">
            Estimated Length (hours)
          </label>
          <input
            id="estimatedLength"
            type="number"
            placeholder="Enter estimated length in hours"
            value={estimatedLength}
            onChange={(e) => setEstimatedLength(e.target.value)}
            min="0"
            step="0.5"
          />
        </div>

        {serverMessage && (
          <p className={serverMessage.includes('success') ? 'success' : 'error'}>{serverMessage}</p>
        )}

        <button type="submit" className="primary-button">
          Add Course
        </button>
      </form>
    </div>
  );
}