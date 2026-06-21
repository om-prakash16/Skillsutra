"use client";

import React, { useState } from "react";
import { 
  Users, Search, Filter, Download, Mail, Phone, MapPin, Briefcase, ChevronDown, UserPlus, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

const mockEmployees = [
  { id: "EMP001", name: "Sarah Jenkins", role: "Senior Frontend Engineer", department: "Engineering", location: "San Francisco, CA", status: "Active", email: "sarah.j@company.com", phone: "+1 (555) 123-4567" },
  { id: "EMP002", name: "Michael Chang", role: "Product Manager", department: "Product", location: "Remote (NY)", status: "Active", email: "michael.c@company.com", phone: "+1 (555) 234-5678" },
  { id: "EMP003", name: "Emma Wilson", role: "UX Designer", department: "Design", location: "London, UK", status: "On Leave", email: "emma.w@company.com", phone: "+44 20 7123 4567" },
  { id: "EMP004", name: "David Foster", role: "Account Executive", department: "Sales", location: "Austin, TX", status: "Active", email: "david.f@company.com", phone: "+1 (555) 345-6789" },
  { id: "EMP005", name: "Lisa Thompson", role: "HR Director", department: "Human Resources", location: "San Francisco, CA", status: "Active", email: "lisa.t@company.com", phone: "+1 (555) 456-7890" },
  { id: "EMP006", name: "James Rodriguez", role: "Backend Developer", department: "Engineering", location: "Remote (ESP)", status: "Active", email: "james.r@company.com", phone: "+34 91 123 4567" },
  { id: "EMP007", name: "Anita Desai", role: "Marketing Lead", department: "Marketing", location: "San Francisco, CA", status: "Active", email: "anita.d@company.com", phone: "+1 (555) 567-8901" },
];

export default function EmployeeDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");

  const filteredEmployees = mockEmployees.filter(emp => 
    (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedDept === "All" || emp.department === selectedDept)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">Manage and search across your entire organization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileSpreadsheet className="w-4 h-4 mr-2" /> Export</Button>
          <Button><UserPlus className="w-4 h-4 mr-2" /> Invite Employee</Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or ID..."
                className="pl-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                    {selectedDept === "All" ? "All Departments" : selectedDept}
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={selectedDept === "All"} onCheckedChange={() => setSelectedDept("All")}>All Departments</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={selectedDept === "Engineering"} onCheckedChange={() => setSelectedDept("Engineering")}>Engineering</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={selectedDept === "Product"} onCheckedChange={() => setSelectedDept("Product")}>Product</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={selectedDept === "Design"} onCheckedChange={() => setSelectedDept("Design")}>Design</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={selectedDept === "Sales"} onCheckedChange={() => setSelectedDept("Sales")}>Sales</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={selectedDept === "Marketing"} onCheckedChange={() => setSelectedDept("Marketing")}>Marketing</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={selectedDept === "Human Resources"} onCheckedChange={() => setSelectedDept("Human Resources")}>Human Resources</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>More Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Active Employees</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>On Leave</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Contractors</DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Clear Filters</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Employee</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp.id} className="group hover:bg-muted/20 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-primary/5 text-primary font-medium">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{emp.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="text-primary/70 font-mono">{emp.id}</span> • {emp.role}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <Mail className="w-3.5 h-3.5 mr-1.5" /> {emp.email}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 mr-1.5" /> {emp.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
                    {emp.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" /> {emp.location}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={emp.status === "Active" ? "default" : "secondary"}
                    className={emp.status === "Active" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-600"}
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No employees found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
