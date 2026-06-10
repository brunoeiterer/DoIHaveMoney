import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext/AuthContext";
import { LoadingState } from "./LoadingState";
import { getAccessToken } from "../context/AuthContext/AuthGlobal";

interface ProtectedRouteProps {
  requireDrive?: boolean;
  redirectIfFullyAuthorized?: boolean;
}

export function ProtectedRoute({
  requireDrive = false,
  redirectIfFullyAuthorized = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticating } = useAuth();
  const accessToken = getAccessToken();

  if (isAuthenticating) {
    return <LoadingState fullScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (redirectIfFullyAuthorized && accessToken) {
    return <Navigate to="/budgets" replace />;
  }

  if (requireDrive && !accessToken) {
    return <Navigate to="/authorization" replace />;
  }

  return <Outlet />;
}
