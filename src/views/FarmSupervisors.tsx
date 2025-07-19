import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/lib/services/user";
import { IUser, ICreateUserInput } from "@/types/user";
import { useGetPondsQuery } from "@/lib/services/ponds";
import { IPond } from "@/types/pond";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export default function FarmSupervisors() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    ponds: [] as string[], // Array of pond IDs
  });

  const { toast } = useToast();
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersQuery();

  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const users = usersData?.data || [];

  if (usersLoading) {
    return <Spinner className="h-8 w-8 text-primary" />;
  }

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle pond selection (multi-select)
  const handlePondSelect = (pondId: string) => {
    setForm((prev) => ({
      ...prev,
      ponds: prev.ponds.includes(pondId)
        ? prev.ponds.filter((id) => id !== pondId)
        : [...prev.ponds, pondId],
    }));
  };

  // Open form for add or edit
  const openForm = (Supervisor?: IUser) => {
    if (Supervisor) {
      setEditId(Supervisor.id);
      setForm({
        firstName: Supervisor.firstName,
        lastName: Supervisor.lastName,
        email: Supervisor.email,
        password: "", // Don't pre-fill password for security
        phoneNumber: Supervisor.phoneNumber || "",
        ponds: Supervisor.ponds ? Supervisor.ponds.map((pond) => pond.id) : [],
      });
    } else {
      setEditId(null);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        ponds: [],
      });
    }
    setShowForm(true);
  };

  // Save Supervisor (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        // Update existing user
        const updateData: Partial<ICreateUserInput> = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          role: "Supervisor", // Default role
        };

        if (form.password) {
          updateData.password = form.password;
        }

        await updateUserMutation.mutateAsync({ id: editId, data: updateData });
        toast({
          title: "Success",
          description: "Supervisor updated successfully!",
        });
      } else {
        // Create new user
        if (!form.password) {
          toast({
            title: "Error",
            description: "Password is required for new supervisors",
            variant: "destructive",
          });
          return;
        }

        const newUserData: ICreateUserInput = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phoneNumber: form.phoneNumber,
          role: "Supervisor", // Default role
        };

        await createUserMutation.mutateAsync(newUserData);
        toast({
          title: "Success",
          description: "Supervisor created successfully!",
        });
      }

      setShowForm(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        ponds: [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: editId
          ? "Failed to update Supervisor"
          : "Failed to create Supervisor",
        variant: "destructive",
      });
      console.error("Error saving Supervisor:", error);
    }
  };

  // Delete Supervisor
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this Supervisor?")) {
      try {
        await deleteUserMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: "Supervisor deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete Supervisor",
          variant: "destructive",
        });
        console.error("Error deleting Supervisor:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Farm Supervisors
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and delete farm supervisors
          </p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supervisor
        </Button>
      </div>

      {/* Supervisors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supervisors List</CardTitle>
          <CardDescription>
            Manage all farm supervisors?.and their assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Full Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Phone Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Assigned Ponds
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((sup) => (
                  <tr key={sup.id} className="border-b">
                    <td className="px-4 py-2 font-medium">
                      {sup.firstName} {sup.lastName}
                    </td>
                    <td className="px-4 py-2">{sup.email}</td>
                    <td className="px-4 py-2">
                      {sup.phoneNumber || "Not provided"}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={sup.role === "Admin" ? "default" : "secondary"}
                      >
                        {sup.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">
                      {sup.ponds && sup.ponds.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {sup.ponds.map((pond) => (
                            <Button
                              key={pond.id}
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={() =>
                                navigate(`/dashboard/ponds/${pond.id}`)
                              }
                            >
                              {pond.name}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        "No ponds assigned"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openForm(sup)}
                        disabled={updateUserMutation.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(sup.id)}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Supervisor Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Supervisor" : "Add Supervisor"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {editId && "(Leave blank to keep current password)"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required={!editId}
                    placeholder={
                      editId ? "Leave blank to keep current" : "Enter password"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
              >
                {createUserMutation.isPending ||
                updateUserMutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    {editId ? "Updating..." : "Creating..."}
                  </>
                ) : editId ? (
                  "Save Changes"
                ) : (
                  "Add Supervisor"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
