import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTheme } from "../context/ThemeContext";

interface Props {
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
}

// Same hues as the difficulty tags (green / orange / red) in each theme.
const PALETTE = {
  light: { easy: "#448361", medium: "#D9730D", hard: "#D44C47", track: "#EFEEEA" },
  dark: { easy: "#4DAB9A", medium: "#FFA344", hard: "#FF7369", track: "#2E2E2E" },
};

export const DifficultyRadialChart = ({ easy, medium, hard }: Props) => {
  const { resolvedTheme } = useTheme();
  const colors = PALETTE[resolvedTheme];

  const totalSolved = easy.solved + medium.solved + hard.solved;

  const data = [
    { name: "Easy", value: easy.solved || 0.0001, color: colors.easy },
    { name: "Medium", value: medium.solved || 0.0001, color: colors.medium },
    { name: "Hard", value: hard.solved || 0.0001, color: colors.hard },
  ];

  return (
    <div className="relative h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* faint full ring so the empty state still reads as a chart */}
          <Pie
            data={[{ name: "track", value: 1 }]}
            innerRadius="68%"
            outerRadius="90%"
            dataKey="value"
            stroke="none"
            isAnimationActive={false}
          >
            <Cell fill={colors.track} />
          </Pie>
          <Pie
            data={data}
            innerRadius="68%"
            outerRadius="90%"
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight">{totalSolved}</span>
        <span className="text-xs text-fg/50">Solved</span>
      </div>
    </div>
  );
};
