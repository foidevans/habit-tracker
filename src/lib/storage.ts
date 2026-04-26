import { User, Session } from  '@/types/auth';
import { Habit } from '@/types/habit';

const KEYS = {
    users: 'habit-tracker-users',
    habits: 'habit-tracker-habits',
    session: 'habit-tracker-session',
}

export function getUsers(): User[] {
    const data = localStorage.getItem(KEYS.users);
    return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
    localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function getSession(): Session | null {
    const data = localStorage.getItem(KEYS.session);
    return data ? JSON.parse(data) : null;
}

export function saveSession(session: Session | null): void {
    if (session) {
        localStorage.setItem(KEYS.session, JSON.stringify(session));
    } else {
        localStorage.removeItem(KEYS.session);
    }
}

export function getHabits(): Habit[] {
    const data = localStorage.getItem(KEYS.habits);
    return data ? JSON.parse(data) : [];
}

export function saveHabits(habits: Habit[]): void {
    localStorage.setItem(KEYS.habits, JSON.stringify(habits));
}