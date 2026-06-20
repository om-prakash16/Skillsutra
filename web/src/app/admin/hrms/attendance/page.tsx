"use client";

import React, { useState } from "react";
import { 
  Clock, MapPin, Search, Calendar, History, Fingerprint, Activity, Moon, Sun, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const todayAttendance = [
  { id: "A-001", employee: "Sarah Jenkins", role: "Engineering", shift: "Morning (09:00 - 17:00)", checkIn: "08:45 AM", checkOut: "--", status: "Present", location: "San Francisco HQ (Office)", initial: "SJ" },
  { id: "A-002", employee: "Michael Chang", role: "Product", shift: "Morning (09:00 - 17:00)", checkIn: "09:12 AM", checkOut: "--", status: "Late", location: "Remote (NY) - IP Verified", initial: "MC" },
  { id: "A-003", employee: "James Rodriguez", role: "Engineering", shift: "Night (22:00 - 06:00)", checkIn: "21:50 PM (Yesterday)", checkOut: "06:15 AM", status: "Completed", location: "Remote (ESP)", initial: "JR" },
  { id: "A-004", employee: "David Foster", role: "Sales", shift: "Morning (09:00 - 17:00)", checkIn: "--", checkOut: "--", status: "Absent", location: "--", initial: "DF" },
];

export default function AttendancePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time & Attendance</h1>
          <p className="text-muted-foreground mt-1">Real-time attendance tracking, shifts, and timesheets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> Schedule Shift</Button>
          <Button><History className="w-4 h-4 mr-2" /> Timesheets</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">142</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 165 active employees</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Late Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">12</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">3</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">8</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="bg-muted/50 border border-border/50 p-1 mb-4">
          <TabsTrigger value="today" className="rounded-md">Today's Attendance</TabsTrigger>
          <TabsTrigger value="shifts" className="rounded-md">Shift Planner</TabsTrigger>
          <TabsTrigger value="timesheets" className="rounded-md">Timesheet Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search employee..." className="pl-9 bg-muted/50" />
              </div>
              <Button variant="ghost" size="sm" className="text-primary"><Activity className="w-4 h-4 mr-2" /> Live Map View</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Location Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{record.initial}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{record.employee}</span>
                            <div className="text-xs text-muted-foreground">{record.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          {record.shift.includes("Morning") ? <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 mr-1.5 text-blue-500" />}
                          {record.shift}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{record.checkIn}</TableCell>
                      <TableCell className="font-medium text-sm text-muted-foreground">{record.checkOut}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {record.location.includes("Remote") ? <Fingerprint className="w-3.5 h-3.5 mr-1.5" /> : <MapPin className="w-3.5 h-3.5 mr-1.5" />}
                          {record.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          record.status === "Present" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          record.status === "Completed" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                          record.status === "Late" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                          "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        }>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
