
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
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
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: "/activity",
    element: (
      <ProtectedRoute>
        <Activity />
      </ProtectedRoute>
    )
  },
  {
    path: "/ai-assistant",
    element: (
      <ProtectedRoute>
        <AIAssistant />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <Clients />
      </ProtectedRoute>
    )
  },
  {
    path: "/vehicles",
    element: (
      <ProtectedRoute>
        <Vehicles />
      </ProtectedRoute>
    )
  },
  {
    path: "/fleet",
    element: (
      <ProtectedRoute>
        <Fleet />
      </ProtectedRoute>
    )
  },
  {
    path: "/accounting",
    element: (
      <ProtectedRoute>
        <Accounting />
      </ProtectedRoute>
    )
  },
  {
    path: "/cessions",
    element: (
      <ProtectedRoute>
        <Cessions />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
  },
  {
    path: "/help",
    element: (
      <ProtectedRoute>
        <Help />
      </ProtectedRoute>
    )
  },
  {
    path: "/planning",
    element: (
      <ProtectedRoute>
        <Planning />
      </ProtectedRoute>
    )
  }
];
