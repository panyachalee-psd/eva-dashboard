import { Monitor, Navigation, Gauge, BarChart3, Settings, Shield, Cloud, Radar, Users, FolderOpen, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  onCollapse: (collapsed: boolean) => void;
  onMobileClose: () => void;
}

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  collapsed, 
  isMobile, 
  mobileOpen, 
  onCollapse,
  onMobileClose 
}: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "vms", label: "VMS", icon: Monitor },
    { id: "lms", label: "LMS", icon: Navigation },
    { id: "wim", label: "WIM", icon: Scale },
    { id: "iot", label: "IoT Tools", icon: Gauge },
    // { id: "weather", label: "Weather Sensor", icon: Cloud },
    // { id: "radar", label: "Radar", icon: Radar },
    // { id: "security", label: "Security", icon: Shield },
    { id: "user", label: "User", icon: Users },
    { id: "project", label: "Project", icon: FolderOpen },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "testapi", label: "test Api", icon: Cloud },
  ];

  const sidebarClasses = cn(
    "bg-sidebar h-full border-r border-sidebar-border transition-all duration-300 flex flex-col",
    isMobile ? [
      "fixed left-0 top-16 bottom-0 z-50 w-64",
      mobileOpen ? "translate-x-0" : "-translate-x-full"
    ] : [
      "relative",
      collapsed ? "w-16" : "w-64"
    ]
  );

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    
    const buttonContent = (
      <Button
        key={item.id}
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "h-11 transition-all duration-200",
          collapsed && !isMobile ? "w-11 px-0 justify-center" : "w-full justify-start",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        onClick={() => onTabChange(item.id)}
      >
        <Icon className={cn("h-5 w-5", !collapsed || isMobile ? "mr-3" : "")} />
        {(!collapsed || isMobile) && item.label}
      </Button>
    );

    if (collapsed && !isMobile) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent;
  };

  return (
    <aside className={sidebarClasses}>
      {/* Header with collapse toggle */}
      <div className={cn("flex items-center justify-between border-b border-sidebar-border", 
        collapsed && !isMobile ? "p-2" : "p-4")}>
        {(!collapsed || isMobile) && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground text-sm">E</span>
            </div>
            <span className="text-sidebar-foreground text-lg">EVA</span>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapse(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent p-1.5 h-auto w-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className={cn("flex-1 overflow-y-auto", collapsed && !isMobile ? "p-2" : "p-4")}>
        <nav className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </nav>
      </div>

      {/* Footer for collapsed state */}
      {collapsed && !isMobile && (
        <div className="p-2 border-t border-sidebar-border">
          <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center mx-auto">
            <span className="text-sidebar-accent-foreground text-xs">E</span>
          </div>
        </div>
      )}
    </aside>
  );
}