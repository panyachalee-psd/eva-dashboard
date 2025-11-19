import { useState } from "react";
import {
  FolderOpen,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatCard } from "./StatCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
// AvatarImage
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
// LineChart, Line

const projectStatusData = [
  { name: "Active", value: 12, color: "#ff6b35" },
  { name: "Completed", value: 8, color: "#10b981" },
  { name: "On Hold", value: 3, color: "#f59e0b" },
  { name: "Planning", value: 5, color: "#6b7280" },
];

const monthlyProgress = [
  { month: "Jan", completed: 2, started: 4 },
  { month: "Feb", completed: 3, started: 2 },
  { month: "Mar", completed: 1, started: 5 },
  { month: "Apr", completed: 4, started: 3 },
  { month: "May", completed: 2, started: 6 },
  { month: "Jun", completed: 5, started: 2 },
];

const projects = [
  {
    id: 1,
    name: "VMS Integration Phase 2",
    description: "Expanding video management system to include AI analytics and facial recognition",
    status: "active",
    progress: 75,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    team: ["JS", "SJ", "MC"],
    priority: "high",
    budget: "$125,000",
    spent: "$93,750",
  },
  {
    id: 2,
    name: "IoT Sensor Network",
    description: "Deployment of weather and environmental sensors across campus",
    status: "active",
    progress: 45,
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    team: ["ED", "RW", "LB"],
    priority: "medium",
    budget: "$85,000",
    spent: "$38,250",
  },
  {
    id: 3,
    name: "Radar System Upgrade",
    description: "Hardware and software upgrades for existing radar detection systems",
    status: "completed",
    progress: 100,
    startDate: "2023-10-01",
    endDate: "2024-01-31",
    team: ["DM", "AG"],
    priority: "high",
    budget: "$95,000",
    spent: "$95,000",
  },
  {
    id: 4,
    name: "LMS Mobile App",
    description: "Development of mobile application for learning management system",
    status: "planning",
    progress: 10,
    startDate: "2024-07-01",
    endDate: "2024-12-31",
    team: ["JS", "ED"],
    priority: "low",
    budget: "$65,000",
    spent: "$6,500",
  },
  {
    id: 5,
    name: "Security Dashboard Enhancement",
    description: "Adding advanced threat detection and response capabilities",
    status: "on-hold",
    progress: 30,
    startDate: "2024-03-01",
    endDate: "2024-09-30",
    team: ["SJ", "MC", "RW"],
    priority: "medium",
    budget: "$110,000",
    spent: "$33,000",
  },
];

const tasks = [
  {
    id: 1,
    title: "Complete API integration testing",
    project: "VMS Integration Phase 2",
    due: "2024-06-15",
    status: "in-progress",
    assignee: "JS",
  },
  {
    id: 2,
    title: "Deploy sensors to Building A",
    project: "IoT Sensor Network",
    due: "2024-06-20",
    status: "pending",
    assignee: "ED",
  },
  {
    id: 3,
    title: "Review security protocols",
    project: "Security Dashboard Enhancement",
    due: "2024-06-18",
    status: "completed",
    assignee: "SJ",
  },
  {
    id: 4,
    title: "Create mobile app wireframes",
    project: "LMS Mobile App",
    due: "2024-07-01",
    status: "pending",
    assignee: "ED",
  },
  {
    id: 5,
    title: "Budget approval documentation",
    project: "IoT Sensor Network",
    due: "2024-06-12",
    status: "in-progress",
    assignee: "RW",
  },
];

export function ProjectDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  // const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "default";
      case "on-hold":
        return "secondary";
      case "planning":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Project Management</h2>
          <p className="text-muted-foreground">Track and manage system implementation projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline View
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value="28"
          change="+3"
          icon={FolderOpen}
          changeType="positive"
        />
        <StatCard
          title="Active Projects"
          value="12"
          change="+2"
          icon={Clock}
          changeType="positive"
        />
        <StatCard
          title="Completed"
          value="8"
          change="+1"
          icon={CheckCircle}
          changeType="positive"
        />
        <StatCard
          title="Total Budget"
          value="$480K"
          change="+$85K"
          icon={Users}
          changeType="positive"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Project Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
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
                  <CheckCircle className="h-5 w-5" />
                  Monthly Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="started" fill="#ff6b35" name="Started" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Key Projects Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Team:</span>
                        <div className="flex -space-x-2">
                          {project.team.map((member, idx) => (
                            <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="bg-primary text-white text-xs">
                                {member}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant={getPriorityColor(project.priority)} className="text-xs">
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                All Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                          <Badge variant={getPriorityColor(project.priority)} className="text-xs">
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            📅 {project.startDate} - {project.endDate}
                          </span>
                          <span>
                            💰 {project.spent} / {project.budget}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Team:</span>
                          <div className="flex -space-x-2">
                            {project.team.map((member, idx) => (
                              <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="bg-primary text-white text-xs">
                                  {member}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h5 className="font-medium">{task.title}</h5>
                      <p className="text-sm text-muted-foreground">{task.project}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                      <p className="text-sm text-muted-foreground">Assignee: {task.assignee}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.status === "completed" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {task.status === "in-progress" && (
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      )}
                      {task.status === "pending" && <XCircle className="h-4 w-4 text-yellow-600" />}
                      <span className={`text-sm ${getTaskStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
