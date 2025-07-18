
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "@/routes/routes";
import { AuthProvider } from "@/contexts/AuthContext";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {routes.map((route, index) => {
            // For the auth route and document upload, we don't want to wrap it in the AppLayout
            if (route.path === "/auth" || route.path === "/documents/upload/:token") {
              return <Route key={index} path={route.path} element={route.element} />;
            }
            
            // For the not found route
            if (route.path === "*") {
              return <Route key={index} path={route.path} element={route.element} />;
            }
            
            // For all other routes, they are already wrapped in ProtectedRoute
            return <Route key={index} path={route.path} element={route.element} />;
          })}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
