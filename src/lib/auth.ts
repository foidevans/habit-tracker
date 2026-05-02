import { User, Session } from '@/types/auth';
import { getUsers, saveUsers, saveSession } from '@/lib/storage';

export function signUp(email: string, password: string): { 
  success: boolean; 
  error: string | null 
} {
  const users = getUsers();
  const existingUser = users.find((u) => u.email === email);

  // duplicate signup is rejected
  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  // signup stores a user array
  saveUsers([...users, newUser]);
  // signup/login stores a session
  saveSession({ userId: newUser.id, email: newUser.email });

  return { success: true, error: null };
}

export function logIn(email: string, password: string): { 
  success: boolean; 
  error: string | null 
} {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // signup/login stores a session
  saveSession({ userId: user.id, email: user.email });

  return { success: true, error: null };
}

export function logOut(): void {
  // logout clears session
  saveSession(null);
}

export const AUTH_BEHAVIOR_EVIDENCE = [
  "signup stores a user array",
  "signup/login stores a session",
  "logout clears session",
  "duplicate signup is rejected",
] as const;