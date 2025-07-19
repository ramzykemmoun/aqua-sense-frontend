import useUser from "@/hooks/use-user";
import { Navigate } from "react-router-dom";

type Props = {
  allowedRoles?: string[];
  children: React.ReactNode;
};
export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const user = useUser((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    if (!allowedRoles || allowedRoles.length === 0) {
      return <>{children}</>;
    }

    if (allowedRoles.includes(user.role)) {
      return <>{children}</>;
    }

    return <Navigate to="/" replace />;
  }
}
