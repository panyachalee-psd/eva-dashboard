import {
  Monitor,
  MessageSquare,
  Zap,
  MapPin,
  AlertCircle,
  Edit,
  Eye,
  Power,
  Wifi,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// , LineChart, Line

const messageUpdateData = [
  { time: "00:00", updates: 4 },
  { time: "04:00", updates: 2 },
  { time: "08:00", updates: 12 },
  { time: "12:00", updates: 18 },
  { time: "16:00", updates: 25 },
  { time: "20:00", updates: 15 },
];

const vmsData = [
  {
    id: "VMS-001",
    location: "Highway A1 North - Km 15",
    status: "online",
    message: "TRAFFIC MOVING SMOOTHLY",
    type: "LED Matrix",
    brightness: 85,
    lastUpdate: "2 min ago",
  },
  {
    id: "VMS-002",
    location: "City Center - Main Junction",
    status: "online",
    message: "ROADWORK AHEAD - USE ALT ROUTE",
    type: "Full Color",
    brightness: 90,
    lastUpdate: "15 min ago",
  },
  {
    id: "VMS-003",
    location: "Highway A1 South - Km 22",
    status: "maintenance",
    message: "SYSTEM MAINTENANCE",
    type: "LED Matrix",
    brightness: 0,
    lastUpdate: "2 hours ago",
  },
  {
    id: "VMS-004",
    location: "Industrial Zone - Route 15",
    status: "online",
    message: "SPEED LIMIT 60 KM/H",
    type: "Monochrome",
    brightness: 75,
    lastUpdate: "30 min ago",
  },
  {
    id: "VMS-005",
    location: "School Zone - Oak Avenue",
    status: "online",
    message: "SCHOOL ZONE - REDUCE SPEED",
    type: "Full Color",
    brightness: 95,
    lastUpdate: "5 min ago",
  },
];

const messageTemplates = [
  { id: 1, name: "Traffic Alert", message: "TRAFFIC CONGESTION AHEAD", category: "Traffic" },
  { id: 2, name: "Weather Warning", message: "HEAVY RAIN - DRIVE CAREFULLY", category: "Weather" },
  { id: 3, name: "Road Work", message: "ROADWORK AHEAD - MERGE LEFT", category: "Construction" },
  { id: 4, name: "Speed Limit", message: "SPEED LIMIT 80 KM/H", category: "Regulatory" },
  { id: 5, name: "Emergency", message: "EMERGENCY VEHICLES - MOVE RIGHT", category: "Emergency" },
];

export function VMSDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Variable Message Signs</h2>
        <p className="text-muted-foreground">
          Control and monitor digital traffic signs across the road network
        </p>
      </div>

      {/* VMS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Signs"
          value="84"
          change="+6 new signs"
          changeType="positive"
          icon={Monitor}
        />
        <StatCard
          title="Online Signs"
          value="78"
          change="92.8% uptime"
          changeType="positive"
          icon={Wifi}
        />
        <StatCard
          title="Active Messages"
          value="45"
          change="Real-time updates"
          changeType="neutral"
          icon={MessageSquare}
        />
        <StatCard
          title="Updates Today"
          value="127"
          change="+23 from yesterday"
          changeType="positive"
          icon={Zap}
        />
      </div>

      {/* Live Message Display Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Message Display</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Update Messages
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview Mode
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vmsData.slice(0, 6).map((vms) => (
              <div
                key={vms.id}
                className="relative bg-gray-900 rounded-lg p-4 min-h-[200px] flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {vms.id}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        vms.status === "online"
                          ? "bg-green-500 animate-pulse"
                          : vms.status === "maintenance"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-xs text-white">{vms.brightness}%</span>
                  </div>
                </div>

                {/* Digital Sign Display */}
                <div className="flex-1 bg-black border-2 border-orange-400 rounded p-3 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-sm font-mono leading-tight">
                      {vms.message.split(" ").map((word, idx) => (
                        <div key={idx} className="mb-1">
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-white/70 mb-2">{vms.location}</div>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs text-white/70">
                      {vms.type}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 text-white hover:bg-white/20"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 text-white hover:bg-white/20"
                      >
                        <Power className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Update Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Message Updates (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messageUpdateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="updates" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Message Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Message Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messageTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h5 className="font-medium">{template.name}</h5>
                    <p className="text-sm text-muted-foreground font-mono">{template.message}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      Deploy
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VMS Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sign Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sign ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Current Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vmsData.map((vms) => (
                <TableRow key={vms.id}>
                  <TableCell className="font-medium">{vms.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{vms.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs bg-muted p-1 rounded max-w-[200px] truncate">
                      {vms.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{vms.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        vms.status === "online"
                          ? "default"
                          : vms.status === "maintenance"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {vms.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vms.lastUpdate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Power className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Message updated on Highway A1 North</p>
                <p className="text-sm text-muted-foreground">
                  Changed to {'"TRAFFIC MOVING SMOOTHLY"'} • 2 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Emergency message deployed</p>
                <p className="text-sm text-muted-foreground">
                  City Center signs showing road closure alert • 15 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Sign back online</p>
                <p className="text-sm text-muted-foreground">
                  VMS-003 maintenance completed successfully • 2 hours ago
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Brightness adjusted</p>
                <p className="text-sm text-muted-foreground">
                  Auto-brightness enabled for all highway signs • 3 hours ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
