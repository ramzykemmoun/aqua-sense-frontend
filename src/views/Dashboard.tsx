import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  Droplets,
  Thermometer,
  Fish,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const stats = {
    totalPonds: 12,
    activePonds: 10,
    totalAlerts: 3,
    farmSupervisors: 5,
  };

  const recentAlerts = [
    {
      id: 1,
      pond: "Pond A1",
      type: "Temperature",
      severity: "high",
      message: "Temperature above optimal range",
    },
    {
      id: 2,
      pond: "Pond B2",
      type: "Oxygen",
      severity: "medium",
      message: "Oxygen levels dropping",
    },
    {
      id: 3,
      pond: "Pond C1",
      type: "pH Level",
      severity: "low",
      message: "pH slightly acidic",
    },
  ];

  const pondMetrics = [
    {
      name: "Average Temperature",
      value: "24.5°C",
      icon: Thermometer,
      change: "+0.2°C",
    },
    {
      name: "Average Oxygen",
      value: "7.2 mg/L",
      icon: Droplets,
      change: "-0.1 mg/L",
    },
    { name: "Fish Health Score", value: "94%", icon: Fish, change: "+2%" },
    { name: "System Uptime", value: "99.8%", icon: Activity, change: "+0.1%" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to AquaSense - Monitor your aquaculture operations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ponds</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPonds}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activePonds} active, {stats.totalPonds - stats.activePonds}{" "}
              inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Farm Supervisors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.farmSupervisors}</div>
            <p className="text-xs text-muted-foreground">
              Managing pond operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Latest alerts from your pond monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity}
                    </Badge>
                    <span className="font-medium">{alert.pond}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground">{alert.type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pond Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>
              Key performance indicators across all ponds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pondMetrics.map((metric) => (
              <div
                key={metric.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
