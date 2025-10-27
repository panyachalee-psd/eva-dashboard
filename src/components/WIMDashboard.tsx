import { Scale, TrendingUp, AlertTriangle, CheckCircle, MapPin, Truck, Activity, Database } from "lucide-react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Progress } from "./ui/progress";
import  CustomerTable from "../components/ApiTestProject"
const weightDistributionData = [
  { range: "0-10t", count: 145 },
  { range: "10-20t", count: 320 },
  { range: "20-30t", count: 485 },
  { range: "30-40t", count: 210 },
  { range: "40+t", count: 85 },
];

const hourlyTrafficData = [
  { time: "00:00", vehicles: 45, violations: 2 },
  { time: "04:00", vehicles: 28, violations: 1 },
  { time: "08:00", vehicles: 185, violations: 8 },
  { time: "12:00", vehicles: 245, violations: 12 },
  { time: "16:00", vehicles: 298, violations: 15 },
  { time: "20:00", vehicles: 156, violations: 6 },
];

const axleLoadData = [
  { name: "Front Axle", value: 35 },
  { name: "Rear Axle", value: 45 },
  { name: "Trailer", value: 20 },
];

const COLORS = ['#ff6b35', '#ff8c5a', '#ffad7f'];

const wimStations = [
  { id: "WIM-001", location: "Highway A1 North - Km 25", status: "online", vehicles: 1245, violations: 42, lastReading: "15 sec ago", accuracy: 98.5 },
  { id: "WIM-002", location: "Highway A1 South - Km 30", status: "online", vehicles: 1089, violations: 38, lastReading: "8 sec ago", accuracy: 99.2 },
  { id: "WIM-003", location: "Industrial Zone - Route 15", status: "calibration", vehicles: 0, violations: 0, lastReading: "2 hours ago", accuracy: 0 },
  { id: "WIM-004", location: "Port Access Road - Gate 3", status: "online", vehicles: 892, violations: 28, lastReading: "22 sec ago", accuracy: 97.8 },
  { id: "WIM-005", location: "Border Checkpoint - North", status: "offline", vehicles: 0, violations: 0, lastReading: "5 hours ago", accuracy: 0 },
];

const recentViolations = [
  { id: "V-2024-1547", vehicle: "ABC-1234", type: "Heavy Truck", weight: "45.2t", limit: "40.0t", excess: "5.2t", station: "WIM-001", time: "2 min ago", severity: "high" },
  { id: "V-2024-1546", vehicle: "XYZ-5678", type: "Semi Trailer", weight: "42.8t", limit: "40.0t", excess: "2.8t", station: "WIM-002", time: "8 min ago", severity: "medium" },
  { id: "V-2024-1545", vehicle: "DEF-9012", type: "Heavy Truck", weight: "48.5t", limit: "40.0t", excess: "8.5t", station: "WIM-004", time: "15 min ago", severity: "high" },
  { id: "V-2024-1544", vehicle: "GHI-3456", type: "Truck", weight: "41.5t", limit: "40.0t", excess: "1.5t", station: "WIM-001", time: "32 min ago", severity: "low" },
  { id: "V-2024-1543", vehicle: "JKL-7890", type: "Semi Trailer", weight: "43.2t", limit: "40.0t", excess: "3.2t", station: "WIM-002", time: "45 min ago", severity: "medium" },
];

const recentReadings = [
  { time: "14:23:45", vehicle: "MNO-2468", type: "Truck", weight: "35.2t", axles: 4, speed: "68 km/h", status: "compliant", station: "WIM-001" },
  { time: "14:23:38", vehicle: "PQR-1357", type: "Semi Trailer", weight: "38.5t", axles: 5, speed: "72 km/h", status: "compliant", station: "WIM-002" },
  { time: "14:23:22", vehicle: "STU-9753", type: "Heavy Truck", weight: "45.2t", axles: 6, speed: "65 km/h", status: "violation", station: "WIM-001" },
  { time: "14:23:15", vehicle: "VWX-8642", type: "Truck", weight: "32.8t", axles: 4, speed: "70 km/h", status: "compliant", station: "WIM-004" },
  { time: "14:23:08", vehicle: "YZA-3691", type: "Light Truck", weight: "18.5t", axles: 3, speed: "75 km/h", status: "compliant", station: "WIM-002" },
];

