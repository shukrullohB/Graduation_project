import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  LabelList,
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

export default function Mistakes({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        barCategoryGap={22}
        margin={{ top: 10, right: 22, left: 8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="mistakeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0047FF" />
            <stop offset="52%" stopColor="#2D6BFF" />
            <stop offset="100%" stopColor="#8BA9FF" />
          </linearGradient>
          <linearGradient id="mistakeGradientSoft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9FBDFF" />
            <stop offset="100%" stopColor="#DCE8FF" />
          </linearGradient>
        </defs>
        <CartesianGrid horizontal={false} strokeDasharray="4 8" stroke="rgba(0,71,255,0.10)" />
        <XAxis
          type="number"
          tick={{ fill: "rgba(111,127,157,0.84)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="subject"
          width={110}
          tick={{ fill: "rgba(22,48,95,0.72)", fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,71,255,0.06)" }}
          contentStyle={tooltipStyle}
          formatter={(value) => [`${value}`, "Mistakes"]}
        />
        <Bar
          dataKey="mistakes"
          radius={[0, 18, 18, 0]}
          barSize={34}
          name="Mistakes"
          background={{
            fill: "rgba(0,71,255,0.06)",
            radius: 18,
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.subject}
              fill={index === 0 ? "url(#mistakeGradient)" : "url(#mistakeGradientSoft)"}
            />
          ))}
          <LabelList
            dataKey="mistakes"
            position="right"
            offset={10}
            style={{ fill: "#16305F", fontSize: 12, fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
