import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { hasAccessToPath, getDefaultPath } from "@/utils/role-permissions";

export const RoleProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const location = useLocation();
  
  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }
  
  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If no role is found, redirect to auth (shouldn't happen normally)
  if (!role) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has access to current path
  if (!hasAccessToPath(role, location.pathname)) {
    // Redirect to the default path for this role
    const defaultPath = getDefaultPath(role);
    return <Navigate to={defaultPath} replace />;
  }
  
  return <>{children}</>;
};