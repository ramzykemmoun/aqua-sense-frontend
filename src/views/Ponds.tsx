import { useState } from "react";
import { MapView } from "@/components/MapView";
import { LocationPicker } from "@/components/LocationPicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Fish, Users, MapPin, Search, PlusCircle } from "lucide-react";
import { useGetPondsQuery, useCreatePondMutation } from "@/lib/services/ponds";
import { useGetUsersQuery } from "@/lib/services/user";
import { IPond, IPondCreateInput } from "@/types/pond";
import { IUser } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Ponds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [supervisorFilter, setSupervisorFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPond, setNewPond] = useState({
    name: "",
    description: "",
    latitude: 0,
    longitude: 0,
    supervisorIds: [] as string[],
    temperatureActive: true,
    pHActive: true,
    dissolvedOxygenActive: true,
    salinityActive: true,
    turbidityActive: true,
    ammoniaActive: true,
    nitrateActive: true,
    nitriteActive: true,
  });
  console.log({ newPond });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading, isError } = useGetPondsQuery();
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const createPondMutation = useCreatePondMutation();

  const linkedPonds = data?.data || [];
  const supervisors = usersData?.data.filter(
    (user: IUser) => user.role === "Supervisor"
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          Failed to load ponds. Please try again later.
        </p>
      </div>
    );
  }

  const handlePondSelect = (pond: IPond | null) => {
    navigate(`/dashboard/ponds/${pond?.id}`);
  };

  const handleCreatePond = async () => {
    try {
      // Validate required fields
      if (!newPond.name.trim()) {
        toast({
          title: "Error",
          description: "Pond name is required",
          variant: "destructive",
        });
        return;
      }

      if (!newPond.latitude || !newPond.longitude) {
        toast({
          title: "Error",
          description: "Please select a location on the map",
          variant: "destructive",
        });
        return;
      }

      // Prepare pond data for API
      const pondData: Partial<IPondCreateInput> = {
        name: newPond.name.trim(),
        description: newPond.description.trim() || undefined,
        latitude: newPond.latitude,
        longitude: newPond.longitude,
        temperatureActive: newPond.temperatureActive,
        pHActive: newPond.pHActive,
        dissolvedOxygenActive: newPond.dissolvedOxygenActive,
        salinityActive: newPond.salinityActive,
        turbidityActive: newPond.turbidityActive,
        ammoniaActive: newPond.ammoniaActive,
        nitrateActive: newPond.nitrateActive,
        nitriteActive: newPond.nitriteActive,
        supervisorIds: newPond.supervisorIds,
      };

      // Add supervisor assignment (adapt based on backend API)
      if (newPond.supervisorIds.length > 0) {
        // TODO: Backend integration for supervisor assignment
        console.log("Selected supervisors?.", newPond.supervisorIds);
      }

      await createPondMutation.mutateAsync(pondData as IPond);

      toast({
        title: "Success",
        description: "Pond created successfully!",
      });

      // Reset form and close dialog
      setIsCreateDialogOpen(false);
      setNewPond({
        name: "",
        description: "",
        latitude: 0,
        longitude: 0,
        supervisorIds: [],
        temperatureActive: true,
        pHActive: true,
        dissolvedOxygenActive: true,
        salinityActive: true,
        turbidityActive: true,
        ammoniaActive: true,
        nitrateActive: true,
        nitriteActive: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create pond. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating pond:", error);
    }
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

  if (isLoading) return <Spinner className="h-16 w-16 mx-auto mt-20" />;

  const ponds = data.data || [];

  console.log({ dev: data, ponds });

  return (
    <div className="space-y-6">
      <>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ponds</h1>
            <p className="text-muted-foreground">
              Monitor pond locations and manage linked facilities
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Pond
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[75vw] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Pond</DialogTitle>
                <DialogDescription>
                  Add a new pond to your aquaculture facility. Fill in the
                  details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
                <div className="grid gap-2">
                  <Label htmlFor="name">Pond Name</Label>
                  <div className="relative">
                    <Fish className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter pond name..."
                      value={newPond.name}
                      onChange={(e) =>
                        setNewPond({ ...newPond, name: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Location Picker */}
                <LocationPicker
                  onLocationSelect={(lat, lng) => {
                    setNewPond({ ...newPond, latitude: lat, longitude: lng });
                  }}
                  selectedLocation={
                    newPond.latitude && newPond.longitude
                      ? { lat: newPond.latitude, lng: newPond.longitude }
                      : undefined
                  }
                />

                {/* Selected coordinates display */}
                {newPond.latitude !== 0 && newPond.longitude !== 0 && (
                  <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded">
                    <strong>Selected coordinates:</strong>{" "}
                    {newPond.latitude.toFixed(4)},{" "}
                    {newPond.longitude.toFixed(4)}
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add any additional notes or description..."
                    value={newPond.description}
                    onChange={(e) =>
                      setNewPond({ ...newPond, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Assign Supervisors</Label>
                  <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center py-2">
                        <Spinner className="h-4 w-4 mr-2" />
                        Loading supervisors?...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {usersData?.data
                          ?.filter((user: IUser) => user.role === "Supervisor")
                          .map((supervisor: IUser) => (
                            <div
                              key={supervisor.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`supervisor-${supervisor.id}`}
                                checked={newPond.supervisorIds.includes(
                                  supervisor.id
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewPond({
                                      ...newPond,
                                      supervisorIds: [
                                        ...newPond.supervisorIds,
                                        supervisor.id,
                                      ],
                                    });
                                  } else {
                                    setNewPond({
                                      ...newPond,
                                      supervisorIds:
                                        newPond.supervisorIds.filter(
                                          (id) => id !== supervisor.id
                                        ),
                                    });
                                  }
                                  console.log({ newPond });
                                }}
                              />
                              <Label
                                htmlFor={`supervisor-${supervisor.id}`}
                                className="text-sm font-normal"
                              >
                                {supervisor.firstName} {supervisor.lastName}
                              </Label>
                            </div>
                          ))}
                        {usersData?.data?.filter(
                          (user: IUser) => user.role === "Supervisor"
                        ).length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No supervisors?.available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Sensor Configuration</Label>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="temperature"
                        checked={newPond.temperatureActive}
                        onCheckedChange={(checked) =>
                          setNewPond({
                            ...newPond,
                            temperatureActive: !!checked,
                          })
                        }
                      />
                      <Label
                        htmlFor="temperature"
                        className="text-sm font-normal"
                      >
                        Temperature
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ph"
                        checked={newPond.pHActive}
                        onCheckedChange={(checked) =>
                          setNewPond({ ...newPond, pHActive: !!checked })
                        }
                      />
                      <Label htmlFor="ph" className="text-sm font-normal">
                        pH Level
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="oxygen"
                        checked={newPond.dissolvedOxygenActive}
                        onCheckedChange={(checked) =>
                          setNewPond({
                            ...newPond,
                            dissolvedOxygenActive: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="oxygen" className="text-sm font-normal">
                        Dissolved Oxygen
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="salinity"
                        checked={newPond.salinityActive}
                        onCheckedChange={(checked) =>
                          setNewPond({ ...newPond, salinityActive: !!checked })
                        }
                      />
                      <Label htmlFor="salinity" className="text-sm font-normal">
                        Salinity
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="turbidity"
                        checked={newPond.turbidityActive}
                        onCheckedChange={(checked) =>
                          setNewPond({ ...newPond, turbidityActive: !!checked })
                        }
                      />
                      <Label
                        htmlFor="turbidity"
                        className="text-sm font-normal"
                      >
                        Turbidity
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ammonia"
                        checked={newPond.ammoniaActive}
                        onCheckedChange={(checked) =>
                          setNewPond({ ...newPond, ammoniaActive: !!checked })
                        }
                      />
                      <Label htmlFor="ammonia" className="text-sm font-normal">
                        Ammonia
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nitrate"
                        checked={newPond.nitrateActive}
                        onCheckedChange={(checked) =>
                          setNewPond({ ...newPond, nitrateActive: !!checked })
                        }
                      />
                      <Label htmlFor="nitrate" className="text-sm font-normal">
                        Nitrate
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nitrite"
                        checked={newPond.nitriteActive}
                        onCheckedChange={(checked) =>
                          setNewPond({ ...newPond, nitriteActive: !!checked })
                        }
                      />
                      <Label htmlFor="nitrite" className="text-sm font-normal">
                        Nitrite
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createPondMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreatePond}
                  disabled={createPondMutation.isPending}
                >
                  {createPondMutation.isPending ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Pond"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  {ponds.length} of {linkedPonds.length} ponds shown
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                      {supervisors?.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.firstName} {supervisor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Ponds List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {ponds.map((pond) => (
                <Card
                  key={pond.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handlePondSelect(pond)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{pond.name}</div>
                      <Badge variant={getStatusColor("active") as any}>
                        {pond.name}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {pond.supervisors?.length > 0
                          ? pond.supervisors
                              .map(
                                (Supervisor) =>
                                  `${Supervisor.firstName} ${Supervisor.lastName}`
                              )
                              .join(", ")
                          : "No Supervisors"}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                        <div className="text-center">
                          <div className="font-medium">
                            {pond.data.temperature}°C
                          </div>
                          <div className="text-muted-foreground">Temp</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{pond.data.pH}</div>
                          <div className="text-muted-foreground">pH</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {pond.data.dissolvedOxygen}
                          </div>
                          <div className="text-muted-foreground">O₂</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
