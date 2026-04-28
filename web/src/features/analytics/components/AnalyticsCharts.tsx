'use client';

import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-xl border border-primary/20 p-4 rounded-xl shadow-2xl">
        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">{label}</p>
        <p className="text-sm font-bold text-primary">
          {payload[0].name}: <span className="text-foreground">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface ChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  dataKey: string;
}

export function AnalyticsCharts({ data, type, dataKey }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#888', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
               type="monotone" 
               dataKey={dataKey} 
               stroke="#6366f1" 
               strokeWidth={3}
               fillOpacity={1} 
               fill="url(#colorValue)" 
               animationDuration={1500}
            />
          </AreaChart>
        ) : (
          <BarChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
             <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#888', fontSize: 10, fontWeight: 700 }}
            />
             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
             <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} animationDuration={1200}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
             </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
