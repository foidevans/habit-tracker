'use client';

import { Habit } from '@/types/habit';
import HabitCard from '@/components/habits/HabitCard';

type HabitListProps = {
  habits: Habit[];
  onUpdate: () => void;
};

export default function HabitList({ habits, onUpdate }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <p className="text-4xl mb-4">🌱</p>
        <h3 className="font-semibold text-gray-900 mb-1">No habits yet</h3>
        <p className="text-sm text-gray-500">
          Create your first habit to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}