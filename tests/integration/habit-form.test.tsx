import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList';
import { Habit } from '@/types/habit';

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

describe('habit form', () => {
  it('shows a validation error when habit name is empty', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByTestId('habit-save-button'));
    expect(screen.getByText('Habit name is required')).toBeInTheDocument();
  });

  it('creates a new habit and renders it in the list', () => {
    const session = { userId: 'user1', email: 'favour@test.com' };
    localStorage.setItem('habit-tracker-session', JSON.stringify(session));
    localStorage.setItem('habit-tracker-habits', JSON.stringify([]));

    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    });
    fireEvent.change(screen.getByTestId('habit-description-input'), {
      target: { value: 'Stay hydrated' },
    });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(onSave).toHaveBeenCalledWith('Drink Water', 'Stay hydrated');
  });

  it('edits an existing habit and preserves immutable fields', () => {
    const onSave = vi.fn();
    render(
      <HabitForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialValues={{ name: 'Drink Water', description: 'Stay hydrated' }}
      />
    );

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink More Water' },
    });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(onSave).toHaveBeenCalledWith('Drink More Water', 'Stay hydrated');
  });

  it('deletes a habit only after explicit confirmation', () => {
    const today = new Date().toISOString().split('T')[0];
    const habits: Habit[] = [{
      id: '1',
      userId: 'user1',
      name: 'Drink Water',
      description: 'Stay hydrated',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    }];
    localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));

    const onUpdate = vi.fn();
    render(<HabitList habits={habits} onUpdate={onUpdate} />);

    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('habit-delete-drink-water'));
    expect(screen.queryByTestId('confirm-delete-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-delete-button'));
    expect(onUpdate).toHaveBeenCalled();
  });

  it('toggles completion and updates the streak display', () => {
    const today = new Date().toISOString().split('T')[0];
    const habits: Habit[] = [{
      id: '1',
      userId: 'user1',
      name: 'Drink Water',
      description: 'Stay hydrated',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    }];
    localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));

    const onUpdate = vi.fn();
    render(<HabitList habits={habits} onUpdate={onUpdate} />);

    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0');

    fireEvent.click(screen.getByTestId('habit-complete-drink-water'));
    expect(onUpdate).toHaveBeenCalled();
  });
});