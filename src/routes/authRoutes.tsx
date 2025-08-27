
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

export const authRoutes = [
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/auth/reset-password",
    element: <Auth />
  },
  {
    path: "*",
    element: <NotFound />
  }
];
