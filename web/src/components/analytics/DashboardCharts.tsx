"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
    data: any[];
    title: string;
    type: 'line' | 'bar' | 'pie';
    dataKey: string;
    nameKey: string;
    height?: number;
}

export function DashboardCharts({ data, title, type, dataKey, nameKey, height = 300 }: ChartProps) {
  return (
    <Card className="bg-[#050505] border-white/10 overflow-hidden relative group hover:border-white/20 transition-all p-6">
      <CardHeader className="p-0 pb-6 border-b border-white/10 mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{title}</h3>
      </CardHeader>
      
      <CardContent className="p-0">
        <div style={{ height: `${height}px`, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                {type === 'line' ? (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis 
                            dataKey={nameKey} 
                            stroke="#525252" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#525252" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(v) => `${v}`} 
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #262626', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#00f2fe', fontWeight: 'bold' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey={dataKey} 
                            stroke="#00f2fe" 
                            strokeWidth={3} 
                            dot={{ fill: '#00f2fe', r: 4 }} 
                            activeDot={{ r: 6, strokeWidth: 0 }} 
                        />
                    </LineChart>
                ) : (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis 
                            dataKey={nameKey} 
                            stroke="#525252" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#525252" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #262626', borderRadius: '8px', fontSize: '10px' }}
                        />
                        <Bar dataKey={dataKey} fill="#0d9488" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f2fe' : '#0d9488'} />
                            ))}
                        </Bar>
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
