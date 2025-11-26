import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { OverviewDashboard } from "../components/OverviewDashboard";
import { VMSDashboard } from "../components/VMSDashboard";
import { LMSDashboard } from "../components/LMSDashboard";
import { WIMDashboard } from "../components/WIMDashboard";
import { IoTDashboard } from "../components/IoTDashboard";
import { SecurityDashboard } from "../components/SecurityDashboard";
import { SettingsDashboard } from "../components/SettingsDashboard";
import { WeatherSensorDashboard } from "../components/WeatherSensorDashboard";
import { RadarDashboard } from "../components/RadarDashboard";
import { UserDashboard } from "../components/UserDashboard";
import { ProjectDashboard } from "../components/ProjectDashboard";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
        setMobileSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard />;
      case "vms":
        return <VMSDashboard />;
      case "lms":
        return <LMSDashboard />;
      case "wim":
        return <WIMDashboard />;
      case "iot":
        return <IoTDashboard />;
      case "security":
        return <SecurityDashboard />;
      case "settings":
        return <SettingsDashboard />;
      case "weather":
        return <WeatherSensorDashboard />;
      case "radar":
        return <RadarDashboard />;
      case "user":
        return <UserDashboard />;
      case "project":
        return <ProjectDashboard />;
      default:
        return <OverviewDashboard />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        onMenuClick={() =>
          isMobile
            ? setMobileSidebarOpen(!mobileSidebarOpen)
            : setSidebarCollapsed(!sidebarCollapsed)
        }
        isMobile={isMobile}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          mobileOpen={mobileSidebarOpen}
          onCollapse={setSidebarCollapsed}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        {isMobile && mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            isMobile ? "ml-0" : sidebarCollapsed ? "ml-4" : "ml-4"
          }`}
        >
          <div className="p-4 md:p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
