import { Card } from "./ui/card";
import { PredictionResult } from "./ResultsDisplay";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ResultsChartProps {
  results: PredictionResult[];
}

const ResultsChart = ({ results }: ResultsChartProps) => {
  if (results.length === 0) return null;

  const counts = results.reduce(
    (acc, r) => {
      if (r.prediction === "Confirmed Planet") acc.confirmed++;
      else if (r.prediction === "Candidate") acc.candidate++;
      else acc.false++;
      return acc;
    },
    { confirmed: 0, candidate: 0, false: 0 }
  );

  const total = results.length;
  const data = [
    {
      name: "Confirmed Planet",
      value: counts.confirmed,
      percentage: ((counts.confirmed / total) * 100).toFixed(1),
    },
    {
      name: "Candidate",
      value: counts.candidate,
      percentage: ((counts.candidate / total) * 100).toFixed(1),
    },
    {
      name: "False Positive",
      value: counts.false,
      percentage: ((counts.false / total) * 100).toFixed(1),
    },
  ];

  const COLORS = ["hsl(142, 76%, 45%)", "hsl(45, 93%, 58%)", "hsl(0, 85%, 60%)"];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 animate-slide-up">
      <h3 className="text-2xl font-bold mb-6 text-primary">📊 Distribution Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(229, 40%, 12%)",
              border: "1px solid hsl(229, 30%, 20%)",
              borderRadius: "8px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ResultsChart;
