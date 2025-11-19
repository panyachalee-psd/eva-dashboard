import {
  Gauge,
  Zap,
  Thermometer,
  Wifi,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const sensorData = [
  { time: "00:00", temperature: 22, humidity: 65, speed: 45 },
  { time: "04:00", temperature: 20, humidity: 70, speed: 35 },
  { time: "08:00", temperature: 25, humidity: 60, speed: 78 },
  { time: "12:00", temperature: 28, humidity: 55, speed: 85 },
  { time: "16:00", temperature: 30, humidity: 50, speed: 92 },
  { time: "20:00", temperature: 26, humidity: 58, speed: 67 },
];

const iotDevices = [
  {
    id: "SPD-001",
    name: "Speed Enforcement Cam 1",
    location: "Highway A",
    status: "online",
    lastUpdate: "2 min ago",
    violations: 12,
  },
  {
    id: "SPD-002",
    name: "Speed Enforcement Cam 2",
    location: "School Zone B",
    status: "online",
    lastUpdate: "1 min ago",
    violations: 8,
  },
  {
    id: "SPD-003",
    name: "Speed Enforcement Cam 3",
    location: "Downtown",
    status: "offline",
    lastUpdate: "15 min ago",
    violations: 0,
  },
  {
    id: "ENV-001",
    name: "Environmental Sensor 1",
    location: "Building A",
    status: "online",
    lastUpdate: "30 sec ago",
    violations: 0,
  },
  {
    id: "ENV-002",
    name: "Environmental Sensor 2",
    location: "Building B",
    status: "online",
    lastUpdate: "45 sec ago",
    violations: 2,
  },
];

const speedViolations = [
  { time: "00:00", violations: 2 },
  { time: "04:00", violations: 1 },
  { time: "08:00", violations: 15 },
  { time: "12:00", violations: 28 },
  { time: "16:00", violations: 35 },
  { time: "20:00", violations: 18 },
];

export function IoTDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">IoT Tools & Monitoring</h2>
        <p className="text-muted-foreground">
          Monitor and control IoT devices including speed enforcement systems
        </p>
      </div>

      {/* IoT Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Devices"
          value="156"
          change="+8 new devices"
          changeType="positive"
          icon={Gauge}
        />
        <StatCard
          title="Online Devices"
          value="148"
          change="94.9% uptime"
          changeType="positive"
          icon={Wifi}
        />
        <StatCard
          title="Speed Violations"
          value="342"
          change="Today's count"
          changeType="neutral"
          icon={Zap}
        />
        <StatCard
          title="Avg Temperature"
          value="24.5°C"
          change="+1.2°C from yesterday"
          changeType="neutral"
          icon={Thermometer}
        />
      </div>

      {/* Real-time Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environmental Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#38a3a5"
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#57cc99"
                  strokeWidth={2}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Speed Enforcement Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={speedViolations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="violations"
                  stroke="#38a3a5"
                  fill="#38a3a5"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Device Management</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Gauge className="w-4 h-4 mr-2" />
              Add Device
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Alerts</TableHead>
                <TableHead>Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iotDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground">{device.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{device.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={device.status === "online" ? "default" : "destructive"}>
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{device.lastUpdate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {device.violations > 0 ? (
                      <Badge variant="destructive">{device.violations}</Badge>
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={device.status === "online"} />
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Speed Enforcement Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Speed Enforcement Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Zone Configuration</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">School Zone (25 mph)</span>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Highway (65 mph)</span>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Downtown (35 mph)</span>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Alert Thresholds</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warning (+10 mph)</span>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Citation (+15 mph)</span>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency (+25 mph)</span>
                  <Switch checked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Recent Violations</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>45 mph in 25 mph zone</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>38 mph in 25 mph zone</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>78 mph in 65 mph zone</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
