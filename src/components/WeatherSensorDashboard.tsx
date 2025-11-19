// import { useState } from "react";
import { Cloud, Wind, Thermometer, Droplets, Eye, Gauge } from "lucide-react";
// , CloudRain, Sun
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatCard } from "./StatCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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

const temperatureData = [
  { time: "00:00", temp: 18, humidity: 65 },
  { time: "04:00", temp: 16, humidity: 72 },
  { time: "08:00", temp: 22, humidity: 58 },
  { time: "12:00", temp: 28, humidity: 45 },
  { time: "16:00", temp: 31, humidity: 42 },
  { time: "20:00", temp: 26, humidity: 55 },
];

const windData = [
  { time: "00:00", speed: 12, direction: 180 },
  { time: "04:00", speed: 8, direction: 165 },
  { time: "08:00", speed: 15, direction: 200 },
  { time: "12:00", speed: 22, direction: 220 },
  { time: "16:00", speed: 28, direction: 240 },
  { time: "20:00", speed: 18, direction: 210 },
];

const sensorStations = [
  {
    id: "WS001",
    name: "Station Alpha",
    location: "North Building",
    status: "active",
    temp: 24,
    humidity: 58,
    windSpeed: 15,
  },
  {
    id: "WS002",
    name: "Station Beta",
    location: "South Campus",
    status: "active",
    temp: 26,
    humidity: 62,
    windSpeed: 12,
  },
  {
    id: "WS003",
    name: "Station Gamma",
    location: "East Wing",
    status: "maintenance",
    temp: 22,
    humidity: 55,
    windSpeed: 8,
  },
  {
    id: "WS004",
    name: "Station Delta",
    location: "West Parking",
    status: "active",
    temp: 25,
    humidity: 60,
    windSpeed: 18,
  },
];

export function WeatherSensorDashboard() {
  // const [selectedStation, setSelectedStation] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Weather Sensor Dashboard</h2>
          <p className="text-muted-foreground">Real-time environmental monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Cloud className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">Configure Alerts</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Stations"
          value="12"
          change="+2"
          // icon={<Gauge className="h-5 w-5" />}
          icon={Gauge}
          trend="up"
        />
        <StatCard
          title="Avg Temperature"
          value="24.5°C"
          change="+1.2°C"
          // icon={<Thermometer className="h-5 w-5" />}
          icon={Thermometer}
          trend="up"
        />
        <StatCard
          title="Humidity"
          value="58%"
          change="-3%"
          // icon={<Droplets className="h-5 w-5" />}
          icon={Droplets}
          trend="down"
        />
        <StatCard
          title="Wind Speed"
          value="15 km/h"
          change="+5 km/h"
          // icon={<Wind className="h-5 w-5" />}
          icon={Wind}
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature & Humidity Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="temp" orientation="left" />
                <YAxis yAxisId="humidity" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temp"
                  stroke="#ff6b35"
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Wind Speed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={windData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="speed"
                  stroke="#ff6b35"
                  fill="#ff6b35"
                  fillOpacity={0.3}
                  name="Wind Speed (km/h)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weather Stations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Stations Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensorStations.map((station) => (
              <div
                key={station.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{station.name}</h4>
                  <Badge variant={station.status === "active" ? "default" : "secondary"}>
                    {station.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{station.location}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      Temperature
                    </span>
                    <span className="font-medium">{station.temp}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      Humidity
                    </span>
                    <span className="font-medium">{station.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Wind className="h-3 w-3" />
                      Wind Speed
                    </span>
                    <span className="font-medium">{station.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Weather Alerts & Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div>
                <h5 className="font-medium text-yellow-800">High Wind Speed Alert</h5>
                <p className="text-sm text-yellow-600">
                  Station Delta: Wind speed exceeding 25 km/h
                </p>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <div>
                <h5 className="font-medium text-blue-800">Low Humidity Warning</h5>
                <p className="text-sm text-blue-600">Station Alpha: Humidity below 40%</p>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                Monitoring
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
              <div>
                <h5 className="font-medium text-red-800">Station Offline</h5>
                <p className="text-sm text-red-600">Station Gamma: Maintenance mode active</p>
              </div>
              <Badge variant="outline" className="border-red-300 text-red-700">
                Critical
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
