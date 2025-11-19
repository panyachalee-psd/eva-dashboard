import { useState } from "react";
import { Radar, Target, AlertTriangle, Signal, Zap, Activity } from "lucide-react";
// Eye
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatCard } from "./StatCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const detectionData = [
  { name: "Vehicles", value: 156, color: "#ff6b35" },
  { name: "Pedestrians", value: 42, color: "#ff8c5a" },
  { name: "Cyclists", value: 28, color: "#ffad7f" },
  { name: "Unknown", value: 15, color: "#ffcfa5" },
];

const radarPerformance = [
  { time: "00:00", accuracy: 98.5, detections: 45 },
  { time: "04:00", accuracy: 97.2, detections: 32 },
  { time: "08:00", accuracy: 99.1, detections: 78 },
  { time: "12:00", accuracy: 98.8, detections: 95 },
  { time: "16:00", accuracy: 97.9, detections: 112 },
  { time: "20:00", accuracy: 98.3, detections: 87 },
];

const radarStations = [
  {
    id: "RD001",
    name: "Radar North",
    location: "Main Highway",
    status: "active",
    range: "500m",
    accuracy: 98.5,
    detections: 156,
  },
  {
    id: "RD002",
    name: "Radar East",
    location: "Industrial Zone",
    status: "active",
    range: "750m",
    accuracy: 97.8,
    detections: 89,
  },
  {
    id: "RD003",
    name: "Radar South",
    location: "City Center",
    status: "warning",
    range: "600m",
    accuracy: 95.2,
    detections: 203,
  },
  {
    id: "RD004",
    name: "Radar West",
    location: "Residential",
    status: "maintenance",
    range: "400m",
    accuracy: 0,
    detections: 0,
  },
];

const speedViolations = [
  { zone: "School Zone", violations: 45, limit: "30 km/h" },
  { zone: "Highway", violations: 78, limit: "100 km/h" },
  { zone: "City Streets", violations: 32, limit: "50 km/h" },
  { zone: "Residential", violations: 18, limit: "40 km/h" },
];

export function RadarDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  // const [selectedRadar, setSelectedRadar] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Radar Monitoring Dashboard</h2>
          <p className="text-muted-foreground">Advanced traffic and object detection system</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Calibrate
          </Button>
          <Button size="sm">Export Data</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Radars"
          value="3"
          change="0"
          // icon={<Radar className="h-5 w-5" />}
          icon={Radar}
          trend="neutral"
        />
        <StatCard
          title="Total Detections"
          value="241"
          change="+12%"
          // icon={<Target className="h-5 w-5" />}
          icon={Target}
          trend="up"
        />
        <StatCard
          title="Average Accuracy"
          value="98.2%"
          change="+0.3%"
          // icon={<Signal className="h-5 w-5" />}
          icon={Signal}
          trend="up"
        />
        <StatCard
          title="Speed Violations"
          value="173"
          change="-8%"
          // icon={<Zap className="h-5 w-5" />}
          icon={Zap}
          trend="down"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Detection Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={detectionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {detectionData.map((entry, index) => (
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
              <Activity className="h-5 w-5" />
              Radar Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={radarPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="accuracy" orientation="left" domain={[95, 100]} />
                <YAxis yAxisId="detections" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="accuracy"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#ff6b35"
                  strokeWidth={2}
                  name="Accuracy (%)"
                />
                <Line
                  yAxisId="detections"
                  type="monotone"
                  dataKey="detections"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  name="Detections"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Radar Stations Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radar className="h-5 w-5" />
            Radar Stations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {radarStations.map((station) => (
              <div
                key={station.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{station.name}</h4>
                  <Badge
                    variant={
                      station.status === "active"
                        ? "default"
                        : station.status === "warning"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {station.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{station.location}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Range:</span>
                    <p className="font-medium">{station.range}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>
                    <p className="font-medium">{station.accuracy}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Detections:</span>
                    <p className="font-medium">{station.detections}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Signal:</span>
                    <p className="font-medium text-green-600">Strong</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Speed Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Speed Violations by Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={speedViolations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="violations" fill="#ff6b35" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-yellow-800">Radar Accuracy Drop</h5>
                  <p className="text-sm text-yellow-600">Radar South showing 95.2% accuracy</p>
                </div>
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  Warning
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-red-800">Station Offline</h5>
                  <p className="text-sm text-red-600">Radar West: Scheduled maintenance</p>
                </div>
                <Badge variant="outline" className="border-red-300 text-red-700">
                  Critical
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-green-800">System Update</h5>
                  <p className="text-sm text-green-600">All systems running latest firmware</p>
                </div>
                <Badge variant="outline" className="border-green-300 text-green-700">
                  Info
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
