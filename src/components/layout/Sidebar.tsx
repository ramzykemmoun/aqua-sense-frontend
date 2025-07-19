import { NavLink, useLocation } from "react-router-dom";
import {
  Map,
  BarChart3,
  AlertTriangle,
  Database,
  Settings,
  Fish,
  Waves,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/use-user";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    allowedRoles: ["Admin", "Supervisor"],
  },
  {
    name: "Ponds",
    href: "/dashboard/ponds",
    icon: Map,
    allowedRoles: ["Admin", "Supervisor"],
  },
  {
    name: "Farm Supervisors",
    href: "/dashboard/supervisors",
    icon: Users,
    allowedRoles: ["Admin"],
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: AlertTriangle,
    allowedRoles: ["Admin", "Supervisor"],
  },
  {
    name: "Data History",
    href: "/dashboard/history",
    icon: Database,
    allowedRoles: ["Admin", "Supervisor"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["Admin", "Supervisor"],
  },
];

export function Sidebar() {
  const location = useLocation();
  const user = useUser((state) => state.user);

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Fish className="h-8 w-8 text-primary" />
            <Waves className="h-4 w-4 text-primary-glow absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AquaSense</h1>
            <p className="text-xs text-muted-foreground">Pond Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          if (!item.allowedRoles.includes(user.role)) {
            return null;
          }

          const isActive = location.pathname === item.href;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-accent-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Real-time monitoring</p>
          <p className="text-primary">● Online</p>
        </div>
      </div>
    </div>
  );
}
