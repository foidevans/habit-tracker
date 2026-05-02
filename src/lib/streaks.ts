export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today ?? new Date().toISOString().split('T')[0];
  const uniqueCompletions = [...new Set(completions)];
  
  // streak checks today before counting
  if (!uniqueCompletions.includes(todayDate)) {
    return 0;
  }

  const sorted = uniqueCompletions.sort();
  const completionSet = new Set(sorted);
  let streak = 0;
  let currentDate = todayDate;

  while (completionSet.has(currentDate)) {
    streak += 1;
    const date = new Date(`${currentDate}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() - 1);
    currentDate = date.toISOString().slice(0, 10);
  }

  return streak;
}