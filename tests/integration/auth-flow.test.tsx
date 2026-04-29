import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
  mockReplace.mockClear();
});

describe('auth flow', () => {
  it('submits the signup form and creates a session', () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'favour@test.com' },
    });
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    const session = JSON.parse(localStorage.getItem('habit-tracker-session')!);
    expect(session).not.toBeNull();
    expect(session.email).toBe('favour@test.com');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
it('shows an error for duplicate signup email', () => {
  // first signup
  const users = [{
    id: '1',
    email: 'favour@test.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
  }];
  localStorage.setItem('habit-tracker-users', JSON.stringify(users));

  // second signup with same email
  render(<SignupForm />);
  fireEvent.change(screen.getByTestId('auth-signup-email'), {
    target: { value: 'favour@test.com' },
  });
  fireEvent.change(screen.getByTestId('auth-signup-password'), {
    target: { value: 'password123' },
  });
  fireEvent.click(screen.getByTestId('auth-signup-submit'));

  expect(screen.getByText('User already exists')).toBeInTheDocument();
});

  it('submits the login form and stores the active session', () => {
    const users = [{
      id: '1',
      email: 'favour@test.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    }];
    localStorage.setItem('habit-tracker-users', JSON.stringify(users));

    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'favour@test.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    const session = JSON.parse(localStorage.getItem('habit-tracker-session')!);
    expect(session).not.toBeNull();
    expect(session.email).toBe('favour@test.com');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });
});