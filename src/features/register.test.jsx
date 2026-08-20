import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './register';
import { AuthProvider } from '../context/AuthContext';

describe('Register', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('shows a friendly message when the proxy returns a non-JSON error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Proxy error: Could not proxy request /api/register/ to http://localhost:8000/'),
      json: () => {
        throw new SyntaxError("Unexpected token 'P', \"Proxy erro\"...");
      },
    });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'student' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'student@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/backend server is not reachable/i)).toBeInTheDocument();
    });
  });
});
