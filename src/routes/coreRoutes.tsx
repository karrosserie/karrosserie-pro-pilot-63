
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/router/RoleProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import Activity from "@/pages/Activity";
import AIAssistant from "@/pages/AIAssistant";
import Profile from "@/pages/Profile";
import Clients from "@/pages/Clients";
import Vehicles from "@/pages/Vehicles";
import Fleet from "@/pages/Fleet";
import Settings from "@/pages/Settings";
import Accounting from "@/pages/Accounting";
import Cessions from "@/pages/Cessions";
import Help from "@/pages/Help";
import Planning from "@/pages/Planning";

export const coreRoutes = [
  {
    path: "/",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Index />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/activity",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Activity />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/ai-assistant",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <AIAssistant />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Profile />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/clients",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Clients />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/vehicles",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Vehicles />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/fleet",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Fleet />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/accounting",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Accounting />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/cessions",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Cessions />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Settings />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/help",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Help />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/planning",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Planning />
        </AppLayout>
      </RoleProtectedRoute>
    )
  }
];
