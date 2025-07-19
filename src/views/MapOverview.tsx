import { useState } from "react";
import { MapView } from "@/components/MapView";
import { PondDashboard } from "@/components/PondDashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fish, Users, Activity, MapPin, Search, Filter } from "lucide-react";
import { useGetPondsQuery } from "@/lib/services/ponds";
import { Spinner } from "@/components/ui/spinner";

export default function Ponds() {
  const [selectedPond, setSelectedPond] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [supervisorFilter, setSupervisorFilter] = useState("all");

  // Mock data for linked ponds
  const linkedPonds = [
    {
      id: 1,
      name: "Pond A1",
      location: "North Section",
      status: "active",
      Supervisor: "John Smith",
      fishCount: 2500,
      temperature: 24.5,
      ph: 7.2,
      oxygen: 8.1,
    },
    {
      id: 2,
      name: "Pond A2",
      location: "North Section",
      status: "active",
      Supervisor: "John Smith",
      fishCount: 2200,
      temperature: 23.8,
      ph: 7.4,
      oxygen: 8.5,
    },
    {
      id: 3,
      name: "Pond B1",
      location: "South Section",
      status: "maintenance",
      Supervisor: "Sarah Wilson",
      fishCount: 0,
      temperature: 20.0,
      ph: 6.8,
      oxygen: 5.2,
    },
    {
      id: 4,
      name: "Pond B2",
      location: "South Section",
      status: "active",
      Supervisor: "Sarah Wilson",
      fishCount: 2800,
      temperature: 25.2,
      ph: 7.1,
      oxygen: 7.8,
    },
    {
      id: 5,
      name: "Pond C1",
      location: "East Section",
      status: "warning",
      Supervisor: "Mike Johnson",
      fishCount: 2400,
      temperature: 26.8,
      ph: 6.5,
      oxygen: 6.9,
    },
    {
      id: 6,
      name: "Pond C2",
      location: "East Section",
      status: "active",
      Supervisor: "Mike Johnson",
      fishCount: 2600,
      temperature: 24.1,
      ph: 7.3,
      oxygen: 8.2,
    },
  ];

  const supervisors?.= Array.from(
    new Set(linkedPonds.map((pond) => pond.Supervisor))
  );

  const filteredPonds = linkedPonds.filter((pond) => {
    const matchesSearch =
      pond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pond.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pond.Supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || pond.status === statusFilter;
    const matchesSupervisor =
      supervisorFilter === "all" || pond.Supervisor === supervisorFilter;

    return matchesSearch && matchesStatus && matchesSupervisor;
  });

  const handlePondSelect = (pondId: number) => {
    setSelectedPond(pondId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "warning":
        return "secondary";
      case "maintenance":
        return "outline";
      case "inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  const { data, isLoading, error } = useGetPondsQuery();
  const ponds = data?.data || [];

  if (isLoading) return <Spinner className="h-16 w-16 mx-auto mt-20" />;
  if (error) return <p>Error loading ponds</p>;

  return (
    <div className="space-y-6">
      {selectedPond !== null ? (
        <PondDashboard />
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ponds</h1>
            <p className="text-muted-foreground">
              Monitor pond locations and manage linked facilities
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Map View */}
            <div className="lg:col-span-2">
              <MapView ponds={ponds} />
            </div>

            {/* Linked Ponds List with Filters */}
            <div className="space-y-4">
              {/* Search and Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="h-5 w-5" />
                    Ponds List
                  </CardTitle>
                  <CardDescription>
                    {filteredPonds.length} of {linkedPonds.length} ponds shown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ponds, locations, supervisors?..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={supervisorFilter}
                      onValueChange={setSupervisorFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Supervisors</SelectItem>
                        {supervisors?.map((Supervisor) => (
                          <SelectItem key={Supervisor} value={Supervisor}>
                            {Supervisor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Ponds List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredPonds.map((pond) => (
                  <Card
                    key={pond.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handlePondSelect(pond.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{pond.name}</div>
                        <Badge variant={getStatusColor(pond.status) as any}>
                          {pond.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {pond.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {pond.Supervisor}
                        </div>
                        <div className="flex items-center gap-1">
                          <Fish className="h-3 w-3" />
                          {pond.fishCount.toLocaleString()} fish
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                          <div className="text-center">
                            <div className="font-medium">
                              {pond.temperature}°C
                            </div>
                            <div className="text-muted-foreground">Temp</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{pond.ph}</div>
                            <div className="text-muted-foreground">pH</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{pond.oxygen}</div>
                            <div className="text-muted-foreground">O₂</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active Ponds
                    </span>
                    <span className="font-medium">
                      {
                        filteredPonds.filter((p) => p.status === "active")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Warnings
                    </span>
                    <span className="font-medium">
                      {
                        filteredPonds.filter((p) => p.status === "warning")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Under Maintenance
                    </span>
                    <span className="font-medium">
                      {
                        filteredPonds.filter((p) => p.status === "maintenance")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Fish
                    </span>
                    <span className="font-medium">
                      {filteredPonds
                        .reduce((sum, p) => sum + p.fishCount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
