import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, Recharts } from "@/components/ui/chart";
import {
  Thermometer,
  Droplets,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Fish,
  Waves,
  BarChart3,
  Clock,
  RefreshCw,
  Microscope,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPondByIdQuery,
  useGetPondDataByIdQuery,
} from "@/lib/services/ponds";
import { Spinner } from "./ui/spinner";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";
import { IPondData } from "@/types/pond";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification } from "@/types/notification";

const formatTimeForChart = (date: Date | string | undefined) => {
  if (!date) {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const validDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(validDate.getTime())) {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return validDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "normal":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

export function PondDashboard() {
  const navigate = useNavigate();
  const pondId = useParams().pondId!;

  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [historicalDataState, setHistoricalDataState] = useState<IPondData[]>(
    []
  );
  const [chartWindowSize] = useState(5);
  const [isDataUpdating, setIsDataUpdating] = useState(false);
  const [isFishAnalysisOpen, setIsFishAnalysisOpen] = useState(false);

  const { addNotification, notifications } = useNotifications();
  const { unityProvider } = useUnityContext({
    loaderUrl: "/build/Build/Build.loader.js",
    dataUrl: "/build/Build/Build.data",
    frameworkUrl: "/build/Build/Build.framework.js",
    codeUrl: "/build/Build/Build.wasm",
  });

  const onBack = () => {
    navigate("/dashboard/ponds");
  };

  const { data, isLoading, error } = useGetPondByIdQuery(pondId);

  const {
    data: pondsData,
    isLoading: pondsLoading,
    error: pondsError,
    refetch,
  } = useGetPondDataByIdQuery(pondId);

  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      refetch({ throwOnError: false, cancelRefetch: true });
      setLastUpdate(new Date());
    }, 8000);

    return () => clearInterval(interval);
  }, [refetch, isAutoRefresh]);

  useEffect(() => {
    if (
      pondsData?.data &&
      pondsData?.data?.length > 0 &&
      historicalDataState.length === 0
    ) {
      setHistoricalDataState(pondsData.data);
    }
  }, [pondsData?.data, historicalDataState.length]);

  useEffect(() => {
    if (pondsData?.data && pondsData?.data?.length > 0) {
      setLastUpdate(new Date());
      setIsDataUpdating(true);

      const latestBackendData = pondsData.data[pondsData.data.length - 1];

      if (latestBackendData) {
        setHistoricalDataState((prevHistory) => {
          const exists = prevHistory.some(
            (point) =>
              point?.id === latestBackendData?.id ||
              (point?.timestamp &&
                latestBackendData?.timestamp &&
                new Date(point.timestamp).getTime() ===
                  new Date(latestBackendData.timestamp).getTime()) ||
              (point?.createdAt &&
                latestBackendData?.createdAt &&
                new Date(point.createdAt).getTime() ===
                  new Date(latestBackendData.createdAt).getTime())
          );

          if (!exists) {
            const updatedHistory = [...prevHistory, latestBackendData];
            return updatedHistory.slice(-50);
          }

          return prevHistory;
        });
      }

      setTimeout(() => setIsDataUpdating(false), 500);
    }
  }, [pondsData?.data]);

  const pond = data?.data;

  let historicalData =
    historicalDataState.length > 0
      ? historicalDataState
      : pondsData?.data || [];

  const chartData = historicalData.slice(-chartWindowSize);

  const fixedHistoricalData = historicalData.map((point, index) => {
    if (!point?.timestamp && !point?.createdAt) {
      const now = new Date();
      const timestamp = new Date(
        now.getTime() - (historicalData.length - 1 - index) * 60000
      );
      return {
        ...point,
        timestamp: timestamp,
        createdAt: timestamp.toISOString(),
      };
    }
    return point;
  });

  const fixedChartData = chartData.map((point, index) => {
    if (!point?.timestamp && !point?.createdAt) {
      const now = new Date();
      const timestamp = new Date(
        now.getTime() - (chartData.length - 1 - index) * 60000
      );
      return {
        ...point,
        timestamp: timestamp,
        createdAt: timestamp.toISOString(),
      };
    }
    return point;
  });
  const handleManualRefresh = async () => {
    setLastUpdate(new Date());
    await refetch({ throwOnError: false, cancelRefetch: true });
  };

  const handleClearHistory = () => {
    setHistoricalDataState([]);
  };

  const checkForProblems = (data: IPondData, pondName: string) => {
    const problems: Notification[] = [];
    const timestamp = new Date().toISOString();
    const now = Date.now();
    const NOTIFICATION_THROTTLE = 15 * 60 * 1000;
    const CRITICAL_THROTTLE = 10 * 60 * 1000;

    const hasRecentNotification = (alertType: string, isCritical = false) => {
      const throttleTime = isCritical
        ? CRITICAL_THROTTLE
        : NOTIFICATION_THROTTLE;
      return notifications.some((notification) => {
        const notificationTime = new Date(notification.time).getTime();
        const timeDiff = now - notificationTime;
        return (
          notification.pondId === pondId &&
          notification.title.toLowerCase().includes(alertType.toLowerCase()) &&
          timeDiff < throttleTime
        );
      });
    };

    const shouldCheckNotifications = fixedHistoricalData.length % 3 === 0;
    if (!shouldCheckNotifications) return problems;

    if (data?.temperature !== undefined) {
      const isCritical = data.temperature < 18 || data.temperature > 32;
      const isWarning = data.temperature < 20 || data.temperature > 30;

      if (isWarning && !hasRecentNotification("temperature", isCritical)) {
        problems.push({
          id: `temp-${pondId}-${Date.now()}`,
          type: isCritical ? "critical" : "warning",
          title: `Temperature Alert - ${pondName}`,
          message: `Temperature is ${data.temperature.toFixed(
            1
          )}°C (Optimal: 23-26°C)`,
          time: timestamp,
          read: false,
          pondId,
          severity: isCritical ? "critical" : "high",
        });
      }
    }

    if (data?.pH !== undefined) {
      const isCritical = data.pH < 6.0 || data.pH > 8.5;
      const isWarning = data.pH < 6.5 || data.pH > 8.0;

      if (isWarning && !hasRecentNotification("ph", isCritical)) {
        problems.push({
          id: `ph-${pondId}-${Date.now()}`,
          type: isCritical ? "critical" : "warning",
          title: `pH Level Alert - ${pondName}`,
          message: `pH level is ${data.pH.toFixed(2)} (Optimal: 6.8-7.5)`,
          time: timestamp,
          read: false,
          pondId,
          severity: isCritical ? "critical" : "high",
        });
      }
    }

    if (data?.dissolvedOxygen !== undefined) {
      const isCritical = data.dissolvedOxygen < 3.0;
      const isWarning =
        data.dissolvedOxygen < 4.0 || data.dissolvedOxygen > 12.0;

      if (isWarning && !hasRecentNotification("oxygen", isCritical)) {
        problems.push({
          id: `do-${pondId}-${Date.now()}`,
          type: isCritical ? "critical" : "warning",
          title: `Oxygen Alert - ${pondName}`,
          message: `Dissolved oxygen is ${data.dissolvedOxygen.toFixed(
            1
          )} mg/L (Target: 5-8 mg/L)`,
          time: timestamp,
          read: false,
          pondId,
          severity: isCritical ? "critical" : "medium",
        });
      }
    }

    if (data?.ammonia !== undefined) {
      const isCritical = data.ammonia > 0.05;
      const isWarning = data.ammonia > 0.03;

      if (isWarning && !hasRecentNotification("ammonia", isCritical)) {
        problems.push({
          id: `ammonia-${pondId}-${Date.now()}`,
          type: isCritical ? "critical" : "warning",
          title: `Ammonia Alert - ${pondName}`,
          message: `Ammonia level is ${data.ammonia.toFixed(
            3
          )} ppm (Safe: <0.02 ppm)`,
          time: timestamp,
          read: false,
          pondId,
          severity: isCritical ? "critical" : "medium",
        });
      }
    }

    if (data?.waterLevel !== undefined) {
      const isCritical = data.waterLevel < 50 || data.waterLevel > 99;
      const isWarning = data.waterLevel < 65 || data.waterLevel > 95;

      if (isWarning && !hasRecentNotification("water level", isCritical)) {
        problems.push({
          id: `water-${pondId}-${Date.now()}`,
          type: isCritical ? "critical" : "warning",
          title: `Water Level Alert - ${pondName}`,
          message: `Water level is ${data.waterLevel.toFixed(
            0
          )}% (Optimal: 75-90%)`,
          time: timestamp,
          read: false,
          pondId,
          severity: isCritical ? "critical" : "medium",
        });
      }
    }

    if (data?.turbidity !== undefined) {
      const isCritical = data.turbidity > 10.0;
      const isWarning = data.turbidity > 7.0;

      if (isWarning && !hasRecentNotification("turbidity", isCritical)) {
        problems.push({
          id: `turbidity-${pondId}-${Date.now()}`,
          type: isCritical ? "critical" : "warning",
          title: `Water Clarity Alert - ${pondName}`,
          message: `High turbidity detected: ${data.turbidity.toFixed(1)} NTU`,
          time: timestamp,
          read: false,
          pondId,
          severity: isCritical ? "critical" : "medium",
        });
      }
    }

    if (data?.nitrite !== undefined) {
      const isCritical = data.nitrite > 0.25;
      const isWarning = data.nitrite > 0.15;

      if (isWarning && !hasRecentNotification("nitrite", isCritical)) {
        problems.push({
          id: `nitrite-${pondId}-${Date.now()}`,
          type: isCritical ? "critical" : "warning",
          title: `Nitrite Alert - ${pondName}`,
          message: `Nitrite level is ${data.nitrite.toFixed(
            3
          )} ppm (Safe: <0.1 ppm)`,
          time: timestamp,
          read: false,
          pondId,
          severity: isCritical ? "critical" : "medium",
        });
      }
    }

    return problems;
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  const currentData = fixedHistoricalData[fixedHistoricalData.length - 1];

  useEffect(() => {
    if (currentData && pond?.name && fixedHistoricalData.length > 0) {
      const problems = checkForProblems(currentData, pond.name);
      problems.forEach((problem) => addNotification(problem));
    }
  }, [currentData?.id, currentData?.timestamp, pond?.name, addNotification]);

  if (isLoading || pondsLoading)
    return <Spinner className="h-16 w-16 mx-auto mt-20" />;

  const temperatureChartData = fixedChartData.map((point, index) => {
    return {
      time: formatTimeForChart(point?.timestamp || point?.createdAt),
      value: Number((point?.temperature || 0).toFixed(1)),
    };
  });

  const phChartData = fixedChartData.map((point, index) => ({
    time: formatTimeForChart(point?.timestamp || point?.createdAt),
    value: Number((point?.pH || 0).toFixed(2)),
  }));

  const dissolvedOxygenChartData = fixedChartData.map((point, index) => ({
    time: formatTimeForChart(point?.timestamp || point?.createdAt),
    value: Number((point?.dissolvedOxygen || 0).toFixed(1)),
  }));

  const waterLevelChartData = fixedChartData.map((point, index) => ({
    time: formatTimeForChart(point?.timestamp || point?.createdAt),
    value: Number((point?.waterLevel || 0).toFixed(0)),
  }));

  const ammoniaChartData = fixedChartData.map((point, index) => ({
    time: formatTimeForChart(point?.timestamp || point?.createdAt),
    value: Number((point?.ammonia || 0).toFixed(3)),
  }));

  const turbidityChartData = fixedChartData.map((point, index) => ({
    time: formatTimeForChart(point?.timestamp || point?.createdAt),
    value: Number((point?.turbidity || 0).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Fish className="h-8 w-8 text-primary" />
              {pond?.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoRefresh}
          >
            <Clock className="h-4 w-4 mr-2" />
            Auto-refresh {isAutoRefresh ? "ON" : "OFF"}
          </Button>

          <Button variant="outline" size="sm" onClick={handleManualRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>

          <Button variant="outline" size="sm" onClick={handleClearHistory}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Clear History ({fixedHistoricalData.length})
          </Button>

          <Badge className="bg-success/10 text-success border-success/20">
            <Waves className="h-3 w-3 mr-1" />
            Live Data ({fixedHistoricalData.length} total • showing last{" "}
            {chartWindowSize}) • Last: {lastUpdate.toLocaleTimeString()}
            {isDataUpdating && (
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            )}
          </Badge>
        </div>
      </div>

      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Fish className="h-5 w-5" />
            Assigned Supervisors
          </CardTitle>
          <CardDescription>
            Staff responsible for monitoring this pond
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pond?.supervisors && pond?.supervisors?.length > 0 ? (
              pond?.supervisors?.map((supervisor) => (
                <Badge
                  key={supervisor.id}
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                >
                  {supervisor?.firstName} {supervisor?.lastName}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                No supervisors assigned
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Fish Population
            </CardTitle>
            <Fish className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {currentData?.fishCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active fish detected
            </p>
            <div className="mt-2">
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3" />
                {fixedHistoricalData.length > 1 && (
                  <span>
                    {(currentData?.fishCount || 0) -
                      (fixedHistoricalData[fixedHistoricalData.length - 2]
                        ?.fishCount || 0) >=
                    0
                      ? "+"
                      : ""}
                    {Math.round(
                      (currentData?.fishCount || 0) -
                        (fixedHistoricalData[fixedHistoricalData.length - 2]
                          ?.fishCount || 0)
                    )}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 dark:border-cyan-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
              Water Level
            </CardTitle>
            <Waves className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-800 dark:text-cyan-200">
              {(currentData?.waterLevel || 0).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Optimal range: 80-95%
            </p>
            <div className="mt-2">
              <Progress
                value={currentData?.waterLevel || 0}
                className="h-2 bg-cyan-100 dark:bg-cyan-900"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Temperature
            </CardTitle>
            <Thermometer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {(currentData?.temperature || 0).toFixed(1)}°C
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Optimal: 23-26°C
            </p>
            <div className="mt-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  (currentData?.temperature || 0) >= 23 &&
                  (currentData?.temperature || 0) <= 26
                    ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                    : "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                }`}
              >
                {(currentData?.temperature || 0) >= 23 &&
                (currentData?.temperature || 0) <= 26
                  ? "Normal Range"
                  : "Out of Range"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              pH Level
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {(currentData?.pH || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Optimal: 6.8-7.5
            </p>
            <div className="mt-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  (currentData?.pH || 0) >= 6.8 && (currentData?.pH || 0) <= 7.5
                    ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                    : "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                }`}
              >
                {(currentData?.pH || 0) >= 6.8 && (currentData?.pH || 0) <= 7.5
                  ? "Normal Range"
                  : "Out of Range"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Dissolved Oxygen
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {(currentData?.dissolvedOxygen || 0).toFixed(1)} mg/L
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: 5-8 mg/L
            </p>
            <div className="mt-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  (currentData?.dissolvedOxygen || 0) >= 5.0 &&
                  (currentData?.dissolvedOxygen || 0) <= 8.0
                    ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                    : "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                }`}
              >
                {(currentData?.dissolvedOxygen || 0) >= 5.0 &&
                (currentData?.dissolvedOxygen || 0) <= 8.0
                  ? "Optimal"
                  : "Critical"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Fish className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-blue-700 dark:text-blue-300">
                  🐟 Advanced Fish Analysis
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  AI-powered fish health monitoring and population analysis
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setIsFishAnalysisOpen(!isFishAnalysisOpen)}
              variant={isFishAnalysisOpen ? "default" : "outline"}
              className={`transition-all duration-300 ${
                isFishAnalysisOpen
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
              }`}
            >
              {isFishAnalysisOpen ? (
                <>
                  <Fish className="h-4 w-4 mr-2" />
                  Close Analysis
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Start Fish Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Fish className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Population
                  </p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {currentData?.fishCount || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Health Status
                  </p>
                  <p className="text-lg font-bold text-green-800 dark:text-green-200">
                    Excellent
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Growth Rate
                  </p>
                  <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                    +12.5%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isFishAnalysisOpen
                ? "max-h-[700px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {isFishAnalysisOpen && (
              <div className="mt-6 border-t border-blue-200 dark:border-blue-800 pt-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Microscope className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          🔬 Real-time Fish Monitoring
                        </h3>
                        <p className="text-sm text-blue-100">
                          Advanced computer vision analysis for fish health and
                          behavior
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="h-[600px] bg-gray-50 dark:bg-gray-900">
                    <iframe
                      src="http://127.0.0.1:9000/"
                      className="w-full h-full border-0"
                      title="Fish Analysis Interface"
                      style={{ minHeight: "600px" }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Activity Patterns
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Swimming Activity
                        </span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Feeding Response
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Normal
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Stress Indicators
                        </span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Low
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <Fish className="h-4 w-4" />
                      AI Recommendations
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Fish population density is optimal
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Consider increasing feeding frequency during peak
                          growth
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Water conditions support healthy fish behavior
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pond?.data &&
          Object.entries(pond?.data)
            .filter(
              ([key, value]) =>
                typeof value === "number" &&
                key !== "id" &&
                key !== "pondId" &&
                !key.includes("timestamp") &&
                !key.includes("createdAt")
            )
            .map(([key, value]) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </CardTitle>
                  {getStatusIcon("normal")}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {value}
                    {key === "temperature"
                      ? "°C"
                      : key === "pH"
                      ? ""
                      : key.includes("Oxygen")
                      ? " mg/L"
                      : " ppm"}
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>
                        Min:{" "}
                        {key === "temperature"
                          ? "23"
                          : key === "pH"
                          ? "6.8"
                          : "0"}
                      </span>
                      <span>
                        Max:{" "}
                        {key === "temperature"
                          ? "26"
                          : key === "pH"
                          ? "7.5"
                          : "10"}
                      </span>
                    </div>
                    <Progress
                      value={
                        key === "temperature"
                          ? Math.max(
                              0,
                              Math.min(
                                100,
                                (((value as number) - 23) / 3) * 100
                              )
                            )
                          : key === "pH"
                          ? Math.max(
                              0,
                              Math.min(
                                100,
                                (((value as number) - 6.8) / 0.7) * 100
                              )
                            )
                          : Math.max(0, Math.min(100, (value as number) * 10))
                      }
                      className="h-2"
                    />
                  </div>
                  <p className="text-xs mt-2 text-green-600 dark:text-green-400">
                    Normal range
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Temperature Trend
            </CardTitle>
            <CardDescription>
              Moving window (Last {chartWindowSize} readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                temperature: {
                  label: "Temperature",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart data={temperatureChartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[20, 30]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  animationDuration={300}
                  connectNulls
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              pH Level Trend
            </CardTitle>
            <CardDescription>
              Moving window (Last {chartWindowSize} readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                ph: {
                  label: "pH Level",
                  color: "hsl(280, 100%, 50%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart data={phChartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[6, 8]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(280, 100%, 50%)"
                  strokeWidth={2}
                  name="pH Level"
                  dot={{ fill: "hsl(280, 100%, 50%)", strokeWidth: 2, r: 4 }}
                  animationDuration={300}
                  connectNulls
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              Dissolved Oxygen Trend
            </CardTitle>
            <CardDescription>
              Moving window (Last {chartWindowSize} readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                dissolvedOxygen: {
                  label: "Dissolved Oxygen",
                  color: "hsl(200, 100%, 50%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart data={dissolvedOxygenChartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[0, 15]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(200, 100%, 50%)"
                  strokeWidth={2}
                  name="Dissolved Oxygen (mg/L)"
                  dot={{ fill: "hsl(200, 100%, 50%)", strokeWidth: 2, r: 4 }}
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-cyan-600" />
              Water Level Trend
            </CardTitle>
            <CardDescription>
              Moving window (Last {chartWindowSize} readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                waterLevel: {
                  label: "Water Level",
                  color: "hsl(180, 100%, 50%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart data={waterLevelChartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[0, 100]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(180, 100%, 50%)"
                  strokeWidth={2}
                  name="Water Level (%)"
                  dot={{ fill: "hsl(180, 100%, 50%)", strokeWidth: 2, r: 4 }}
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5 text-blue-600" />
              Fish Population Trend
            </CardTitle>
            <CardDescription>
              Moving window (Last {chartWindowSize} readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                fishCount: {
                  label: "Fish Count",
                  color: "hsl(220, 100%, 50%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.AreaChart
                data={fixedChartData.map((point, index) => ({
                  time: formatTimeForChart(
                    point?.timestamp || point?.createdAt
                  ),
                  value: Number(point?.fishCount || 0),
                }))}
              >
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(220, 100%, 50%)"
                  fill="hsl(220, 100%, 50%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Fish Count"
                  animationDuration={300}
                />
              </Recharts.AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Ammonia Levels
            </CardTitle>
            <CardDescription>
              Moving window - ammonia concentration (Last {chartWindowSize}{" "}
              readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                ammonia: {
                  label: "Ammonia",
                  color: "hsl(45, 100%, 50%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart data={ammoniaChartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[0, 0.1]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(45, 100%, 50%)"
                  strokeWidth={2}
                  name="Ammonia (ppm)"
                  dot={{ fill: "hsl(45, 100%, 50%)", strokeWidth: 2, r: 4 }}
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-600" />
              Water Turbidity
            </CardTitle>
            <CardDescription>
              Moving window - water clarity (Last {chartWindowSize} readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                turbidity: {
                  label: "Turbidity",
                  color: "hsl(120, 50%, 40%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart data={turbidityChartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[0, 10]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(120, 50%, 40%)"
                  strokeWidth={2}
                  name="Turbidity (NTU)"
                  dot={{ fill: "hsl(120, 50%, 40%)", strokeWidth: 2, r: 4 }}
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-teal-600" />
              Water Salinity
            </CardTitle>
            <CardDescription>
              Moving window - salt concentration (Last {chartWindowSize}{" "}
              readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                salinity: {
                  label: "Salinity",
                  color: "hsl(160, 100%, 40%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart
                data={fixedChartData.map((point, index) => ({
                  time: formatTimeForChart(
                    point?.timestamp || point?.createdAt
                  ),
                  value: Number((point?.salinity || 0).toFixed(2)),
                }))}
              >
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[0, 2]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(160, 100%, 40%)"
                  strokeWidth={2}
                  name="Salinity (ppt)"
                  dot={{ fill: "hsl(160, 100%, 40%)", strokeWidth: 2, r: 4 }}
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Nitrate Levels
            </CardTitle>
            <CardDescription>
              Moving window - nitrate concentration (Last {chartWindowSize}{" "}
              readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                nitrate: {
                  label: "Nitrate",
                  color: "hsl(100, 60%, 45%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart
                data={fixedChartData.map((point, index) => ({
                  time: formatTimeForChart(
                    point?.timestamp || point?.createdAt
                  ),
                  value: Number((point?.nitrate || 0).toFixed(1)),
                }))}
              >
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[0, 20]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(100, 60%, 45%)"
                  strokeWidth={2}
                  name="Nitrate (ppm)"
                  dot={{ fill: "hsl(100, 60%, 45%)", strokeWidth: 2, r: 4 }}
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Nitrite Levels
            </CardTitle>
            <CardDescription>
              Moving window - nitrite concentration (Last {chartWindowSize}{" "}
              readings)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                nitrite: {
                  label: "Nitrite",
                  color: "hsl(30, 100%, 50%)",
                },
              }}
              className="h-[300px]"
            >
              <Recharts.LineChart
                data={fixedChartData.map((point, index) => ({
                  time: formatTimeForChart(
                    point?.timestamp || point?.createdAt
                  ),
                  value: Number((point?.nitrite || 0).toFixed(3)),
                }))}
              >
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="time" />
                <Recharts.YAxis domain={[0, 0.5]} />
                <Recharts.Tooltip content={<ChartTooltip />} />
                <Recharts.Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(30, 100%, 50%)"
                  strokeWidth={2}
                  name="Nitrite (ppm)"
                  dot={{ fill: "hsl(30, 100%, 50%)", strokeWidth: 2, r: 4 }}
                />
              </Recharts.LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Microscope className="h-5 w-5" />
            Bacteria Detection & Analysis
          </CardTitle>
          <CardDescription>
            YOLO-powered bacteria detection and water quality assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            src="http://127.0.0.1:8000/"
            className="w-full h-[600px] border-0 rounded-lg"
            title="Bacteria Detection Interface"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            3D Visualization
          </CardTitle>
          <CardDescription>
            Interactive 3D model showing water level, fish movement, and sensor
            positions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg flex items-center justify-center">
            <Unity
              unityProvider={unityProvider}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
