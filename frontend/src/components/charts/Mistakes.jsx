import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#2563eb", "#f97316", "#10b981", "#a855f7", "#f59e0b"];

const Mistakes = ({ data }) => {
  const items = data?.items || [];
  return (
    <div className="card chart-card">
      <div className="card__header">
        <h3>Frequent Mistakes</h3>
      </div>
      {items.length === 0 ? (
        <p className="muted">No mistake data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Tooltip />
            <Pie
              data={items}
              dataKey="count"
              nameKey="label"
              innerRadius={60}
              outerRadius={100}
              label
            >
              {items.map((entry, index) => (
                <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Mistakes;
