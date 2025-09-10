import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from './use-user-role';

export interface ViewManagementState {
  currentView: 'manager' | 'employe';
  selectedEmployeView: string | null;
  canSwitchViews: boolean;
  isEmployeeRole: boolean;
  canManageUsers: boolean;
}

export function useViewManagement() {
  const { user } = useAuth();
  const { userRole, isOwner, isResponsable, isCarrossier, isCarrossierCourtesy } = useUserRole();
  
  // Local state for view management - Default based on role
  const [localCurrentView, setLocalCurrentView] = useState<'manager' | 'employe'>('employe');
  const [selectedEmployeView, setSelectedEmployeView] = useState<string | null>(null);

  // Determine default view based on user role
  useEffect(() => {
    if (isOwner || isResponsable) {
      setLocalCurrentView('manager');
    } else if (isCarrossier || isCarrossierCourtesy) {
      setLocalCurrentView('employe');
      setSelectedEmployeView(user?.id || null);
    }
  }, [isOwner, isResponsable, isCarrossier, isCarrossierCourtesy, user?.id]);

  // Calculate permissions and capabilities
  const isEmployeeRole = isCarrossier || isCarrossierCourtesy;
  const canManageUsers = isOwner || isResponsable;
  const canSwitchViews = canManageUsers;

  return {
    currentView: localCurrentView,
    selectedEmployeView,
    setCurrentView: setLocalCurrentView,
    setSelectedEmployeView,
    canSwitchViews,
    isEmployeeRole,
    canManageUsers,
  };
}