
import Auth from "@/pages/Auth";
import AdminCreateUsers from "@/pages/AdminCreateUsers";
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
    path: "/admin-create-users",
    element: <AdminCreateUsers />
  },
  {
    path: "*",
    element: <NotFound />
  }
];
