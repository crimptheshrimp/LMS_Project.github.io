import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import CourseView from './courseView';

describe('CourseView', () => {
  beforeEach(() => {
    localStorage.setItem(
      'authUser',
      JSON.stringify({ id: 1, username: 'student1', email: 'student@example.com', role: 'student' })
    );

    global.fetch = jest.fn((url) => {
      if (url === '/api/auth/user/') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify({ user: { id: 1, username: 'student1', role: 'student' } })),
          json: () => Promise.resolve({ user: { id: 1, username: 'student1', role: 'student' } }),
        });
      }

      if (url === '/api/courses/1/enroll/') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify({ message: 'Enrollment successful.', course_id: 1, student_id: 1 })),
          json: () => Promise.resolve({ message: 'Enrollment successful.', course_id: 1, student_id: 1 }),
        });
      }

      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({})),
        json: () => Promise.resolve({}),
      });
    });
  });

  it('allows students to enroll in a course', async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CourseView
            courses={[{ id: 1, title: 'Intro to Django', description: 'Learn Django basics', instructor: 'teacher1' }]}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /enroll/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/courses/1/enroll/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        })
      );
    });
  });
});
