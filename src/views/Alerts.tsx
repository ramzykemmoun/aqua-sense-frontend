import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Fish,
  Thermometer,
  Droplets,
  Microscope,
  Bug,
} from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification } from "@/types/notification";
import { useState, useMemo } from "react";

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case "warning":
    case "high":
      return <Clock className="h-4 w-4 text-warning" />;
    case "medium":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "low":
      return <CheckCircle className="h-4 w-4 text-success" />;
    default:
      return <CheckCircle className="h-4 w-4 text-success" />;
  }
};

const getSeverityBadge = (severity: string) => {
  const variants = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-success/10 text-success border-success/20",
    normal: "bg-success/10 text-success border-success/20",
  };

  return (
    <Badge
      className={variants[severity as keyof typeof variants] || variants.normal}
    >
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "critical":
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "bacteria":
      return <Microscope className="h-4 w-4" />;
    case "system":
      return <Fish className="h-4 w-4" />;
    default:
      return <Fish className="h-4 w-4" />;
  }
};

const getParameterFromTitle = (title: string) => {
  if (title.toLowerCase().includes("temperature")) return "Temperature";
  if (title.toLowerCase().includes("ph")) return "pH";
  if (title.toLowerCase().includes("oxygen")) return "Dissolved Oxygen";
  if (title.toLowerCase().includes("ammonia")) return "Ammonia";
  if (title.toLowerCase().includes("water level")) return "Water Level";
  if (
    title.toLowerCase().includes("turbidity") ||
    title.toLowerCase().includes("clarity")
  )
    return "Turbidity";
  if (title.toLowerCase().includes("nitrite")) return "Nitrite";
  if (title.toLowerCase().includes("nitrate")) return "Nitrate";
  if (title.toLowerCase().includes("bacteria")) return "Bacteria";
  return "General";
};

const getParameterIcon = (parameter: string) => {
  switch (parameter.toLowerCase()) {
    case "temperature":
      return <Thermometer className="h-4 w-4" />;
    case "bacteria":
      return <Microscope className="h-4 w-4" />;
    case "ph":
    case "dissolved oxygen":
    case "ammonia":
    case "nitrite":
    case "nitrate":
    case "turbidity":
    case "water level":
      return <Droplets className="h-4 w-4" />;
    default:
      return <Fish className="h-4 w-4" />;
  }
};

export default function Alerts() {
  const { notifications, removeNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [pondFilter, setPondFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Transform notifications to match the alert format
  const transformedAlerts = useMemo(() => {
    return notifications.map((notification) => ({
      id: notification.id,
      pondName: notification.title.split(" - ")[1] || "Unknown Pond",
      parameter: getParameterFromTitle(notification.title),
      severity: notification.severity || notification.type,
      message: notification.message,
      timestamp: new Date(notification.time).toLocaleString(),
      resolved: notification.read,
      notification: notification, // Keep reference to original notification
    }));
  }, [notifications]);

  // Filter alerts based on search and filters
  const filteredAlerts = useMemo(() => {
    return transformedAlerts.filter((alert) => {
      const matchesSearch =
        searchTerm === "" ||
        alert.pondName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === "all" || alert.severity === severityFilter;

      const matchesPond =
        pondFilter === "all" ||
        alert.pondName.toLowerCase().includes(pondFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !alert.resolved) ||
        (statusFilter === "resolved" && alert.resolved);

      return matchesSearch && matchesSeverity && matchesPond && matchesStatus;
    });
  }, [transformedAlerts, searchTerm, severityFilter, pondFilter, statusFilter]);

  // Calculate summary statistics
  const activeAlerts = filteredAlerts.filter((alert) => !alert.resolved).length;
  const resolvedToday = filteredAlerts.filter((alert) => {
    const alertDate = new Date(alert.timestamp);
    const today = new Date();
    return alert.resolved && alertDate.toDateString() === today.toDateString();
  }).length;

  const handleMarkResolved = (notification: Notification) => {
    // Mark as read in the store
    const updatedNotification = { ...notification, read: true };
    removeNotification(notification);
    // Note: In a real app, you might want to add it back as read
    // addNotification(updatedNotification);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-warning" />
            Alerts & Notifications
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage pond alerts in real-time
          </p>
        </div>
        <Button>
          <Filter className="h-4 w-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pondFilter} onValueChange={setPondFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pond" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ponds</SelectItem>
                {Array.from(
                  new Set(transformedAlerts.map((alert) => alert.pondName))
                )
                  .filter((name) => name !== "Unknown Pond")
                  .map((pondName) => (
                    <SelectItem key={pondName} value={pondName.toLowerCase()}>
                      {pondName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              Successfully addressed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Notifications
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">
              All time notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Latest alerts from all monitored ponds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No alerts match your current filters
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    alert.resolved
                      ? "bg-muted/30 border-muted"
                      : alert.severity === "critical"
                      ? "bg-destructive/5 border-destructive/20"
                      : alert.severity === "high" ||
                        alert.severity === "warning"
                      ? "bg-warning/5 border-warning/20"
                      : "bg-blue/5 border-blue/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2 mt-0.5">
                        {getSeverityIcon(alert.severity)}
                        {getParameterIcon(alert.parameter)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm">
                            {alert.pondName}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {alert.parameter}
                          </span>
                          {getSeverityBadge(alert.severity)}
                          {alert.resolved && (
                            <Badge className="bg-success/10 text-success border-success/20">
                              Resolved
                            </Badge>
                          )}
                          {alert.notification.type === "bacteria" && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                              <Microscope className="h-3 w-3 mr-1" />
                              Bacteria Detection
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Alert ID: {alert.id.substring(0, 8)}...</span>
                          <span>{alert.timestamp}</span>
                          {alert.notification.pondId && (
                            <span>
                              Pond ID:{" "}
                              {alert.notification.pondId.substring(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.resolved && (
                        <>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleMarkResolved(alert.notification)
                            }
                          >
                            Mark Resolved
                          </Button>
                        </>
                      )}
                      {alert.resolved && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeNotification(alert.notification)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
