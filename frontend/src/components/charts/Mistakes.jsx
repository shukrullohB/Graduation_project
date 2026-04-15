import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Mistakes({
  data,
  dataKey = "mistakes",
  xKey = "subject",
  label = "Count",
  color = "#ef5a6f",
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6eeff" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#60708f" }} />
        <YAxis tick={{ fontSize: 12, fill: "#60708f" }} />
        <Tooltip formatter={(value) => [value, label]} />
        <Bar dataKey={dataKey} fill={color} name={label} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
