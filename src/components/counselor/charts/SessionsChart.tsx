import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface SessionsChartProps {
  data: Array<{
    month: string;
    completed: number;
    cancelled: number;
  }>;
}

export function SessionsChart({ data }: SessionsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="month" 
          stroke="var(--color-text-gray)" 
          style={{ fontSize: '12px', fill: 'var(--color-text-dark)' }}
        />
        <YAxis 
          stroke="var(--color-text-gray)" 
          style={{ fontSize: '12px', fill: 'var(--color-text-dark)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-bg-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--color-text-dark)',
          }}
          labelStyle={{ color: 'var(--color-text-dark)', fontWeight: 500 }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-dark)' }}
          iconType="circle"
        />
        <Bar 
          dataKey="completed" 
          fill="var(--color-primary-teal)" 
          radius={[8, 8, 0, 0]}
          name="Completed Sessions"
        />
        <Bar 
          dataKey="cancelled" 
          fill="var(--color-text-gray)" 
          radius={[8, 8, 0, 0]}
          name="Cancelled Sessions"
          opacity={0.5}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}