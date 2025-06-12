
import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Display a loading screen while checking authentication
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }
  
  // Redirect to login page if user is not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};
