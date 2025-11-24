import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useTranslation } from "react-i18next";
import { TraffViolation, WeightDistri } from "../../models/vehicleModel";


interface WeightDistributionChartItem {
  range: string;
  count: number;
}

export function WIMStatOverall() {
  const { t } = useTranslation();

//   const [weightDistributionData, setWeightDistributionData] = useState([]);
  const [weightDistributionData, setWeightDistributionData] =useState<WeightDistributionChartItem[]>([]);
  const [hourlyTrafficData, setHourlyTrafficData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // ---- API 1: Traffic Violations ----
        const trafficRes = await axios.get(
          `http://85.204.247.82:3007/dashboard/traffic-violation`,
        );

        // Assuming API returns { data: [...] }
        const trafficData = trafficRes.data?.data || trafficRes.data || [];

        // setHourlyTrafficData(
        //   trafficData.map((item: TraffViolation) => ({
        //     time: item.dateTime,
        //     vehicles: item.vehicle_count || 0,
        //     violations: item.violations_count || 0,
        //   }))
        // );
        setHourlyTrafficData(
          trafficData.map((item: TraffViolation) => ({
            time: item.dateTime
              ? new Date(item.dateTime).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            vehicles: item.vehicle_count || 0,
            violations: item.violations_count || 0,
          })),
        );

        // ---- API 2: Weight Distribution ----
        const weightRes = await axios.get(
          `http://85.204.247.82:3007/dashboard/weight-distribution?weight_bins_kg=10000`,
        );

        const weightData = weightRes.data?.data || weightRes.data || [];

        // setWeightDistributionData(
        //   weightData.map((item: WeightDistri) => ({
        //     range: item.weight_range || "",
        //     count: item.count || 0,
        //   })),
        // );
        setWeightDistributionData(
  compressWeightDistribution(weightData).map((item: WeightDistri) => ({
    range: item.weight_range,
    count: item.count,
  }))
);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function compressWeightDistribution(data: WeightDistri[]) {
  if (!data || data.length <= 10) return data;

  // First 9 bins stay the same
  const firstNine = data.slice(0, 9);

  // Combine all remaining bins
  const remaining = data.slice(9);

  const lastRangeStart = remaining[0].weight_range.split("-")[0]; // e.g. "4501"

  const last = {
    weight_range: `${lastRangeStart}+`, 
    count: remaining.reduce((sum, item) => sum + item.count, 0),
  };

  return [...firstNine, last];
}

  if (loading) return <p data-testid="loading">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Distribution */}
        <Card>
  <CardHeader>
    <CardTitle>{t("weight_distribution")}</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={
          weightDistributionData.length > 0
            ? weightDistributionData
            : [
                { range: "0-1000", count: 0 },
                { range: "1001-2000", count: 0 },
                { range: "2001-3000", count: 0 },
                { range: "3001-4000", count: 0 },
              ]
        }
        data-testid="weight-chart"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#048018" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>{t("weight_distribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weightDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#048018" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Traffic & Violations */}
        <Card>
          <CardHeader>
            <CardTitle>{t("traffic_violations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyTrafficData} data-testid="traffic-chart">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#048018"
                  strokeWidth={2}
                  name="Vehicles"
                />
                <Line
                  type="monotone"
                  dataKey="violations"
                  stroke="#d4183d"
                  strokeWidth={2}
                  name="Violations"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// // import { Scale, AlertTriangle, Truck, Activity } from "lucide-react";
// // TrendingUp, CheckCircle, MapPin, Database
// // import { StatCard } from "../StatCard";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// // import { Button } from "../ui/button";
// // import { Badge } from "./ui/badge";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from "recharts";
// // , PieChart, Pie, Cell
// // import { Progress } from "./ui/progress";
// // import  CustomerTable from "../components/ApiTestProject"
// // import CurrentMeasureTable from "../../components/wimCurrentMeasurement/CurrentMeasure";
// // import ViolatedTable from "../../components/wimViolate/Violated";
// // import { WIMDashboardOverall } from "../../components/WimDashboardOverall/DashboardOverall";
// import { useTranslation } from "react-i18next";
// const weightDistributionData = [
//   { range: "0-10000", count: 145 },
//   { range: "10001-20000", count: 320 },
//   { range: "20001-30000", count: 485 },
//   { range: "30001-40000", count: 210 },
//   { range: "40000+", count: 85 },
// ];

// const hourlyTrafficData = [
//   { time: "00:00", vehicles: 45, violations: 2 },
//   { time: "04:00", vehicles: 28, violations: 1 },
//   { time: "08:00", vehicles: 185, violations: 8 },
//   { time: "12:00", vehicles: 245, violations: 12 },
//   { time: "16:00", vehicles: 298, violations: 15 },
//   { time: "20:00", vehicles: 156, violations: 6 },
// ];

// export function WIMStatOverall() {
//   const { t } = useTranslation();
//   return (
//     <div className="space-y-6">
//       {/* <div>
//         <h2 className="text-2xl font-bold text-foreground mb-2">{t("weight_in_motion_system")}</h2>
//         <p className="text-muted-foreground">{t("subheader_monitor_vehicle")}</p>
//       </div> */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Weight Distribution */}
//         <Card>
//           <CardHeader>
//             <CardTitle>{t("weight_distribution")}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={weightDistributionData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="range" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#048018" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Hourly Traffic & Violations */}
//         <Card>
//           <CardHeader>
//             <CardTitle>{t("traffic_violations")}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={hourlyTrafficData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="time" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="vehicles"
//                   stroke="#048018"
//                   strokeWidth={2}
//                   name="Vehicles"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="violations"
//                   stroke="#d4183d"
//                   strokeWidth={2}
//                   name="Violations"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
