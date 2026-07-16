import { useState } from 'react';

export default function AddCourse() {
  const [courseTitle, setCourseTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedLength, setEstimatedLength] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const courseData = {
      title: courseTitle,
      description: description,
      estimatedLength: estimatedLength,
    };

    console.log('Course Data:', courseData);
    // TODO: Send courseData to API
    // Example: await fetch('/api/courses', { method: 'POST', body: JSON.stringify(courseData) })

    // Reset form after submission
    setCourseTitle('');
    setDescription('');
    setEstimatedLength('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Add New Course</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div>
          <label htmlFor="courseTitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Course Title
          </label>
          <input
            id="courseTitle"
            type="text"
            placeholder="Enter course title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <label htmlFor="estimatedLength" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Estimated Length (hours)
          </label>
          <input
            id="estimatedLength"
            type="number"
            placeholder="Enter estimated length in hours"
            value={estimatedLength}
            onChange={(e) => setEstimatedLength(e.target.value)}
            required
            min="0"
            step="0.5"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            marginTop: '1rem',
          }}
        >
          Add Course
        </button>
      </form>
    </div>
  );
}