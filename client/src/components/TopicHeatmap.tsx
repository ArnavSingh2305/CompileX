import type { TopicProgress } from "../api/stats";

const intensityClass = (percentage: number): string => {
  if (percentage === 0) return "bg-fg/[0.05]";
  if (percentage < 25) return "bg-accent/15";
  if (percentage < 50) return "bg-accent/30";
  if (percentage < 75) return "bg-accent/50";
  return "bg-accent";
};

export const TopicHeatmap = ({ topics }: { topics: TopicProgress[] }) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {topics.map((t) => {
        const solid = t.percentage >= 75;
        return (
          <div
            key={t.topic}
            className={`rounded-md px-2.5 py-2 transition-colors ${intensityClass(t.percentage)}`}
            title={`${t.solved}/${t.total} solved`}
          >
            <p className={`line-clamp-2 text-xs font-medium leading-4 ${solid ? "text-accent-fg" : "text-fg"}`}>
              {t.topic}
            </p>
            <p className={`mt-0.5 text-[11px] ${solid ? "text-accent-fg/80" : "text-fg/55"}`}>
              {t.solved}/{t.total}
            </p>
          </div>
        );
      })}
    </div>
  );
};
