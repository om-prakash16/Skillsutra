"use client";

import React from "react";
import { CanvasBlock } from "../canvas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDynamicData } from "../../hooks/use-dynamic-data";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Cell } from "recharts";
import { Star, Database, Loader2, LineChart as LineChartIcon } from "lucide-react";

const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
];
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CollectionListRenderer: React.FC<{ props: any, blockId: string }> = ({ props }) => {
  const { data, loading, error } = useDynamicData(props.collection, props.limit || 5);
  
  return (
    <div className="w-full my-4 border border-border bg-card rounded-xl p-6 shadow-sm relative min-h-[150px]">
       <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="text-[10px]"><Database className="w-3 h-3 mr-1" /> Dynamic: {props.collection || 'None'}</Badge>
       </div>
       <h3 className="font-bold mb-4">{props.title || 'Dynamic Collection'}</h3>
       
       {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div>
       ) : error ? (
          <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-sm">{error}</div>
       ) : data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl text-sm">No items found in {props.collection}</div>
       ) : (
          <div className="space-y-3">
             {data.map((item: any, i: number) => (
                <div key={item.id || i} className="p-3 border border-border rounded-lg bg-muted/20 text-sm flex flex-col gap-1">
                   <div className="font-bold text-primary">{item.title || item.name || item.slug || `Item ${i}`}</div>
                   <div className="text-xs text-muted-foreground line-clamp-2">{JSON.stringify(item).substring(0, 100)}...</div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};

export const DataRenderers: Record<string, React.FC<{ props: any, blockId: string, children?: React.ReactNode }>> = {
  // Data Display
  data_table: ({ props }) => (
    <div className="w-full border border-border rounded-xl overflow-hidden my-4 bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {(props.columns || ['ID', 'Name', 'Status']).map((c: string) => <TableHead key={c} className="font-bold">{c}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1,2,3].map(i => (
            <TableRow key={i}>
              <TableCell className="font-medium">#{1000 + i}</TableCell>
              <TableCell>User {i}</TableCell>
              <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  advanced_table: ({ props }) => (
    <div className="w-full border border-border rounded-xl overflow-hidden my-4 bg-card shadow-sm">
       <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
          <div className="font-bold text-sm">Advanced Data Grid</div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="h-8 text-xs">Filter</Button>
             <Button variant="outline" size="sm" className="h-8 text-xs">Export</Button>
          </div>
       </div>
       <Table>
          <TableHeader className="bg-muted/50">
             <TableRow>
               {['Select', 'ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(c => <TableHead key={c} className="font-bold text-xs">{c}</TableHead>)}
             </TableRow>
          </TableHeader>
          <TableBody>
             {[1,2,3,4].map(i => (
                <TableRow key={i}>
                   <TableCell><input type="checkbox" className="rounded" /></TableCell>
                   <TableCell className="font-medium text-xs">PROD-{i}K</TableCell>
                   <TableCell className="text-xs">Enterprise Item {i}</TableCell>
                   <TableCell className="text-xs">Software</TableCell>
                   <TableCell className="text-xs">${(i * 1200).toLocaleString()}</TableCell>
                   <TableCell className="text-xs">{i * 12}</TableCell>
                   <TableCell><Badge variant="outline" className="text-[10px]">In Stock</Badge></TableCell>
                   <TableCell className="text-xs font-medium text-primary cursor-pointer">Edit</TableCell>
                </TableRow>
             ))}
          </TableBody>
       </Table>
       <div className="p-3 border-t border-border bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
          <span>Showing 1 to 4 of 240 entries</span>
          <div className="flex gap-1">
             <Button variant="ghost" size="sm" className="h-7 px-2">Prev</Button>
             <Button variant="outline" size="sm" className="h-7 px-2">1</Button>
             <Button variant="ghost" size="sm" className="h-7 px-2">2</Button>
             <Button variant="ghost" size="sm" className="h-7 px-2">Next</Button>
          </div>
       </div>
    </div>
  ),
  pivot_table: ({ props }) => (
    <div className="w-full border border-border rounded-xl p-6 my-4 bg-card shadow-sm flex flex-col items-center justify-center min-h-[200px] text-center">
       <Star className="w-8 h-8 text-primary mb-3 opacity-80" />
       <h4 className="font-bold">Pivot Table Engine</h4>
       <p className="text-xs text-muted-foreground mt-1 max-w-sm">Drag and drop dimensions to generate real-time aggregations from your dataset.</p>
    </div>
  ),
  tree_grid: ({ props }) => (
    <div className="w-full border border-border rounded-xl p-6 my-4 bg-card shadow-sm min-h-[200px]">
       <h4 className="font-bold mb-4 border-b border-border pb-2">Organization Tree Grid</h4>
       <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 font-medium"><span className="w-4 h-4 flex items-center justify-center bg-muted rounded cursor-pointer">-</span> 📁 Engineering Dept</div>
          <div className="flex items-center gap-2 ml-6 text-muted-foreground"><span className="w-4 h-4 flex items-center justify-center bg-muted rounded cursor-pointer">-</span> 📁 Frontend Team</div>
          <div className="flex items-center gap-2 ml-12 text-muted-foreground">👤 Alice (Lead)</div>
          <div className="flex items-center gap-2 ml-12 text-muted-foreground">👤 Bob (Senior)</div>
          <div className="flex items-center gap-2 ml-6 text-muted-foreground"><span className="w-4 h-4 flex items-center justify-center bg-muted rounded cursor-pointer">+</span> 📁 Backend Team</div>
       </div>
    </div>
  ),
  kanban: ({ props }) => (
    <div className="w-full flex gap-4 overflow-x-auto custom-scrollbar my-4 pb-2">
       {(props.columns || ['To Do', 'In Progress', 'Done']).map((col: string, i: number) => (
         <div key={i} className="min-w-[280px] flex-1 bg-muted/20 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
               <h4 className="font-bold text-sm">{col}</h4>
               <Badge variant="secondary">{i === 0 ? 2 : 1}</Badge>
            </div>
            <div className="bg-card border border-border p-4 rounded-lg mb-3 shadow-sm hover:shadow transition-shadow cursor-grab">
               <p className="text-sm font-medium mb-2">Implement Phase 3</p>
               <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Development</span>
                  <Avatar className="w-6 h-6"><div className="w-full h-full bg-primary/20 text-primary flex items-center justify-center font-bold">A</div></Avatar>
               </div>
            </div>
            {i === 0 && (
              <div className="bg-card border border-border p-4 rounded-lg shadow-sm hover:shadow transition-shadow cursor-grab">
                 <p className="text-sm font-medium mb-2">Write Tests</p>
                 <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>QA</span>
                 </div>
              </div>
            )}
         </div>
       ))}
    </div>
  ),
  kpi_card: ({ props }) => (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm my-2 flex flex-col justify-between hover:shadow-md transition-shadow">
       <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{props.title || 'Total Revenue'}</h3>
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><Star className="w-4 h-4" /></div>
       </div>
       <div>
          <div className="text-3xl font-black tracking-tight">{props.value || '$45,231'}</div>
          <div className="text-sm font-bold text-green-500 mt-1 flex items-center gap-1">
             <span>↑</span> {props.trend || '+20.1%'} <span className="text-muted-foreground font-normal ml-1">from last month</span>
          </div>
       </div>
    </div>
  ),

  // Charts
  chart_line: ({ props }) => (
    <div className="w-full p-6 bg-card border border-border rounded-2xl shadow-sm my-4 h-[350px] flex flex-col">
       <h3 className="font-bold mb-4">{props.title || 'Line Analytics'}</h3>
       <div className="flex-1 min-h-0 w-full">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={mockChartData}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
             <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
             <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
             <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }} activeDot={{ r: 8 }} />
           </LineChart>
         </ResponsiveContainer>
       </div>
    </div>
  ),
  chart_bar: ({ props }) => (
    <div className="w-full p-6 bg-card border border-border rounded-2xl shadow-sm my-4 h-[350px] flex flex-col">
       <h3 className="font-bold mb-4">{props.title || 'Bar Analytics'}</h3>
       <div className="flex-1 min-h-0 w-full">
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={mockChartData}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
             <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
             <RechartsTooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
             <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
           </BarChart>
         </ResponsiveContainer>
       </div>
    </div>
  ),
  chart_pie: ({ props }) => (
    <div className="w-full p-6 bg-card border border-border rounded-2xl shadow-sm my-4 h-[350px] flex flex-col">
       <h3 className="font-bold mb-4">{props.title || 'Pie Analytics'}</h3>
       <div className="flex-1 min-h-0 w-full flex items-center justify-center">
         <ResponsiveContainer width="100%" height="100%">
           <PieChart>
             <Pie data={mockChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
               {mockChartData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
               ))}
             </Pie>
             <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
           </PieChart>
         </ResponsiveContainer>
       </div>
    </div>
  ),
  chart_waterfall: ({ props }) => (
    <div className="w-full p-6 bg-card border border-border rounded-2xl shadow-sm my-4 h-[350px] flex flex-col items-center justify-center text-center">
       <BarChart className="w-8 h-8 text-primary mb-3 opacity-80" />
       <h3 className="font-bold">Waterfall Chart</h3>
       <p className="text-xs text-muted-foreground mt-1">Visualize cumulative impact of sequentially introduced positive or negative values.</p>
    </div>
  ),
  chart_candlestick: ({ props }) => (
    <div className="w-full p-6 bg-card border border-border rounded-2xl shadow-sm my-4 h-[350px] flex flex-col items-center justify-center text-center">
       <LineChartIcon className="w-8 h-8 text-primary mb-3 opacity-80" />
       <h3 className="font-bold">Candlestick Chart</h3>
       <p className="text-xs text-muted-foreground mt-1">Advanced financial charting for open, high, low, close (OHLC) tracking.</p>
    </div>
  ),

  // CMS
  collection_list: CollectionListRenderer,
  dynamic_grid: ({ props }) => (
    <div className="w-full p-8 border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl my-4 text-center">
       <span className="text-3xl mb-3 block">🗄️</span>
       <h3 className="font-bold text-lg text-primary">{props.collection || 'Products'} Dynamic Grid</h3>
       <p className="text-sm text-primary/70 mt-1">Dynamic items will render here from your database.</p>
       <Button variant="outline" className="mt-4 bg-background">Configure Binding</Button>
    </div>
  ),
};
