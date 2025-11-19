import { useState } from "react";
import { Users, UserPlus, UserCheck, UserX, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatCard } from "./StatCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const userRoleData = [
  { name: "Admin", value: 8, color: "#38a3a5" },
  { name: "Operator", value: 24, color: "#57cc99" },
  { name: "Viewer", value: 45, color: "#80ed99" },
  { name: "Guest", value: 12, color: "#2b9744ff" },
];

const userActivityData = [
  { day: "Mon", active: 65, new: 8 },
  { day: "Tue", active: 72, new: 12 },
  { day: "Wed", active: 68, new: 6 },
  { day: "Thu", active: 78, new: 15 },
  { day: "Fri", active: 82, new: 9 },
  { day: "Sat", active: 45, new: 3 },
  { day: "Sun", active: 38, new: 2 },
];

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@eva.com",
    role: "Admin",
    status: "active",
    lastLogin: "2 hours ago",
    avatar: "",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@eva.com",
    role: "Operator",
    status: "active",
    lastLogin: "1 day ago",
    avatar: "",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@eva.com",
    role: "Operator",
    status: "inactive",
    lastLogin: "1 week ago",
    avatar: "",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@eva.com",
    role: "Viewer",
    status: "active",
    lastLogin: "3 hours ago",
    avatar: "",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.w@eva.com",
    role: "Admin",
    status: "active",
    lastLogin: "30 minutes ago",
    avatar: "",
  },
  {
    id: 6,
    name: "Lisa Brown",
    email: "lisa.brown@eva.com",
    role: "Viewer",
    status: "pending",
    lastLogin: "Never",
    avatar: "",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david.m@eva.com",
    role: "Operator",
    status: "active",
    lastLogin: "5 hours ago",
    avatar: "",
  },
  {
    id: 8,
    name: "Anna Garcia",
    email: "anna.garcia@eva.com",
    role: "Guest",
    status: "inactive",
    lastLogin: "2 weeks ago",
    avatar: "",
  },
];

export function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role.toLowerCase() === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Operator":
        return "default";
      case "Viewer":
        return "secondary";
      case "Guest":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="89"
          change="+12"
          icon={Users}
          // trend="up"
          changeType="positive"
        />
        <StatCard
          title="Active Users"
          value="67"
          change="+8"
          icon={UserCheck}
          // trend="up"
          changeType="positive"
        />
        <StatCard
          title="New This Week"
          value="15"
          change="+3"
          icon={UserPlus}
          // trend="up"
          changeType="positive"
        />
        <StatCard
          title="Inactive Users"
          value="7"
          change="-2"
          icon={UserX}
          // trend="down"
          changeType="negative"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Roles Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Weekly User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="active" fill="#38a3a5" name="Active Users" />
                <Bar dataKey="new" fill="#57CC99" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Directory
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-primary text-white text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Recent User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-green-600">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">John Smith logged in</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="outline" className="border-green-300 text-green-700">
                Login
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">LB</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Lisa Brown account created</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                Created
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-yellow-100 text-yellow-600">MC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Mike Chen role updated to Operator</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                Updated
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
