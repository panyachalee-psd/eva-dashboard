import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import CurrentMeasureTable from "../components/wimCurrentMeasurement/CurrentMeasure";
import ViolatedTable from "../components/wimViolate/Violated";
import { WIMDashboardOverall } from "../components/WimDashboardOverall/DashboardOverall";
import { WIMStatOverall } from "../components/WimStatOverall/StatOverall";
import { useTranslation } from "react-i18next";

export function WIMDashboard() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("weight_in_motion_system")}</h2>
        <p className="text-muted-foreground">{t("subheader_monitor_vehicle")}</p>
      </div>

      {/* WIM DashboardOverall */}
      <WIMDashboardOverall />

      
      {/* WIM StatOverall */}
      <WIMStatOverall />

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle>{t("recent_weight_violations")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ViolatedTable />
        </CardContent>
      </Card>

      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{t("recent_weight_readings")}</CardTitle>
            <div>
              <Button size="sm" className="hidden sm:flex" startIcon="pi-folder-open">
                {t("download_report")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CurrentMeasureTable />
        </CardContent>
      </Card>
    </div>
  );
}
