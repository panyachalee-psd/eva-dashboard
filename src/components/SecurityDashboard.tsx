import { Shield, AlertTriangle, Lock, Eye, UserCheck, Activity } from "lucide-react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const threatData = [
  { time: "00:00", threats: 2, blocked: 8 },
  { time: "04:00", threats: 1, blocked: 3 },
  { time: "08:00", threats: 5, blocked: 12 },
  { time: "12:00", threats: 8, blocked: 18 },
  { time: "16:00", threats: 12, blocked: 25 },
  { time: "20:00", threats: 6, blocked: 15 },
];

const accessData = [
  { hour: "00", successful: 45, failed: 3 },
  { hour: "06", successful: 120, failed: 8 },
  { hour: "12", successful: 280, failed: 15 },
  { hour: "18", successful: 195, failed: 7 },
];

const securityEvents = [
  {
    id: "SEC-001",
    type: "Unauthorized Access",
    location: "Server Room",
    severity: "high",
    time: "2 min ago",
    status: "investigating",
  },
  {
    id: "SEC-002",
    type: "Failed Login Attempt",
    location: "Admin Panel",
    severity: "medium",
    time: "5 min ago",
    status: "blocked",
  },
  {
    id: "SEC-003",
    type: "Suspicious Activity",
    location: "Parking Lot",
    severity: "low",
    time: "12 min ago",
    status: "monitoring",
  },
  {
    id: "SEC-004",
    type: "Access Granted",
    location: "Main Entrance",
    severity: "info",
    time: "15 min ago",
    status: "completed",
  },
  {
    id: "SEC-005",
    type: "System Alert",
    location: "Network",
    severity: "medium",
    time: "18 min ago",
    status: "resolved",
  },
];

export function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Security Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor security threats and access control across all systems
        </p>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Security Level"
          value="High"
          change="All systems secure"
          changeType="positive"
          icon={Shield}
        />
        <StatCard
          title="Active Threats"
          value="3"
          change="-2 from yesterday"
          changeType="positive"
          icon={AlertTriangle}
        />
        <StatCard
          title="Access Attempts"
          value="1,247"
          change="97.8% success rate"
          changeType="positive"
          icon={UserCheck}
        />
        <StatCard
          title="Blocked Attacks"
          value="47"
          change="Today's count"
          changeType="neutral"
          icon={Lock}
        />
      </div>

      {/* Security Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Threat Detection (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stackId="1"
                  stroke="#ff6b35"
                  fill="#ff6b35"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stackId="1"
                  stroke="#ff8c5a"
                  fill="#ff8c5a"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access Control Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="successful" fill="#ff6b35" />
                <Bar dataKey="failed" fill="#ff8c5a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Security Events</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Live Monitor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.id}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.severity === "high"
                          ? "destructive"
                          : event.severity === "medium"
                            ? "secondary"
                            : event.severity === "low"
                              ? "outline"
                              : "default"
                      }
                    >
                      {event.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{event.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "completed" || event.status === "resolved"
                          ? "default"
                          : event.status === "blocked"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Investigate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>VMS Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Camera Encryption</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Access Control</span>
              <Badge variant="default">Secure</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Integrity</span>
              <Badge variant="default">Verified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Network Security</span>
              <Badge variant="secondary">Monitoring</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LMS Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">User Authentication</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Encryption</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Session Management</span>
              <Badge variant="default">Secure</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Content Protection</span>
              <Badge variant="default">Protected</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IoT Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Device Authentication</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Communication Encryption</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Firmware Updates</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Intrusion Detection</span>
              <Badge variant="default">Monitoring</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
