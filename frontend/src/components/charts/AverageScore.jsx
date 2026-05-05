import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  borderRadius: 18,
  border: "1px solid rgba(0, 71, 255, 0.16)",
  background: "rgba(255, 248, 231, 0.98)",
  boxShadow: "0 24px 48px rgba(0, 71, 255, 0.12)",
  color: "#16305F",
};

export default function AverageScore({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0047FF" />
            <stop offset="48%" stopColor="#2D6BFF" />
            <stop offset="100%" stopColor="#6D96FF" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 8" stroke="rgba(0,71,255,0.10)" />
        <XAxis
          dataKey="subject"
          tick={{ fill: "rgba(22,48,95,0.72)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "rgba(111,127,157,0.84)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,71,255,0.06)" }}
          contentStyle={tooltipStyle}
          formatter={(value) => [`${value}`, "Average"]}
        />
        <Bar
          dataKey="avgScore"
          fill="url(#avgGradient)"
          radius={[18, 18, 8, 8]}
          maxBarSize={72}
          name="Avg Score"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
