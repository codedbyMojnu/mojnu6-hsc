import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoutes() {
  const { user } = useAuth();
  return !user?.token ? <Navigate to="/" replace /> : <Outlet />;
}
