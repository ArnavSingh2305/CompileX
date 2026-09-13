import type { TopicProgress } from "../api/stats";

const intensityColor = (percentage: number): string => {
  if (percentage === 0) {
    return "bg-slate-100 dark:bg-white/5";
  }

  if (percentage < 25) {
    return "bg-pink-100 dark:bg-pink-500/20";
  }

  if (percentage < 50) {
    return "bg-pink-300 dark:bg-pink-500/40";
  }

  if (percentage < 75) {
    return "bg-pink-400 dark:bg-pink-500/60";
  }

  return "bg-pink-600 dark:bg-pink-500";
};

export const TopicHeatmap = ({
  topics,
}: {
  topics: TopicProgress[];
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {topics.map((t) => (
        <div
          key={t.topic}
          className={`rounded-lg p-3 ${intensityColor(
            t.percentage
          )} transition-colors`}
          title={`${t.solved}/${t.total} solved`}
        >
          <p
            className={`text-xs font-medium truncate ${
              t.percentage >= 50
                ? "text-white"
                : "text-navy-900 dark:text-slate-200"
            }`}
          >
            {t.topic}
          </p>

          <p
            className={`text-[10px] mt-0.5 ${
              t.percentage >= 50
                ? "text-white/80"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {t.solved}/{t.total}
          </p>
        </div>
      ))}
    </div>
  );
};