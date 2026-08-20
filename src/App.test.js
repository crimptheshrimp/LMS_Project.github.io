import { canAccessAddCourse } from './features/permissions';

test('shows the add course link for instructor and admin users', () => {
  expect(canAccessAddCourse('instructor')).toBe(true);
  expect(canAccessAddCourse('admin')).toBe(true);
  expect(canAccessAddCourse('student')).toBe(false);
});
