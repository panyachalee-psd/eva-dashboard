import {
  Navigation,
  Car,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Clock,
  Route,
  TrafficCone,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const trafficFlowData = [
  { month: "Jan", vehicles: 12000, avgSpeed: 85 },
  { month: "Feb", vehicles: 13500, avgSpeed: 88 },
  { month: "Mar", vehicles: 14800, avgSpeed: 82 },
  { month: "Apr", vehicles: 16200, avgSpeed: 87 },
  { month: "May", vehicles: 17500, avgSpeed: 90 },
  { month: "Jun", vehicles: 18470, avgSpeed: 84 },
];

const laneStatusData = [
  { name: "Active Lanes", value: 85, color: "#22c55e" },
  { name: "Under Maintenance", value: 8, color: "#f59e0b" },
  { name: "Closed Lanes", value: 5, color: "#ef4444" },
  { name: "Emergency Use", value: 2, color: "#ff6b35" },
];

const laneData = [
  {
    id: "L001",
    name: "Highway A1 - North Bound",
    type: "Express",
    lanes: 4,
    status: "active",
    vehicles: 1450,
    avgSpeed: 85,
    incidents: 0,
  },
  {
    id: "L002",
    name: "Highway A1 - South Bound",
    type: "Express",
    lanes: 4,
    status: "active",
    vehicles: 1680,
    avgSpeed: 82,
    incidents: 1,
  },
  {
    id: "L003",
    name: "City Center - Main Street",
    type: "Urban",
    lanes: 3,
    status: "maintenance",
    vehicles: 890,
    avgSpeed: 45,
    incidents: 0,
  },
  {
    id: "L004",
    name: "Industrial Zone - Route 15",
    type: "Arterial",
    lanes: 2,
    status: "active",
    vehicles: 650,
    avgSpeed: 75,
    incidents: 0,
  },
  {
    id: "L005",
    name: "School Zone - Oak Avenue",
    type: "Local",
    lanes: 2,
    status: "restricted",
    vehicles: 320,
    avgSpeed: 30,
    incidents: 0,
  },
];

export function LMSDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Lane Management System</h2>
        <p className="text-muted-foreground">
          Monitor and control traffic lanes and road infrastructure
        </p>
      </div>

      {/* LMS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Lanes"
          value="147"
          change="+3 new lanes"
          changeType="positive"
          icon={Route}
        />
        <StatCard
          title="Active Routes"
          value="52"
          change="98% operational"
          changeType="positive"
          icon={Navigation}
        />
        <StatCard
          title="Traffic Flow"
          value="18.4K"
          change="+12% vehicles/day"
          changeType="positive"
          icon={Car}
        />
        <StatCard
          title="Avg Speed"
          value="78 km/h"
          change="Within normal range"
          changeType="neutral"
          icon={Clock}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Flow & Speed Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#80ed99"
                  strokeWidth={2}
                  name="Vehicles (thousands)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgSpeed"
                  stroke="#57cc99"
                  strokeWidth={2}
                  name="Avg Speed (km/h)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lane Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={laneStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {laneStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lane Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lane Management</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <TrafficCone className="w-4 h-4 mr-2" />
              Traffic Control
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lane/Route</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Traffic</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laneData.map((lane) => (
                <TableRow key={lane.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lane.name}</p>
                      <p className="text-sm text-muted-foreground">{lane.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lane.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Route className="w-4 h-4 text-muted-foreground" />
                      <span>{lane.lanes} lanes</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <span>{lane.vehicles.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{lane.avgSpeed} km/h</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lane.status === "active"
                          ? "default"
                          : lane.status === "maintenance"
                            ? "secondary"
                            : lane.status === "restricted"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {lane.status}
                    </Badge>
                    {lane.incidents > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {lane.incidents} incident{lane.incidents > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        Control
                      </Button>
                      <Button variant="ghost" size="sm">
                        Monitor
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lane Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Lane Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Lane reopened after maintenance</p>
                  <p className="text-sm text-muted-foreground">
                    Highway A1 North - Lane 3 • 45 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <TrafficCone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Traffic diversion activated</p>
                  <p className="text-sm text-muted-foreground">
                    Main Street construction zone • 2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Peak traffic detected</p>
                  <p className="text-sm text-muted-foreground">
                    Industrial Zone - Route 15 • 3 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Incident reported</p>
                  <p className="text-sm text-muted-foreground">
                    Highway A1 South - Minor collision cleared • 4 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Speed limit updated</p>
                  <p className="text-sm text-muted-foreground">
                    School Zone - Oak Avenue reduced to 30 km/h • 6 hours ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Traffic Sensors</span>
                  <span className="text-sm text-muted-foreground">94% operational</span>
                </div>
                <Progress value={94} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Lane Controllers</span>
                  <span className="text-sm text-muted-foreground">98% online</span>
                </div>
                <Progress value={98} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Communication Network</span>
                  <span className="text-sm text-muted-foreground">99% uptime</span>
                </div>
                <Progress value={99} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Data Processing</span>
                  <span className="text-sm text-muted-foreground">87% capacity</span>
                </div>
                <Progress value={87} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
