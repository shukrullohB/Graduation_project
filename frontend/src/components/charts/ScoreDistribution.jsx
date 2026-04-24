import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4f7cff", "#6d5cff", "#06b6d4", "#22c55e", "#f59e0b"];

export default function ScoreDistribution({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="range"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={48}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.26)",
            boxShadow: "0 12px 24px rgba(15,23,42,0.12)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
