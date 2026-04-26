import { Habit } from '@/types/habit';
import { getHabits, saveHabits } from '@/lib/storage';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const hasDate = habit.completions.includes(date);

  const updatedCompletions = hasDate
    ? habit.completions.filter((d) => d !== date)
    : [...habit.completions, date];

  const uniqueCompletions = [...new Set(updatedCompletions)];

  return {
    ...habit,
    completions: uniqueCompletions,
  };
}

export function getUserHabits(userId: string): Habit[] {
  const habits = getHabits();
  return habits.filter((h) => h.userId === userId);
}

export function createHabit(
  userId: string,
  name: string,
  description: string
): Habit {
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    userId,
    name,
    description,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
  };

  const habits = getHabits();
  saveHabits([...habits, newHabit]);

  return newHabit;
}

export function updateHabit(
  id: string,
  name: string,
  description: string
): void {
  const habits = getHabits();
  const updated = habits.map((h) =>
    h.id === id
      ? { ...h, name, description }
      : h
  );
  saveHabits(updated);
}

export function deleteHabit(id: string): void {
  const habits = getHabits();
  const updated = habits.filter((h) => h.id !== id);
  saveHabits(updated);
}

export function completeHabit(id: string, date: string): void {
  const habits = getHabits();
  const updated = habits.map((h) =>
    h.id === id ? toggleHabitCompletion(h, date) : h
  );
  saveHabits(updated);
}