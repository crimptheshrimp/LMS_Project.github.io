import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { canAccessAddCourse } from './features/permissions';

test('shows the add course link for instructor and admin users', () => {
  expect(canAccessAddCourse('instructor')).toBe(true);
  expect(canAccessAddCourse('admin')).toBe(true);
  expect(canAccessAddCourse('student')).toBe(false);
});

test('renders the LearningHub brand in the top navigation', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/learninghub/i)).toBeInTheDocument();
});
