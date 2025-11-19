import { Monitor, Navigation, Gauge, AlertTriangle, CheckCircle, Scale } from "lucide-react";
// TrendingUp
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
// BarChart, Bar,

const lineData = [
  { name: "Jan", vms: 400, lms: 240, wim: 320, iot: 140 },
  { name: "Feb", vms: 300, lms: 139, wim: 285, iot: 221 },
  { name: "Mar", vms: 200, lms: 980, wim: 395, iot: 229 },
  { name: "Apr", vms: 278, lms: 390, wim: 412, iot: 200 },
  { name: "May", vms: 189, lms: 480, wim: 438, iot: 218 },
  { name: "Jun", vms: 239, lms: 380, wim: 456, iot: 250 },
];

const pieData = [
  { name: "VMS Active", value: 92, color: "#ff6b35" },
  { name: "LMS Active", value: 92, color: "#ff8c5a" },
  { name: "WIM Active", value: 83, color: "#ffad7f" },
  { name: "IoT Active", value: 78, color: "#ffcfa5" },
];

export function OverviewDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">System Overview</h2>
        <p className="text-muted-foreground">
          Monitor all integrated systems from a single dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Digital Signs"
          value="84"
          change="+6 new signs"
          changeType="positive"
          icon={Monitor}
        />
        <StatCard
          title="Active Lanes"
          value="147"
          change="+3 new lanes"
          changeType="positive"
          icon={Navigation}
        />
        <StatCard
          title="WIM Stations"
          value="18"
          change="15 online"
          changeType="positive"
          icon={Scale}
        />
        <StatCard
          title="IoT Devices"
          value="156"
          change="-2% from last month"
          changeType="negative"
          icon={Gauge}
        />
        {/* <StatCard
          title="System Health"
          value="98.5%"
          change="+0.5% from last month"
          changeType="positive"
          icon={TrendingUp}
        /> */}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="vms" stroke="#ff6b35" strokeWidth={2} name="VMS" />
                <Line type="monotone" dataKey="lms" stroke="#ff8c5a" strokeWidth={2} name="LMS" />
                <Line type="monotone" dataKey="wim" stroke="#ffad7f" strokeWidth={2} name="WIM" />
                <Line type="monotone" dataKey="iot" stroke="#ffcfa5" strokeWidth={2} name="IoT" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-900">VMS Sign Offline</p>
                <p className="text-sm text-red-700">Highway A1 South digital sign not responding</p>
              </div>
              <span className="text-xs text-red-600">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">Message Update Required</p>
                <p className="text-sm text-orange-700">
                  City Center VMS needs traffic diversion update
                </p>
              </div>
              <span className="text-xs text-orange-600">15 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">VMS Message Updated</p>
                <p className="text-sm text-green-700">
                  Highway signs updated with new traffic information
                </p>
              </div>
              <span className="text-xs text-green-600">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
