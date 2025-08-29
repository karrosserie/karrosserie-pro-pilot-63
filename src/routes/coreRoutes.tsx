
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import Activity from "@/pages/Activity";
import AIAssistant from "@/pages/AIAssistant";
import Profile from "@/pages/Profile";
import Clients from "@/pages/Clients";
import Vehicles from "@/pages/Vehicles";
import Fleet from "@/pages/Fleet";
import Settings from "@/pages/Settings";
import Cessions from "@/pages/Cessions";
import Help from "@/pages/Help";
import KarrosseriePlanningPage from "@/pages/KarrosseriePlanningPage";
import Messageries from "@/pages/Messageries";
import PresencePointages from "@/pages/PresencePointages";

export const coreRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Index />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/activity",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Activity />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/ai-assistant",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <AIAssistant />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Profile />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Clients />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/vehicles",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Vehicles />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/fleet",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Fleet />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/cessions",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Cessions />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Settings />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/help",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Help />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/planning",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <KarrosseriePlanningPage />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/messageries",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Messageries />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/presence-pointages",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PresencePointages />
        </AppLayout>
      </ProtectedRoute>
    )
  }
];
