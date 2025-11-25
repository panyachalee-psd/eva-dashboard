import { useState, useEffect } from "react";
import axios from "axios";
import { Scale, AlertTriangle, Truck, Gauge } from "lucide-react";
import { StatCard } from "../StatCard";
import { useTranslation } from "react-i18next";
import { WimSummary } from "../../models/vehicleModel";

export function WIMDashboardOverall() {
  const { t } = useTranslation();

  // State typed with WimSummary
  const [stats, setStats] = useState<WimSummary>({
    total: 0,
    overweight_count: 0,
    overweight_percentage: 0,
    total_weight: 0,
    average_speed: 0,
    average_total_weight: 0,
  });

  // State for loading and error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await axios.get<WimSummary>(
          "http://85.204.247.82:3007/dashboard/summary",
        );

        setStats(response.data);
        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error occurred"));
        }
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  function formatT(value: number) {
    if (value == null) return "-";
    return `${value / 1000} t`;
  }

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading dashboard: {error.message}</p>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("avg_vehicle_weight")}
          value={formatT(stats.average_total_weight)}
          icon={Scale}
        />
        <StatCard
          title={t("vehicles_today")}
          value={stats.total}
          icon={Truck}
        />
        <StatCard
          title={t("violations_detected")}
          value={stats.overweight_count}
          change={`${stats.overweight_percentage.toFixed(1)}% violation rate`}
          changeType={
            stats.overweight_percentage >= 10 ? "negative" : "positive"
          }
          icon={AlertTriangle}
        />
        <StatCard
          title={t("avg_vehicle_speed")}
          value={`${stats.average_speed.toFixed(1)} km/h`}
          icon={Gauge}
        />
      </div>
    </div>
  );
}
