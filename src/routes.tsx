import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import AquaChatBot from "@/components/AquaChatBot";

import Dashboard from "./views/Dashboard";
import Ponds from "./views/Ponds";
import Alerts from "./views/Alerts";
import DataHistory from "./views/DataHistory";
import Settings from "./views/Settings";
import NotFound from "./views/NotFound";
import FarmSupervisors from "./views/FarmSupervisors";
import Login from "./views/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { PondDashboard } from "./components/PondDashboard";

const DashboardLayout = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
    <AquaChatBot />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    path: "/dashboard/",
    children: [
      { path: "", element: <Dashboard /> },
      { path: "ponds", element: <Ponds /> },
      { path: "ponds/:pondId", element: <PondDashboard /> },
      { path: "alerts", element: <Alerts /> },
      { path: "history", element: <DataHistory /> },
      { path: "settings", element: <Settings /> },
      { path: "supervisors", element: <FarmSupervisors /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const Router = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  );
};

export default Router;
