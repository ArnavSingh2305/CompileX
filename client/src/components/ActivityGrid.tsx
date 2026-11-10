interface Props {
  activity: Record<string, number>;
}

const intensity = (count: number): string => {
  if (count === 0) return "bg-fg/[0.06]";
  if (count === 1) return "bg-accent/25";
  if (count <= 3) return "bg-accent/55";
  return "bg-accent";
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
  const weeks: (typeof days)[] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`}
                className={`h-3 w-3 rounded-[3px] ${intensity(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-fg/50">
        Less
        {[0, 1, 3, 4].map((n) => (
          <span key={n} className={`h-3 w-3 rounded-[3px] ${intensity(n)}`} />
        ))}
        More
      </div>
    </div>
  );
};