export function WIMDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Weight-in-Motion System</h2>
        <p className="text-muted-foreground">Monitor vehicle weights and enforce load limits across the road network</p>
      </div>

      {/* WIM Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Stations"
          value="18"
          change="+2 new stations"
          changeType="positive"
          icon={Scale}
        />
        <StatCard
          title="Vehicles Today"
          value="3,226"
          change="+18% from yesterday"
          changeType="positive"
          icon={Truck}
        />
        <StatCard
          title="Violations Detected"
          value="108"
          change="3.3% violation rate"
          changeType="negative"
          icon={AlertTriangle}
        />
        <StatCard
          title="System Accuracy"
          value="98.5%"
          change="Within spec range"
          changeType="positive"
          icon={Activity}
        />
      </div>

      {/* Live Station Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Station Status</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Scale className="w-4 h-4 mr-2" />
              Calibrate All
            </Button>
            <Button variant="outline" size="sm">
              <Database className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wimStations.map((station) => (
              <div key={station.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{station.id}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{station.location}</p>
                  </div>
                  <Badge variant={
                    station.status === 'online' ? 'default' : 
                    station.status === 'calibration' ? 'secondary' : 'destructive'
                  }>
                    {station.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vehicles Today:</span>
                    <span className="font-medium">{station.vehicles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Violations:</span>
                    <span className="font-medium text-destructive">{station.violations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-medium">{station.accuracy}%</span>
                  </div>
                  {station.accuracy > 0 && (
                    <Progress value={station.accuracy} className="h-2" />
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Last reading: {station.lastReading}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Distribution (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weightDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff6b35" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Traffic & Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic & Violations (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyTrafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="vehicles" stroke="#ff6b35" strokeWidth={2} name="Vehicles" />
                <Line type="monotone" dataKey="violations" stroke="#d4183d" strokeWidth={2} name="Violations" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Axle Load Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Axle Load Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={axleLoadData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {axleLoadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Stations Online</span>
                  <span className="text-sm font-medium">15/18 (83.3%)</span>
                </div>
                <Progress value={83.3} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Data Quality</span>
                  <span className="text-sm font-medium">98.5%</span>
                </div>
                <Progress value={98.5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Sensor Calibration</span>
                  <span className="text-sm font-medium">94.4%</span>
                </div>
                <Progress value={94.4} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Network Connectivity</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">15</div>
                  <div className="text-xs text-muted-foreground">Online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-xs text-muted-foreground">Calibration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-xs text-muted-foreground">Offline</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Weight Violations</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerTable />
          {/* <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Violation ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actual Weight</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead>Excess</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentViolations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell className="font-medium font-mono text-sm">{violation.id}</TableCell>
                  <TableCell className="font-medium">{violation.vehicle}</TableCell>
                  <TableCell>{violation.type}</TableCell>
                  <TableCell className="font-medium text-destructive">{violation.weight}</TableCell>
                  <TableCell>{violation.limit}</TableCell>
                  <TableCell className="font-bold text-destructive">+{violation.excess}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{violation.station}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{violation.time}</TableCell>
                  <TableCell>
                    <Badge variant={
                      violation.severity === 'high' ? 'destructive' : 
                      violation.severity === 'medium' ? 'secondary' : 'outline'
                    }>
                      {violation.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
        </CardContent>
      </Card>

      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Weight Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Axles</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReadings.map((reading, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-sm">{reading.time}</TableCell>
                  <TableCell className="font-medium">{reading.vehicle}</TableCell>
                  <TableCell>{reading.type}</TableCell>
                  <TableCell className="font-medium">{reading.weight}</TableCell>
                  <TableCell>{reading.axles}</TableCell>
                  <TableCell>{reading.speed}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{reading.station}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reading.status === 'compliant' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Compliant
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Violation
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-900">Heavy violation detected</p>
                <p className="text-sm text-red-700">Vehicle ABC-1234 exceeded weight limit by 8.5 tons at WIM-001 • 2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-yellow-900">Station calibration in progress</p>
                <p className="text-sm text-yellow-700">WIM-003 undergoing scheduled calibration maintenance • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-900">Daily compliance report generated</p>
                <p className="text-sm text-green-700">96.7% compliance rate achieved across all stations • 3 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-900">Data synchronization complete</p>
                <p className="text-sm text-blue-700">All station data successfully synced to central database • 4 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
