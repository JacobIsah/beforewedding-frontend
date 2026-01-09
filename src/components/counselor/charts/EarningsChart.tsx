import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EarningsChartProps {
  data: Array<{
    month: string;
    earnings: number;
    sessions: number;
  }>;
}

export function EarningsChart({ data }: EarningsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary-teal)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-primary-teal)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="month" 
          stroke="var(--color-text-gray)" 
          style={{ fontSize: '12px', fill: 'var(--color-text-dark)' }}
        />
        <YAxis 
          stroke="var(--color-text-gray)" 
          style={{ fontSize: '12px', fill: 'var(--color-text-dark)' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-bg-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--color-text-dark)',
          }}
          formatter={(value: number) => [`$${value}`, 'Earnings']}
          labelStyle={{ color: 'var(--color-text-dark)', fontWeight: 500 }}
        />
        <Area
          type="monotone"
          dataKey="earnings"
          stroke="var(--color-primary-teal)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorEarnings)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}