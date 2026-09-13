import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface Props {
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
}

const COLORS = {
  easy: "#22C55E",
  medium: "#F59E0B",
  hard: "#EF4444",
};

export const DifficultyRadialChart = ({
  easy,
  medium,
  hard,
}: Props) => {
  const totalSolved =
    easy.solved + medium.solved + hard.solved;

  const data = [
    {
      name: "Easy",
      value: easy.solved || 0.0001,
      color: COLORS.easy,
    },
    {
      name: "Medium",
      value: medium.solved || 0.0001,
      color: COLORS.medium,
    },
    {
      name: "Hard",
      value: hard.solved || 0.0001,
      color: COLORS.hard,
    },
  ];

  return (
    <div className="relative w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="65%"
            outerRadius="90%"
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold">
          {totalSolved}
        </span>

        <span className="text-xs text-slate-500">
          Solved
        </span>
      </div>
    </div>
  );
};