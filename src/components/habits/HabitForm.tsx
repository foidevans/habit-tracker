'use client';

import { useState } from 'react';
import { validateHabitName } from '@/lib/validators';
import { Habit } from '@/types/habit';

type HabitFormProps = {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
  initialValues?: Pick<Habit, 'name' | 'description'>;
};

export default function HabitForm({ onSave, onCancel, initialValues }: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    setError(null);
    onSave(result.value, description.trim());
  }

  return (
    <div data-testid="habit-form" className="bg-white rounded-2xl shadow p-6 mb-4">
      <div className="mb-4">
        <label
          htmlFor="habit-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Habit Name
        </label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="e.g. Drink Water"
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="habit-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (optional)
        </label>
        <input
          id="habit-description"
          type="text"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="e.g. Drink 8 glasses a day"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="habit-frequency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          data-testid="habit-save-button"
          onClick={handleSave}
          className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}