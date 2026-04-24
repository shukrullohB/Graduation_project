import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AverageScore({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
        <XAxis
          dataKey="subject"
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(79, 124, 255, 0.08)" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.26)",
            boxShadow: "0 12px 24px rgba(15,23,42,0.12)",
          }}
        />
        <Bar
          dataKey="avgScore"
          fill="url(#avgGradient)"
          radius={[10, 10, 0, 0]}
          name="Avg Score"
        />
        <defs>
          <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f7cff" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
