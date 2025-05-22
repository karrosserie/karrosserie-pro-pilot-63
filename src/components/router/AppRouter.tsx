
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "@/routes/routes";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {routes.map((route, index) => {
            // For the auth route, we don't want to wrap it in the AppLayout
            if (route.path === "/auth") {
              return <Route key={index} path={route.path} element={route.element} />;
            }
            
            // For protected routes and the not found route, check if it already uses ProtectedRoute
            if (route.path === "*") {
              return <Route key={index} path={route.path} element={route.element} />;
            }
            
            // For all other routes, wrap them in AppLayout
            return (
              <Route 
                key={index}
                path={route.path}
                element={
                  route.element.props.children ? (
                    <AppLayout>
                      {route.element.props.children}
                    </AppLayout>
                  ) : route.element
                }
              />
            );
          })}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
