import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Filter, Calendar, Database, FileText } from "lucide-react";

// Mock historical data
const mockHistoryData = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:00",
    pondName: "Pond Alpha",
    parameter: "Temperature",
    value: 24.5,
    unit: "°C",
    status: "normal",
    sensor: "TMP-001"
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:30:00",
    pondName: "Pond Alpha",
    parameter: "pH",
    value: 7.2,
    unit: "",
    status: "normal",
    sensor: "PH-001"
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:30:00",
    pondName: "Pond Beta",
    parameter: "Dissolved Oxygen",
    value: 6.8,
    unit: "mg/L",
    status: "warning",
    sensor: "DO-002"
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:25:00",
    pondName: "Pond Gamma",
    parameter: "Temperature",
    value: 28.5,
    unit: "°C",
    status: "warning",
    sensor: "TMP-003"
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:25:00",
    pondName: "Pond Delta",
    parameter: "Ammonia",
    value: 0.9,
    unit: "mg/L",
    status: "normal",
    sensor: "NH3-004"
  },
  {
    id: 6,
    timestamp: "2024-01-15 14:20:00",
    pondName: "Pond Beta",
    parameter: "pH",
    value: 6.2,
    unit: "",
    status: "critical",
    sensor: "PH-002"
  },
  {
    id: 7,
    timestamp: "2024-01-15 14:20:00",
    pondName: "Pond Alpha",
    parameter: "Water Level",
    value: 3.2,
    unit: "m",
    status: "normal",
    sensor: "WL-001"
  },
  {
    id: 8,
    timestamp: "2024-01-15 14:15:00",
    pondName: "Pond Gamma",
    parameter: "Salinity",
    value: 3.8,
    unit: "ppt",
    status: "normal",
    sensor: "SAL-003"
  }
];

const getStatusBadge = (status: string) => {
  const variants = {
    normal: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    critical: "bg-destructive/10 text-destructive border-destructive/20"
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || variants.normal}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function DataHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPond, setSelectedPond] = useState("all");
  const [selectedParameter, setSelectedParameter] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = mockHistoryData.filter(record => {
    const matchesSearch = record.pondName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.sensor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPond = selectedPond === "all" || record.pondName.toLowerCase().includes(selectedPond);
    const matchesParameter = selectedParameter === "all" || record.parameter === selectedParameter;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    
    return matchesSearch && matchesPond && matchesParameter && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Pond Name", "Parameter", "Value", "Unit", "Status", "Sensor"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(record => [
        record.timestamp,
        record.pondName,
        record.parameter,
        record.value,
        record.unit,
        record.status,
        record.sensor
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pond_data_history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Database className="h-8 w-8 text-primary" />
            Data History
          </h1>
          <p className="text-muted-foreground">View and export historical sensor data from all ponds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">Last update period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7k</div>
            <p className="text-xs text-muted-foreground">Total measurements</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <Database className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">Data integrity</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter and search through historical data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search records..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedPond} onValueChange={setSelectedPond}>
              <SelectTrigger>
                <SelectValue placeholder="Pond" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ponds</SelectItem>
                <SelectItem value="alpha">Pond Alpha</SelectItem>
                <SelectItem value="beta">Pond Beta</SelectItem>
                <SelectItem value="gamma">Pond Gamma</SelectItem>
                <SelectItem value="delta">Pond Delta</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedParameter} onValueChange={setSelectedParameter}>
              <SelectTrigger>
                <SelectValue placeholder="Parameter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parameters</SelectItem>
                <SelectItem value="Temperature">Temperature</SelectItem>
                <SelectItem value="pH">pH</SelectItem>
                <SelectItem value="Dissolved Oxygen">Dissolved Oxygen</SelectItem>
                <SelectItem value="Ammonia">Ammonia</SelectItem>
                <SelectItem value="Water Level">Water Level</SelectItem>
                <SelectItem value="Salinity">Salinity</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedPond("all");
              setSelectedParameter("all");
              setSelectedStatus("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Data Records</CardTitle>
          <CardDescription>
            Historical sensor readings from all monitored ponds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Pond</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sensor ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-sm">
                      {record.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.pondName}
                    </TableCell>
                    <TableCell>{record.parameter}</TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {record.value}{record.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {record.sensor}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No records found matching your filters.</p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredData.length} of {mockHistoryData.length} records
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}