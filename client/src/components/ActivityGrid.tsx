interface Props {
  activity: Record<string, number>;
}

const intensity = (count: number): string => {
  if (count === 0) return "bg-slate-100 dark:bg-white/5";
  if (count === 1) return "bg-pink-200 dark:bg-pink-500/30";
  if (count <= 3) return "bg-pink-400 dark:bg-pink-500/60";
  return "bg-pink-600 dark:bg-pink-500";
};

export const ActivityGrid = ({ activity }: Props) => {
  const days: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = 119; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const key = d.toISOString().split("T")[0];

    days.push({
      date: key,
      count: activity[key] || 0,
    });
  }

  // Group into weeks (columns of 7)
  const weeks: typeof days[] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} submission${
                day.count !== 1 ? "s" : ""
              }`}
              className={`w-3 h-3 rounded-sm ${intensity(day.count)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};