import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext/AuthContext";
import { LoadingState } from "./LoadingState";

interface ProtectedRouteProps {
  requireDrive?: boolean;
  redirectIfFullyAuthorized?: boolean;
}

export function ProtectedRoute({
  requireDrive = false,
  redirectIfFullyAuthorized = false,
}: ProtectedRouteProps) {
  const { email, accessToken, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return <LoadingState fullScreen />;
  }

  if (!email) {
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
