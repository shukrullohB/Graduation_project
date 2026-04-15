import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AverageScore({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6eeff" />
        <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "#60708f" }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#60708f" }} />
        <Tooltip formatter={(value) => [`${value}%`, "Average Score"]} />
        <Bar
          dataKey="avgScore"
          fill="url(#avgScoreGradient)"
          radius={[8, 8, 0, 0]}
          name="Average Score"
        />
        <defs>
          <linearGradient id="avgScoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d66ff" />
            <stop offset="100%" stopColor="#57a8ff" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
