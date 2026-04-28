'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { deleteHabit, completeHabit, updateHabit } from '@/lib/habits';
import HabitForm from '@/components/habits/HabitForm';

type HabitCardProps = {
  habit: Habit;
  onUpdate: () => void;
};

export default function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);

  function handleComplete() {
    completeHabit(habit.id, today);
    onUpdate();
  }

  function handleDelete() {
    deleteHabit(habit.id);
    onUpdate();
  }

  function handleEdit(name: string, description: string) {
    updateHabit(habit.id, name, description);
    setEditing(false);
    onUpdate();
  }

  if (editing) {
    return (
      <HabitForm
        initialValues={{ name: habit.name, description: habit.description }}
        onSave={handleEdit}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl shadow p-5 mb-4 transition ${
        isCompletedToday ? 'bg-green-50 border border-green-200' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-0.5">{habit.description}</p>
          )}
        </div>
        <span
          data-testid={`habit-streak-${slug}`}
          className="text-sm font-medium text-orange-500"
        >
          🔥 {streak} day{streak !== 1 ? 's' : ''}
        </span>
      </div>

      {confirmDelete && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-red-700 mb-2">
            Are you sure you want to delete this habit?
          </p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white text-sm py-1.5 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 border border-gray-300 text-gray-700 text-sm py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleComplete}
          className={`flex-1 text-sm py-2 rounded-lg font-medium transition ${
            isCompletedToday
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isCompletedToday ? '✓ Done' : 'Mark Done'}
        </button>
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => setEditing(true)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setConfirmDelete(true)}
          className="px-3 py-2 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}