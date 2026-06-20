import React from "react";
import { Activity, ArrowUpRight, DollarSign, Users, HardDrive, Cpu, Network, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const DashboardRenderers: Record<string, React.FC<{ props: any, blockId: string }>> = {
  dashboard_stats: ({ props }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-4 w-full">
      {[
        { title: 'Total Revenue', value: '$45,231.89', icon: DollarSign, trend: '+20.1% from last month' },
        { title: 'Subscriptions', value: '+2350', icon: Users, trend: '+180.1% from last month' },
        { title: 'Sales', value: '+12,234', icon: CreditCard, trend: '+19% from last month' },
        { title: 'Active Now', value: '+573', icon: Activity, trend: '+201 since last hour' },
      ].map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  dashboard_revenue: ({ props }) => (
    <Card className="my-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue Card</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$12,431.00</div>
        <div className="h-[80px] w-full mt-4 flex items-end gap-1">
          {[40, 25, 60, 30, 80, 45, 90].map((h, i) => (
            <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  ),
  dashboard_users: ({ props }) => (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">U{i}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">User {i}</p>
              <p className="text-sm text-muted-foreground">user{i}@example.com</p>
            </div>
            <div className="font-medium">+$1,999.00</div>
          </div>
        ))}
      </CardContent>
    </Card>
  ),
  dashboard_activity: ({ props }) => (
    <Card className="my-4 w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="mt-1 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">System Update Completed</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  ),
  dashboard_storage: ({ props }) => (
    <Card className="my-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
        <HardDrive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">124.5 GB / 500 GB</div>
        <Progress value={25} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">25% capacity reached</p>
      </CardContent>
    </Card>
  ),
  dashboard_cpu: ({ props }) => (
    <Card className="my-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
        <Cpu className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">42%</div>
        <div className="flex gap-1 h-8">
          {[20, 30, 45, 60, 42, 35, 42].map((h, i) => (
             <div key={i} className="flex-1 bg-primary/20 rounded flex items-end">
                <div className="w-full bg-primary rounded-b" style={{ height: `${h}%` }} />
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
  dashboard_network: ({ props }) => (
    <Card className="my-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
        <Network className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">1.2 TB <span className="text-sm font-normal text-muted-foreground">in/out</span></div>
        <div className="w-full h-12 bg-muted/20 border border-border rounded-lg flex items-center justify-center">
           <span className="text-xs text-muted-foreground">Network Graph Placeholder</span>
        </div>
      </CardContent>
    </Card>
  ),
};

const CreditCard = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
