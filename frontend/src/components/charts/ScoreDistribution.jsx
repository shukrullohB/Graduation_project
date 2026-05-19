import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BAR_COLORS = ["#0047FF", "#2665FF", "#4B83FF", "#78A1FF", "#A6C0FF"];

const tooltipStyle = {
  borderRadius: 18,
  border: "1px solid rgba(0, 71, 255, 0.16)",
  background: "rgba(255, 248, 231, 0.98)",
  boxShadow: "0 24px 48px rgba(0, 71, 255, 0.12)",
  color: "#16305F",
};

export default function ScoreDistribution({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="histogramGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0047FF" stopOpacity={1} />
            <stop offset="52%" stopColor="#2D6BFF" stopOpacity={0.92} />
            <stop offset="100%" stopColor="#8BA9FF" stopOpacity={0.88} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 8" stroke="rgba(0,71,255,0.10)" />
        <XAxis
          dataKey="range"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(22,48,95,0.72)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          tick={{ fill: "rgba(111,127,157,0.84)", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,71,255,0.06)" }}
          contentStyle={tooltipStyle}
          formatter={(value) => [`${value}`, "Submissions"]}
        />
        <Bar dataKey="count" radius={[18, 18, 8, 8]} fill="url(#histogramGlow)" maxBarSize={84}>
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={BAR_COLORS[index % BAR_COLORS.length]}
              fillOpacity={0.95 - index * 0.08}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
