'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitList from '@/components/habits/HabitList';
import HabitForm from '@/components/habits/HabitForm';
import { getSession } from '@/lib/storage';
import { getUserHabits, createHabit } from '@/lib/habits';
import { logOut } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';
import { Habit } from '@/types/habit';

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loadHabits = useCallback(() => {
    const session = getSession();
    if (!session) return;
    const userHabits = getUserHabits(session.userId);
    setHabits(userHabits);
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  function handleCreate(name: string, description: string) {
    const session = getSession();
    if (!session) return;
    // dashboard filters habits by userId
    createHabit(session.userId, name, description);
    setShowForm(false);
    loadHabits();
  }

function handleLogOut() {
  logOut();
  router.replace('/login');
}

  return (
    <ProtectedRoute>
      <div
        data-testid="dashboard-page"
        className="min-h-screen bg-gray-50"
      >
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-lg">Habit Tracker</h1>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogOut}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Log out
          </button>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Your Habits</h2>
            {!showForm && (
              <button
                data-testid="create-habit-button"
                onClick={() => setShowForm(true)}
                className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                + New Habit
              </button>
            )}
          </div>

          {showForm && (
            <HabitForm
              onSave={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}

          <HabitList
            habits={habits}
            onUpdate={loadHabits}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}